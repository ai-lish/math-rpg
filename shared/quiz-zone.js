// ============================================================
// QUIZ ZONE - Shared quiz logic used by all zone scenes
// ============================================================

let zqState = {
  active: false,
  room: null,
  question: null,
  questions: [],
};

function startZoneQuiz(room) {
  if (zqState.active) return;
  const allQ = window.ALL_QUESTIONS || [];
  const topicQ = allQ.filter(function(q) { return q.topic === room.topic; });
  if (topicQ.length === 0) { showToast('此區暫無題目', '#888'); return; }

  zqState.active = true;
  zqState.room = room;
  zqState.questions = topicQ;

  checkRoomVisit(room.roomId);
  zqShowQuestion();

  const panel = document.getElementById('quiz-panel');
  if (panel) panel.style.display = 'flex';
}

function zqShowQuestion() {
  const q = zqState.questions[Math.floor(Math.random() * zqState.questions.length)];
  zqState.question = q;

  const roomLabel = document.getElementById('quiz-room-label');
  const diffEl = document.getElementById('quiz-diff');
  const questionEl = document.getElementById('quiz-question');
  const optionsEl = document.getElementById('quiz-options');
  const feedbackEl = document.getElementById('quiz-feedback');
  const moreBtn = document.getElementById('quiz-more-btn');

  if (roomLabel) roomLabel.textContent = (zqState.room.icon || '') + ' ' + zqState.room.label;
  if (diffEl) {
    const stars = ['', '⭐', '⭐⭐', '⭐⭐⭐'];
    diffEl.textContent = stars[q.difficulty] || '⭐';
  }

  if (questionEl) {
    if (typeof renderMath !== 'undefined') {
      renderMath(questionEl, q.question);
    } else {
      questionEl.textContent = q.question;
    }
  }

  if (optionsEl) {
    optionsEl.innerHTML = ['A', 'B', 'C', 'D'].map(function(k) {
      var text = q.options[k] || '';
      return '<button class="quiz-opt-btn" data-key="' + k + '" onclick="answerZoneQuiz(\'' + k + '\')">' +
        '<span class="opt-key">' + k + '</span> <span class="opt-text">' + text + '</span></button>';
    }).join('');
  }

  if (feedbackEl) feedbackEl.style.display = 'none';
  if (moreBtn) moreBtn.style.display = 'none';
}

