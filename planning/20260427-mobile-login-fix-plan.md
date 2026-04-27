# Math RPG - 手機E鍵 + 登入按鈕 修復計劃

**日期：** 2026-04-27
**Repo：** `/tmp/math-rpg-phaser`（math-rpg Phaser 版）
**目標：** 兩個問題
1. 手機無法按E進入 zone/room
2. 缺少登入/登出按鈕

---

## 現況分析

### 問題1：手機E鍵問題

**Hub Scene (`hub/hub-main.js`)**
- 機制：auto-overlap — 行走到 zone 位置自動 trigger `enterZone()`
- 冇 `eKey`，冇「行近提示」
- Mobile： joystick 行走到 zone → overlap trigger → 自動進入 ✓（理論上 work）
- 但學生唔知「行埋去就進入」，冇視覺提示

**School/Algebra/Geometry Scene**
- 機制：行走到 nearRoom + **按 E** 顯示「按 E 進入 X」，再按 E 進入
- 有 `pointerdown` tap 檢測（`school-main.js` lines 197-207）
- Mobile tap 問題：`pointer.worldX/Y` 係 camera-relative，點擊 screen 某處時座標未必正確對應 Phaser world 座標
- **Room marker zone 太細**（`SCHOOL_TILE * 0.8` 半徑），手指難精確點

### 問題2：登入按鈕缺失

**現有代碼：** `shared-main.js` 有完整 auth 邏輯
- `signIn()` — Google popup 登入（限制 `lsc.edu.hk` domain）
- `signOut()` — 登出
- `updateAuthUI()` — 切換 login/logout 按鈕顯示
- Firebase Realtime Database 已配置

**缺失：** 所有 HTML（`index.html`, `hub/index.html`, `school/index.html`, `algebra/index.html`, `geometry/index.html`）都冇 `#login-btn`、`#logout-btn`、`#user-info` DOM 元素

---

## 修復方案

### Fix 1：Hub — 加入 Near-Zone 提示（Mobile 友好）

**目標：** 當玩家行近 zone 時，顯示「行近或點擊進入 🏫/📐」，並支援點擊 label 直接進入

**代碼變更 (`hub/hub-main.js`)**

```
位置：createZoneMarkers() + update() + 新增 nearZone tracking
```

1. 在 `createZoneMarkers()` 同時建立可點擊的 HTML overlay button
2. 在 `update()` 追蹤 `nearZone`（行近邊緣就設定）
3. Near 時顯示「點擊進入」按鈕 + 播放動畫提示
4. 點擊按鈕 trigger `enterZone(zoneData)`

**具體做法：**
- 在 `createZoneMarkers()` 中，每個 zone 創建一個 HTML button：
  ```javascript
  // 在 #game-container 內
  const btn = document.createElement('button');
  btn.className = 'zone-enter-btn';
  btn.textContent = zone.label + ' 點擊進入';
  btn.style.cssText = `position:absolute; left:${px}px; top:${py - 60}px; ...`;
  btn.onclick = () => this.enterZone(zone);
  ```
- 預設 `display:none`
- 在 `update()` 計算玩家與每個 zone 的距離

**CSS（放 `hub/index.html` style）**
```css
.zone-enter-btn {
  background: rgba(250, 173, 20, 0.9);
  border: 2px solid #fff;
  color: #1A1A2E;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  pointer-events: all;
  z-index: 20;
  transform: translateX(-50%);
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
}
.zone-enter-btn:hover { background: #FFD700; }
```

**驗證方法：**
- Desktop：行走近 zone → 出現按鈕 → 點擊進入 ✓
- Mobile Emulator：行走近 zone → 出現按鈕 → 點擊進入 ✓

---

### Fix 2：School — 改善 Mobile Tap 進入體驗

**目標：** 讓 mobile 用戶可以點擊 room 直接進入，唔需要行走到正中間

