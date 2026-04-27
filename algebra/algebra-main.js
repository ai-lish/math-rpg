// ============================================================
// ALGEBRA MAIN - AlgebraScene with 7 algebra topic rooms
// ============================================================

const ALG_TILE = 48;
const ALG_COLS = 16;
const ALG_ROWS = 12;

const ALG_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// 7 algebra-related topic rooms (rows 3 and 7)
const ALG_ROOMS = [
  { tileX:2,  tileY:3, topic:'代數',   icon:'🔢', color:0x4A90D9, roomId:'alg',    label:'代數室' },
  { tileX:5,  tileY:3, topic:'方程',   icon:'⚖️',  color:0xFA8C16, roomId:'eq',     label:'方程室' },
  { tileX:8,  tileY:3, topic:'函數',   icon:'📈', color:0x13C2C2, roomId:'func',   label:'函數室' },
  { tileX:11, tileY:3, topic:'比率',   icon:'🔀', color:0x1890FF, roomId:'ratio',  label:'比率室' },
  { tileX:3,  tileY:7, topic:'數列',   icon:'🔢', color:0xFFD700, roomId:'seq',    label:'數列室' },
  { tileX:7,  tileY:7, topic:'百分率', icon:'📉', color:0x2ECC71, roomId:'pct',    label:'百分率室' },
  { tileX:11, tileY:7, topic:'近似值', icon:'📏', color:0x9B59B6, roomId:'approx', label:'近似值室' },
];

class AlgebraScene extends Phaser.Scene {
  constructor() { super({ key: 'Algebra' }); }

  create() {
    this.nearRoom = null;
    this.hintText = null;
    this.joystick = { x: 0, y: 0 };

    this.createTextures();
    this.drawMap();
    this.createPlayer();
    this.createRoomMarkers();
    this.setupControls();

    this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
    this.cameras.main.setBounds(0, 0, ALG_COLS * ALG_TILE, ALG_ROWS * ALG_TILE);

    const zlEl = document.getElementById('zone-label');
    if (zlEl) zlEl.textContent = '📐 代數大陸 — 7個代數室';
    const bbEl = document.getElementById('back-btn');
    if (bbEl) bbEl.style.display = 'block';
    const ltEl = document.getElementById('loading-text');
    if (ltEl) ltEl.style.display = 'none';

    loadState();
    updateHUD();
  }

