// ============================================================
// ALGEBRA MAIN - Placeholder for Phase 3
// AlgebraScene will be moved here from index.html
// ============================================================

class AlgebraPlaceholderScene extends Phaser.Scene {
  constructor() { super({ key: 'AlgebraPlaceholder' }); }

  create() {
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
    
    // Title
    this.add.text(400, 250, '📐 代數大陸', {
      fontSize: '32px',
      color: '#FAAD14',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Subtitle
    this.add.text(400, 300, '即將開放 (Phase 3)', {
      fontSize: '16px',
      color: '#888'
    }).setOrigin(0.5);
    
    // Description
    this.add.text(400, 340, '側卷軸平台遊戲，樓梯與平台', {
      fontSize: '14px',
      color: '#aaa'
    }).setOrigin(0.5);
    
    // Back button
    const btn = this.add.text(400, 400, '🏠 返回大廳', {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#FAAD14',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      window.location.href = '../hub/index.html';
    });
    btn.on('pointerover', () => btn.setAlpha(0.8));
    btn.on('pointerout', () => btn.setAlpha(1));
    
    // Update HTML elements
    document.getElementById('zone-label').textContent = '📐 代數大陸 (Phase 3)';
    document.getElementById('back-btn').style.display = 'block';
    document.getElementById('loading-text').style.display = 'none';
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
  width: 768,
  height: 576,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [AlgebraPlaceholderScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  backgroundColor: '#1A1A2E'
});