**方案：擴大 room marker hit area + 改用 screen 座標**

`school-main.js` 的 `pointerdown` handler 問題：
```javascript
// 現有代碼（lines 197-207）
if (Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, px, py) < SCHOOL_TILE * 0.8)
```

**改為：** 用 HTML overlay button（類似 hub 的做法）

在 `school-main.js` `createRoomMarkers()` 中，每個 room 創建一個 HTML button覆蓋在 room label 上。

**好處：**
- Touch target 更大（成個按鈕）
- 唔靠 Phaser座標，直接 HTML click handler
- 唔需要行走到正中間

---

### Fix 3：Algebra + Geometry — 同樣加入 HTML Overlay 按鈕

同上，在 `algebra-main.js` 和 `geometry-main.js` 加入同樣的 HTML overlay 按鈕方式。

---

### Fix 4：所有 HTML 加入登入/登出按鈕

**目標：** 喺每個場景的 HUD 右上角顯示「登入」或「用戶名 Lv.X + 登出」

**需要修改的 HTML：**
- `hub/index.html`（冒險大廳入口頁）
- `school/index.html`（學校場景）
- `algebra/index.html`（代數大陸）
- `geometry/index.html`（幾何挑戰）
- `index.html`（根目錄冒險大廳）

**HTML 元素（在 `.hud-right` 內加入）：**
```html
<button id="login-btn" class="hud-btn" onclick="signIn()" style="display:none">🔑 登入</button>
<div id="user-info" style="display:none;align-items:center;gap:6px;">
  <span id="user-name" style="color:#fff;font-size:12px;"></span>
  <span id="user-level" style="color:#FAAD14;font-size:11px;"></span>
  <button id="logout-btn" class="hud-btn" onclick="signOut()">登出</button>
</div>
```

**CSS 樣式（每個 HTML 的 `<style>` 中加入）：**
```css
#login-btn { background: #4A90D9; border-color: #4A90D9; }
#logout-btn { background: rgba(0,0,0,.6); border-color: rgba(255,255,255,.25); font-size: 11px; padding: 2px 8px; }
#user-info { background: rgba(0,0,0,.5); padding: 2px 8px; border-radius: 8px; }
```

**JS（在每個場景 init 時調用）：**
```javascript
// 在每個 HTML 的 inline script 中加入
if (auth) auth.onAuthStateChanged(onAuthStateChanged);
updateAuthUI();
```

---

## 優先次序

| # | 優先 | 項目 | 檔案 |
|---|------|------|------|
| 1 | P1 | Hub zone overlay 按鈕 + nearZone 提示 | `hub/hub-main.js`, `hub/index.html` |
| 2 | P1 | School room overlay 按鈕（mobile tap 修復）| `school/school-main.js`, `school/index.html` |
| 3 | P2 | Algebra + Geometry 同樣 overlay 按鈕 | `algebra/`, `geometry/` |
| 4 | P2 | 所有 HTML 加入 login/logout/用戶資訊按鈕 | 5個 HTML 檔 |

---

## 風險評估

| 風險 | 影響 | 緩解 |
|------|------|------|
| HTML overlay button 俾 Phaser canvas 擋住 | 按鈕點唔到 | 設定 `z-index: 20`（高於 canvas overlay），`pointer-events: all` |
| Hub 的 overlap trigger 同 button click 双重觸發 | 進入兩次 | `isTransitioning` flag 已存在，防禦機制已有 |
| Firebase 未配置導致 `signIn()` 報錯 | 不影響本地遊玩 | `signIn()` 內已有 `if(!firebaseConfigured)` 檢查 |

---

## 預計工時

- Fix 1（Hub overlay）：~1 小時
- Fix 2（School overlay）：~1 小時
- Fix 3（Algebra + Geometry）：~1 小時  
- Fix 4（Auth UI）：~1 小時
- 測試驗證：~1 小時
- **總計：~5 小時**
