/**
 * Math RPG - Google Apps Script Backend
 * 
 * DEPLOYMENT:
 * 1. Create a new Google Apps Script project (script.google.com)
 * 2. Copy this code into Code.gs
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (or your school domain)
 * 4. Copy the web app URL into firebase-config.js as GAS_URL
 * 5. Create a Google Sheet and share with the Apps Script email
 *    - The Apps Script email is in: Edit → Preferences → Script properties
 *    - Or check the execution log for the service account email
 */

// === CONFIGURATION ===
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your Sheet ID

// === DO GET - Fetch leaderboard and daily tasks ===
function doGet(e) {
  const action = e.parameter.action || 'status';
  
  try {
    if (action === 'leaderboard') {
      return fetchLeaderboard();
    } else if (action === 'dailyTasks') {
      return fetchDailyTasks(e.parameter.uid);
    } else if (action === 'status') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
    }
    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function fetchLeaderboard() {
  // In production, read from Spreadsheet
  // Format: Rank, Name, Level, XP, Last Played
  const mockData = [
    { rank: 1, name: '🌟 冠軍', level: 15, xp: 2300 },
    { rank: 2, name: '📚 學霸', level: 12, xp: 1800 },
    { rank: 3, name: '⚡ 閃電', level: 10, xp: 1500 },
    { rank: 4, name: '🎮 玩家A', level: 8, xp: 1200 },
    { rank: 5, name: '🎮 玩家B', level: 7, xp: 1050 },
  ];
  
  return jsonResponse({ leaderboard: mockData, updated: new Date().toISOString() });
}

function fetchDailyTasks(uid) {
  const today = new Date().toISOString().split('T')[0];
  
  const tasks = [
    { id: 'daily5', name: '答對5題', description: '答對5道題目', target: 5, reward: 50, current: 0 },
    { id: 'daily10', name: '答對10題', description: '答對10道題目', target: 10, reward: 100, current: 0 },
    { id: 'streak3', name: '連勝3題', description: '連續答對3道題目', target: 3, reward: 75, current: 0 },
  ];
  
  // In production, read player's progress from Spreadsheet
  // const sheet = getSheet();
  // const row = findPlayerRow(sheet, uid);
  // if (row) { ... update tasks from sheet data ... }
  
  return jsonResponse({ tasks: tasks, date: today });
}

// === DO POST - Batch sync answers and progress ===
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'sync';
    
    if (action === 'sync') {
      return handleBatchSync(data);
    } else if (action === 'submitAnswer') {
      return handleAnswerSubmit(data);
    }
    
    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function handleBatchSync(data) {
  const { uid, name, level, xp, hp, correctAnswers, questionsAnswered, streak, dailyProgress, timestamp } = data;
  
  // Validate answer on server side
  const validation = validateAnswer(data.answers || []);
  
  // Write to Google Sheets
  // In production:
  // const sheet = getSheet();
  // appendOrUpdateRow(sheet, { uid, name, level, xp, hp, ... });
  
  return jsonResponse({
    success: true,
    validated: validation,
    syncedAt: new Date().toISOString(),
    rewards: calculateRewards(data)
  });
}

function handleAnswerSubmit(data) {
  const { uid, questionId, answer, isCorrect, difficulty, timestamp } = data;
  
  // Server-side answer validation (for security)
  // In production, compare with correct answers stored in Sheet
  // const correctAnswer = getCorrectAnswer(questionId);
  // const serverCorrect = (answer === correctAnswer);
  
  // Log to Sheets
  // const sheet = getSheet();
  // sheet.appendRow([new Date(), uid, questionId, answer, isCorrect, difficulty]);
  
  return jsonResponse({
    success: true,
    // serverCorrect: serverCorrect, // Uncomment when using real answer key
    xpEarned: isCorrect ? (20 + difficulty * 5) : 0,
    syncedAt: new Date().toISOString()
  });
}

// === HELPER FUNCTIONS ===

function jsonResponse(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function validateAnswer(answers) {
  // Server-side validation
  // In production, load correct answers from a Sheet and validate
  return answers.map(a => ({
    questionId: a.questionId,
    correct: a.isCorrect, // Placeholder - real impl checks against answer key
    xpChange: a.isCorrect ? (20 + (a.difficulty || 1) * 5) : 0
  }));
}

function calculateRewards(data) {
  const rewards = { xp: 0, bonusXP: 0, items: [] };
  
  // Daily task completions
  if (data.dailyProgress) {
    if (data.dailyProgress.correct5) rewards.xp += 50;
    if (data.dailyProgress.correct10) rewards.xp += 100;
    if (data.dailyProgress.streak3) rewards.xp += 75;
  }
  
  // Streak bonus (every 5 correct in a row)
  if (data.streak > 0 && data.streak % 5 === 0) {
    rewards.bonusXP = data.streak * 2;
  }
  
  return rewards;
}

// === SPREADSHEET HELPERS (for production use) ===

function getSheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID') {
    throw new Error('SPREADSHEET_ID not configured');
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function appendOrUpdateRow(sheet, playerData) {
  // Find existing row for player
  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === playerData.uid) {
      foundRow = i + 1;
      break;
    }
  }
  
  const rowData = [
    playerData.uid,
    playerData.name || 'Anonymous',
    playerData.level || 1,
    playerData.xp || 0,
    playerData.hp || 100,
    playerData.correctAnswers || 0,
    playerData.questionsAnswered || 0,
    playerData.streak || 0,
    new Date().toISOString()
  ];
  
  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

// === TEST FUNCTION ===
function testAPI() {
  const result = fetchLeaderboard();
  Logger.log(result.getContent());
}
