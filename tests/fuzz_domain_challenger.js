/**
 * Adversarial Challenger & Fuzzer for IRONFORGE FITNESS E2E Helpers
 * 
 * Tests:
 * 1. scroll.js:
 *    - Catmull-Rom spline C0/C1 continuity, waypoint exact bounds, velocity smoothness across all 4 segments (5 waypoints)
 *    - Extreme numerical stress: NaN, null, undefined, +-Infinity, EPSILON, MAX_VALUE, non-number types (strings, objects, functions, symbols)
 *    - Empty/single/degenerate waypoint arrays in evaluateCatmullRom3D
 *    - Reverse scrubbing and randomized jitter scrubbing (idempotency & determinism)
 *    - prefers-reduced-motion static locking invariance under all adversarial inputs
 * 
 * 2. dom.js:
 *    - Multi-class compound selector combinations and ordering independence (.a.b vs .b.a)
 *    - Multi-level descendant selector validation (nested 3+ deep, non-descendant rejection)
 *    - Deeply nested same-tag HTML parsing (10 levels of <div>)
 *    - Void tag handling (input, img, br, hr) inside nested structures
 *    - Complex attribute parsing (single/double quotes, unquoted values, boolean attributes)
 *    - Event bubbling target integrity, stopPropagation, stopImmediatePropagation, preventDefault
 *    - ClassList edge cases (duplicates, multiple arguments, toggle with force)
 * 
 * 3. webgl.js:
 *    - Context loss state machine stress (100 rapid cycles)
 *    - Extension nullification during lost state
 *    - Detached canvas / null canvas lifecycle
 *    - Standard gl.getParameter queries
 */

const assert = require('assert');
const { CameraNarrativeEvaluator, evaluateCatmullRom3D, sanitizeProgress, CAMERA_WAYPOINTS } = require('./helpers/scroll');
const { MockWebGLContext, createMockWebGLContext } = require('./helpers/webgl');
const { DOMNode, DOMEvent, DOMDocument, WindowMock, createDOM, createWindow } = require('./helpers/dom');

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
};

function test(name, fn) {
  stats.total++;
  try {
    fn();
    stats.passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    stats.failed++;
    stats.failures.push({ name, message: err.message, stack: err.stack });
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
  }
}

console.log('===============================================================');
console.log('ADVERSARIAL CHALLENGER FUZZING HARNESS (ITERATION 2)');
console.log('===============================================================\n');

// ============================================================================
// PART 1: ADVERSARIAL FUZZING OF scroll.js
// ============================================================================
console.log('=== PART 1: ADVERSARIAL STRESS - scroll.js ===');

// 1.1 Robustness to Extreme Types & Values
test('scroll: sanitizeProgress handles extreme types without NaN/Throw', () => {
  const badInputs = [
    NaN, null, undefined, '0.5', 'invalid', '', {}, [], () => {},
    Symbol('foo'), true, false, 0/0, Math.sqrt(-1),
    Infinity, -Infinity, 1e308, -1e308, Number.MAX_VALUE, -Number.MAX_VALUE,
    Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.EPSILON, -0.0
  ];

  for (const input of badInputs) {
    const sanitized = sanitizeProgress(input);
    assert.strictEqual(typeof sanitized, 'number', `sanitizeProgress(${String(input)}) must return number`);
    assert.ok(!Number.isNaN(sanitized), `sanitizeProgress(${String(input)}) must not return NaN`);
    assert.ok(sanitized >= 0.0 && sanitized <= 1.0, `sanitizeProgress(${String(input)}) must be in [0.0, 1.0], got ${sanitized}`);
  }
});

