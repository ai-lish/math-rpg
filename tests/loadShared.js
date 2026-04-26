'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Evaluates shared-main.js in the current global (jsdom) context so that
 * all `window.xxx = yyy` assignments become accessible as globals.
 *
 * Also appends extra window exports for internal data structures that the
 * original file doesn't expose but that we need for data-integrity tests.
 *
 * NOTE: Each Jest test file runs in its own jsdom context, so calling this
 * function once per test file (via beforeAll) is the correct pattern.
 */
function loadSharedMain() {
  // Provide a minimal DOM so DOM-accessing code paths don't throw.
  document.body.innerHTML = `
    <div id="firebase-status"></div>
    <div id="hp-bar" style="width:100%"></div>
    <div id="hp-text">100</div>
    <div id="xp-bar" style="width:0%"></div>
    <div id="xp-text">0</div>
    <div id="level-text">Lv.1</div>
    <div id="user-level">Lv.1</div>
    <div id="hud-card-count">0</div>
    <div id="menu-card-count">0</div>
    <div id="menu-ach-count">0</div>
    <div id="credits-display">0</div>
    <div id="hud-credits"></div>
    <div id="hud-difficulty"></div>
    <div id="hud-diff-icon"></div>
    <div id="hud-diff-label"></div>
    <div id="streak-display"></div>
    <div id="streak-num"></div>
    <div id="achievement-toast"></div>
    <div id="level-up" style="display:none"></div>
    <div id="level-up-info"></div>
    <div id="menu" style="display:none"></div>
    <div id="menu-player-info"></div>
    <div id="leaderboard-panel" style="display:none"></div>
    <div id="leaderboard-list"></div>
    <div id="daily-tasks-panel" style="display:none"></div>
    <div id="tasks-list"></div>
  `;

  const filePath = path.join(__dirname, '..', 'shared', 'shared-main.js');
  let content = fs.readFileSync(filePath, 'utf8');

  // Append extra window exports so tests can inspect internal data structures.
  content += `
;
window.__ALL_QUESTIONS             = typeof ALL_QUESTIONS             !== 'undefined' ? ALL_QUESTIONS             : [];
window.__QUESTIONS_ORIGINAL        = typeof QUESTIONS_ORIGINAL        !== 'undefined' ? QUESTIONS_ORIGINAL        : [];
window.__QUESTIONS_PHASE1B         = typeof QUESTIONS_PHASE1B         !== 'undefined' ? QUESTIONS_PHASE1B         : [];
window.__QUESTIONS_PHASE2          = typeof QUESTIONS_PHASE2          !== 'undefined' ? QUESTIONS_PHASE2          : [];
window.__QUESTIONS_PHASE4          = typeof QUESTIONS_PHASE4          !== 'undefined' ? QUESTIONS_PHASE4          : [];
window.__DAILY_CHALLENGE_QUESTIONS = typeof DAILY_CHALLENGE_QUESTIONS !== 'undefined' ? DAILY_CHALLENGE_QUESTIONS : [];
window.__ACHIEVEMENTS              = typeof ACHIEVEMENTS              !== 'undefined' ? ACHIEVEMENTS              : [];
window.__CARDS                     = typeof CARDS                     !== 'undefined' ? CARDS                     : [];
window.__BOSSES                    = typeof BOSSES                    !== 'undefined' ? BOSSES                    : [];
window.__dailyTasksState           = typeof dailyTasksState           !== 'undefined' ? dailyTasksState           : null;

// Export functions that shared-main.js does not expose via window by default.
if (typeof checkRoomVisit !== 'undefined') window.checkRoomVisit = checkRoomVisit;
if (typeof hasAchievement !== 'undefined') window.hasAchievement = hasAchievement;
if (typeof checkDailyTasks !== 'undefined') window.checkDailyTasks = checkDailyTasks;
if (typeof updateStreakUI !== 'undefined') window.updateStreakUI = updateStreakUI;

// Patch loadState so that window.gameState stays in sync with the internal
// gameState variable after loadState() reassigns it via object spread.
// (The patch closure can read the eval-scope 'gameState' variable by reference.)
const __origLoadState = window.loadState;
window.loadState = function patchedLoadState() {
  __origLoadState.apply(this, arguments);
  // After loadState, the internal 'gameState' may be a new object.
  // Re-sync window.gameState so tests can read the updated values.
  window.gameState = gameState; // eslint-disable-line no-undef
};

`;

  // eval runs in function scope; window.xxx assignments affect the global object.
  // eslint-disable-next-line no-eval
  eval(content); // NOSONAR
}

module.exports = { loadSharedMain };
