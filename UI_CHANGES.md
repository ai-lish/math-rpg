# Math RPG UI/UX Changes Log

## Summary
Systematic UI/UX improvements based on user feedback (Hermes) and 2025 glassmorphism/design trends.

---

## P0: Floor Tiles ✅ COMPLETED

**Problem:** School floor tiles looked like uniform purple squares, walking animation showed "square blocks".

**Solution:** Procedural floor generation with 4 tile variants.

**Changes:**
- Created 4 floor variants (`floor0`, `floor1`, `floor2`, `floor3`) with warm beige base (#E2C9A0)
- Each variant has different subtle checkered pattern to break grid monotony
- Floor placement uses position-based algorithm: `(x*7+y*13)%4` for pseudo-random non-repeating pattern
- Tile colors changed from purple (#8b5d8b) to warm beige (#E2C9A0) - more realistic school floor

**Research reference:** Edutopia game-based learning research emphasizes visual variety for engagement.

---

## P1: Color Theme - Too Dark ✅ COMPLETED

**Problem:** Dark purple-black background (#1A1A2E) too gloomy.

**Solution:** Bright sky blue/white glassmorphism palette.

**Changes:**

### Background
- `body`: #1A1A2E → #E8F4FD (bright sky blue)

### HUD (Top bar)
- Added `backdrop-filter: blur(16px)` glassmorphism
- Semi-transparent white background `rgba(255,255,255,.75)`
- Soft shadow `box-shadow: 0 2px 12px rgba(0,0,0,.1)`
- Rounded bottom corners `border-radius: 0 0 16px 0`
- Text color: `#fff` → `#1A1A2E` (dark, readable on white)

### Quiz Overlay
- Background: `rgba(26,26,46,.97)` → `rgba(200,230,255,.92)` (soft blue tint)
- Card: Dark `#16213e` → `rgba(255,255,255,.85)` frosted glass
- `backdrop-filter: blur(16px)`
- `border-radius: 20px` (larger, softer)
- `box-shadow: 0 8px 32px rgba(74,144,217,.2), 0 2px 8px rgba(0,0,0,.1)`

### Quiz Options
- Background: `#1f2d4a` → `rgba(255,255,255,.8)` (white card)
- Text: `#fff` → `#1A1A2E` (dark readable)
- `border-radius: 14px` (softer)
- Added subtle shadow `box-shadow: 0 2px 8px rgba(0,0,0,.08)`

### Menu Panels (Leaderboard, Daily Tasks, Card, Achievement)
- All background colors changed from dark `rgba(26,26,46,.97)` to `rgba(200,230,255,.85-.88)`
- All cards changed from `#16213e` to `rgba(255,255,255,.85-.9)` frosted glass
- Added `backdrop-filter: blur(16px-20px)`
- `border-radius: 20px` (larger, softer)
- Added soft shadows

### Buttons
- All buttons now use `linear-gradient(135deg,...)` for 2025 gradient style
- Added soft shadows `box-shadow: 0 4px 12px rgba(...)`
- `border-radius: 12px-14px` (softer)

---

## P2: Character Movement ✅ COMPLETED

**Changes:**
- Created 4 directional sprites: `player_up`, `player_down`, `player_left`, `player_right`
- Each sprite shows appropriate facing direction with visible features
- update() loop now switches texture based on movement direction:
  - `vy < 0` → player_up
  - `vx < 0` → player_left (with diagonal priority)
  - `vx > 0` → player_right (with diagonal priority)
  - `vy > 0` or no input → player_down
- Removed `setFlipX` (now uses dedicated sprites instead)

**Research:** Game Developer GDC research on RPG character animation - directional sprites improve player orientation and visual feedback.

---

## P3: UI Modernization ✅ MOSTLY COMPLETE

**Completed:**
- ✅ Glassmorphism: All panels use `backdrop-filter: blur()` + semi-transparent backgrounds
- ✅ Soft shadows: All cards have `box-shadow`
- ✅ Larger typography: Quiz question increased from 17px to 18px, menu titles from 22px to 24px
- ✅ Cleaner layouts: Increased padding/gaps, softer border-radius
- ✅ Bright color accents: All buttons use gradient + shadow

**Card System:**
- Card cells: White glassmorphism `rgba(255,255,255,.85)` with blur
- Hover: Scale 1.07 with blue glow
- Locked: 35% opacity (reduced from 40%)
- Glow colors updated for brightness

**Achievement System:**
- Glassmorphism background
- Gold accent color preserved
- Names now dark (#B8860B) for readability on light

---

---

## P4: Building/Map Diversity ✅ COMPLETED

**Changes:**
- Added `theme` and `floorColor` properties to each ROOMS entry
- Created 15 unique `roomfloor_*` textures, each with distinct color palette:
  - 代數房 (Algebra): `#DBEAFE` light blue
  - 幾何房 (Geometry): `#D1FAE5` light green
  - 統計房 (Statistics): `#FEF3C7` light yellow
  - 概率房 (Probability): `#EDE9FE` light purple
  - 函數房 (Function): `#FCE7F3` light pink
  - 方程房 (Equation): `#CFFAFE` light cyan
  - 面積房 (Area): `#FFEDD5` light orange
  - 坐標房 (Coordinate): `#FEE2E2` light red
  - 比率房 (Ratio): `#CFFAFB` light teal
  - 數列房 (Sequence): `#FEF08A` light yellow
  - 百分法房 (Percentage): `#F3E8FF` light violet
  - 近似房 (Approximation): `#F1F5F9` light gray
  - 競技場 (Arena): `#FEF9E7` gold tint
  - 每日挑戰 (Daily): `#FFF7ED` warm white
  - 入口 (Entrance): `#D1FAE5` light green
- Each room floor texture uses tint color from ROOMS.color for cohesive theme
- Room signs now use room color for text (instead of white)
- Room signs have semi-transparent white background

**Note:** Full themed venues (Algebra Hall, Geometry Forest, etc.) would require significant map restructuring beyond room tiles. Current implementation provides distinct visual identity per room.

---

## P5: Character Sprite Diversity ✅ COMPLETED

**Changes:**
- Added 4 avatar variants with distinct visual styles:
  - **Avatar 1**: Short brown hair, blue shirt (default student look)
  - **Avatar 2**: Curly dark hair, green shirt (creative type)
  - **Avatar 3**: Long brown hair, pink shirt (artistic type)
  - **Avatar 4**: Short dark hair, orange shirt + glasses (studious type)
- Each avatar has unique skin tone, hair style, shirt color, and pants color
- Avatar selection in Profile panel with canvas-rendered previews
- `gameState.selectedAvatar` stores selection (1-4)
- `createCharacterVariants()` in MainScene generates all 4 sprites
- Scene restarts on avatar change to apply selection

**Profile Panel Updates:**
- Glassmorphism styling (light background with blur)
- Avatar selector with 4 clickable preview boxes
- Selected avatar highlighted with blue border
- Scene reloads to apply avatar change

---

## Detailed CSS Changes

### Colors Applied
| Element | Old | New |
|---------|-----|-----|
| Body bg | #1A1A2E | #E8F4FD |
| Floor tile | #8b5d8b | #E2C9A0 (warm beige) |
| Wall tile | #4a4a6a | #9CA3AF (gray) |
| Quiz card bg | #16213e | rgba(255,255,255,.85) |
| Quiz text | #fff | #1A1A2E |
| Quiz option bg | #1f2d4a | rgba(255,255,255,.8) |
| Menu bg | rgba(26,26,46,.96) | rgba(200,230,255,.88) |

### Glassmorphism Applied To
- #hud (top bar)
- #quiz-overlay + #quiz-card
- #menu
- #leaderboard-panel + #leaderboard-card
- #daily-tasks-panel + #tasks-card
- #card-overlay
- #achievement-overlay
- .card-cell
- .quiz-option (options)

### 2025 Design Trends Applied
1. **Glassmorphism**: All panels use backdrop-filter blur + transparency
2. **Post-Neumorphism**: Soft shadows, rounded corners, gentle depth
3. **Gradient Buttons**: linear-gradient with matching shadow
4. **Warmer Palette**: From purple-black to sky blue/beige/white
5. **Larger Typography**: Improved readability

---

## Files Modified
- `/tmp/math-rpg/index.html` (UI/UX improvements)

## Next Steps (Priority Order)
1. P4: Building/Map Diversity - Add distinctive visual identity per room type
2. P5: Character Sprite Diversity - Expand character options
3. P2: Full directional movement - 4-direction sprite animation