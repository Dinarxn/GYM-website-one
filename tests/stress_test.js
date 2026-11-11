/**
 * Adversarial Stress Harness for tests/helpers/ (scroll, webgl, dom)
 */

const assert = require('assert');
const { CameraNarrativeEvaluator, evaluateCatmullRom3D, CAMERA_WAYPOINTS } = require('./helpers/scroll');
const { MockWebGLContext, createMockWebGLContext } = require('./helpers/webgl');
const { DOMNode, DOMEvent, DOMDocument, WindowMock, createDOM, createWindow } = require('./helpers/dom');

const report = {
  scroll: { passed: 0, failed: 0, issues: [] },
  webgl: { passed: 0, failed: 0, issues: [] },
  dom: { passed: 0, failed: 0, issues: [] },
};

function record(domain, testName, fn) {
  try {
    fn();
    report[domain].passed++;
    console.log(`  [PASS] [${domain.toUpperCase()}] ${testName}`);
  } catch (err) {
    report[domain].failed++;
    report[domain].issues.push({ testName, error: err.message, stack: err.stack });
    console.log(`  [FAIL] [${domain.toUpperCase()}] ${testName}: ${err.message}`);
  }
}

console.log('====================================================');
console.log('ADVERSARIAL STRESS TEST: DOMAIN LOGIC SIMULATORS');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. STRESS TEST: tests/helpers/scroll.js
// ----------------------------------------------------
console.log('--- 1. Testing scroll.js ---');

const evaluator = new CameraNarrativeEvaluator();
const reducedEvaluator = new CameraNarrativeEvaluator(CAMERA_WAYPOINTS, { reducedMotion: true });

// 1.1 Standard boundaries: -1.0, 0.0, 0.5, 1.0, 2.0
const testProgressValues = [-1.0, 0.0, 0.5, 1.0, 2.0];

for (const p of testProgressValues) {
  record('scroll', `Boundary progress: ${p}`, () => {
    const res = evaluator.evaluate(p);
    assert.ok(res, 'Result should exist');
    assert.ok(Array.isArray(res.position) && res.position.length === 3, 'Position must be 3D vector');
    assert.ok(Array.isArray(res.target) && res.target.length === 3, 'Target must be 3D vector');
    assert.ok(typeof res.waypointId === 'string' && res.waypointId.length > 0, 'waypointId must be non-empty string');

    for (let i = 0; i < 3; i++) {
      assert.ok(Number.isFinite(res.position[i]), `Position[${i}] must be finite for p=${p}, got ${res.position[i]}`);
      assert.ok(Number.isFinite(res.target[i]), `Target[${i}] must be finite for p=${p}, got ${res.target[i]}`);
    }
  });
}

// 1.2 Verify clamping behavior: -1.0 should equal 0.0, 2.0 should equal 1.0
record('scroll', 'Clamping: p = -1.0 matches p = 0.0 exactly', () => {
  const atNeg = evaluator.evaluate(-1.0);
  const atZero = evaluator.evaluate(0.0);
  assert.deepStrictEqual(atNeg.position, atZero.position);
  assert.deepStrictEqual(atNeg.target, atZero.target);
  assert.strictEqual(atNeg.waypointId, atZero.waypointId);
});

record('scroll', 'Clamping: p = 2.0 matches p = 1.0 exactly', () => {
  const atTwo = evaluator.evaluate(2.0);
  const atOne = evaluator.evaluate(1.0);
  assert.deepStrictEqual(atTwo.position, atOne.position);
  assert.deepStrictEqual(atTwo.target, atOne.target);
  assert.strictEqual(atTwo.waypointId, atOne.waypointId);
});

// 1.3 Extreme progress values: Infinity, -Infinity
record('scroll', 'Extreme progress: +Infinity clamps to 1.0', () => {
  const atInf = evaluator.evaluate(Infinity);
  const atOne = evaluator.evaluate(1.0);
  assert.deepStrictEqual(atInf.position, atOne.position);
  assert.strictEqual(atInf.waypointId, atOne.waypointId);
});

