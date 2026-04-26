'use strict';

/**
 * gameState.test.js
 *
 * Tests for core game-state functions:
 *   addXP, loseHP, saveState, loadState, checkDailyTasks, checkRoomVisit
 */

const { loadSharedMain } = require('./loadShared');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** The initial state exactly as declared in shared-main.js */
const INITIAL_STATE = {
  hp: 100, maxHp: 100, xp: 0, level: 1,
  questionsAnswered: 0, correctAnswers: 0,
  streak: 0, maxStreak: 0,
  dailyCorrect: 0,
  dailyTasks: { correct5: false, correct10: false, streak3: false },
  lastDailyReset: null,
  cards: [],
  // Pre-unlock hp_full to prevent it from firing and adding unexpected XP
  // during level-up tests (addXP triggers checkAchievements which can award XP)
  unlockedAchievements: ['hp_full'],
  roomsVisited: [],
  completedDailyTasks: 0,
  arenaParticipated: 0, arenaPerfect: 0, arenaTop10: 0, arenaScores: [],
  wrongAnswers: 0, hpLowCorrect: 0, hpNoLossStreak: 0,
  speedAnswers: 0, morningAnswers: 0,
  roomCorrect: {},
  friendCode: '', friends: [], sharedCode: 0,
  bossesDefeated: 0, bossPerfect: 0,
  bossCooldowns: {}, bossDefeatedSet: [],
  lastDailyChallenge: '', dailyChallengeCompleted: false, dailyChallengeStreak: 0,
  currentDifficulty: 1, consecutiveCorrect: 0, consecutiveWrong: 0,
  loginStreak: 0, lastLoginDate: '',
  credits: 0, tutorialDone: false, selectedAvatar: 1,
};

