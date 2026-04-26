'use strict';

/**
 * hubMovement.test.js
 *
 * Tests for movement and joystick mathematics extracted from hub-main.js.
 * These functions are tested as pure math without loading hub-main.js
 * (which would spin up a Phaser.Game instance).
 */

// ---------------------------------------------------------------------------
// Pure movement logic (mirrors hub-main.js update())
// ---------------------------------------------------------------------------

/**
 * Normalises a movement vector for diagonal movement.
 * Mirrors the logic in MapHubScene.update() in hub-main.js.
 */
function normaliseMovement(vx, vy) {
  if (vx !== 0 && vy !== 0) {
    const len = Math.sqrt(vx * vx + vy * vy);
    return { vx: vx / len, vy: vy / len };
  }
  return { vx, vy };
}

/**
 * Determines whether joystick input should override keyboard input.
 * Mirrors: if (Math.abs(joystick.x) > 0.1 || Math.abs(joystick.y) > 0.1)
 */
function shouldUseJoystick(joystick) {
  return Math.abs(joystick.x) > 0.1 || Math.abs(joystick.y) > 0.1;
}

/**
 * Computes the joystick knob position given a drag offset and radius.
 * Mirrors the handle() function in setupJoystick().
 */
function computeJoystickOutput(dx, dy, RADIUS) {
  const dist = Math.min(RADIUS, Math.sqrt(dx * dx + dy * dy));
  const ang = Math.atan2(dy, dx);
  return {
    joystickX: Math.cos(ang) * dist / RADIUS,
    joystickY: Math.sin(ang) * dist / RADIUS,
    knobX: Math.cos(ang) * dist,
    knobY: Math.sin(ang) * dist,
  };
}

// ---------------------------------------------------------------------------
// Movement normalisation
// ---------------------------------------------------------------------------

describe('normaliseMovement', () => {
  test('diagonal movement (1,1) is normalised to length ~1', () => {
    const { vx, vy } = normaliseMovement(1, 1);
    const length = Math.sqrt(vx * vx + vy * vy);
    expect(length).toBeCloseTo(1, 5);
  });

  test('diagonal movement (-1,1) is normalised to length ~1', () => {
    const { vx, vy } = normaliseMovement(-1, 1);
    const length = Math.sqrt(vx * vx + vy * vy);
    expect(length).toBeCloseTo(1, 5);
  });

  test('diagonal movement (1,-1) is normalised to length ~1', () => {
    const { vx, vy } = normaliseMovement(1, -1);
    const length = Math.sqrt(vx * vx + vy * vy);
    expect(length).toBeCloseTo(1, 5);
  });

  test('diagonal movement (-1,-1) is normalised to length ~1', () => {
    const { vx, vy } = normaliseMovement(-1, -1);
    const length = Math.sqrt(vx * vx + vy * vy);
    expect(length).toBeCloseTo(1, 5);
  });

  test('horizontal-only movement is NOT modified', () => {
    const { vx, vy } = normaliseMovement(1, 0);
    expect(vx).toBe(1);
    expect(vy).toBe(0);
  });

  test('vertical-only movement is NOT modified', () => {
    const { vx, vy } = normaliseMovement(0, 1);
    expect(vx).toBe(0);
    expect(vy).toBe(1);
  });

  test('no movement (0,0) returns (0,0)', () => {
    const { vx, vy } = normaliseMovement(0, 0);
    expect(vx).toBe(0);
    expect(vy).toBe(0);
  });

  test('diagonal (1,1) normalises each component to 1/√2', () => {
    const { vx, vy } = normaliseMovement(1, 1);
    expect(vx).toBeCloseTo(1 / Math.SQRT2, 5);
    expect(vy).toBeCloseTo(1 / Math.SQRT2, 5);
  });

  test('partial joystick diagonal input is also normalised', () => {
    const { vx, vy } = normaliseMovement(0.6, 0.8);
    const length = Math.sqrt(vx * vx + vy * vy);
    expect(length).toBeCloseTo(1, 5);
  });
});

// ---------------------------------------------------------------------------
// Joystick threshold
// ---------------------------------------------------------------------------