record('scroll', 'Extreme progress: -Infinity clamps to 0.0', () => {
  const atNegInf = evaluator.evaluate(-Infinity);
  const atZero = evaluator.evaluate(0.0);
  assert.deepStrictEqual(atNegInf.position, atZero.position);
  assert.strictEqual(atNegInf.waypointId, atZero.waypointId);
});

// 1.4 Adversarial input: NaN, undefined, null
record('scroll', 'Adversarial progress: NaN handling', () => {
  const res = evaluator.evaluate(NaN);
  assert.ok(res, 'Result should exist');
  for (let i = 0; i < 3; i++) {
    assert.ok(Number.isFinite(res.position[i]), `Position[${i}] must be finite for NaN, got ${res.position[i]}`);
    assert.ok(Number.isFinite(res.target[i]), `Target[${i}] must be finite for NaN, got ${res.target[i]}`);
  }
  assert.ok(typeof res.waypointId === 'string' && res.waypointId.length > 0, 'waypointId must be valid for NaN');
});

record('scroll', 'Adversarial progress: undefined handling', () => {
  const res = evaluator.evaluate(undefined);
  assert.ok(res, 'Result should exist');
  for (let i = 0; i < 3; i++) {
    assert.ok(Number.isFinite(res.position[i]), `Position[${i}] must be finite for undefined, got ${res.position[i]}`);
  }
});

record('scroll', 'Adversarial progress: null handling', () => {
  const res = evaluator.evaluate(null);
  assert.ok(res, 'Result should exist');
  const atZero = evaluator.evaluate(0);
  assert.deepStrictEqual(res.position, atZero.position);
});

// 1.5 Reduced motion static locking across all values
for (const p of [-1.0, 0.0, 0.5, 1.0, 2.0, NaN, Infinity, -Infinity]) {
  record('scroll', `Reduced-motion static locking at p=${p}`, () => {
    const res = reducedEvaluator.evaluate(p);
    assert.deepStrictEqual(res.position, [0.0, 2.2, 8.0], `Position must be locked at [0, 2.2, 8.0] for p=${p}`);
    assert.deepStrictEqual(res.target, [0.0, 1.8, 0.0], `Target must be locked at [0, 1.8, 0.0] for p=${p}`);
    assert.ok(typeof res.waypointId === 'string' && res.waypointId.length > 0, `waypointId must be valid for p=${p}`);
  });
}

// 1.6 Direct evaluateCatmullRom3D test with single point, empty points, and NaN
record('scroll', 'evaluateCatmullRom3D with NaN progress', () => {
  const points = [[0, 0, 0], [1, 1, 1], [2, 2, 2]];
  const vec = evaluateCatmullRom3D(points, NaN);
  assert.ok(Array.isArray(vec) && vec.length === 3);
  for (let i = 0; i < 3; i++) {
    assert.ok(Number.isFinite(vec[i]), `vec[${i}] must be finite, got ${vec[i]}`);
  }
});


// ----------------------------------------------------
// 2. STRESS TEST: tests/helpers/webgl.js
// ----------------------------------------------------
console.log('\n--- 2. Testing webgl.js ---');

// 2.1 Initial state
record('webgl', 'Initial context state is not lost', () => {
  const dom = createDOM();
  const canvas = dom.createElement('canvas');
  const gl = createMockWebGLContext(2, {}, canvas);
  assert.strictEqual(gl.isContextLost(), false);
});

// 2.2 Lose context and verify isContextLost, events, and getExtension
record('webgl', 'Trigger loseContext() and verify state and event', () => {
  const dom = createDOM();
  const canvas = dom.createElement('canvas');
  const gl = createMockWebGLContext(2, {}, canvas);

  let lostEventFired = false;
  let eventDefaultPrevented = false;

  canvas.addEventListener('webglcontextlost', (e) => {
    lostEventFired = true;
    e.preventDefault();
    eventDefaultPrevented = e.defaultPrevented;
  });

  const ext = gl.getExtension('WEBGL_lose_context');
  assert.ok(ext, 'WEBGL_lose_context extension must exist before loss');

  ext.loseContext();

  assert.strictEqual(gl.isContextLost(), true, 'isContextLost() must return true after loseContext()');
  assert.strictEqual(lostEventFired, true, 'webglcontextlost event must have fired');
  assert.strictEqual(eventDefaultPrevented, true, 'preventDefault() on event must mark defaultPrevented');
});

