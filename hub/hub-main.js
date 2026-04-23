// ============================================================
// MAP HUB SCENE - Hub Map with Walking Player and Zone Navigation
// ============================================================
class MapHubScene extends Phaser.Scene {
  constructor() { super({ key: 'MapHub' }); }

  preload() {
    this.createTextures();
  }

  create() {
    const WORLD_W = 800, WORLD_H = 480;

    // Ground background
    this.add.rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, 0x1a1a2e);

    // Title
    this.add.text(WORLD_W / 2, 30, '🗺️ 中央樞紐', {
      fontSize: '28px', fontFamily: 'Segoe UI', color: '#FAAD14', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Ground plane (simple colored rectangle)
    this.add.rectangle(WORLD_W / 2, WORLD_H / 2 + 30, WORLD_W, WORLD_H - 80, 0x2d4a3a);

    // Create zone markers
    this.createZones();

    // Create player
    this.createPlayer();

    // WASD / Arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Physics world bounds
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
  }

  createTextures() {
    // Player texture (small colored square with face indicator)
    const playerG = this.make.graphics({ x: 0, y: 0, add: false });
    playerG.fillStyle(0x4A90D9, 1);
    playerG.fillRoundedRect(0, 0, 32, 32, 6);
    playerG.fillStyle(0xffffff, 1);
    playerG.fillCircle(16, 12, 5);
    playerG.fillStyle(0x1a1a2e, 1);
    playerG.fillCircle(16, 12, 2);
    playerG.generateTexture('player', 32, 32);
    playerG.destroy();

    // Zone marker textures
    const colors = [0x4A90D9, 0x52C41A, 0xFAAD14, 0x722ED1];
    colors.forEach((c, i) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(c, 0.8);
      g.fillRoundedRect(0, 0, 80, 60, 8);
      g.lineStyle(2, 0xffffff, 0.6);
      g.strokeRoundedRect(2, 2, 76, 56, 6);
      g.generateTexture('zone_' + i, 80, 60);
      g.destroy();
    });
  }

  createZones() {
    const zones = [
      { key: 'school',   x: 400, y: 200, color: 0x4A90D9, label: '🏫 學校',    target: 'school/index.html' },
      { key: 'algebra', x: 200, y: 350, color: 0x52C41A, label: '📐 代數',    target: 'algebra/index.html' },
      { key: 'geometry',x: 600, y: 350, color: 0xFAAD14, label: '📐 幾何',    target: 'geometry/index.html' },
    ];

    zones.forEach((zone, i) => {
      // Zone rectangle
      const rect = this.add.rectangle(zone.x, zone.y, 100, 70, zone.color, 0.85);
      rect.setStrokeStyle(3, 0xffffff, 0.7);
      rect.setInteractive({ useHandCursor: true });

      // Zone label
      const label = this.add.text(zone.x, zone.y, zone.label, {
        fontSize: '14px', fontFamily: 'Segoe UI', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);

      // Zone icon above
      const icon = this.add.text(zone.x, zone.y - 55, zone.label.split(' ')[0], {
        fontSize: '24px'
      }).setOrigin(0.5);

      // Hover effect
      rect.on('pointerover', () => {
        rect.setStrokeStyle(4, 0xffffff, 1);
      });
      rect.on('pointerout', () => {
        rect.setStrokeStyle(3, 0xffffff, 0.7);
      });

      // Zone touch → navigate
      rect.on('pointerdown', () => {
        window.location.href = zone.target;
      });

      // Arrow indicator pointing to zone
      const arrow = this.add.text(zone.x, zone.y + 45, '▼', {
        fontSize: '10px', color: '#ffffff', alpha: 0.5
      }).setOrigin(0.5);

      // Click instruction
      const hint = this.add.text(zone.x, zone.y + 58, '點擊進入', {
        fontSize: '9px', fontFamily: 'Segoe UI', color: '#aaaaaa'
      }).setOrigin(0.5);
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 420, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.1);
    this.player.setDrag(200);
    this.player.setMaxVelocity(200);
  }

  update() {
    const speed = 180;
    const vel = this.player.body.velocity;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }
  }
}
