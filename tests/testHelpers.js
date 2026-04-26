'use strict';

/**
 * testHelpers.js
 *
 * Shared utilities used across multiple test files.
 */

/**
 * The initial game state exactly as declared in shared-main.js.
 * Pre-unlocks hp_full to prevent it from awarding unexpected XP
 * during addXP level-up tests (addXP → checkAchievements → addXP).
 */
const INITIAL_STATE = {
  hp: 100, maxHp: 100, xp: 0, level: 1,
  questionsAnswered: 0, correctAnswers: 0,
  streak: 0, maxStreak: 0,
  dailyCorrect: 0,
  dailyTasks: { correct5: false, correct10: false, streak3: false },
  lastDailyReset: null,
  cards: [],
  // hp_full is always met at game start (hp === maxHp); pre-unlock it so
  // checkAchievements doesn't award its XP during unrelated tests.
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

/**
 * Reset the live gameState object in-place so that addXP / loseHP etc.
 * (which close over the internal variable) see the updated values.
 *
 * @param {Object} [overrides] - Fields to override on top of INITIAL_STATE.
 */
function resetGameState(overrides = {}) {
  const gs = window.gameState;
  Object.keys(gs).forEach(k => delete gs[k]);
  Object.assign(gs, JSON.parse(JSON.stringify({ ...INITIAL_STATE, ...overrides })));
}

/**
 * Returns a lazy Proxy for a window.__XYZ array so that assertQuestionsValid()
 * can be called at describe() time (before beforeAll runs) while actual array
 * access is deferred until the test callbacks execute.
 *
 * @param {string} windowKey - Key on window, e.g. '__QUESTIONS_ORIGINAL'
 */
function lazyWindowArray(windowKey) {
  return new Proxy([], {
    get(_, prop) {
      const arr = window[windowKey];
      if (prop === 'length') return arr ? arr.length : 0;
      if (prop === 'forEach') return fn => arr && arr.forEach(fn);
      if (prop === 'map') return fn => arr ? arr.map(fn) : [];
      return arr ? arr[prop] : undefined;
    },
  });
}

module.exports = { INITIAL_STATE, resetGameState, lazyWindowArray };
