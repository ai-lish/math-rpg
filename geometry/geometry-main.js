// ============================================================
// GEOMETRY MAIN - Placeholder for Phase 4
// Future geometry zone
// ============================================================

class GeometryPlaceholderScene extends Phaser.Scene {
  constructor() { super({ key: 'GeometryPlaceholder' }); }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
    
    this.add.text(400, 250, '📐 幾何世界', {
      fontSize: '32px',
      color: '#52C41A',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 300, '即將開放 (Phase 4)', {
      fontSize: '16px',
      color: '#888'
    }).setOrigin(0.5);
    
    const btn = this.add.text(400, 360, '🏠 返回大廳', {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#52C41A',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => window.location.href = '../hub/index.html');
    
    document.getElementById('zone-label').textContent = '📐 幾何世界 (Phase 4)';
    document.getElementById('back-btn').style.display = 'block';
  }
}

function returnToHub() {
  window.location.href = '../hub/index.html';
}

const geometryGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 768,
  height: 576,
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
  scene: [GeometryPlaceholderScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  backgroundColor: '#1A1A2E'
});