/** Reset the live gameState object (same reference used by addXP etc.) */
function resetGameState(overrides = {}) {
  const gs = window.gameState;
  Object.keys(gs).forEach(k => delete gs[k]);
  Object.assign(gs, JSON.parse(JSON.stringify({ ...INITIAL_STATE, ...overrides })));
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeAll(() => {
  loadSharedMain();
});

beforeEach(() => {
  resetGameState({ lastDailyReset: new Date().toDateString() });
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// addXP
// ---------------------------------------------------------------------------

describe('addXP', () => {
  test('adds XP to gameState', () => {
    window.addXP(50);
    expect(window.gameState.xp).toBe(50);
  });

  test('accumulates XP across multiple calls', () => {
    window.addXP(30);
    window.addXP(20);
    expect(window.gameState.xp).toBe(50);
  });

  test('does NOT trigger level-up when XP < threshold', () => {
    window.addXP(99);
    expect(window.gameState.level).toBe(1);
    expect(window.gameState.xp).toBe(99);
  });

  test('triggers level-up when XP reaches 100 × level', () => {
    window.addXP(100); // level 1 needs 100
    expect(window.gameState.level).toBe(2);
  });

  test('resets XP to 0 on exact level-up boundary', () => {
    window.addXP(100);
    expect(window.gameState.xp).toBe(0);
  });

  test('carries excess XP over into the next level', () => {
    window.addXP(120); // 100 needed → 20 excess
    expect(window.gameState.level).toBe(2);
    expect(window.gameState.xp).toBe(20);
  });

  test('handles sequential level-ups correctly', () => {
    window.addXP(100); // 1 → 2, xp=0
    expect(window.gameState.level).toBe(2);
    window.addXP(200); // 2 → 3, xp=0
    expect(window.gameState.level).toBe(3);
    expect(window.gameState.xp).toBe(0);
  });

  test('level 2 requires 200 XP to level-up', () => {
    window.addXP(100); // reach level 2
    window.addXP(199); // just under level-3 threshold
    expect(window.gameState.level).toBe(2);
    window.addXP(1);   // cross the threshold
    expect(window.gameState.level).toBe(3);
  });

  test('saves state to localStorage after addXP', () => {
    window.addXP(42);
    window.saveState();
    const saved = JSON.parse(localStorage.getItem('mathrpg_v1'));
    expect(saved.xp).toBe(42);
  });
});

// ---------------------------------------------------------------------------
// loseHP
// ---------------------------------------------------------------------------

describe('loseHP', () => {
  test('reduces HP by the given amount', () => {
    window.loseHP(20);
    expect(window.gameState.hp).toBe(80);
  });

  test('does not reduce HP below 0', () => {
    window.loseHP(200);
    expect(window.gameState.hp).toBeGreaterThanOrEqual(0);
  });

  test('resets streak to 0', () => {
    window.gameState.streak = 7;
    window.loseHP(10);
    expect(window.gameState.streak).toBe(0);
  });

  test('resets HP to maxHp when HP reaches exactly 0', () => {
    window.loseHP(100); // hp = 100 → 0 → reset to maxHp (100)
    expect(window.gameState.hp).toBe(window.gameState.maxHp);
  });

  test('deducts 10 XP when HP reaches 0 (death)', () => {
    window.gameState.xp = 50;
    window.loseHP(100);
    expect(window.gameState.xp).toBe(40);
  });

  test('does not let XP drop below 0 on death', () => {
    window.gameState.xp = 5;
    window.loseHP(100);
    expect(window.gameState.xp).toBe(0);
  });

  test('saves state to localStorage after loseHP', () => {
    window.loseHP(10);
    window.saveState();
    const saved = JSON.parse(localStorage.getItem('mathrpg_v1'));
    expect(saved.hp).toBe(90);
  });

  test('partial HP loss does NOT reset HP', () => {
    window.loseHP(50);
    expect(window.gameState.hp).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// saveState / loadState
// ---------------------------------------------------------------------------

describe('saveState', () => {
  test('persists gameState to localStorage', () => {
    window.gameState.xp = 77;
    window.gameState.level = 3;
    window.saveState();
    const stored = JSON.parse(localStorage.getItem('mathrpg_v1'));
    expect(stored.xp).toBe(77);
    expect(stored.level).toBe(3);
  });

  test('persists card array', () => {
    window.gameState.cards = ['c01', 'r01'];
    window.saveState();
    const stored = JSON.parse(localStorage.getItem('mathrpg_v1'));
    expect(stored.cards).toEqual(['c01', 'r01']);
  });
});

describe('loadState', () => {
  test('restores xp and level from localStorage', () => {
    localStorage.setItem('mathrpg_v1', JSON.stringify({ xp: 55, level: 4, lastDailyReset: new Date().toDateString() }));
    window.loadState();
    expect(window.gameState.xp).toBe(55);
    expect(window.gameState.level).toBe(4);
  });

  test('does not throw when localStorage is empty', () => {
    localStorage.clear();
    expect(() => window.loadState()).not.toThrow();
  });

  test('does not throw on corrupted JSON in localStorage', () => {
    localStorage.setItem('mathrpg_v1', '{ corrupted json !!!');
    expect(() => window.loadState()).not.toThrow();
  });

  test('filters out empty-string card IDs', () => {
    localStorage.setItem('mathrpg_v1', JSON.stringify({ cards: ['c01', '', 'c02'], lastDailyReset: new Date().toDateString() }));
    window.loadState();
    expect(window.gameState.cards).toEqual(['c01', 'c02']);
  });

  test('filters out non-string card IDs', () => {
    localStorage.setItem('mathrpg_v1', JSON.stringify({ cards: ['c01', null, 42, 'r01'], lastDailyReset: new Date().toDateString() }));
    window.loadState();
    expect(window.gameState.cards).toEqual(['c01', 'r01']);
  });

  test('resets dailyCorrect when a new day begins', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    localStorage.setItem('mathrpg_v1', JSON.stringify({
      dailyCorrect: 12,
      lastDailyReset: yesterday.toDateString(),
    }));
    window.loadState();
    expect(window.gameState.dailyCorrect).toBe(0);
  });

  test('does NOT reset dailyCorrect on the same day', () => {
    localStorage.setItem('mathrpg_v1', JSON.stringify({
      dailyCorrect: 12,
      lastDailyReset: new Date().toDateString(),
    }));
    window.loadState();
    expect(window.gameState.dailyCorrect).toBe(12);
  });

  test('removes expired boss cooldowns on load', () => {
    const expiredTime = Date.now() - 1000; // 1 second ago (already expired)
    localStorage.setItem('mathrpg_v1', JSON.stringify({
      bossCooldowns: { alg_boss: expiredTime },
      lastDailyReset: new Date().toDateString(),
    }));
    window.loadState();
    expect(window.gameState.bossCooldowns.alg_boss).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// checkRoomVisit
// ---------------------------------------------------------------------------

describe('checkRoomVisit', () => {
  test('adds a new room to roomsVisited', () => {
    window.checkRoomVisit('alg');
    expect(window.gameState.roomsVisited).toContain('alg');
  });

  test('does not add the same room twice', () => {
    window.checkRoomVisit('geo');
    window.checkRoomVisit('geo');
    const count = window.gameState.roomsVisited.filter(r => r === 'geo').length;
    expect(count).toBe(1);
  });

  test('tracks multiple distinct rooms', () => {
    window.checkRoomVisit('alg');
    window.checkRoomVisit('geo');
    window.checkRoomVisit('stat');
    expect(window.gameState.roomsVisited).toHaveLength(3);
  });
});