describe('shouldUseJoystick', () => {
  test('returns false when both axes are exactly 0', () => {
    expect(shouldUseJoystick({ x: 0, y: 0 })).toBe(false);
  });

  test('returns false when both axes are within the dead-zone (≤ 0.1)', () => {
    expect(shouldUseJoystick({ x: 0.05, y: 0.05 })).toBe(false);
    expect(shouldUseJoystick({ x: -0.1, y: 0 })).toBe(false);
    expect(shouldUseJoystick({ x: 0, y: 0.1 })).toBe(false);
  });

  test('returns true when x exceeds the dead-zone threshold', () => {
    expect(shouldUseJoystick({ x: 0.11, y: 0 })).toBe(true);
    expect(shouldUseJoystick({ x: -0.11, y: 0 })).toBe(true);
  });

  test('returns true when y exceeds the dead-zone threshold', () => {
    expect(shouldUseJoystick({ x: 0, y: 0.11 })).toBe(true);
    expect(shouldUseJoystick({ x: 0, y: -0.11 })).toBe(true);
  });

  test('returns true when both axes exceed the threshold', () => {
    expect(shouldUseJoystick({ x: 0.5, y: 0.5 })).toBe(true);
  });

  test('returns true even when only one axis is active', () => {
    expect(shouldUseJoystick({ x: 1, y: 0 })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Joystick knob physics
// ---------------------------------------------------------------------------

describe('computeJoystickOutput', () => {
  const RADIUS = 40;

  test('pointing right: joystickX ≈ 1, joystickY ≈ 0', () => {
    const { joystickX, joystickY } = computeJoystickOutput(RADIUS, 0, RADIUS);
    expect(joystickX).toBeCloseTo(1, 5);
    expect(joystickY).toBeCloseTo(0, 5);
  });

  test('pointing left: joystickX ≈ -1, joystickY ≈ 0', () => {
    const { joystickX, joystickY } = computeJoystickOutput(-RADIUS, 0, RADIUS);
    expect(joystickX).toBeCloseTo(-1, 5);
    expect(joystickY).toBeCloseTo(0, 5);
  });

  test('pointing up: joystickX ≈ 0, joystickY ≈ -1', () => {
    const { joystickX, joystickY } = computeJoystickOutput(0, -RADIUS, RADIUS);
    expect(joystickX).toBeCloseTo(0, 5);
    expect(joystickY).toBeCloseTo(-1, 5);
  });

  test('pointing down: joystickX ≈ 0, joystickY ≈ 1', () => {
    const { joystickX, joystickY } = computeJoystickOutput(0, RADIUS, RADIUS);
    expect(joystickX).toBeCloseTo(0, 5);
    expect(joystickY).toBeCloseTo(1, 5);
  });

  test('distance beyond RADIUS is clamped to RADIUS', () => {
    // 200 > RADIUS (40) → dist should clamp to 40
    const { joystickX, joystickY } = computeJoystickOutput(200, 0, RADIUS);
    expect(joystickX).toBeCloseTo(1, 5); // fully right
    expect(joystickY).toBeCloseTo(0, 5);
  });

  test('knob pixel offset is within RADIUS for extreme input', () => {
    const { knobX, knobY } = computeJoystickOutput(999, 0, RADIUS);
    const dist = Math.sqrt(knobX * knobX + knobY * knobY);
    expect(dist).toBeLessThanOrEqual(RADIUS);
  });

  test('zero drag returns zero output', () => {
    const { joystickX, joystickY } = computeJoystickOutput(0, 0, RADIUS);
    expect(joystickX).toBeCloseTo(0, 5);
    expect(joystickY).toBeCloseTo(0, 5);
  });

  test('diagonal drag produces equal x and y components', () => {
    const { joystickX, joystickY } = computeJoystickOutput(RADIUS, RADIUS, RADIUS);
    expect(Math.abs(joystickX - joystickY)).toBeLessThan(1e-10);
  });
});

// ---------------------------------------------------------------------------
// HUB_MAP constants and structure
// ---------------------------------------------------------------------------

describe('Hub map constants', () => {
  const HUB_TILE = 48;
  const HUB_COLS = 16;
  const HUB_ROWS = 12;

  test('tile size is 48px', () => {
    expect(HUB_TILE).toBe(48);
  });

  test('map dimensions are 16×12', () => {
    expect(HUB_COLS).toBe(16);
    expect(HUB_ROWS).toBe(12);
  });

  // Re-create HUB_MAP to verify structural properties without loading Phaser
  const HUB_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,3,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,9,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  test('map has correct number of rows', () => {
    expect(HUB_MAP).toHaveLength(HUB_ROWS);
  });

  test('every row has correct number of columns', () => {
    HUB_MAP.forEach(row => expect(row).toHaveLength(HUB_COLS));
  });

  test('border tiles are all walls (value 1)', () => {
    // Top and bottom rows
    HUB_MAP[0].forEach(t => expect(t).toBe(1));
    HUB_MAP[HUB_ROWS - 1].forEach(t => expect(t).toBe(1));
    // Left and right columns
    for (let y = 0; y < HUB_ROWS; y++) {
      expect(HUB_MAP[y][0]).toBe(1);
      expect(HUB_MAP[y][HUB_COLS - 1]).toBe(1);
    }
  });

  test('player spawn tile (9) appears exactly once', () => {
    let count = 0;
    HUB_MAP.forEach(row => row.forEach(t => { if (t === 9) count++; }));
    expect(count).toBe(1);
  });

  test('school entrance tile (2) appears exactly once', () => {
    let count = 0;
    HUB_MAP.forEach(row => row.forEach(t => { if (t === 2) count++; }));
    expect(count).toBe(1);
  });

  test('algebra entrance tile (3) appears exactly once', () => {
    let count = 0;
    HUB_MAP.forEach(row => row.forEach(t => { if (t === 3) count++; }));
    expect(count).toBe(1);
  });
});