function answerZoneQuiz(choice) {
  if (!zqState.active || !zqState.question) return;
  var q = zqState.question;
  var isCorrect = choice === q.answer;

  // Disable all option buttons and highlight correct/wrong
  var optBtns = document.querySelectorAll('.quiz-opt-btn');
  optBtns.forEach(function(btn) {
    btn.disabled = true;
    if (btn.dataset.key === q.answer) {
      btn.classList.add('correct');
    } else if (btn.dataset.key === choice && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  var feedbackEl = document.getElementById('quiz-feedback');
  var fbIcon = document.getElementById('quiz-fb-icon');
  var fbMsg = document.getElementById('quiz-fb-msg');

  // Update game state
  gameState.questionsAnswered = (gameState.questionsAnswered || 0) + 1;

  if (isCorrect) {
    gameState.correctAnswers = (gameState.correctAnswers || 0) + 1;
    gameState.dailyCorrect = (gameState.dailyCorrect || 0) + 1;
    gameState.streak = (gameState.streak || 0) + 1;
    if (gameState.streak > (gameState.maxStreak || 0)) gameState.maxStreak = gameState.streak;
    if (!gameState.roomCorrect) gameState.roomCorrect = {};
    gameState.roomCorrect[zqState.room.roomId] = (gameState.roomCorrect[zqState.room.roomId] || 0) + 1;

    var xpGain = 20 + (q.difficulty - 1) * 10;
    addXP(xpGain);
    sfxCorrect && sfxCorrect();
    checkDailyTasks();
    checkAchievements();
    zqTryDropCard();

    if (fbIcon) fbIcon.textContent = '✅';
    if (fbMsg) fbMsg.textContent = '答對了！ +' + xpGain + ' XP';
    if (feedbackEl) { feedbackEl.className = 'quiz-feedback quiz-feedback-correct'; feedbackEl.style.display = 'flex'; }

    // Streak sound
    if (gameState.streak >= 3) sfxStreak && sfxStreak();
  } else {
    gameState.wrongAnswers = (gameState.wrongAnswers || 0) + 1;
    gameState.streak = 0;

    loseHP(10);
    sfxWrong && sfxWrong();
    checkAchievements();

    if (fbIcon) fbIcon.textContent = '❌';
    if (fbMsg) fbMsg.textContent = '答錯了！正確答案是 ' + q.answer + '。 -10 HP';
    if (feedbackEl) { feedbackEl.className = 'quiz-feedback quiz-feedback-wrong'; feedbackEl.style.display = 'flex'; }
  }

  var moreBtn = document.getElementById('quiz-more-btn');
  if (moreBtn) moreBtn.style.display = 'block';

  saveState();
  updateHUD();
}

function continueZoneQuiz() {
  zqShowQuestion();
}

function closeZoneQuiz() {
  zqState.active = false;
  zqState.question = null;
  var panel = document.getElementById('quiz-panel');
  if (panel) panel.style.display = 'none';
}

function zqTryDropCard() {
  var allCards = window.CARDS || [];
  if (allCards.length === 0) return;
  if (Math.random() >= 0.18) return; // 18% drop chance

  var rand = Math.random();
  var rarity = rand < 0.60 ? 'common' : rand < 0.88 ? 'rare' : rand < 0.98 ? 'epic' : 'legendary';
  var pool = allCards.filter(function(c) { return c.rarity === rarity; });
  if (pool.length === 0) return;

  var card = pool[Math.floor(Math.random() * pool.length)];
  if (!gameState.cards) gameState.cards = [];
  if (!gameState.cards.includes(card.id)) {
    gameState.cards.push(card.id);
    saveState();
    showToast('🃏 獲得卡牌: ' + card.icon + ' ' + card.name + '!', '#722ED1');
    checkAchievements();
  }
}

function showCardsPanel() {
  var panel = document.getElementById('cards-panel');
  if (!panel) return;
  var allCards = window.CARDS || [];
  var owned = gameState.cards || [];
  var listEl = document.getElementById('cards-list');
  if (listEl) {
    if (owned.length === 0) {
      listEl.innerHTML = '<div class="panel-empty">尚未獲得任何卡牌<br>答對題目有機會掉落卡牌！</div>';
    } else {
      listEl.innerHTML = owned.map(function(id) {
        var card = allCards.find(function(c) { return c.id === id; }) || { icon: '🃏', name: id, rarity: 'common', effect: '' };
        var rarityColor = { common: '#fff', rare: '#4A90D9', epic: '#722ED1', legendary: '#FAAD14' }[card.rarity] || '#fff';
        return '<div class="card-item" style="border-color:' + rarityColor + '">' +
          '<span class="card-icon">' + card.icon + '</span>' +
          '<div class="card-info"><div class="card-name" style="color:' + rarityColor + '">' + card.name + '</div>' +
          '<div class="card-effect">' + (card.effect || '') + '</div></div></div>';
      }).join('');
    }
  }
  panel.style.display = 'flex';
}

function closeCardsPanel() {
  var panel = document.getElementById('cards-panel');
  if (panel) panel.style.display = 'none';
}

function showAchievementsPanel() {
  var panel = document.getElementById('achievements-panel');
  if (!panel) return;
  var allAch = window.__ACHIEVEMENTS || (typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS : []);
  var unlocked = gameState.unlockedAchievements || [];
  var listEl = document.getElementById('achievements-list');
  if (listEl) {
    listEl.innerHTML = allAch.map(function(a) {
      var done = unlocked.includes(a.id);
      return '<div class="ach-item ' + (done ? 'ach-done' : 'ach-locked') + '">' +
        '<span class="ach-icon-sm">' + a.icon + '</span>' +
        '<div class="ach-info"><div class="ach-name-sm">' + a.name + '</div>' +
        '<div class="ach-desc-sm">' + a.desc + '</div></div>' +
        '<div class="ach-reward">+' + a.reward + 'XP</div></div>';
    }).join('');
  }
  panel.style.display = 'flex';
}

function closeAchievementsPanel() {
  var panel = document.getElementById('achievements-panel');
  if (panel) panel.style.display = 'none';
}