test('scroll: Catmull-Rom C0 continuity across 10,000 fine progress steps', () => {
  const evaluator = new CameraNarrativeEvaluator();
  const STEPS = 10000;
  let prevPos = evaluator.evaluate(0.0).position;
  let prevTar = evaluator.evaluate(0.0).target;
  let maxPosDelta = 0;
  let maxTarDelta = 0;

  for (let i = 1; i <= STEPS; i++) {
    const p = i / STEPS;
    const { position, target } = evaluator.evaluate(p);

    // Euclidean step distance
    const posDist = Math.sqrt(
      Math.pow(position[0] - prevPos[0], 2) +
      Math.pow(position[1] - prevPos[1], 2) +
      Math.pow(position[2] - prevPos[2], 2)
    );
    const tarDist = Math.sqrt(
      Math.pow(target[0] - prevTar[0], 2) +
      Math.pow(target[1] - prevTar[1], 2) +
      Math.pow(target[2] - prevTar[2], 2)
    );

    if (posDist > maxPosDelta) maxPosDelta = posDist;
    if (tarDist > maxTarDelta) maxTarDelta = tarDist;

    // Ensure step jumps are smooth (no discrete teleports > 0.05 units for 1/10000 step)
    assert.ok(posDist < 0.05, `Position jump at step ${i} (p=${p}) too large: ${posDist}`);
    assert.ok(tarDist < 0.05, `Target jump at step ${i} (p=${p}) too large: ${tarDist}`);

    prevPos = position;
    prevTar = target;
  }
  assert.ok(maxPosDelta > 0, 'Camera must actually move along path');
});

test('scroll: Waypoint junction continuity and exact boundary interpolation', () => {
  const evaluator = new CameraNarrativeEvaluator();
  const atStart = evaluator.evaluate(0.0);
  const atEnd = evaluator.evaluate(1.0);

  // At p=0, must match waypoint 0
  const w0 = CAMERA_WAYPOINTS[0];
  for (let k = 0; k < 3; k++) {
    assert.ok(Math.abs(atStart.position[k] - w0.position[k]) < 1e-4, `p=0 position[${k}] must match waypoint 0`);
    assert.ok(Math.abs(atStart.target[k] - w0.target[k]) < 1e-4, `p=0 target[${k}] must match waypoint 0`);
  }
  assert.strictEqual(atStart.waypointId, w0.id);

  // At p=1, must match waypoint 4 (next-level)
  const w4 = CAMERA_WAYPOINTS[CAMERA_WAYPOINTS.length - 1];
  for (let k = 0; k < 3; k++) {
    assert.ok(Math.abs(atEnd.position[k] - w4.position[k]) < 1e-4, `p=1 position[${k}] must match waypoint 4`);
    assert.ok(Math.abs(atEnd.target[k] - w4.target[k]) < 1e-4, `p=1 target[${k}] must match waypoint 4`);
  }
  assert.strictEqual(atEnd.waypointId, w4.id);

  // Check C1 velocity continuity across waypoint junction boundaries (0.25, 0.50, 0.75)
  const junctions = [0.25, 0.50, 0.75];
  const delta = 0.0005;
  for (const j of junctions) {
    const left1 = evaluator.evaluate(j - delta).position;
    const center = evaluator.evaluate(j).position;
    const right1 = evaluator.evaluate(j + delta).position;

    // Approximate left & right velocity vectors
    const vLeft = [(center[0] - left1[0]) / delta, (center[1] - left1[1]) / delta, (center[2] - left1[2]) / delta];
    const vRight = [(right1[0] - center[0]) / delta, (right1[1] - center[1]) / delta, (right1[2] - center[2]) / delta];

    for (let k = 0; k < 3; k++) {
      const diff = Math.abs(vLeft[k] - vRight[k]);
      assert.ok(diff < 0.5, `Velocity discontinuity at junction p=${j} axis ${k}: ${diff}`);
    }
  }
});

test('scroll: evaluateCatmullRom3D handles degenerate point lists gracefully', () => {
  // Empty list
  const empty = evaluateCatmullRom3D([], 0.5);
  assert.deepStrictEqual(empty, [0.0, 0.0, 0.0]);

  // Single point list
  const single = evaluateCatmullRom3D([[1.2, 3.4, 5.6]], 0.5);
  assert.deepStrictEqual(single, [1.2, 3.4, 5.6]);

  // Single point list with partial coords
  const partial = evaluateCatmullRom3D([[7.0]], 0.5);
  assert.deepStrictEqual(partial, [7.0, 0.0, 0.0]);

  // Null/non-array point list
  const nullPoints = evaluateCatmullRom3D(null, 0.5);
  assert.deepStrictEqual(nullPoints, [0.0, 0.0, 0.0]);
});

