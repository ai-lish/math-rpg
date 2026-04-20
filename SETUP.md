# Math RPG - Phase 1b Setup Guide

## Overview
Phase 1b adds Firebase authentication, cloud leaderboard, daily tasks, streak system, and GAS backend integration.

## Total Questions
- Original (Phase 1a): 19 questions
- Phase 1b imported: 40 questions  
- **Total: 58 questions** across 代數/幾何/統計 topics

---

## 1. Firebase Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → name it `math-rpg` (or your choice)
3. Click through the setup wizard

### Step 2: Enable Authentication
1. In the left sidebar: **Build → Authentication → Get started**
2. Click "Sign-in method" tab
3. Enable **Google**
4. Under "Authorized domains", add your school domain (e.g., `lsh.edu.hk`)
5. Click Save

### Step 3: Create Realtime Database
1. Left sidebar: **Build → Realtime Database → Create Database**
2. Choose a location near your users
3. Start in **test mode** (for development)
4. Later, add security rules to restrict access

### Step 4: Register Web App
1. Go to **Project Settings** (gear icon top-left)
2. Scroll to "Your apps" section
3. Click **</> (Web)**
4. Register app with a nickname
5. Copy the `firebaseConfig` object

### Step 5: Update firebase-config.js
Edit `firebase-config.js` in the game folder:

```javascript
const FirebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 6: Update index.html
In `index.html`, find the Firebase configuration section and make sure the config is loaded:

```javascript
// If using firebase-config.js:
<script src="firebase-config.js"></script>
```

---

## 2. Google Apps Script (GAS) Backend

GAS provides a server-side backend for batch syncing game progress to Google Sheets.

### Step 1: Create Google Sheet
1. Create a new Google Sheet
2. Name it "Math RPG Progress"
3. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

### Step 2: Create Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New project"
3. Copy the code from `gas-backend.gs` into Code.gs
4. Update `SPREADSHEET_ID` at the top with your Sheet ID

### Step 3: Deploy as Web App
1. Click **Deploy → New deployment**
2. Select type: **Web app**
3. Configure:
   - Description: "Math RPG Backend v1"
   - Execute as: **Me**
   - Who has access: **Anyone** (or your domain)
4. Click **Deploy**
5. Copy the **Web app URL**

### Step 4: Configure in index.html
In `index.html`, set your GAS URL:

```javascript
let gasUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

### GAS Features
- **doGet()**: Fetch leaderboard and daily tasks
  - `?action=leaderboard` - Get top 20 players
  - `?action=dailyTasks&uid=xxx` - Get player's daily tasks
- **doPost()**: Batch sync game progress
  - `action=sync` - Sync all player data
  - `action=submitAnswer` - Submit a single answer

---

## 3. Database Structure (Firebase Realtime DB)

```json
{
  "players": {
    "$uid": {
      "name": "Player Name",
      "level": 5,
      "xp": 230,
      "hp": 100,
      "correctAnswers": 45,
      "questionsAnswered": 60,
      "streak": 3,
      "maxStreak": 7,
      "dailyCorrect": 8,
      "lastPlayed": 1713001234567
    }
  },
  "leaderboard": {
    "$uid": {
      "name": "Player Name",
      "level": 5,
      "xp": 230,
      "lastPlayed": 1713001234567
    }
  },
  "online": {
    "$uid": {
      "name": "Player Name",
      "lastSeen": 1713001234567
    }
  }
}
```

---

## 4. Offline Mode

The game works fully offline without Firebase:
- Game progress saves to `localStorage`
- Login/logout buttons are hidden when Firebase is not configured
- All original 19 questions + 40 imported questions work offline
- Leaderboard shows "Firebase未配置" when offline

---

## 5. Testing Checklist

- [ ] Game loads without errors
- [ ] Player can move around the map
- [ ] Entering a room starts a quiz
- [ ] Questions display correctly with KaTeX math
- [ ] Correct/wrong feedback works
- [ ] XP and level up system works
- [ ] HP and damage system works
- [ ] Google sign-in works (if Firebase configured)
- [ ] Leaderboard shows player data (if Firebase configured)
- [ ] Daily tasks panel opens
- [ ] Streak counter shows during quiz
- [ ] Offline mode works (no Firebase)

---

## 6. Troubleshooting

### "Firebase not configured"
- Make sure `firebase-config.js` exists and has valid values
- Make sure the script is loaded in `<head>` before `index.html` scripts

### Google sign-in fails
- Check that your school domain is in Firebase authorized domains
- Make sure Google sign-in is enabled in Firebase Console

### Leaderboard not showing data
- Check Firebase Realtime Database rules allow read access
- Check browser console for errors

### Math formulas not rendering
- KaTeX CDN is loaded from jsDelivr
- Check internet connection
- KaTeX is only used for math expressions

---

## 7. Security Notes

For production deployment:
1. Set Firebase Database rules to restrict read/write access
2. Consider adding user authentication validation in GAS
3. Use environment variables for API keys
4. Consider rate limiting on the GAS endpoint

---

## File Structure

```
math-rpg/
├── index.html          # Main game (single file)
├── firebase-config.js  # Firebase configuration (fill in your keys)
├── gas-backend.gs      # Google Apps Script backend
├── SETUP.md            # This file
└── README.md           # Original README
```