// 2.3 Restore context and verify state and recovery
record('webgl', 'Trigger restoreContext() and verify recovery', () => {
  const dom = createDOM();
  const canvas = dom.createElement('canvas');
  const gl = createMockWebGLContext(2, {}, canvas);

  let restoredEventFired = false;
  canvas.addEventListener('webglcontextrestored', () => {
    restoredEventFired = true;
  });

  const ext = gl.getExtension('WEBGL_lose_context');
  ext.loseContext();
  assert.strictEqual(gl.isContextLost(), true);

  ext.restoreContext();

  assert.strictEqual(gl.isContextLost(), false, 'isContextLost() must return false after restoreContext()');
  assert.strictEqual(restoredEventFired, true, 'webglcontextrestored event must have fired');
});

// 2.4 Multiple lose/restore cycles
record('webgl', 'Multiple lose/restore cycles maintain consistency', () => {
  const dom = createDOM();
  const canvas = dom.createElement('canvas');
  const gl = createMockWebGLContext(2, {}, canvas);

  let lostCount = 0;
  let restoredCount = 0;

  canvas.addEventListener('webglcontextlost', (e) => {
    lostCount++;
    e.preventDefault();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    restoredCount++;
  });

  const ext = gl.getExtension('WEBGL_lose_context');

  for (let i = 0; i < 5; i++) {
    ext.loseContext();
    assert.strictEqual(gl.isContextLost(), true);
    ext.restoreContext();
    assert.strictEqual(gl.isContextLost(), false);
  }

  assert.strictEqual(lostCount, 5, 'Lost event should fire 5 times');
  assert.strictEqual(restoredCount, 5, 'Restored event should fire 5 times');
});

// 2.5 getExtension behavior during context loss
record('webgl', 'getExtension during context loss returns null', () => {
  const gl = createMockWebGLContext(2);
  const ext = gl.getExtension('WEBGL_lose_context');
  ext.loseContext();

  // Any subsequent getExtension call during context lost state
  const lostExt = gl.getExtension('WEBGL_lose_context');
  assert.strictEqual(lostExt, null, 'getExtension must return null when context is lost');

  ext.restoreContext();
  const restoredExt = gl.getExtension('WEBGL_lose_context');
  assert.ok(restoredExt !== null, 'getExtension must return extension object after context is restored');
});

// 2.6 Context without canvas attachment does not crash on lose/restore
record('webgl', 'Context without canvas attachment handles loseContext/restoreContext safely', () => {
  const gl = createMockWebGLContext(2, {}, null);
  const ext = gl.getExtension('WEBGL_lose_context');
  ext.loseContext();
  assert.strictEqual(gl.isContextLost(), true);
  ext.restoreContext();
  assert.strictEqual(gl.isContextLost(), false);
});

// 2.7 Consecutive loseContext() calls
record('webgl', 'Consecutive loseContext() calls do not break context', () => {
  const gl = createMockWebGLContext(2);
  const ext = gl.getExtension('WEBGL_lose_context');
  ext.loseContext();
  ext.loseContext();
  assert.strictEqual(gl.isContextLost(), true);
  ext.restoreContext();
  assert.strictEqual(gl.isContextLost(), false);
});

// 2.8 restoreContext() without loseContext()
record('webgl', 'restoreContext() without previous loseContext() is safe', () => {
  const gl = createMockWebGLContext(2);
  const ext = gl.getExtension('WEBGL_lose_context');
  ext.restoreContext();
  assert.strictEqual(gl.isContextLost(), false);
});


// ----------------------------------------------------
// 3. STRESS TEST: tests/helpers/dom.js
// ----------------------------------------------------
console.log('\n--- 3. Testing dom.js ---');