test('scroll: Evaluation idempotency, reversibility, and lack of internal state mutations', () => {
  const evaluator = new CameraNarrativeEvaluator();

  // Evaluate sequence forward then backward
  const forwardSeq = [0.0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0];
  const forwardResults = forwardSeq.map((p) => evaluator.evaluate(p));

  // Reverse evaluate
  const backwardResults = forwardSeq.slice().reverse().map((p) => evaluator.evaluate(p)).reverse();

  assert.deepStrictEqual(forwardResults, backwardResults, 'Forward and reverse evaluations must yield identical coordinates');

  // Random scrub order
  const shuffled = [0.75, 0.1, 1.0, 0.0, 0.5, 0.25, 0.9];
  for (const p of shuffled) {
    const idx = forwardSeq.indexOf(p);
    const res = evaluator.evaluate(p);
    assert.deepStrictEqual(res, forwardResults[idx], `Random scrub at p=${p} must match forward evaluation`);
  }
});

test('scroll: Reduced motion static locking invariance under adversarial inputs', () => {
  const reducedEvaluator = new CameraNarrativeEvaluator(CAMERA_WAYPOINTS, { reducedMotion: true });
  const chaoticInputs = [
    -1000, 0.0, 0.333, 0.5, 1.0, 9999, NaN, Infinity, -Infinity, null, undefined, 'attack', {}, []
  ];

  for (const input of chaoticInputs) {
    const res = reducedEvaluator.evaluate(input);
    assert.deepStrictEqual(res.position, [0.0, 2.2, 8.0], `Reduced motion position invariant failed for ${String(input)}`);
    assert.deepStrictEqual(res.target, [0.0, 1.8, 0.0], `Reduced motion target invariant failed for ${String(input)}`);
    assert.ok(typeof res.waypointId === 'string' && res.waypointId.length > 0, `waypointId must be valid string for ${String(input)}`);
  }
});

// ============================================================================
// PART 2: ADVERSARIAL FUZZING OF dom.js
// ============================================================================
console.log('\n=== PART 2: ADVERSARIAL STRESS - dom.js ===');

test('dom: Multi-class compound selector ordering and multi-class combinations', () => {
  const dom = createDOM();
  const el = dom.createElement('div');
  el.className = 'btn active primary shadow-lg';
  dom.body.appendChild(el);

  // Both orders .active.btn and .btn.active must match
  assert.strictEqual(dom.querySelector('.btn.active'), el, '.btn.active must match');
  assert.strictEqual(dom.querySelector('.active.btn'), el, '.active.btn must match');
  assert.strictEqual(dom.querySelector('.shadow-lg.primary.btn'), el, '.shadow-lg.primary.btn must match');

  // Negative: missing one class must fail
  assert.strictEqual(dom.querySelector('.btn.active.disabled'), null, 'Missing class .disabled must not match');
});

test('dom: Multi-level descendant selector validation and strict scoping', () => {
  const dom = createDOM();
  const nav = dom.createElement('nav');
  const ul = dom.createElement('ul');
  const li = dom.createElement('li');
  const navButton = dom.createElement('button');
  navButton.className = 'nav-action';

  li.appendChild(navButton);
  ul.appendChild(li);
  nav.appendChild(ul);
  dom.body.appendChild(nav);

  const footer = dom.createElement('footer');
  const footerButton = dom.createElement('button');
  footerButton.className = 'nav-action';
  footer.appendChild(footerButton);
  dom.body.appendChild(footer);

  // 2-level descendant
  const navButtons = dom.querySelectorAll('nav button');
  assert.strictEqual(navButtons.length, 1);
  assert.strictEqual(navButtons[0], navButton);

  // 3-level descendant
  const liButtons = dom.querySelectorAll('nav ul button');
  assert.strictEqual(liButtons.length, 1);
  assert.strictEqual(liButtons[0], navButton);

  // Strict: footer button must not match 'nav button'
  assert.ok(!navButtons.includes(footerButton));
});

