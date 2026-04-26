// ============================================================
// HUB MAIN - MapHubScene with walking player
// ============================================================

const HUB_TILE = 48;
const HUB_COLS = 16;
const HUB_ROWS = 12;

// Hub map layout (0=floor, 1=wall, 2=school entrance, 3=algebra entrance, 9=player spawn)
const HUB_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,2,0,0,0,0,0,0,0,0,3,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,9,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Zone definitions (tile position -> target URL + label)
const ZONES = [
  { tileX: 3, tileY: 3, label: '🏫 學校', href: 'school/index.html', color: 0x4A90D9 },
  { tileX: 12, tileY: 3, label: '📐 代數大陸', href: 'algebra/index.html', color: 0xFAAD14 },
];

class MapHubScene extends Phaser.Scene {
  constructor() { super({ key: 'MapHub' }); }

  create() {
    // Center camera
    this.cameras.main.setViewport(0, 0, HUB_COLS * HUB_TILE, HUB_ROWS * HUB_TILE);
    
    this.createTextures();
    this.drawMap();
    this.createPlayer();
    this.createZoneMarkers();
    this.setupControls();
    
    // Camera follow player
    this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
    this.cameras.main.setBounds(0, 0, HUB_COLS * HUB_TILE, HUB_ROWS * HUB_TILE);
    
    // Update zone label
    const zlEl = document.getElementById('zone-label');
    if (zlEl) zlEl.textContent = '🗺️ 冒險大廳';
    const bbEl = document.getElementById('back-btn');
    if (bbEl) bbEl.style.display = 'none';
    
    // Init HUD
    updateHUD();
    loadState();
  }

  createTextures() {
    const mk = (key, w, h, draw) => {
      const g = this.make.graphics({ add: false });
      draw(g);
      g.generateTexture(key, w, h);
      g.destroy();
    };
    
    // Floor tile - warm beige
    mk('hub_floor', HUB_TILE, HUB_TILE, g => {
      g.fillStyle(0x3D5A80);
      g.fillRect(0, 0, HUB_TILE, HUB_TILE);
      g.fillStyle(0x4A6FA5);
      g.fillRect(1, 1, HUB_TILE - 2, 2);
      g.fillStyle(0x2D4A6B);
      g.fillRect(1, 1, 2, HUB_TILE - 2);
    });
    
    // Wall tile
    mk('hub_wall', HUB_TILE, HUB_TILE, g => {
      g.fillStyle(0x2D3A4A);
      g.fillRect(0, 0, HUB_TILE, HUB_TILE);
      g.fillStyle(0x3D4A5A);
      g.fillRect(2, 2, HUB_TILE - 4, HUB_TILE - 4);
      g.fillStyle(0x1D2A3A);
      g.fillRect(4, 4, HUB_TILE - 8, HUB_TILE - 8);
    });
    
    // Zone marker (school - blue)
    mk('zone_school', HUB_TILE, HUB_TILE, g => {
      g.fillStyle(0x4A90D9);
      g.fillRect(0, 0, HUB_TILE, HUB_TILE);
      g.fillStyle(0x6BA3E0);
      g.fillRect(4, 4, HUB_TILE - 8, 4);
      g.fillStyle(0x3A80C9);
      g.fillRect(4, HUB_TILE - 8, HUB_TILE - 8, 4);
    });
    
    // Zone marker (algebra - yellow)
    mk('zone_algebra', HUB_TILE, HUB_TILE, g => {
      g.fillStyle(0xFAAD14);
      g.fillRect(0, 0, HUB_TILE, HUB_TILE);
      g.fillStyle(0xFBBF24);
      g.fillRect(4, 4, HUB_TILE - 8, 4);
      g.fillStyle(0xD99B04);
      g.fillRect(4, HUB_TILE - 8, HUB_TILE - 8, 4);
    });
    
    // Player sprite (top-down view)
    mk('player_hub', 24, 24, g => {
      // Body
      g.fillStyle(0x87CEEB);
      g.fillRect(8, 6, 8, 10);
      // Head
      g.fillStyle(0xFFD4A8);
      g.fillRect(9, 2, 6, 6);
      // Hair
      g.fillStyle(0x4A3728);
      g.fillRect(9, 2, 6, 2);
      // Eyes
      g.fillStyle(0x333333);
      g.fillRect(10, 4, 1, 1);
      g.fillRect(13, 4, 1, 1);
      // Legs
      g.fillStyle(0x3D5A80);
      g.fillRect(9, 16, 3, 4);
      g.fillRect(13, 16, 3, 4);
    });
  }

  drawMap() {
    this.floorLayer = this.add.group();
    this.wallLayer = this.physics.add.staticGroup();
    
    for (let y = 0; y < HUB_ROWS; y++) {
      for (let x = 0; x < HUB_COLS; x++) {
        const tile = HUB_MAP[y][x];
        const px = x * HUB_TILE + HUB_TILE / 2;
        const py = y * HUB_TILE + HUB_TILE / 2;
        
        if (tile === 1) {
          this.wallLayer.create(px, py, 'hub_wall');
        } else {
          const floor = this.add.sprite(px, py, 'hub_floor');
          this.floorLayer.add(floor);
        }
      }
    }
  }

  createPlayer() {
    // Find spawn point
    let spawnX = 8 * HUB_TILE + HUB_TILE / 2;
    let spawnY = 8 * HUB_TILE + HUB_TILE / 2;
    
    for (let y = 0; y < HUB_ROWS; y++) {
      for (let x = 0; x < HUB_COLS; x++) {
        if (HUB_MAP[y][x] === 9) {
          spawnX = x * HUB_TILE + HUB_TILE / 2;
          spawnY = y * HUB_TILE + HUB_TILE / 2;
        }
      }
    }
    
    this.player = this.physics.add.sprite(spawnX, spawnY, 'player_hub');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 20);
    this.player.body.setOffset(2, 2);
    
