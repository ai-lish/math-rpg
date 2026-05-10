'use strict';

/**
 * credits.test.js
 *
 * Tests for the Math Bank credits functions:
 *   addCredits, spendCredits
 */

const { loadSharedMain } = require('./loadShared');
const { resetGameState } = require('./testHelpers');

beforeAll(() => {
  loadSharedMain();
});

beforeEach(() => {
  resetGameState({ lastDailyReset: new Date().toDateString() });
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// addCredits
// ---------------------------------------------------------------------------

describe('addCredits', () => {
  test('increases gameState.credits by the given amount', () => {
    window.addCredits(5);
    expect(window.gameState.credits).toBe(5);
  });

  test('accumulates across multiple calls', () => {
    window.addCredits(5);
    window.addCredits(20);
    expect(window.gameState.credits).toBe(25);
  });

  test('ignores negative amounts (no-op)', () => {
    window.gameState.credits = 10;
    window.addCredits(-5);
    expect(window.gameState.credits).toBe(10);
  });

  test('rounds fractional amounts', () => {
    window.addCredits(4.9);
    expect(Number.isInteger(window.gameState.credits)).toBe(true);
  });

  test('persists credits to localStorage', () => {
    window.addCredits(15);
    window.saveState();
    const saved = JSON.parse(localStorage.getItem('mathrpg_v1'));
    expect(saved.credits).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// spendCredits
// ---------------------------------------------------------------------------

describe('spendCredits', () => {
  test('returns true and deducts credits when balance is sufficient', () => {
    window.gameState.credits = 50;
    const result = window.spendCredits(10);
    expect(result).toBe(true);
    expect(window.gameState.credits).toBe(40);
  });

  test('returns false and does not deduct when balance is insufficient', () => {
    window.gameState.credits = 5;
    const result = window.spendCredits(10);
    expect(result).toBe(false);
    expect(window.gameState.credits).toBe(5);
  });

  test('returns false when credits are zero', () => {
    window.gameState.credits = 0;
    const result = window.spendCredits(10);
    expect(result).toBe(false);
    expect(window.gameState.credits).toBe(0);
  });

  test('returns true on exact balance match', () => {
    window.gameState.credits = 10;
    const result = window.spendCredits(10);
    expect(result).toBe(true);
    expect(window.gameState.credits).toBe(0);
  });

  test('persists updated balance to localStorage', () => {
    window.gameState.credits = 30;
    window.spendCredits(10);
    window.saveState();
    const saved = JSON.parse(localStorage.getItem('mathrpg_v1'));
    expect(saved.credits).toBe(20);
  });

  test('round-trip: addCredits then spendCredits', () => {
    window.addCredits(20);
    window.spendCredits(10);
    expect(window.gameState.credits).toBe(10);
  });
});
