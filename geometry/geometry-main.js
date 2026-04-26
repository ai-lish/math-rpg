// ============================================================
// GEOMETRY MAIN - GeometryScene with 5 geometry topic rooms
// ============================================================

const GEO_TILE = 48;
const GEO_COLS = 16;
const GEO_ROWS = 12;

const GEO_MAP = [
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

// 5 geometry-related topic rooms
const GEO_ROOMS = [
  { tileX:3,  tileY:3, topic:'幾何', icon:'📐', color:0x52C41A, roomId:'geo',   label:'幾何室' },
  { tileX:8,  tileY:3, topic:'面積', icon:'⬜', color:0x2DB7F5, roomId:'area',  label:'面積室' },
  { tileX:13, tileY:3, topic:'坐標', icon:'📍', color:0xFF85C0, roomId:'coord', label:'坐標室' },
  { tileX:5,  tileY:8, topic:'概率', icon:'🎲', color:0xF5222D, roomId:'prob',  label:'概率室' },
  { tileX:11, tileY:8, topic:'統計', icon:'📊', color:0x722ED1, roomId:'stat',  label:'統計室' },
];

class GeometryScene extends Phaser.Scene {
  constructor() { super({ key: 'Geometry' }); }

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
    this.cameras.main.setBounds(0, 0, GEO_COLS * GEO_TILE, GEO_ROWS * GEO_TILE);

    const zlEl = document.getElementById('zone-label');
    if (zlEl) zlEl.textContent = '📐 幾何世界 — 5個幾何室';
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

    mk('geo_floor', GEO_TILE, GEO_TILE, g => {
      g.fillStyle(0x1A3020);
      g.fillRect(0, 0, GEO_TILE, GEO_TILE);
      g.fillStyle(0x254030);
      g.fillRect(1, 1, GEO_TILE - 2, 2);
      g.fillStyle(0x102015);
      g.fillRect(1, 1, 2, GEO_TILE - 2);
    });

    mk('geo_wall', GEO_TILE, GEO_TILE, g => {
      g.fillStyle(0x0E1E10);
      g.fillRect(0, 0, GEO_TILE, GEO_TILE);
      g.fillStyle(0x1A2E18);
      g.fillRect(2, 2, GEO_TILE - 4, GEO_TILE - 4);
      g.fillStyle(0x081008);
      g.fillRect(4, 4, GEO_TILE - 8, GEO_TILE - 8);
    });

    mk('geo_player', 24, 24, g => {
      g.fillStyle(0x52C41A);
      g.fillRect(8, 6, 8, 10);
      g.fillStyle(0xFFD4A8);
      g.fillRect(9, 2, 6, 6);
      g.fillStyle(0x2D6B06);
      g.fillRect(9, 2, 6, 2);
      g.fillStyle(0x333333);
      g.fillRect(10, 4, 1, 1);
      g.fillRect(13, 4, 1, 1);
      g.fillStyle(0x1A4A0A);
      g.fillRect(9, 16, 3, 4);
      g.fillRect(13, 16, 3, 4);
    });

    GEO_ROOMS.forEach(room => {
      mk('georoom_' + room.roomId, GEO_TILE, GEO_TILE, g => {
        g.fillStyle(room.color);
        g.fillRect(0, 0, GEO_TILE, GEO_TILE);
        g.fillStyle(0xFFFFFF, 0.25);
        g.fillRect(3, 3, GEO_TILE - 6, 5);
        g.fillStyle(0x000000, 0.25);
        g.fillRect(3, GEO_TILE - 8, GEO_TILE - 6, 5);
        g.fillStyle(0x000000, 0.5);
        g.fillRect(GEO_TILE / 2 - 6, GEO_TILE - 10, 12, 10);
      });
    });
  }

  drawMap() {
    this.wallLayer = this.physics.add.staticGroup();
    for (let y = 0; y < GEO_ROWS; y++) {
      for (let x = 0; x < GEO_COLS; x++) {
        const tile = GEO_MAP[y][x];
        const px = x * GEO_TILE + GEO_TILE / 2;
        const py = y * GEO_TILE + GEO_TILE / 2;
        if (tile === 1) {
          this.wallLayer.create(px, py, 'geo_wall');
        } else {
          this.add.image(px, py, 'geo_floor');
        }
      }
    }
  }

  createPlayer() {
    const spawnX = 7 * GEO_TILE + GEO_TILE / 2;
    const spawnY = 6 * GEO_TILE + GEO_TILE / 2;
    this.player = this.physics.add.sprite(spawnX, spawnY, 'geo_player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 20);
    this.player.body.setOffset(2, 2);
    this.physics.add.collider(this.player, this.wallLayer);
  }

  createRoomMarkers() {
    this.roomZones = [];
    GEO_ROOMS.forEach(room => {
      const px = room.tileX * GEO_TILE + GEO_TILE / 2;
      const py = room.tileY * GEO_TILE + GEO_TILE / 2;

      const marker = this.add.image(px, py, 'georoom_' + room.roomId);
      this.tweens.add({ targets: marker, alpha: 0.75, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      this.add.text(px, py - GEO_TILE * 0.7, room.icon + ' ' + room.label, {
        fontSize: '10px', color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5);

      const zone = this.add.zone(px, py, GEO_TILE * 1.4, GEO_TILE * 1.4);
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
      GEO_ROOMS.forEach(room => {
        const px = room.tileX * GEO_TILE + GEO_TILE / 2;
        const py = room.tileY * GEO_TILE + GEO_TILE / 2;
        if (Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, px, py) < GEO_TILE * 0.8) {
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
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y) < GEO_TILE * 1.1) nearAny = true;
    });
    if (!nearAny) {
      this.nearRoom = null;
      if (this.hintText) { this.hintText.destroy(); this.hintText = null; }
    } else if (this.hintText) {
      this.hintText.setPosition(this.player.x, this.player.y - 40);
    }

    if ((vx !== 0 || vy !== 0) && Math.random() < 0.015) sfxStep && sfxStep();
    this.player.setAlpha((vx !== 0 || vy !== 0) ? (0.8 + Math.sin(this.time.now / 100) * 0.2) : 1);
  }
}

function returnToHub() {
  window.location.href = '../hub/index.html';
}

// ============================================================
// GAME INIT
// ============================================================
const geometryGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GEO_COLS * GEO_TILE,
  height: GEO_ROWS * GEO_TILE,
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [GeometryScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  backgroundColor: '#1A1A2E'
});