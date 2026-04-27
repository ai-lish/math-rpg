// ============================================================
// SCHOOL MAIN - MapSchoolScene with 12 topic rooms
// ============================================================

const SCHOOL_TILE = 48;
const SCHOOL_COLS = 16;
const SCHOOL_ROWS = 12;

// 0 = floor, 1 = wall
const SCHOOL_MAP = [
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

// 12 topic rooms in a 4×3 grid
const SCHOOL_ROOMS = [
  { tileX:2,  tileY:2, topic:'代數', icon:'🔢', color:0x4A90D9, roomId:'alg',   label:'代數室' },
  { tileX:5,  tileY:2, topic:'幾何', icon:'📐', color:0x52C41A, roomId:'geo',   label:'幾何室' },
  { tileX:8,  tileY:2, topic:'統計', icon:'📊', color:0x722ED1, roomId:'stat',  label:'統計室' },
  { tileX:11, tileY:2, topic:'概率', icon:'🎲', color:0xF5222D, roomId:'prob',  label:'概率室' },
  { tileX:2,  tileY:5, topic:'函數', icon:'📈', color:0x13C2C2, roomId:'func',  label:'函數室' },
  { tileX:5,  tileY:5, topic:'方程', icon:'⚖️',  color:0xFA8C16, roomId:'eq',    label:'方程室' },
  { tileX:8,  tileY:5, topic:'面積', icon:'⬜', color:0x2DB7F5, roomId:'area',  label:'面積室' },
  { tileX:11, tileY:5, topic:'坐標', icon:'📍', color:0xFF85C0, roomId:'coord', label:'坐標室' },
  { tileX:2,  tileY:8, topic:'比率', icon:'🔀', color:0x1890FF, roomId:'ratio', label:'比率室' },
  { tileX:5,  tileY:8, topic:'數列', icon:'🔢', color:0xFFD700, roomId:'seq',   label:'數列室' },
  { tileX:8,  tileY:8, topic:'百分率', icon:'📉', color:0x2ECC71, roomId:'pct',   label:'百分率室' },
  { tileX:11, tileY:8, topic:'近似值', icon:'📏', color:0x9B59B6, roomId:'approx',label:'近似值室' },
];

class SchoolScene extends Phaser.Scene {
  constructor() { super({ key: 'School' }); }

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
    this.cameras.main.setBounds(0, 0, SCHOOL_COLS * SCHOOL_TILE, SCHOOL_ROWS * SCHOOL_TILE);

    const zlEl = document.getElementById('zone-label');
    if (zlEl) zlEl.textContent = '🏫 學校 — 12個教室';
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

    mk('sch_floor', SCHOOL_TILE, SCHOOL_TILE, g => {
      g.fillStyle(0x2A3550);
      g.fillRect(0, 0, SCHOOL_TILE, SCHOOL_TILE);
      g.fillStyle(0x354060);
      g.fillRect(1, 1, SCHOOL_TILE - 2, 2);
      g.fillStyle(0x1E2840);
      g.fillRect(1, 1, 2, SCHOOL_TILE - 2);
    });

    mk('sch_wall', SCHOOL_TILE, SCHOOL_TILE, g => {
      g.fillStyle(0x1A2535);
      g.fillRect(0, 0, SCHOOL_TILE, SCHOOL_TILE);
      g.fillStyle(0x253045);
      g.fillRect(2, 2, SCHOOL_TILE - 4, SCHOOL_TILE - 4);
      g.fillStyle(0x0E1520);
      g.fillRect(4, 4, SCHOOL_TILE - 8, SCHOOL_TILE - 8);
    });

    mk('sch_player', 24, 24, g => {
      g.fillStyle(0x87CEEB);
      g.fillRect(8, 6, 8, 10);
      g.fillStyle(0xFFD4A8);
      g.fillRect(9, 2, 6, 6);
      g.fillStyle(0x4A3728);
      g.fillRect(9, 2, 6, 2);
      g.fillStyle(0x333333);
      g.fillRect(10, 4, 1, 1);
      g.fillRect(13, 4, 1, 1);
      g.fillStyle(0x3D5A80);
      g.fillRect(9, 16, 3, 4);
      g.fillRect(13, 16, 3, 4);
    });

    SCHOOL_ROOMS.forEach(room => {
      mk('room_' + room.roomId, SCHOOL_TILE, SCHOOL_TILE, g => {
        g.fillStyle(room.color);
        g.fillRect(0, 0, SCHOOL_TILE, SCHOOL_TILE);
        g.fillStyle(0xFFFFFF, 0.25);
        g.fillRect(3, 3, SCHOOL_TILE - 6, 5);
        g.fillStyle(0x000000, 0.25);
        g.fillRect(3, SCHOOL_TILE - 8, SCHOOL_TILE - 6, 5);
        // Door
        g.fillStyle(0x000000, 0.5);
        g.fillRect(SCHOOL_TILE / 2 - 6, SCHOOL_TILE - 10, 12, 10);
      });
    });
  }

  drawMap() {
    this.wallLayer = this.physics.add.staticGroup();
    for (let y = 0; y < SCHOOL_ROWS; y++) {
      for (let x = 0; x < SCHOOL_COLS; x++) {
        const tile = SCHOOL_MAP[y][x];
        const px = x * SCHOOL_TILE + SCHOOL_TILE / 2;
        const py = y * SCHOOL_TILE + SCHOOL_TILE / 2;
        if (tile === 1) {
          this.wallLayer.create(px, py, 'sch_wall');
        } else {
          this.add.image(px, py, 'sch_floor');
        }
      }
    }
  }

  createPlayer() {
    const spawnX = 7 * SCHOOL_TILE + SCHOOL_TILE / 2;
    const spawnY = 6 * SCHOOL_TILE + SCHOOL_TILE / 2;
    this.player = this.physics.add.sprite(spawnX, spawnY, 'sch_player');
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

    SCHOOL_ROOMS.forEach(room => {
      const px = room.tileX * SCHOOL_TILE + SCHOOL_TILE / 2;
      const py = room.tileY * SCHOOL_TILE + SCHOOL_TILE / 2;

      const marker = this.add.image(px, py, 'room_' + room.roomId);
      this.tweens.add({ targets: marker, alpha: 0.75, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      this.add.text(px, py - SCHOOL_TILE * 0.7, room.icon + ' ' + room.label, {
        fontSize: '10px', color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5);

      const zone = this.add.zone(px, py, SCHOOL_TILE * 1.4, SCHOOL_TILE * 1.4);
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

    // Tap on room marker to enter (mobile)
    this.input.on('pointerdown', pointer => {
      if (zqState.active) return;
      SCHOOL_ROOMS.forEach(room => {
        const px = room.tileX * SCHOOL_TILE + SCHOOL_TILE / 2;
        const py = room.tileY * SCHOOL_TILE + SCHOOL_TILE / 2;
        if (Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, px, py) < SCHOOL_TILE * 0.8) {
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

    // E key to enter nearby room
    if (this.nearRoom && Phaser.Input.Keyboard.JustDown(this.eKey)) {
      startZoneQuiz(this.nearRoom);
    }

    // Check if still near a room
    let nearAny = false;
    this.roomZones.forEach(zone => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y) < SCHOOL_TILE * 1.1) {
        nearAny = true;
      }
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
    const NEAR_DIST = SCHOOL_TILE * 2.2;
    if (this.roomBtns) {
      this.roomBtns.forEach(({ btn, room, px, py }) => {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, px, py);
        if (dist < NEAR_DIST) {
          const { sx, sy } = this._worldToScreen(px, py);
          btn.style.left = sx + 'px';
          btn.style.top = (sy - SCHOOL_TILE * 0.6) + 'px';
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
const schoolGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: SCHOOL_COLS * SCHOOL_TILE,
  height: SCHOOL_ROWS * SCHOOL_TILE,
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [SchoolScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  backgroundColor: '#1A1A2E'
});