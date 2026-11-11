const assert = require('../helpers/assert');
const { CAMERA_WAYPOINTS, CameraNarrativeEvaluator, evaluateCatmullRom3D } = require('../helpers/scroll');

describe('Tier 1 - Feature 15: GSAP ScrollTrigger 5-Scene Camera Narrative', () => {
  test('T1-F15-01: 5 Narrative Waypoints Exact Spatial Definition', () => {
    assert.equal(CAMERA_WAYPOINTS.length, 5, 'Must contain exactly 5 camera waypoints');

    const expectedWaypoints = [
      { id: 'beginning', position: [0.0, 2.2, 7.5], target: [0.0, 1.8, 0.0], fov: 45 },
      { id: 'strength', position: [-3.4, 1.4, 3.6], target: [-0.6, 0.9, 0.1], fov: 45 },
      { id: 'performance', position: [3.6, 2.2, 4.0], target: [0.7, 1.3, -0.6], fov: 45 },
      { id: 'discipline', position: [0.2, 3.9, 2.6], target: [0.0, 0.7, 0.0], fov: 45 },
      { id: 'next-level', position: [0.0, 1.3, 9.2], target: [0.0, 3.2, -3.2], fov: 45 },
    ];

    for (let i = 0; i < expectedWaypoints.length; i++) {
      assert.equal(CAMERA_WAYPOINTS[i].id, expectedWaypoints[i].id);
      assert.deepEqual(CAMERA_WAYPOINTS[i].position, expectedWaypoints[i].position);
      assert.deepEqual(CAMERA_WAYPOINTS[i].target, expectedWaypoints[i].target);
      assert.equal(CAMERA_WAYPOINTS[i].fov, 45);
    }
  });

  test('T1-F15-02: Waypoint Identification Across Normalized Progress', () => {
    const evaluator = new CameraNarrativeEvaluator();

    // Verify correct waypoint ID resolution at key progress milestones
    assert.equal(evaluator.getWaypointIdAt(0.0), 'beginning');
    assert.equal(evaluator.getWaypointIdAt(0.25), 'strength');
    assert.equal(evaluator.getWaypointIdAt(0.5), 'performance');
    assert.equal(evaluator.getWaypointIdAt(0.75), 'discipline');
    assert.equal(evaluator.getWaypointIdAt(1.0), 'next-level');
  });

  test('T1-F15-03: Catmull-Rom Interpolation Spatial Continuity', () => {
    const evaluator = new CameraNarrativeEvaluator();
    const steps = 20;

    let prevPos = evaluator.evaluate(0.0).position;

    for (let i = 1; i <= steps; i++) {
      const p = i / steps;
      const currPos = evaluator.evaluate(p).position;

      // Calculate Euclidean distance between adjacent steps
      const dx = currPos[0] - prevPos[0];
      const dy = currPos[1] - prevPos[1];
      const dz = currPos[2] - prevPos[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Trajectory must be continuous without teleportation jumps (> 3.0 units in 5% delta)
      assert.assert(dist < 3.0, `Step at p=${p} jumped too far (${dist})`);
      prevPos = currPos;
    }
  });

  test('T1-F15-04: Reduced Motion Static Vantage Point Locking', () => {
    const evaluator = new CameraNarrativeEvaluator(CAMERA_WAYPOINTS, { reducedMotion: true });

    // When reduced motion is requested, camera must lock to static vantage point
    const samples = [0.0, 0.25, 0.5, 0.75, 1.0];
    for (const p of samples) {
      const state = evaluator.evaluate(p);
      assert.deepEqual(state.position, [0.0, 2.2, 8.0], `Position must be locked at p=${p}`);
      assert.deepEqual(state.target, [0.0, 1.8, 0.0], `Target must be locked at p=${p}`);
      assert.truthy(state.waypointId, 'Waypoint ID must still be resolved');
    }
  });

  test('T1-F15-05: Spline Target Trajectory Continuity Across Narrative Arc', () => {
    const evaluator = new CameraNarrativeEvaluator();

    const tBeginning = evaluator.evaluate(0.0);
    const tStrength = evaluator.evaluate(0.25);
    const tNextLevel = evaluator.evaluate(1.0);

    // Initial lookAt starts near center [0, 1.8, 0]
    assert.closeTo(tBeginning.target[0], 0.0, 0.1);
    assert.closeTo(tBeginning.target[1], 1.8, 0.1);

    // Strength waypoint pans left toward barbell platform
    assert.closeTo(tStrength.target[0], -0.6, 0.2);

    // Next-level waypoint elevates gaze toward monument
    assert.closeTo(tNextLevel.target[1], 3.2, 0.2);
  });
});
