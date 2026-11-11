/**
 * GSAP ScrollTrigger normalized progress & Catmull-Rom spline camera evaluator.
 */

const CAMERA_WAYPOINTS = [
  { id: 'beginning', position: [0.0, 2.2, 7.5], target: [0.0, 1.8, 0.0], fov: 45 },
  { id: 'strength', position: [-3.4, 1.4, 3.6], target: [-0.6, 0.9, 0.1], fov: 45 },
  { id: 'performance', position: [3.6, 2.2, 4.0], target: [0.7, 1.3, -0.6], fov: 45 },
  { id: 'discipline', position: [0.2, 3.9, 2.6], target: [0.0, 0.7, 0.0], fov: 45 },
  { id: 'next-level', position: [0.0, 1.3, 9.2], target: [0.0, 3.2, -3.2], fov: 45 },
];

/**
 * Robust progress sanitizer:
 * - Coerces NaN, undefined, null, and non-number types to 0.0
 * - Clamps +Infinity to 1.0, -Infinity to 0.0
 * - Clamps values < 0.0 to 0.0, > 1.0 to 1.0
 */
function sanitizeProgress(val) {
  if (val === null || val === undefined || typeof val !== 'number' || Number.isNaN(val)) {
    return 0.0;
  }
  return Math.max(0, Math.min(1, val));
}

/**
 * Standard 1D Catmull-Rom spline interpolation between p1 and p2 with tangents from p0 and p3.
 */
function catmullRom1D(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

/**
 * 3D Catmull-Rom interpolation given an array of points [ [x,y,z], ... ] and normalized t in [0, 1].
 */
function evaluateCatmullRom3D(points, t) {
  if (!Array.isArray(points) || points.length === 0) {
    return [0.0, 0.0, 0.0];
  }
  if (points.length === 1) {
    return [points[0][0] || 0.0, points[0][1] || 0.0, points[0][2] || 0.0];
  }

  const clampedT = sanitizeProgress(t);
  const numSegments = points.length - 1;
  const rawIdx = clampedT * numSegments;
  const segIdx = Math.min(Math.floor(rawIdx), numSegments - 1);
  const localT = rawIdx - segIdx;

  const p0 = points[Math.max(0, segIdx - 1)];
  const p1 = points[segIdx];
  const p2 = points[Math.min(points.length - 1, segIdx + 1)];
  const p3 = points[Math.min(points.length - 1, segIdx + 2)];

  return [
    catmullRom1D(p0[0], p1[0], p2[0], p3[0], localT),
    catmullRom1D(p0[1], p1[1], p2[1], p3[1], localT),
    catmullRom1D(p0[2], p1[2], p2[2], p3[2], localT),
  ];
}

class CameraNarrativeEvaluator {
  constructor(waypoints = CAMERA_WAYPOINTS, options = {}) {
    this.waypoints = Array.isArray(waypoints) && waypoints.length > 0 ? waypoints : CAMERA_WAYPOINTS;
    this.reducedMotion = options.reducedMotion || false;
    this.positions = this.waypoints.map((w) => w.position);
    this.targets = this.waypoints.map((w) => w.target);
  }

  evaluate(progress) {
    const p = sanitizeProgress(progress);

    if (this.reducedMotion) {
      // Locked static vantage point under reduced motion
      return {
        position: [0.0, 2.2, 8.0],
        target: [0.0, 1.8, 0.0],
        waypointId: this.getWaypointIdAt(p),
      };
    }

    const position = evaluateCatmullRom3D(this.positions, p);
    const target = evaluateCatmullRom3D(this.targets, p);
    const waypointId = this.getWaypointIdAt(p);

    return { position, target, waypointId };
  }

  getWaypointIdAt(progress) {
    const p = sanitizeProgress(progress);
    const segment = p * (this.waypoints.length - 1);
    const idx = Math.min(Math.round(segment), this.waypoints.length - 1);
    return this.waypoints[idx].id;
  }
}

module.exports = {
  CAMERA_WAYPOINTS,
  sanitizeProgress,
  evaluateCatmullRom3D,
  CameraNarrativeEvaluator,
};
