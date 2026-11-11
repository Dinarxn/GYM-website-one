const assert = require('../helpers/assert');
const {
  CameraNarrativeEvaluator,
  sanitizeProgress,
  evaluateCatmullRom3D,
  CAMERA_WAYPOINTS,
} = require('../helpers/scroll');

describe('Tier 2 - Feature 15: Camera Narrative Boundary Cases', () => {
  test('T2-15-01: Adversarial Progress Input Sanitization (Boundary)', () => {
    // Verify sanitizeProgress handles non-finite, null, undefined, and extreme numeric values
    assert.equal(sanitizeProgress(NaN), 0.0, 'NaN must sanitize to 0.0');
    assert.equal(sanitizeProgress(undefined), 0.0, 'undefined must sanitize to 0.0');
    assert.equal(sanitizeProgress(null), 0.0, 'null must sanitize to 0.0');
    assert.equal(sanitizeProgress('invalid'), 0.0, 'string must sanitize to 0.0');
    assert.equal(sanitizeProgress(-Infinity), 0.0, '-Infinity must clamp to 0.0');
    assert.equal(sanitizeProgress(Infinity), 1.0, '+Infinity must clamp to 1.0');
  });

  test('T2-15-02: Catmull-Rom Interpolation Precision Across High-Density Samples (Corner)', () => {
    const evaluator = new CameraNarrativeEvaluator();
    const sampleCount = 100;

    // Evaluate across 100 dense timeline steps
    for (let i = 0; i <= sampleCount; i++) {
      const p = i / sampleCount;
      const state = evaluator.evaluate(p);

      assert.truthy(state.position, `Position at p=${p} must be defined`);
      assert.truthy(state.target, `Target at p=${p} must be defined`);
      assert.equal(state.position.length, 3);
      assert.equal(state.target.length, 3);

      for (let axis = 0; axis < 3; axis++) {
        assert.truthy(Number.isFinite(state.position[axis]), `Position axis ${axis} at p=${p} must be finite`);
        assert.truthy(Number.isFinite(state.target[axis]), `Target axis ${axis} at p=${p} must be finite`);
      }
    }
  });

  test('T2-15-03: Negative and Overscroll Progress Clamping (Boundary)', () => {
    const evaluator = new CameraNarrativeEvaluator();

    const under = evaluator.evaluate(-0.5);
    const over = evaluator.evaluate(1.8);

    // Should clamp exactly to evaluate(0.0) and evaluate(1.0)
    const point0 = evaluator.evaluate(0.0);
    const point1 = evaluator.evaluate(1.0);

    assert.deepEqual(under.position, point0.position, 'Negative progress must clamp to beginning waypoint');
    assert.deepEqual(under.target, point0.target);
    assert.equal(under.waypointId, 'beginning');

    assert.deepEqual(over.position, point1.position, 'Overscroll progress must clamp to next-level waypoint');
    assert.deepEqual(over.target, point1.target);
    assert.equal(over.waypointId, 'next-level');
  });

  test('T2-15-04: Reduced Motion Mode Static Vantage Lock Under Adversarial Inputs (Boundary)', () => {
    const evaluator = new CameraNarrativeEvaluator(CAMERA_WAYPOINTS, { reducedMotion: true });

    // Under reduced motion, adversarial inputs must still yield invariant locked static position
    const adversarialValues = [-2, 0, 0.5, 1, 3, NaN, undefined];
    for (const val of adversarialValues) {
      const state = evaluator.evaluate(val);
      assert.deepEqual(state.position, [0.0, 2.2, 8.0], `Position must be locked at progress=${val}`);
      assert.deepEqual(state.target, [0.0, 1.8, 0.0], `Target must be locked at progress=${val}`);
    }
  });

  test('T2-15-05: Spline Degenerate Point Set Resilience (Edge Case)', () => {
    // Empty points array
    const emptyResult = evaluateCatmullRom3D([], 0.5);
    assert.deepEqual(emptyResult, [0.0, 0.0, 0.0], 'Empty points array returns [0, 0, 0]');

    // Single point array
    const singlePoint = [[1.2, 3.4, 5.6]];
    const singleResult = evaluateCatmullRom3D(singlePoint, 0.7);
    assert.deepEqual(singleResult, [1.2, 3.4, 5.6], 'Single point array returns the point position');
  });
});