    // Collide with walls
    this.physics.add.collider(this.player, this.wallLayer);
  }

  createZoneMarkers() {
    this.zoneLabels = [];
    
    ZONES.forEach((zone, i) => {
      const px = zone.tileX * HUB_TILE + HUB_TILE / 2;
      const py = zone.tileY * HUB_TILE + HUB_TILE / 2;
      
      // Zone marker sprite
      const textureKey = zone.tileX === 3 ? 'zone_school' : 'zone_algebra';
      const marker = this.add.sprite(px, py, textureKey);
      
      // Pulsing animation
      this.tweens.add({
        targets: marker,
        alpha: 0.7,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Zone label above marker
      const label = this.add.text(px, py - HUB_TILE, zone.label, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 8, y: 4 }
      });
      label.setOrigin(0.5);
      
      // Make marker a zone trigger
      const zoneCollider = this.add.zone(px, py, HUB_TILE, HUB_TILE);
      this.physics.world.enable(zoneCollider);
      zoneCollider.body.setAllowGravity(false);
      zoneCollider.body.setImmovable(true);
      zoneCollider.zoneData = zone;
      
      this.physics.add.overlap(this.player, zoneCollider, (player, zoneObj) => {
        this.enterZone(zoneObj.zoneData);
      });
    });
  }

  enterZone(zoneData) {
    // Prevent multiple triggers
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Visual feedback
    this.cameras.main.flash(200, 255, 255, 255);
    
    // Play sound
    sfxStep && sfxStep();
    
    // Navigate after brief delay
    this.time.delayedCall(200, () => {
      window.location.href = zoneData.href;
    });
  }

  setupControls() {
    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    
    // Debug: Press 1/2/3 to teleport to zones
    this.input.keyboard.on('keydown-ONE', () => window.location.href = 'school/index.html');
    this.input.keyboard.on('keydown-TWO', () => window.location.href = 'algebra/index.html');
    this.input.keyboard.on('keydown-THREE', () => window.location.href = 'geometry/index.html');
    
    // Debug: Press T to log player position
    this.input.keyboard.on('keydown-T', () => {
      console.log('Player position:', this.player.x, this.player.y);
    });
    
    // Joystick
    this.joystick = { x: 0, y: 0 };
    this.setupJoystick();
  }

  setupJoystick() {
    const zone = document.getElementById('joystick-zone');
    const knob = document.getElementById('joystick-knob');
    if (!zone || !knob) return;
    
    let drag = false;
    const RADIUS = 40;
    
    const handle = (e) => {
      const t = e.touches ? e.touches[0] : e;
      const rect = zone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      const dx = t.clientX - cx;
      const dy = t.clientY - cy;
      const dist = Math.min(RADIUS, Math.sqrt(dx * dx + dy * dy));
      const ang = Math.atan2(dy, dx);
      
      this.joystick.x = Math.cos(ang) * dist / RADIUS;
      this.joystick.y = Math.sin(ang) * dist / RADIUS;
      
      knob.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px)`;
    };
    
    const start = (e) => {
      const t = e.touches ? e.touches[0] : e;
      if (t.clientX > window.innerWidth / 2) return;
      e.preventDefault();
      drag = true;
      
      const bx = Math.min(t.clientX, window.innerWidth * 0.45);
      const by = Math.max(t.clientY, 100);
      zone.style.display = 'flex';
      zone.style.left = (bx - RADIUS - 10) + 'px';
      zone.style.top = (by - RADIUS - 10) + 'px';
      handle(e);
    };
    
    document.addEventListener('mousedown', e => {
      if (e.target.closest('#joystick-zone') || e.clientX < window.innerWidth / 2) start(e);
    });
    document.addEventListener('mousemove', e => { if (drag) handle(e); });
    document.addEventListener('mouseup', () => {
      if (drag) {
        drag = false;
        this.joystick = { x: 0, y: 0 };
        knob.style.transform = 'translate(0,0)';
      }
    });
    document.addEventListener('touchstart', e => start(e), { passive: false });
    document.addEventListener('touchmove', e => { if (drag) handle(e); }, { passive: false });
    document.addEventListener('touchend', () => {
      if (drag) {
        drag = false;
        this.joystick = { x: 0, y: 0 };
        knob.style.transform = 'translate(0,0)';
      }
    });
  }

  update() {
    const speed = 150;
    let vx = 0;
    let vy = 0;
    
    // Keyboard input
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -1;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1;
    
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -1;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 1;
    
    // Joystick input (overrides keyboard if active)
    if (Math.abs(this.joystick.x) > 0.1 || Math.abs(this.joystick.y) > 0.1) {
      vx = this.joystick.x;
      vy = this.joystick.y;
    }
    
    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      const len = Math.sqrt(vx * vx + vy * vy);
      vx /= len;
      vy /= len;
    }
    
    this.player.setVelocity(vx * speed, vy * speed);
    
    // Update player direction
    if (vx < 0) this.player.setFlipX(true);
    else if (vx > 0) this.player.setFlipX(false);
    
    // Walking animation
    if (vx !== 0 || vy !== 0) {
      this.player.setAlpha(0.8 + Math.sin(this.time.now / 100) * 0.2);
    } else {
      this.player.setAlpha(1);
    }
  }
}

// ============================================================
// GAME INIT
// ============================================================
const hubGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: HUB_COLS * HUB_TILE,
  height: HUB_ROWS * HUB_TILE,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [MapHubScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  backgroundColor: '#1A1A2E'
});

// Global functions for HTML
function returnToHub() {
  // Hub doesn't need to go back anywhere
  console.log('Already at hub');
}