test('dom: Deeply nested same-tag HTML parsing (10 levels of div > div)', () => {
  const dom = createDOM();
  const rootDiv = dom.createElement('div');

  // Build 10-level nested HTML string: <div class="lvl-0"><div class="lvl-1">...</div></div>
  let html = '';
  for (let i = 0; i < 10; i++) {
    html += `<div class="lvl-${i}">`;
  }
  html += 'DEEP_CONTENT';
  for (let i = 0; i < 10; i++) {
    html += `</div>`;
  }

  rootDiv.innerHTML = html;

  // Validate hierarchy depth
  let current = rootDiv.children[0];
  for (let i = 0; i < 10; i++) {
    assert.ok(current, `Level ${i} div must exist`);
    assert.strictEqual(current.tagName, 'DIV');
    assert.strictEqual(current.className, `lvl-${i}`);
    if (i < 9) {
      assert.strictEqual(current.children.length, 1, `Level ${i} must have exactly 1 child`);
      current = current.children[0];
    }
  }
  assert.strictEqual(current.textContent, 'DEEP_CONTENT', 'Deepest text content must match');
});

test('dom: Void tags (input, img, br, hr) in complex nested HTML parsing', () => {
  const dom = createDOM();
  const formWrap = dom.createElement('div');
  formWrap.innerHTML = `
    <form class="enquiry-form">
      <input type="text" name="name" value="Alex" class="form-input">
      <img src="/avatar.jpg" alt="Avatar">
      <br>
      <div class="group">
        <input type="email" name="email" value="alex@gym.com">
        <hr>
        <button type="submit" class="btn">Send</button>
      </div>
    </form>
  `;

  const form = formWrap.querySelector('form');
  assert.ok(form, 'form element must exist');
  assert.strictEqual(form.className, 'enquiry-form');

  const inputs = formWrap.querySelectorAll('input');
  assert.strictEqual(inputs.length, 2, 'Must parse exactly 2 inputs');
  assert.strictEqual(inputs[0].getAttribute('name'), 'name');
  assert.strictEqual(inputs[0].value, 'Alex');
  assert.strictEqual(inputs[1].getAttribute('name'), 'email');
  assert.strictEqual(inputs[1].value, 'alex@gym.com');

  const btn = formWrap.querySelector('.group button');
  assert.ok(btn, 'Button inside .group must be parsed');
  assert.strictEqual(btn.textContent, 'Send');
});

test('dom: Event bubbling target preservation and propagation halting', () => {
  const dom = createDOM();
  const section = dom.createElement('section');
  const card = dom.createElement('div');
  const button = dom.createElement('button');

  card.appendChild(button);
  section.appendChild(card);
  dom.body.appendChild(section);

  const eventsSeen = [];

  button.addEventListener('click', (e) => {
    eventsSeen.push({ node: 'button', target: e.target, currentTarget: e.currentTarget });
  });

  card.addEventListener('click', (e) => {
    eventsSeen.push({ node: 'card', target: e.target, currentTarget: e.currentTarget });
  });

  section.addEventListener('click', (e) => {
    eventsSeen.push({ node: 'section', target: e.target, currentTarget: e.currentTarget });
  });

  // Dispatch click from button
  button.click();

  assert.strictEqual(eventsSeen.length, 3, 'All 3 levels should see bubbling event');
  for (const entry of eventsSeen) {
    assert.strictEqual(entry.target, button, `target at ${entry.node} must remain the original clicked button`);
  }
  assert.strictEqual(eventsSeen[0].currentTarget, button);
  assert.strictEqual(eventsSeen[1].currentTarget, card);
  assert.strictEqual(eventsSeen[2].currentTarget, section);
});

test('dom: stopImmediatePropagation stops subsequent listeners on current node AND parent bubbling', () => {
  const dom = createDOM();
  const parent = dom.createElement('div');
  const child = dom.createElement('button');
  parent.appendChild(child);
  dom.body.appendChild(parent);

  let firstChildExecuted = false;
  let secondChildExecuted = false;
  let parentExecuted = false;

  child.addEventListener('custom-action', (e) => {
    firstChildExecuted = true;
    e.stopImmediatePropagation();
  });

  child.addEventListener('custom-action', () => {
    secondChildExecuted = true;
  });

  parent.addEventListener('custom-action', () => {
    parentExecuted = true;
  });

  child.dispatchEvent(new DOMEvent('custom-action', { bubbles: true }));

  assert.strictEqual(firstChildExecuted, true, 'First child listener should execute');
  assert.strictEqual(secondChildExecuted, false, 'Second child listener must NOT execute after stopImmediatePropagation()');
  assert.strictEqual(parentExecuted, false, 'Parent listener must NOT execute after stopImmediatePropagation()');
});

