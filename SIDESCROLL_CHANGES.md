# SIDESCROLL_CHANGES.md - Side-Scrolling Platformer Mode

## Overview
Converting Math RPG from top-down (no gravity) to side-scrolling platformer mode.

## Phase 1: Foundation ✅ COMPLETE

### 1. Physics Changes
- **Gravity enabled**: `physics.arcade.gravity.y = 800` (line 3069)
- **Platform collision**: `this.physics.add.collider(player, platforms)` (line 1940)
- **Double-jump**: Jump count tracked via `this.jumpCount`, max 2 jumps

### 2. New Tile Textures Added (lines ~2038-2067)
| Key | Description | Visual |
|-----|-------------|--------|
| `ceiling` | Gray with center line | Dark gray base, lighter top edge, center stripe |
| `wall_side` | 3D depth effect | Gray with three horizontal bands for depth |
| `floor_side` | Warm beige | Warm tan with highlight bands |
| `stair` | Golden brown steps | Brown with step ledges |

### 3. Player Side-View Sprites Added
| Key | Description |
|-----|-------------|
| `player_side_idle` | Side view character, standing |
| `player_side_walk1` | Walk frame 1 (legs apart) |
| `player_side_walk2` | Walk frame 2 (legs together) |
| `player_side_jump` | Jump frame (arms up, legs tucked) |

### 4. Platform System
- `this.platforms = this.physics.add.staticGroup()` (line 1935)
- `buildPlatformColliders()` method (line 2134) tags each platform tile
- All floor/wall/room tiles added to platforms group for collision
- Player collides with platforms group

### 5. Jump Mechanics (update method, line 2238)
- Up/W/Space for jump
- Double-jump: press again while airborne
- Down/S while airborne = drop through platform (velocityY = 200)
- `isOnGround` check using `body.blocked.down` or `body.touching.down`

### 6. Sprite Selection
- `player_side_idle` when stationary
- `player_side_walk1` when moving (flipped left/right via `setFlipX`)
- `player_side_jump` when airborne
- Horizontal-only movement via `setVelocityX` (preserves gravity)

---

## Phase 2: Map System (NOT STARTED)
- [ ] Expand map from 16 to 24 columns
- [ ] Draw 4-layer corridor structure
- [ ] Add stair tiles for level transitions
- [ ] Implement camera bounds and follow

---

## Phase 3: Polish (NOT STARTED)
- [ ] Add walk animation (frame toggle between walk1/walk2)
- [ ] Add parallax background layers
- [ ] Optimize camera following

---

## Key Code Locations
- Physics config: line ~3069
- `create()` method: lines ~1930-1950
- `buildPlatformColliders()`: lines ~2134-2139
- `drawMap()` modified: lines ~2142-2165
- `update()` rewritten: lines ~2228-2263
- New textures in `createPixelTextures()`: lines ~2038-2067