// 3.1 Selector engine: basic, id, class, tag, attribute
record('dom', 'Basic selector engine resolution', () => {
  const dom = createDOM();
  const div = dom.createElement('div');
  div.id = 'hero-container';
  div.className = 'section dark-surface';
  div.setAttribute('data-section', 'hero');

  const btn = dom.createElement('button');
  btn.className = 'btn btn-primary';
  btn.setAttribute('data-action', 'submit');
  div.appendChild(btn);
  dom.body.appendChild(div);

  assert.strictEqual(dom.querySelector('#hero-container'), div, 'ID selector #hero-container');
  assert.strictEqual(dom.querySelector('.section'), div, 'Class selector .section');
  assert.strictEqual(dom.querySelector('.dark-surface'), div, 'Class selector .dark-surface');
  assert.strictEqual(dom.querySelector('[data-section="hero"]'), div, 'Attribute selector [data-section="hero"]');
  assert.strictEqual(dom.querySelector('button'), btn, 'Tag selector button');
  assert.strictEqual(dom.querySelector('button[data-action="submit"]'), btn, 'Compound selector button[data-action="submit"]');
});

// 3.2 Complex nested descendant selector: "div.section button.btn-primary"
record('dom', 'Nested descendant selector resolution', () => {
  const dom = createDOM();
  const nav = dom.createElement('nav');
  nav.className = 'navbar';
  const navBtn = dom.createElement('button');
  navBtn.className = 'nav-toggle';
  nav.appendChild(navBtn);

  const main = dom.createElement('main');
  main.className = 'content';
  const mainBtn = dom.createElement('button');
  mainBtn.className = 'cta-button';
  main.appendChild(mainBtn);

  dom.body.appendChild(nav);
  dom.body.appendChild(main);

  const matched = dom.querySelectorAll('nav button');
  // Strict descendant check: only buttons inside nav should match!
  assert.ok(matched.includes(navBtn), 'nav button should include navBtn');
  assert.ok(!matched.includes(mainBtn), 'nav button must NOT include mainBtn from outside nav');
});

// 3.3 Multiple class compound selector: e.g. ".card.active"
record('dom', 'Multiple class compound selector: .card.active', () => {
  const dom = createDOM();
  const c1 = dom.createElement('div');
  c1.className = 'card';
  const c2 = dom.createElement('div');
  c2.className = 'card active';
  dom.body.appendChild(c1);
  dom.body.appendChild(c2);

  const matched = dom.querySelectorAll('.card.active');
  assert.ok(matched.includes(c2), '.card.active must match c2');
  assert.ok(!matched.includes(c1), '.card.active must NOT match c1');
});

// 3.4 Attribute selectors with operators: ^=, $=, *=
record('dom', 'Attribute prefix/suffix/substring operators', () => {
  const dom = createDOM();
  const a1 = dom.createElement('a');
  a1.setAttribute('href', 'https://example.com/programs');
  const a2 = dom.createElement('a');
  a2.setAttribute('href', '#membership');
  const a3 = dom.createElement('a');
  a3.setAttribute('href', 'mailto:info@ironforge.com');

  dom.body.appendChild(a1);
  dom.body.appendChild(a2);
  dom.body.appendChild(a3);

  assert.strictEqual(dom.querySelector('[href^="https://"]'), a1, 'href prefix ^=');
  assert.strictEqual(dom.querySelector('[href$="membership"]'), a2, 'href suffix $=');
  assert.strictEqual(dom.querySelector('[href*="ironforge"]'), a3, 'href substring *=');
});

// 3.5 Event bubbling: leaf -> parent -> body
record('dom', 'Event bubbling from child through parent hierarchy', () => {
  const dom = createDOM();
  const parent = dom.createElement('div');
  const child = dom.createElement('button');
  parent.appendChild(child);
  dom.body.appendChild(parent);

  const trace = [];
  child.addEventListener('click', (e) => {
    trace.push({ level: 'child', currentTarget: e.currentTarget, target: e.target });
  });
  parent.addEventListener('click', (e) => {
    trace.push({ level: 'parent', currentTarget: e.currentTarget, target: e.target });
  });

  child.click();

  assert.strictEqual(trace.length, 2, 'Event should bubble to parent');
  assert.strictEqual(trace[0].level, 'child');
  assert.strictEqual(trace[1].level, 'parent');
  // Check target integrity during bubbling: target should remain the child!
  assert.strictEqual(trace[0].target, child, 'child listener target should be child');
  assert.strictEqual(trace[1].target, child, 'parent listener target should be child');
  assert.strictEqual(trace[1].currentTarget, parent, 'parent listener currentTarget should be parent');
});