  createTextures() {
    const mk = (key, w, h, draw) => {
      const g = this.make.graphics({ add: false });
      draw(g);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    mk('alg_floor', ALG_TILE, ALG_TILE, g => {
      g.fillStyle(0x2A3020);
      g.fillRect(0, 0, ALG_TILE, ALG_TILE);
      g.fillStyle(0x354025);
      g.fillRect(1, 1, ALG_TILE - 2, 2);
      g.fillStyle(0x1E2815);
      g.fillRect(1, 1, 2, ALG_TILE - 2);
    });

    mk('alg_wall', ALG_TILE, ALG_TILE, g => {
      g.fillStyle(0x1A2010);
      g.fillRect(0, 0, ALG_TILE, ALG_TILE);
      g.fillStyle(0x253015);
      g.fillRect(2, 2, ALG_TILE - 4, ALG_TILE - 4);
      g.fillStyle(0x0E1508);
      g.fillRect(4, 4, ALG_TILE - 8, ALG_TILE - 8);
    });

    mk('alg_player', 24, 24, g => {
      g.fillStyle(0xFFD700);
      g.fillRect(8, 6, 8, 10);
      g.fillStyle(0xFFD4A8);
      g.fillRect(9, 2, 6, 6);
      g.fillStyle(0x8B4513);
      g.fillRect(9, 2, 6, 2);
      g.fillStyle(0x333333);
      g.fillRect(10, 4, 1, 1);
      g.fillRect(13, 4, 1, 1);
      g.fillStyle(0x8B6914);
      g.fillRect(9, 16, 3, 4);
      g.fillRect(13, 16, 3, 4);
    });

    ALG_ROOMS.forEach(room => {
      mk('algroom_' + room.roomId, ALG_TILE, ALG_TILE, g => {
        g.fillStyle(room.color);
        g.fillRect(0, 0, ALG_TILE, ALG_TILE);
        g.fillStyle(0xFFFFFF, 0.25);
        g.fillRect(3, 3, ALG_TILE - 6, 5);
        g.fillStyle(0x000000, 0.25);
        g.fillRect(3, ALG_TILE - 8, ALG_TILE - 6, 5);
        g.fillStyle(0x000000, 0.5);
        g.fillRect(ALG_TILE / 2 - 6, ALG_TILE - 10, 12, 10);
      });
    });
  }

  drawMap() {
    this.wallLayer = this.physics.add.staticGroup();
    for (let y = 0; y < ALG_ROWS; y++) {
      for (let x = 0; x < ALG_COLS; x++) {
        const tile = ALG_MAP[y][x];
        const px = x * ALG_TILE + ALG_TILE / 2;
        const py = y * ALG_TILE + ALG_TILE / 2;
        if (tile === 1) {
          this.wallLayer.create(px, py, 'alg_wall');
        } else {
          this.add.image(px, py, 'alg_floor');
        }
      }
    }
  }

  createPlayer() {
    const spawnX = 7 * ALG_TILE + ALG_TILE / 2;
    const spawnY = 5 * ALG_TILE + ALG_TILE / 2;
    this.player = this.physics.add.sprite(spawnX, spawnY, 'alg_player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 20);
    this.player.body.setOffset(2, 2);
    this.physics.add.collider(this.player, this.wallLayer);
  }

  createRoomMarkers() {
    this.roomZones = [];
    this.roomBtns = [];

    // Camera-relative conversion: world -> screen px
    this._worldToScreen = (wx, wy) => {
      const cam = this.cameras.main;
      const sx = (wx - cam.scrollX) * cam.zoom;
      const sy = (wy - cam.scrollY) * cam.zoom;
      const gc = document.getElementById('game-container');
      if (!gc) return { sx, sy };
      const rect = gc.getBoundingClientRect();
      return { sx: rect.left + sx, sy: rect.top + sy };
    };

    // Remove stale buttons
    document.querySelectorAll('.room-enter-btn').forEach(b => b.remove());

    ALG_ROOMS.forEach(room => {
      const px = room.tileX * ALG_TILE + ALG_TILE / 2;
      const py = room.tileY * ALG_TILE + ALG_TILE / 2;

      const marker = this.add.image(px, py, 'algroom_' + room.roomId);
      this.tweens.add({ targets: marker, alpha: 0.75, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      this.add.text(px, py - ALG_TILE * 0.7, room.icon + ' ' + room.label, {
        fontSize: '10px', color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5);

      const zone = this.add.zone(px, py, ALG_TILE * 1.4, ALG_TILE * 1.4);
      this.physics.world.enable(zone);
      zone.body.setAllowGravity(false);
      zone.body.setImmovable(true);
      zone.roomData = room;

      this.physics.add.overlap(this.player, zone, () => {
        if (!zqState.active && this.nearRoom !== room) {
          this.nearRoom = room;
          this.updateHint(room);
        }
      });
      this.roomZones.push(zone);

      // HTML overlay button for mobile (bigger touch target)
      const gc = document.getElementById('game-container');
      if (gc) {
        const btn = document.createElement('button');
        btn.className = 'room-enter-btn';
        btn.textContent = room.icon + ' 點擊進入';
        btn.style.display = 'none';
        btn.style.position = 'absolute';
        btn.style.zIndex = '20';
        btn.style.pointerEvents = 'all';
        btn.style.transform = 'translate(-50%, -50%)';
        btn.style.whiteSpace = 'nowrap';
        const colorHex = '#' + room.color.toString(16).padStart(6, '0');
        btn.style.background = colorHex + 'ee';
        btn.style.border = '2px solid #fff';
        btn.style.color = '#fff';
        btn.style.fontWeight = 'bold';
        btn.style.padding = '8px 14px';
        btn.style.borderRadius = '16px';
        btn.style.fontSize = '12px';
        btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        btn.onclick = () => startZoneQuiz(room);
        gc.appendChild(btn);
        this.roomBtns.push({ btn, room, px, py });
      }
    });
  }

  updateHint(room) {
    if (this.hintText) this.hintText.destroy();
    this.hintText = this.add.text(
      this.player.x, this.player.y - 40,
      '按 E 進入 ' + room.label,
      { fontSize: '11px', color: '#FAAD14', backgroundColor: 'rgba(0,0,0,0.8)', padding: { x: 5, y: 3 } }
    ).setOrigin(0.5).setDepth(10);
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.eKey = this.input.keyboard.addKey('E');
    this.setupJoystick();

    this.input.on('pointerdown', pointer => {
      if (zqState.active) return;
      ALG_ROOMS.forEach(room => {
        const px = room.tileX * ALG_TILE + ALG_TILE / 2;
        const py = room.tileY * ALG_TILE + ALG_TILE / 2;
        if (Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, px, py) < ALG_TILE * 0.8) {
          startZoneQuiz(room);
        }
      });
    });
  }

  setupJoystick() {
    const zone = document.getElementById('joystick-zone');
    const knob = document.getElementById('joystick-knob');
    if (!zone || !knob) return;
    let drag = false;
    const RADIUS = 40;
    const handle = e => {
      const t = e.touches ? e.touches[0] : e;
      const rect = zone.getBoundingClientRect();
      const dx = t.clientX - (rect.left + rect.width / 2);
      const dy = t.clientY - (rect.top + rect.height / 2);
      const dist = Math.min(RADIUS, Math.sqrt(dx * dx + dy * dy));
      const ang = Math.atan2(dy, dx);
      this.joystick.x = Math.cos(ang) * dist / RADIUS;
      this.joystick.y = Math.sin(ang) * dist / RADIUS;
      knob.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px)`;
    };
    const start = e => {
      const t = e.touches ? e.touches[0] : e;
      if (t.clientX > window.innerWidth / 2) return;
      e.preventDefault();
      drag = true;
      zone.style.display = 'flex';
      zone.style.left = (Math.min(t.clientX, window.innerWidth * 0.45) - RADIUS - 10) + 'px';
      zone.style.top = (Math.max(t.clientY, 100) - RADIUS - 10) + 'px';
      handle(e);
    };
    const end = () => { if (drag) { drag = false; this.joystick = { x: 0, y: 0 }; knob.style.transform = 'translate(0,0)'; } };
    document.addEventListener('mousedown', e => { if (e.clientX < window.innerWidth / 2) start(e); });
    document.addEventListener('mousemove', e => { if (drag) handle(e); });
    document.addEventListener('mouseup', end);
    document.addEventListener('touchstart', e => start(e), { passive: false });
    document.addEventListener('touchmove', e => { if (drag) handle(e); }, { passive: false });
    document.addEventListener('touchend', end);
  }

  update() {
    if (zqState.active) { this.player.setVelocity(0, 0); return; }

    const speed = 150;
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -1;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -1;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 1;

    if (Math.abs(this.joystick.x) > 0.1 || Math.abs(this.joystick.y) > 0.1) {
      vx = this.joystick.x;
      vy = this.joystick.y;
    }
    if (vx !== 0 && vy !== 0) { const l = Math.sqrt(vx * vx + vy * vy); vx /= l; vy /= l; }
    this.player.setVelocity(vx * speed, vy * speed);
    if (vx < 0) this.player.setFlipX(true);
    else if (vx > 0) this.player.setFlipX(false);

    if (this.nearRoom && Phaser.Input.Keyboard.JustDown(this.eKey)) {
      startZoneQuiz(this.nearRoom);
    }

    let nearAny = false;
    this.roomZones.forEach(zone => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y) < ALG_TILE * 1.1) nearAny = true;
    });
    if (!nearAny) {
      this.nearRoom = null;
      if (this.hintText) { this.hintText.destroy(); this.hintText = null; }
    } else if (this.hintText) {
      this.hintText.setPosition(this.player.x, this.player.y - 40);
    }

    if ((vx !== 0 || vy !== 0) && Math.random() < 0.015) sfxStep && sfxStep();
    this.player.setAlpha((vx !== 0 || vy !== 0) ? (0.8 + Math.sin(this.time.now / 100) * 0.2) : 1);

    // ---- Mobile room button overlay ----
    const NEAR_DIST = ALG_TILE * 2.2;
    if (this.roomBtns) {
      this.roomBtns.forEach(({ btn, room, px, py }) => {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, px, py);
        if (dist < NEAR_DIST) {
          const { sx, sy } = this._worldToScreen(px, py);
          btn.style.left = sx + 'px';
          btn.style.top = (sy - ALG_TILE * 0.6) + 'px';
          btn.style.display = 'block';
        } else {
          btn.style.display = 'none';
        }
      });
    }
  }
}

function returnToHub() {
  window.location.href = '../hub/index.html';
}

// ============================================================
// GAME INIT
// ============================================================
const algebraGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: ALG_COLS * ALG_TILE,
  height: ALG_ROWS * ALG_TILE,
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [AlgebraScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  backgroundColor: '#1A1A2E'
});