'use strict';

/**
 * achievements.test.js
 *
 * Tests for the achievement system:
 *   - hasAchievement helper
 *   - checkAchievements unlocking logic
 *   - Individual achievement condition functions
 */

const { loadSharedMain } = require('./loadShared');

const INITIAL_STATE = {
  hp: 100, maxHp: 100, xp: 0, level: 1,
  questionsAnswered: 0, correctAnswers: 0,
  streak: 0, maxStreak: 0,
  dailyCorrect: 0,
  dailyTasks: { correct5: false, correct10: false, streak3: false },
  lastDailyReset: null,
  cards: [],
  unlockedAchievements: [],
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

function resetGameState(overrides = {}) {
  const gs = window.gameState;
  Object.keys(gs).forEach(k => delete gs[k]);
  Object.assign(gs, JSON.parse(JSON.stringify({ ...INITIAL_STATE, ...overrides })));
}

/** Find an achievement by id from the exported array */
function getAch(id) {
  return window.__ACHIEVEMENTS.find(a => a.id === id);
}

beforeAll(() => {
  loadSharedMain();
});

beforeEach(() => {
  resetGameState({ lastDailyReset: new Date().toDateString() });
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// ACHIEVEMENTS data presence
// ---------------------------------------------------------------------------

describe('ACHIEVEMENTS array', () => {
  test('is exported and non-empty', () => {
    expect(window.__ACHIEVEMENTS).toBeDefined();
    expect(window.__ACHIEVEMENTS.length).toBeGreaterThan(0);
  });

  test('every achievement has required fields', () => {
    window.__ACHIEVEMENTS.forEach(a => {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('name');
      expect(a).toHaveProperty('desc');
      expect(a).toHaveProperty('icon');
      expect(a).toHaveProperty('reward');
      expect(a).toHaveProperty('cond');
      expect(typeof a.cond).toBe('function');
      expect(typeof a.reward).toBe('number');
    });
  });

  test('all achievement IDs are unique', () => {
    const ids = window.__ACHIEVEMENTS.map(a => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// hasAchievement
// ---------------------------------------------------------------------------

describe('hasAchievement', () => {
  test('returns false when achievement is not unlocked', () => {
    window.gameState.unlockedAchievements = [];
    expect(window.hasAchievement('first_correct')).toBe(false);
  });

  test('returns true when achievement is in unlockedAchievements', () => {
    window.gameState.unlockedAchievements = ['first_correct'];
    expect(window.hasAchievement('first_correct')).toBe(true);
  });

  test('returns false for a different achievement ID', () => {
    window.gameState.unlockedAchievements = ['first_correct'];
    expect(window.hasAchievement('correct_10')).toBe(false);
  });

  test('handles non-array unlockedAchievements gracefully', () => {
    window.gameState.unlockedAchievements = null;
    expect(window.hasAchievement('first_correct')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// checkAchievements
// ---------------------------------------------------------------------------

describe('checkAchievements', () => {
  test('unlocks first_correct when correctAnswers >= 1', () => {
    window.gameState.correctAnswers = 1;
    window.checkAchievements();
    expect(window.gameState.unlockedAchievements).toContain('first_correct');
  });

  test('does not unlock first_correct when correctAnswers = 0', () => {
    window.gameState.correctAnswers = 0;
    window.checkAchievements();
    expect(window.gameState.unlockedAchievements).not.toContain('first_correct');
  });

  test('does not re-unlock an already-unlocked achievement', () => {
    window.gameState.correctAnswers = 5;
    window.checkAchievements();
    const lenAfterFirst = window.gameState.unlockedAchievements.length;
    window.checkAchievements();
    expect(window.gameState.unlockedAchievements.length).toBe(lenAfterFirst);
  });

  test('grants XP when an achievement is unlocked', () => {
    const ach = getAch('first_correct');
    window.gameState.correctAnswers = 1;
    const xpBefore = window.gameState.xp;
    window.checkAchievements();
    expect(window.gameState.xp).toBeGreaterThanOrEqual(xpBefore + ach.reward);
  });

  test('initialises unlockedAchievements array if it is not an array', () => {
    window.gameState.unlockedAchievements = undefined;
    expect(() => window.checkAchievements()).not.toThrow();
    expect(Array.isArray(window.gameState.unlockedAchievements)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Individual achievement conditions
// ---------------------------------------------------------------------------

describe('Achievement condition: first_correct', () => {
  test('false when correctAnswers = 0', () => {
    expect(getAch('first_correct').cond({ correctAnswers: 0 })).toBe(false);
  });
  test('true when correctAnswers = 1', () => {
    expect(getAch('first_correct').cond({ correctAnswers: 1 })).toBe(true);
  });
});

describe('Achievement condition: correct_10', () => {
  test('false when correctAnswers = 9', () => {
    expect(getAch('correct_10').cond({ correctAnswers: 9 })).toBe(false);
  });
  test('true when correctAnswers = 10', () => {
    expect(getAch('correct_10').cond({ correctAnswers: 10 })).toBe(true);
  });
});

describe('Achievement condition: correct_50', () => {
  test('true when correctAnswers = 50', () => {
    expect(getAch('correct_50').cond({ correctAnswers: 50 })).toBe(true);
  });
  test('false when correctAnswers = 49', () => {
    expect(getAch('correct_50').cond({ correctAnswers: 49 })).toBe(false);
  });
});

describe('Achievement condition: correct_100', () => {
  test('true when correctAnswers = 100', () => {
    expect(getAch('correct_100').cond({ correctAnswers: 100 })).toBe(true);
  });
});

describe('Achievement condition: streak_3', () => {
  test('false when maxStreak = 2', () => {
    expect(getAch('streak_3').cond({ maxStreak: 2 })).toBe(false);
  });
  test('true when maxStreak = 3', () => {
    expect(getAch('streak_3').cond({ maxStreak: 3 })).toBe(true);
  });
});

describe('Achievement condition: streak_5', () => {
  test('true when maxStreak >= 5', () => {
    expect(getAch('streak_5').cond({ maxStreak: 5 })).toBe(true);
  });
  test('false when maxStreak = 4', () => {
    expect(getAch('streak_5').cond({ maxStreak: 4 })).toBe(false);
  });
});

describe('Achievement condition: streak_10', () => {
  test('true when maxStreak = 10', () => {
    expect(getAch('streak_10').cond({ maxStreak: 10 })).toBe(true);
  });
});

describe('Achievement condition: level_5', () => {
  test('false when level = 4', () => {
    expect(getAch('level_5').cond({ level: 4 })).toBe(false);
  });
  test('true when level = 5', () => {
    expect(getAch('level_5').cond({ level: 5 })).toBe(true);
  });
});

describe('Achievement condition: level_10', () => {
  test('true when level >= 10', () => {
    expect(getAch('level_10').cond({ level: 10 })).toBe(true);
  });
});

describe('Achievement condition: first_card', () => {
  test('false when cards array is empty', () => {
    expect(getAch('first_card').cond({ cards: [] })).toBe(false);
  });
  test('true when at least one card exists', () => {
    expect(getAch('first_card').cond({ cards: ['c01'] })).toBe(true);
  });
});

describe('Achievement condition: cards_5', () => {
  test('true when 5 cards owned', () => {
    expect(getAch('cards_5').cond({ cards: ['c01','c02','c03','c04','c05'] })).toBe(true);
  });
  test('false when only 4 cards', () => {
    expect(getAch('cards_5').cond({ cards: ['c01','c02','c03','c04'] })).toBe(false);
  });
});

describe('Achievement condition: visit_3', () => {
  test('true when 3 rooms visited', () => {
    expect(getAch('visit_3').cond({ roomsVisited: ['alg','geo','stat'] })).toBe(true);
  });
  test('false when only 2 rooms visited', () => {
    expect(getAch('visit_3').cond({ roomsVisited: ['alg','geo'] })).toBe(false);
  });
});

describe('Achievement condition: visit_all', () => {
  test('true when 12 or more rooms visited', () => {
    const rooms = Array.from({ length: 12 }, (_, i) => `room${i}`);
    expect(getAch('visit_all').cond({ roomsVisited: rooms })).toBe(true);
  });
  test('false when fewer than 12 rooms visited', () => {
    expect(getAch('visit_all').cond({ roomsVisited: Array.from({ length: 11 }, (_, i) => `r${i}`) })).toBe(false);
  });
});

describe('Achievement condition: legendary_card', () => {
  test('false when no legendary card in hand', () => {
    expect(getAch('legendary_card').cond({ cards: ['c01', 'r01'] })).toBe(false);
  });
  test('true when at least one legendary card (prefix "l")', () => {
    expect(getAch('legendary_card').cond({ cards: ['c01', 'l01'] })).toBe(true);
  });
  test('false when cards array is undefined', () => {
    expect(getAch('legendary_card').cond({ cards: undefined })).toBe(false);
  });
});

describe('Achievement condition: hp_full', () => {
  test('true when hp equals maxHp', () => {
    expect(getAch('hp_full').cond({ hp: 100, maxHp: 100 })).toBe(true);
  });
  test('false when hp < maxHp', () => {
    expect(getAch('hp_full').cond({ hp: 99, maxHp: 100 })).toBe(false);
  });
});

describe('Achievement condition: boss_first', () => {
  test('true when at least one boss defeated', () => {
    expect(getAch('boss_first').cond({ bossesDefeated: 1 })).toBe(true);
  });
  test('false when no bosses defeated', () => {
    expect(getAch('boss_first').cond({ bossesDefeated: 0 })).toBe(false);
  });
});

describe('Achievement condition: boss_all', () => {
  test('true when 4 bosses defeated', () => {
    expect(getAch('boss_all').cond({ bossesDefeated: 4 })).toBe(true);
  });
  test('false when only 3 defeated', () => {
    expect(getAch('boss_all').cond({ bossesDefeated: 3 })).toBe(false);
  });
});

describe('Achievement condition: daily_first', () => {
  test('true when dailyChallengeStreak >= 1', () => {
    expect(getAch('daily_first').cond({ dailyChallengeStreak: 1 })).toBe(true);
  });
  test('false when dailyChallengeStreak = 0', () => {
    expect(getAch('daily_first').cond({ dailyChallengeStreak: 0 })).toBe(false);
  });
});

describe('Achievement condition: daily_streak_7', () => {
  test('true when dailyChallengeStreak >= 7', () => {
    expect(getAch('daily_streak_7').cond({ dailyChallengeStreak: 7 })).toBe(true);
  });
  test('false when dailyChallengeStreak = 6', () => {
    expect(getAch('daily_streak_7').cond({ dailyChallengeStreak: 6 })).toBe(false);
  });
});

describe('Achievement condition: visit_alg (room-specific)', () => {
  test('true when alg room has >= 5 correct', () => {
    expect(getAch('visit_alg').cond({ roomCorrect: { alg: 5 } })).toBe(true);
  });
  test('false when alg room has < 5 correct', () => {
    expect(getAch('visit_alg').cond({ roomCorrect: { alg: 4 } })).toBe(false);
  });
  test('false when roomCorrect is empty object', () => {
    expect(getAch('visit_alg').cond({ roomCorrect: {} })).toBe(false);
  });
});

describe('Achievement condition: wrong_10', () => {
  test('true when wrongAnswers >= 10', () => {
    expect(getAch('wrong_10').cond({ wrongAnswers: 10 })).toBe(true);
  });
  test('false when wrongAnswers = 9', () => {
    expect(getAch('wrong_10').cond({ wrongAnswers: 9 })).toBe(false);
  });
});

describe('Achievement condition: level_20', () => {
  test('true when level >= 20', () => {
    expect(getAch('level_20').cond({ level: 20 })).toBe(true);
  });
  test('false when level = 19', () => {
    expect(getAch('level_20').cond({ level: 19 })).toBe(false);
  });
});