// 3.6 Event bubbling stopPropagation()
record('dom', 'stopPropagation() prevents bubbling to parent', () => {
  const dom = createDOM();
  const parent = dom.createElement('div');
  const child = dom.createElement('button');
  parent.appendChild(child);
  dom.body.appendChild(parent);

  let parentFired = false;
  child.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  parent.addEventListener('click', () => {
    parentFired = true;
  });

  child.click();
  assert.strictEqual(parentFired, false, 'Parent listener should NOT fire after stopPropagation()');
});

// 3.7 stopImmediatePropagation() stops other listeners on the same node
record('dom', 'stopImmediatePropagation() halts subsequent listeners on same node', () => {
  const dom = createDOM();
  const node = dom.createElement('div');

  let secondFired = false;
  node.addEventListener('custom', (e) => {
    e.stopImmediatePropagation();
  });
  node.addEventListener('custom', () => {
    secondFired = true;
  });

  node.dispatchEvent(new DOMEvent('custom'));
  assert.strictEqual(secondFired, false, 'Second listener should NOT fire');
});

// 3.8 preventDefault() and cancelable
record('dom', 'preventDefault() sets defaultPrevented and dispatchEvent returns false', () => {
  const dom = createDOM();
  const form = dom.createElement('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  const evt = new DOMEvent('submit', { cancelable: true });
  const allowed = form.dispatchEvent(evt);

  assert.strictEqual(evt.defaultPrevented, true, 'defaultPrevented must be true');
  assert.strictEqual(allowed, false, 'dispatchEvent must return false when default is prevented');
});

record('dom', 'preventDefault() ignored when cancelable is false', () => {
  const dom = createDOM();
  const el = dom.createElement('div');

  el.addEventListener('unskippable', (e) => {
    e.preventDefault();
  });

  const evt = new DOMEvent('unskippable', { cancelable: false });
  const allowed = el.dispatchEvent(evt);

  assert.strictEqual(evt.defaultPrevented, false, 'defaultPrevented must remain false when not cancelable');
  assert.strictEqual(allowed, true, 'dispatchEvent must return true when cancelable is false');
});

// 3.9 Non-bubbling events do not bubble
record('dom', 'Non-bubbling events do not propagate to parent', () => {
  const dom = createDOM();
  const parent = dom.createElement('div');
  const child = dom.createElement('input');
  parent.appendChild(child);

  let parentHeard = false;
  parent.addEventListener('focus', () => {
    parentHeard = true;
  });

  child.focus();
  assert.strictEqual(parentHeard, false, 'Focus event without bubbling must not reach parent');
});

// 3.10 Nested same-tag HTML parsing in innerHTML
record('dom', 'Nested same-tag HTML parsing (div > div)', () => {
  const dom = createDOM();
  const container = dom.createElement('div');
  container.innerHTML = '<div class="outer"><div class="inner">Inner text</div></div>';
  const outer = container.children[0];
  assert.ok(outer, 'Outer div should exist');
  assert.strictEqual(outer.children.length, 1, 'Outer div should have 1 child');
  assert.strictEqual(outer.children[0].className, 'inner', 'Inner child should have class inner');
});

// Print Final Results
console.log('\n====================================================');
console.log('STRESS TEST SUMMARY RESULTS:');
console.log('====================================================');
console.log(`SCROLL: passed: ${report.scroll.passed}, failed: ${report.scroll.failed}`);
console.log(`WEBGL:  passed: ${report.webgl.passed}, failed: ${report.webgl.failed}`);
console.log(`DOM:    passed: ${report.dom.passed}, failed: ${report.dom.failed}`);

if (report.scroll.failed > 0 || report.webgl.failed > 0 || report.dom.failed > 0) {
  console.log('\nISSUES FOUND:');
  for (const [domKey, stats] of Object.entries(report)) {
    for (const issue of stats.issues) {
      console.log(`- [${domKey}] ${issue.testName}: ${issue.error}`);
    }
  }
}
