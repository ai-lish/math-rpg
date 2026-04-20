# Math RPG

**Phase 1b** - Math RPG game with Firebase integration and cloud features.

## Features

### Phase 1a (Core Game)
- Single HTML file playable offline
- Phaser.js RPG with 3 classrooms: 代數房, 幾何房, 統計房
- 58 total questions across 代數/幾何/統計 topics
- Level + XP system (100*level XP per level)
- HP system (wrong answer = -20 HP)
- localStorage progress saving
- Mobile-friendly virtual joystick
- Web Audio API sound effects

### Phase 1b (Cloud Features)
- Firebase Authentication (Google sign-in for school accounts)
- Firebase Realtime Database (cloud progress sync)
- Cloud leaderboard (top 20 players)
- Daily tasks: 答對5題, 答對10題, 連勝3題
- Streak counter with bonus XP
- GAS backend for Google Sheets integration
- Offline mode fallback

## Quick Start

### Play Online (No Setup)
Open `index.html` directly in a browser - works fully offline!

### Enable Cloud Features
See [SETUP.md](SETUP.md) for Firebase and GAS configuration.

## Question Bank
- 19 original MCQ questions (verified correct answers)
- 40 imported questions from S1-S5 exam OCR banks
- Topics: 代數 (Algebra), 幾何 (Geometry), 統計 (Statistics)

## Tech Stack
- Phaser.js 3.60 (CDN)
- KaTeX (CDN) for math rendering
- Firebase (optional, for cloud features)
- Google Apps Script (optional, for backend)

## GitHub Pages
https://ai-lish.github.io/math-rpg
