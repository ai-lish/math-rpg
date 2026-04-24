# Math RPG — de12a89 Null Check 測試報告

## 測試環境
- **URL**: https://ai-lish.github.io/math-rpg/
- **Browser**: Browserbase (headless)
- **Commit**: `de12a89` (fix: add null checks for DOM element style/textContent access)

---

## ✅ 測試結果：JS Errors — 零錯誤

| 檢查項目 | 結果 |
|----------|------|
| `js_errors` array | `[]` (empty) |
| Console errors | 0 |
| `document.title` | "Math RPG - 冒險大廳" ✓ |
| `#game-container` | 存在 ✓ |
| `#hud` (HP/XP bars) | 存在 ✓ |

**結論：12 處 null check 已成功防止 DOM null 訪問錯誤。**

---

## ⚠️ 發現的問題

### 1. Accessibility Tree 顯示「Empty page」（非 bug，但係調試陷阱）

**現象**：`browser_snapshot()` 返回 `element_count: 0`，snapshot 顯示「Empty page」。

**原因**：
- Phaser 3 使用 WebGL Canvas (`<canvas id="">`) 進行渲染
- WebGL canvas 唔會向 accessibility tree 暴露 DOM nodes
- Accessibility API 睇唔到 canvas 內嘅任何元素

**驗證方法**（非 accessibility tree）：
```javascript
// 呢啲先係正確嘅驗證方式
document.querySelector('canvas').width        // → 768
document.querySelector('canvas').height       // → 576
canvas.toDataURL('image/png')                 // → 有效 PNG base64
hubGame.scene.scenes[0].sys.settings.status   // → 4 (RUNNING)
```

**驗證結果**：
- Canvas: 768×576 ✓
- `toDataURL()`: 有效 PNG（遊戲有輸出）✓
- Scene status: 4 (Phaser.Scene.RUNNING) ✓
- Textures: hub_floor, hub_wall, zone_school, zone_algebra, player_hub 全部存在 ✓
- Floor tiles: 140 個 ✓
- Wall tiles: 52 個 ✓
- Player sprite at (360, 408), visible: true ✓

**建議**：日後 debug 時用 `browser_console` + `browser_vision` 而唔係 `browser_snapshot`，因為 snapshot 唔會捕捉 WebGL canvas 內容。

---

### 2. `hubGame` 唔係 `game` — 全域變數命名

**現象**：`hub-main.js` 將遊戲實例存為 `hubGame`（唔係 `game`）。

**代碼** (`hub-main.js:355`)：
```javascript
const hubGame = new Phaser.Game({ ... });
```

**影響**：
- `shared-main.js` 入面嘅 `game` 相關代碼（如果有的話）唔會影響 `hubGame`
- Debug 時要小心：`typeof game === 'undefined'` 係正常嘅

---

### 3. `index.html.old` 包含喺 Commit（唔係問題，但佔空間）

`de12a89` commit 包含 `index.html.old`（3497 行），呢個係旧版 index.html backup。建議：
- 將 `index.html.old` 移到 `.gitignore` 或刪除
- 或者加到 `.gitattributes` 標記為 binary/large file

---

### 4. Firebase 連接處於「離線」模式

**現象**：Firebase status 顯示「離線」。

**原因**：Firebase config (`firebase-config.js`) 包含佔位符，無法連接真實 Firebase Realtime Database。

**代碼** (`firebase-config.js`):
```javascript
const firebaseConfig = {
  apiKey: "DEMO_API_KEY",
  authDomain: "DEMO.firebaseapp.com",
  databaseURL: "https://DEMO.firebaseio.com",
  // ...
};
```

**建議**：
- 如果唔需要 Firebase 功能，考慮移除 Firebase 初始化代碼以減少 load time
- 如果需要 Firebase，請提供真實 config

---

## 📋 總結

| 項目 | 狀態 |
|------|------|
| 零 JS Errors (de12a89 null checks) | ✅ Pass |
| Canvas 渲染 | ✅ Pass |
| Phaser Scene 運行 | ✅ Pass |
| Textures 生成 | ✅ Pass |
| Accessibility snapshot | ⚠️ 誤導（WebGL canvas 特性） |

**結論**：commit `de12a89` 成功修復咗 DOM null 訪問問題，遊戲正常運行。Debug 工具應使用 `browser_console` + `browser_vision` 而唔係 `browser_snapshot`。
