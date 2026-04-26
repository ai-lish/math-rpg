'use strict';

/**
 * dailyTasks.test.js
 *
 * Tests for checkDailyTasks() – task progress tracking and XP reward logic.
 */

const { loadSharedMain } = require('./loadShared');
const { resetGameState } = require('./testHelpers');

/** Reset internal dailyTasksState to its default values */
function resetDailyTasksState() {
  const dts = window.__dailyTasksState;
  if (!dts) return;
  dts.tasks.forEach(t => {
    t.current = 0;
    t.rewarded = false;
  });
}

beforeAll(() => {
  loadSharedMain();
});

beforeEach(() => {
  resetGameState({ lastDailyReset: new Date().toDateString() });
  resetDailyTasksState();
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// dailyTasksState structure
// ---------------------------------------------------------------------------

describe('dailyTasksState', () => {
  test('is exported and has a tasks array', () => {
    expect(window.__dailyTasksState).toBeDefined();
    expect(Array.isArray(window.__dailyTasksState.tasks)).toBe(true);
  });

  test('has exactly 3 tasks', () => {
    expect(window.__dailyTasksState.tasks).toHaveLength(3);
  });

  test('every task has required fields', () => {
    window.__dailyTasksState.tasks.forEach(t => {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('desc');
      expect(t).toHaveProperty('target');
      expect(t).toHaveProperty('reward');
      expect(t).toHaveProperty('current');
      expect(t).toHaveProperty('rewarded');
      expect(typeof t.reward).toBe('number');
      expect(t.reward).toBeGreaterThan(0);
    });
  });

  test('correct5 task targets 5', () => {
    const t = window.__dailyTasksState.tasks.find(t => t.id === 'correct5');
    expect(t).toBeDefined();
    expect(t.target).toBe(5);
  });

  test('correct10 task targets 10', () => {
    const t = window.__dailyTasksState.tasks.find(t => t.id === 'correct10');
    expect(t).toBeDefined();
    expect(t.target).toBe(10);
  });

  test('streak3 task targets 3', () => {
    const t = window.__dailyTasksState.tasks.find(t => t.id === 'streak3');
    expect(t).toBeDefined();
    expect(t.target).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// checkDailyTasks – progress tracking
// ---------------------------------------------------------------------------

describe('checkDailyTasks – progress tracking', () => {
  test('reflects dailyCorrect in correct5 task current', () => {
    window.gameState.dailyCorrect = 3;
    window.checkDailyTasks();
    const t = window.__dailyTasksState.tasks.find(t => t.id === 'correct5');
    expect(t.current).toBe(3);
  });

  test('reflects dailyCorrect in correct10 task current', () => {
    window.gameState.dailyCorrect = 8;
    window.checkDailyTasks();
    const t = window.__dailyTasksState.tasks.find(t => t.id === 'correct10');
    expect(t.current).toBe(8);
  });

  test('reflects current streak in streak3 task current', () => {
    window.gameState.streak = 5;
    window.checkDailyTasks();
    const t = window.__dailyTasksState.tasks.find(t => t.id === 'streak3');
    expect(t.current).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// checkDailyTasks – reward granting
// ---------------------------------------------------------------------------

describe('checkDailyTasks – reward granting', () => {
  test('grants XP reward when correct5 task is completed', () => {
    const task = window.__dailyTasksState.tasks.find(t => t.id === 'correct5');
    const xpBefore = window.gameState.xp;
    window.gameState.dailyCorrect = 5; // meets target
    window.checkDailyTasks();
    expect(window.gameState.xp).toBeGreaterThanOrEqual(xpBefore + task.reward);
  });

  test('does not grant XP when task target is not yet met', () => {
    const xpBefore = window.gameState.xp;
    window.gameState.dailyCorrect = 4; // correct5 needs 5
    window.checkDailyTasks();
    const task = window.__dailyTasksState.tasks.find(t => t.id === 'correct5');
    // correct5 not completed → no reward for it
    expect(task.rewarded).toBe(false);
    // XP should remain the same (other tasks also not met)
    expect(window.gameState.xp).toBe(xpBefore);
  });

  test('does not grant the same task reward twice', () => {
    const task = window.__dailyTasksState.tasks.find(t => t.id === 'correct5');
    window.gameState.dailyCorrect = 5;
    window.checkDailyTasks(); // first call – should reward
    const xpAfterFirst = window.gameState.xp;
    window.checkDailyTasks(); // second call – should NOT re-reward
    expect(window.gameState.xp).toBe(xpAfterFirst);
  });

  test('marks task as rewarded after granting XP', () => {
    window.gameState.dailyCorrect = 5;
    window.checkDailyTasks();
    const task = window.__dailyTasksState.tasks.find(t => t.id === 'correct5');
    expect(task.rewarded).toBe(true);
  });

  test('grants correct10 reward when dailyCorrect reaches 10', () => {
    const task = window.__dailyTasksState.tasks.find(t => t.id === 'correct10');
    window.gameState.dailyCorrect = 10;
    window.checkDailyTasks();
    expect(task.rewarded).toBe(true);
  });

  test('grants streak3 reward when streak reaches 3', () => {
    const task = window.__dailyTasksState.tasks.find(t => t.id === 'streak3');
    window.gameState.streak = 3;
    window.checkDailyTasks();
    expect(task.rewarded).toBe(true);
  });
});