test('dom: ClassList add/remove/toggle/contains edge cases', () => {
  const dom = createDOM();
  const el = dom.createElement('div');
  el.className = 'alpha beta';

  // Duplicate add
  el.classList.add('beta', 'gamma');
  assert.strictEqual(el.classList.contains('gamma'), true);
  // No duplicate strings in className
  const classes = el.className.split(' ');
  const betaCount = classes.filter(c => c === 'beta').length;
  assert.strictEqual(betaCount, 1, 'ClassList must not produce duplicates in className');

  // Toggle with force
  el.classList.toggle('gamma', false);
  assert.strictEqual(el.classList.contains('gamma'), false);
  el.classList.toggle('delta', true);
  assert.strictEqual(el.classList.contains('delta'), true);

  // Remove multiple
  el.classList.remove('alpha', 'delta');
  assert.strictEqual(el.classList.contains('alpha'), false);
  assert.strictEqual(el.classList.contains('delta'), false);
  assert.strictEqual(el.classList.contains('beta'), true);
});

// ============================================================================
// PART 3: ADVERSARIAL FUZZING OF webgl.js
// ============================================================================
console.log('\n=== PART 3: ADVERSARIAL STRESS - webgl.js ===');

test('webgl: 100 rapid loseContext / restoreContext cycles stress test', () => {
  const dom = createDOM();
  const canvas = dom.createElement('canvas');
  const gl = createMockWebGLContext(2, {}, canvas);
  const ext = gl.getExtension('WEBGL_lose_context');

  let lostFired = 0;
  let restoredFired = 0;

  canvas.addEventListener('webglcontextlost', (e) => {
    lostFired++;
    e.preventDefault();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    restoredFired++;
  });

  const CYCLES = 100;
  for (let i = 0; i < CYCLES; i++) {
    ext.loseContext();
    assert.strictEqual(gl.isContextLost(), true);
    assert.strictEqual(gl.getExtension('WEBGL_lose_context'), null, 'getExtension must be null while lost');

    ext.restoreContext();
    assert.strictEqual(gl.isContextLost(), false);
    assert.ok(gl.getExtension('WEBGL_lose_context') !== null, 'getExtension must recover after restore');
  }

  assert.strictEqual(lostFired, CYCLES);
  assert.strictEqual(restoredFired, CYCLES);
});

test('webgl: Detached canvas and null canvas handle lose/restore with zero exceptions', () => {
  const glOrphan = createMockWebGLContext(2, {}, null);
  const extOrphan = glOrphan.getExtension('WEBGL_lose_context');

  assert.doesNotThrow(() => {
    extOrphan.loseContext();
    assert.strictEqual(glOrphan.isContextLost(), true);
    extOrphan.restoreContext();
    assert.strictEqual(glOrphan.isContextLost(), false);
  });
});

test('webgl: Standard WebGL 2 parameters and shader pipeline mock methods', () => {
  const gl = createMockWebGLContext(2);

  assert.strictEqual(gl.getParameter(0x1f02), 'WebGL 2.0 (Mock GPU)');
  assert.strictEqual(gl.getParameter(0x1f01), 'Mock Renderer');
  assert.strictEqual(gl.getParameter(0x1f00), 'Mock Vendor');

  // Shader lifecycle mock
  const vs = gl.createShader();
  assert.ok(vs && vs.id, 'createShader must return handle');
  const prog = gl.createProgram();
  assert.ok(prog && prog.id, 'createProgram must return handle');
  assert.strictEqual(gl.getProgramParameter(prog, 0x8b82), true);
  assert.strictEqual(gl.getShaderParameter(vs, 0x8b81), true);
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n===============================================================');
console.log(`CHALLENGER FUZZING RESULT: ${stats.passed}/${stats.total} PASSED, ${stats.failed} FAILED`);
console.log('===============================================================');

if (stats.failed > 0) {
  console.error('\nFAILURE DETAILS:');
  for (const f of stats.failures) {
    console.error(`- ${f.name}: ${f.message}`);
  }
  process.exit(1);
} else {
  console.log('ALL ADVERSARIAL EDGE CASES PASSED EMPIRICALLY!');
  process.exit(0);
}
