// ============================================================
// SCHOOL MAIN - LSC 學校 (Classroom / Staff Room / Library)
// ============================================================

const SCHOOL_TILE = 48;
const SCHOOL_COLS = 16;
const SCHOOL_ROWS = 12;

// Map legend: 0=floor, 1=wall
// Layout:
//   Rows 1-4   : 教室 (Classroom) — 3 student NPCs + whiteboard
//   Row 5      : internal wall with two door gaps (cols 5-6 and 10-11)
//   Row 6      : hallway (player spawns here)
//   Row 7      : internal wall with two door gaps (cols 2-3 and 12-13)
//   Rows 8-10  : 教員室 (Staff Room, cols 1-5) | divider (cols 6-7) | 圖書館 (Library, cols 8-14)
const SCHOOL_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // 0 - top wall
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 1 - classroom
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 2 - classroom (NPCs here)
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 3 - classroom
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 4 - classroom
  [1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1],  // 5 - classroom south wall (doors at 5-6 and 10-11)
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 6 - hallway
  [1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1],  // 7 - hallway south wall (doors at 2-3 and 12-13)
  [1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1],  // 8 - staff room | divider | library
  [1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1],  // 9
  [1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1],  // 10
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // 11 - bottom wall
];

// ── Dark Equations: common mistakes shown when a student is polluted ──────────
const DARK_EQUATIONS = {
  '代數': [
    { wrong: '1/2 + 1/3 = 2/5', correct: '5/6' },
    { wrong: 'x + 3 = 7 → x = 7 + 3', correct: 'x = 4' },
    { wrong: '(-2) × (-3) = -6', correct: '6' },
    { wrong: 'x² + x² = x⁴', correct: '2x²' },
  ],
  '幾何': [
    { wrong: '面積 = 長 + 寬', correct: '長 × 寬' },
    { wrong: '周長 = 長 × 寬', correct: '2(長+寬)' },
    { wrong: '三角形面積 = 底 × 高', correct: '底 × 高 ÷ 2' },
  ],
  '統計': [
    { wrong: '平均 = 最大值 + 最小值 ÷ 2', correct: '所有值之和 ÷ 個數' },
    { wrong: '4/8 = 2/5', correct: '1/2' },
    { wrong: 'P(A) = 有利次數 + 總次數', correct: '有利次數 ÷ 總次數' },
  ],
};

// ── Hints available from the teacher ─────────────────────────────────────────
const TEACHER_HINTS = {
  '代數': [
    '代入法：把已知數值代入代數式直接計算。',
    '化簡同類項：只合并係數，字母部分不變。例如 3x + 5x = 8x。',
    '解方程：等號兩邊做相同運算，保持天平平衡。',
    '移項時，符號要反轉：x + 3 = 7 → x = 7 − 3。',
    '乘方：同底數相乘，指數相加。例如 x³ × x² = x⁵。',
  ],
  '幾何': [
    '三角形內角和 = 180°。',
    '長方形面積 = 長 × 寬；周長 = 2(長 + 寬)。',
    '三角形面積 = 底 × 高 ÷ 2。',
    '勾股定理：直角三角形中，斜邊² = 兩直角邊²之和。',
    '圓面積 = πr²；圓周長 = 2πr。',
  ],
  '統計': [
    '平均數 = 所有數值之和 ÷ 數值個數。',
    '中位數：把數據由小至大排序，取中間值。',
    '眾數：出現次數最多的值。',
    '概率 = 有利結果數 ÷ 總結果數，結果在 0 至 1 之間。',
    '百分率：把分數乘以 100% 即可轉化。',
  ],
};

// ── Library topics (players can self-study these) ─────────────────────────────
const LIBRARY_TOPICS = [
  { topic: '代數', icon: '🔢', color: '#4A90D9' },
  { topic: '幾何', icon: '📐', color: '#52C41A' },
  { topic: '統計', icon: '📊', color: '#722ED1' },
  { topic: '概率', icon: '🎲', color: '#F5222D' },
  { topic: '函數', icon: '📈', color: '#13C2C2' },
  { topic: '方程', icon: '⚖️',  color: '#FA8C16' },
  { topic: '面積', icon: '⬜', color: '#2DB7F5' },
  { topic: '坐標', icon: '📍', color: '#FF85C0' },
  { topic: '比率', icon: '🔀', color: '#1890FF' },
  { topic: '數列', icon: '🔢', color: '#FFD700' },
  { topic: '百分率', icon: '📉', color: '#2ECC71' },
  { topic: '近似值', icon: '📏', color: '#9B59B6' },
];

// ── Grade → Topics mapping (which topics are available for each grade) ─────────
// Note: Topics must exist in LIBRARY_TOPICS
const GRADE_TOPICS = {
  '中一': ['代數', '面積', '方程', '比率', '百分率', '坐標', '統計', '近似值'],
  '中二': ['代數', '幾何', '方程'],
  '中三': ['幾何', '統計', '概率', '函數'],
};

// Map grade to a display color
const GRADE_COLORS = {
  '中一': '#52C41A',  // green
  '中二': '#4A90D9',  // blue
  '中三': '#722ED1',  // purple
};

// ── NPC / Zone definitions ────────────────────────────────────────────────────
const SCHOOL_ZONES = [
  // Classroom student NPCs → Grade classrooms (中一/中二/中三)
  { tileX: 3,  tileY: 2, type: 'grade', grade: '中一', icon: '🏫', color: 0x52C41A, roomId: 'grade_s1', label: '中一班房' },
  { tileX: 8,  tileY: 2, type: 'grade', grade: '中二', icon: '🏫', color: 0x4A90D9, roomId: 'grade_s2', label: '中二班房' },
  { tileX: 13, tileY: 2, type: 'grade', grade: '中三', icon: '🏫', color: 0x722ED1, roomId: 'grade_s3', label: '中三班房' },
  // Whiteboard challenge (classroom top-center)
  { tileX: 8,  tileY: 1, type: 'whiteboard', topic: null, diffMin: 2, icon: '📋', color: 0xFFD700, roomId: 'whiteboard', label: '白板挑戰' },
  // Staff Room teacher
  { tileX: 3,  tileY: 9, type: 'teacher', topic: null, icon: '👨‍🏫', color: 0xFA8C16, roomId: 'teacher', label: '老師 (提示)' },
  // Library
  { tileX: 11, tileY: 9, type: 'library', topic: null, icon: '📚', color: 0x2DB7F5, roomId: 'library', label: '圖書館 (自學)' },
];

// ── NPC pollution state (session-only) — kept for future whiteboard/puzzle use
const npcPollution = {};

// ============================================================
// SchoolScene
// ============================================================
class SchoolScene extends Phaser.Scene {
  constructor() { super({ key: 'School' }); }

  create() {
    this.nearZone = null;
    this.hintText = null;
    this.joystick = { x: 0, y: 0 };
    this.npcSprites = {};  // roomId → { marker, labelText, darkAura, darkText }

    this.createTextures();
    this.drawMap();
    this.createPlayer();
    this.createZoneMarkers();
    this.setupControls();

    this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
    this.cameras.main.setBounds(0, 0, SCHOOL_COLS * SCHOOL_TILE, SCHOOL_ROWS * SCHOOL_TILE);

    const zlEl = document.getElementById('zone-label');
    if (zlEl) zlEl.textContent = '🏫 LSC 學校';
    const bbEl = document.getElementById('back-btn');
    if (bbEl) bbEl.style.display = 'block';
    const ltEl = document.getElementById('loading-text');
    if (ltEl) ltEl.style.display = 'none';

    loadState();
    updateHUD();
  }

  // ── Texture creation ──────────────────────────────────────
  createTextures() {
    const mk = (key, w, h, draw) => {
      const g = this.make.graphics({ add: false });
      draw(g);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    // Floor tile — classroom area (lighter blue-grey)
    mk('sch_floor_cls', SCHOOL_TILE, SCHOOL_TILE, g => {
      g.fillStyle(0x2A3550); g.fillRect(0, 0, SCHOOL_TILE, SCHOOL_TILE);
      g.fillStyle(0x354060); g.fillRect(1, 1, SCHOOL_TILE - 2, 2);
      g.fillStyle(0x1E2840); g.fillRect(1, 1, 2, SCHOOL_TILE - 2);
    });

    // Floor tile — hallway / staff / library (darker)
    mk('sch_floor', SCHOOL_TILE, SCHOOL_TILE, g => {
      g.fillStyle(0x1E2A3A); g.fillRect(0, 0, SCHOOL_TILE, SCHOOL_TILE);
      g.fillStyle(0x28374A); g.fillRect(1, 1, SCHOOL_TILE - 2, 2);
      g.fillStyle(0x162030); g.fillRect(1, 1, 2, SCHOOL_TILE - 2);
    });

    // Wall tile
    mk('sch_wall', SCHOOL_TILE, SCHOOL_TILE, g => {
      g.fillStyle(0x1A2535); g.fillRect(0, 0, SCHOOL_TILE, SCHOOL_TILE);
      g.fillStyle(0x253045); g.fillRect(2, 2, SCHOOL_TILE - 4, SCHOOL_TILE - 4);
      g.fillStyle(0x0E1520); g.fillRect(4, 4, SCHOOL_TILE - 8, SCHOOL_TILE - 8);
    });

    // Player sprite
    mk('sch_player', 24, 24, g => {
      g.fillStyle(0x87CEEB); g.fillRect(8, 6, 8, 10);
      g.fillStyle(0xFFD4A8); g.fillRect(9, 2, 6, 6);
      g.fillStyle(0x4A3728); g.fillRect(9, 2, 6, 2);
      g.fillStyle(0x333333); g.fillRect(10, 4, 1, 1); g.fillRect(13, 4, 1, 1);
      g.fillStyle(0x3D5A80); g.fillRect(9, 16, 3, 4); g.fillRect(13, 16, 3, 4);
    });

    // Zone marker textures
    SCHOOL_ZONES.forEach(z => {
      const key = 'zone_' + z.roomId;
      mk(key, SCHOOL_TILE, SCHOOL_TILE, g => {
        g.fillStyle(z.color);
        g.fillRect(0, 0, SCHOOL_TILE, SCHOOL_TILE);
        g.fillStyle(0xFFFFFF, 0.2);
        g.fillRect(3, 3, SCHOOL_TILE - 6, 5);
        g.fillStyle(0x000000, 0.2);
        g.fillRect(3, SCHOOL_TILE - 8, SCHOOL_TILE - 6, 5);
        // door notch
        g.fillStyle(0x000000, 0.4);
        g.fillRect(SCHOOL_TILE / 2 - 5, SCHOOL_TILE - 9, 10, 9);
      });

      // Polluted version (dark overlay)
      mk(key + '_dark', SCHOOL_TILE, SCHOOL_TILE, g => {
        g.fillStyle(0x2D0050);
        g.fillRect(0, 0, SCHOOL_TILE, SCHOOL_TILE);
        g.fillStyle(z.color, 0.3);
        g.fillRect(2, 2, SCHOOL_TILE - 4, SCHOOL_TILE - 4);
        g.fillStyle(0x9B59B6, 0.5);
        g.fillRect(3, 3, SCHOOL_TILE - 6, 5);
        g.fillRect(3, SCHOOL_TILE - 8, SCHOOL_TILE - 6, 5);
      });
    });
  }

  // ── Map drawing ───────────────────────────────────────────
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
          // Use classroom floor for rows 1-4, normal floor elsewhere
          const floorKey = (y >= 1 && y <= 4) ? 'sch_floor_cls' : 'sch_floor';
          this.add.image(px, py, floorKey);
        }
      }
    }
    // Area labels
    this.add.text(8 * SCHOOL_TILE, 0.5 * SCHOOL_TILE, '🏫 教室', {
      fontSize: '12px', color: '#aaddff', backgroundColor: 'rgba(0,0,0,0.5)', padding: { x: 6, y: 2 }
    }).setOrigin(0.5);
    this.add.text(3.5 * SCHOOL_TILE, 7.5 * SCHOOL_TILE, '👨‍🏫 教員室', {
      fontSize: '11px', color: '#ffa940', backgroundColor: 'rgba(0,0,0,0.5)', padding: { x: 4, y: 2 }
    }).setOrigin(0.5);
    this.add.text(11 * SCHOOL_TILE, 7.5 * SCHOOL_TILE, '📚 圖書館', {
      fontSize: '11px', color: '#40c4ff', backgroundColor: 'rgba(0,0,0,0.5)', padding: { x: 4, y: 2 }
    }).setOrigin(0.5);
  }

  // ── Player ────────────────────────────────────────────────
  createPlayer() {
    const spawnX = 7 * SCHOOL_TILE + SCHOOL_TILE / 2;
    const spawnY = 6 * SCHOOL_TILE + SCHOOL_TILE / 2;
    this.player = this.physics.add.sprite(spawnX, spawnY, 'sch_player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 20);
    this.player.body.setOffset(2, 2);
    this.physics.add.collider(this.player, this.wallLayer);
  }

  // ── Zone markers + interaction zones ─────────────────────
  createZoneMarkers() {
    this.zoneList = [];
    this.zoneBtns = [];

    this._worldToScreen = (wx, wy) => {
      const cam = this.cameras.main;
      const sx = (wx - cam.scrollX) * cam.zoom;
      const sy = (wy - cam.scrollY) * cam.zoom;
      const gc = document.getElementById('game-container');
      if (!gc) return { sx, sy };
      const rect = gc.getBoundingClientRect();
      return { sx: rect.left + sx, sy: rect.top + sy };
    };

    document.querySelectorAll('.zone-enter-btn').forEach(b => b.remove());

    SCHOOL_ZONES.forEach(zone => {
      const px = zone.tileX * SCHOOL_TILE + SCHOOL_TILE / 2;
      const py = zone.tileY * SCHOOL_TILE + SCHOOL_TILE / 2;

      const isStudent = zone.type === 'student';
      const polluted = isStudent && npcPollution[zone.roomId] && npcPollution[zone.roomId].count > 0;
      const texKey = 'zone_' + zone.roomId + (polluted ? '_dark' : '');

      const marker = this.add.image(px, py, texKey);
      this.tweens.add({ targets: marker, alpha: 0.75, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      const labelText = this.add.text(px, py - SCHOOL_TILE * 0.75, zone.icon + ' ' + zone.label, {
        fontSize: '10px', color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5);

      // Dark equation text (only for polluted students)
      let darkAura = null;
      let darkText = null;
      if (isStudent) {
        darkAura = this.add.graphics();
        darkText = this.add.text(px, py - SCHOOL_TILE * 1.4, '', {
          fontSize: '9px', color: '#cc44ff',
          backgroundColor: 'rgba(30,0,50,0.85)',
          padding: { x: 3, y: 2 },
          wordWrap: { width: 120 }
        }).setOrigin(0.5).setDepth(9);
        this._updateNPCVisual(zone, marker, darkAura, darkText, px, py);
        this.npcSprites[zone.roomId] = { marker, labelText, darkAura, darkText, px, py, zone };
      }

      const physZone = this.add.zone(px, py, SCHOOL_TILE * 1.4, SCHOOL_TILE * 1.4);
      this.physics.world.enable(physZone);
      physZone.body.setAllowGravity(false);
      physZone.body.setImmovable(true);
      physZone.zoneData = zone;

      this.physics.add.overlap(this.player, physZone, () => {
        if (!zqState.active && this.nearZone !== zone) {
          this.nearZone = zone;
          this.updateHint(zone);
        }
      });
      this.zoneList.push(physZone);

      // Mobile overlay button
      const gc = document.getElementById('game-container');
      if (gc) {
        const btn = document.createElement('button');
        btn.className = 'zone-enter-btn';
        btn.textContent = zone.icon + ' 點擊互動';
        btn.style.display = 'none';
        btn.style.position = 'absolute';
        btn.style.zIndex = '20';
        btn.style.pointerEvents = 'all';
        btn.style.transform = 'translate(-50%, -50%)';
        btn.style.whiteSpace = 'nowrap';
        const colorHex = '#' + zone.color.toString(16).padStart(6, '0');
        btn.style.background = colorHex + 'ee';
        btn.style.border = '2px solid #fff';
        btn.style.color = '#fff';
        btn.style.fontWeight = 'bold';
        btn.style.padding = '8px 14px';
        btn.style.borderRadius = '16px';
        btn.style.fontSize = '12px';
        btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        btn.onclick = () => this.interactWithZone(zone);
        gc.appendChild(btn);
        this.zoneBtns.push({ btn, zone, px, py });
      }
    });
  }

  // ── Update NPC visual based on pollution state ────────────
  _updateNPCVisual(zone, marker, darkAura, darkText, px, py) {
    const state = npcPollution[zone.roomId];
    if (!state) return;
    const polluted = state.count > 0;

    // Swap texture
    const texKey = 'zone_' + zone.roomId + (polluted ? '_dark' : '');
    marker.setTexture(texKey);

    // Draw/clear dark aura
    darkAura.clear();
    if (polluted) {
      darkAura.lineStyle(3, 0x9B59B6, 0.7);
      darkAura.strokeCircle(px, py, SCHOOL_TILE * 0.8);
      darkAura.lineStyle(2, 0x660099, 0.4);
      darkAura.strokeCircle(px, py, SCHOOL_TILE);
      // Show dark equation
      const eqs = DARK_EQUATIONS[zone.topic] || [];
      const eq = eqs[state.count % eqs.length];
      if (eq) {
        darkText.setText('❌ ' + eq.wrong + '\n✅ ' + eq.correct);
        darkText.setVisible(true);
      }
    } else {
      darkText.setVisible(false);
    }
  }

  // ── Refresh all NPC visuals (call after interaction) ─────
  refreshNPCVisuals() {
    Object.values(this.npcSprites).forEach(({ marker, darkAura, darkText, px, py, zone }) => {
      this._updateNPCVisual(zone, marker, darkAura, darkText, px, py);
    });
  }

  // ── Hint text near player ─────────────────────────────────
  updateHint(zone) {
    if (this.hintText) this.hintText.destroy();
    const labels = {
      grade: '按 E 進入班房',
      whiteboard: '按 E 挑戰白板',
      teacher: '按 E 向老師求助',
      library: '按 E 進入圖書館',
    };
    const msg = (labels[zone.type] || '按 E 互動') + (zone.grade ? ' ' + zone.grade : '');
    this.hintText = this.add.text(
      this.player.x, this.player.y - 40, msg,
      { fontSize: '11px', color: '#FAAD14', backgroundColor: 'rgba(0,0,0,0.8)', padding: { x: 5, y: 3 } }
    ).setOrigin(0.5).setDepth(10);
  }

  // ── Zone interaction dispatch ─────────────────────────────
  interactWithZone(zone) {
    switch (zone.type) {
      case 'grade':      showClassroomPanel(zone.grade); break;
      case 'whiteboard': this.startWhiteboardQuiz();           break;
      case 'teacher':    showHintPanel();                      break;
      case 'library':    showLibraryPanel();                   break;
    }
  }


  // ── Whiteboard quiz (high difficulty, rich credits) ────────
  startWhiteboardQuiz() {
    if (zqState.active) return;
    // Randomly pick one of the three main topics for variety
    const topics = ['代數', '幾何', '統計'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    startZoneQuiz({
      topic,
      diffMin: 2,
      icon: '📋',
      color: 0xFFD700,
      roomId: 'whiteboard',
      label: '白板挑戰',
      creditReward: 20,
    });
  }

  // ── Controls ──────────────────────────────────────────────
  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.eKey = this.input.keyboard.addKey('E');
    this.setupJoystick();

    this.input.on('pointerdown', pointer => {
      if (zqState.active) return;
      SCHOOL_ZONES.forEach(zone => {
        const px = zone.tileX * SCHOOL_TILE + SCHOOL_TILE / 2;
        const py = zone.tileY * SCHOOL_TILE + SCHOOL_TILE / 2;
        if (Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, px, py) < SCHOOL_TILE * 0.8) {
          this.interactWithZone(zone);
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

  // ── Update loop ───────────────────────────────────────────
  update() {
    if (zqState.active) { this.player.setVelocity(0, 0); return; }

    const speed = 150;
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown  || this.wasd.A.isDown) vx = -1;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx =  1;
    if (this.cursors.up.isDown    || this.wasd.W.isDown) vy = -1;
    else if (this.cursors.down.isDown  || this.wasd.S.isDown) vy =  1;

    if (Math.abs(this.joystick.x) > 0.1 || Math.abs(this.joystick.y) > 0.1) {
      vx = this.joystick.x; vy = this.joystick.y;
    }
    if (vx !== 0 && vy !== 0) { const l = Math.sqrt(vx * vx + vy * vy); vx /= l; vy /= l; }
    this.player.setVelocity(vx * speed, vy * speed);
    if (vx < 0) this.player.setFlipX(true);
    else if (vx > 0) this.player.setFlipX(false);

    // E key to interact
    if (this.nearZone && Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.interactWithZone(this.nearZone);
    }

    // Clear nearZone if player has moved away
    let nearAny = false;
    this.zoneList.forEach(z => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, z.x, z.y) < SCHOOL_TILE * 1.1) {
        nearAny = true;
      }
    });
    if (!nearAny) {
      this.nearZone = null;
      if (this.hintText) { this.hintText.destroy(); this.hintText = null; }
    } else if (this.hintText) {
      this.hintText.setPosition(this.player.x, this.player.y - 40);
    }

    if ((vx !== 0 || vy !== 0) && Math.random() < 0.015) sfxStep && sfxStep();
    this.player.setAlpha((vx !== 0 || vy !== 0) ? (0.8 + Math.sin(this.time.now / 100) * 0.2) : 1);

    // Mobile zone button overlay
    const NEAR_DIST = SCHOOL_TILE * 2.2;
    if (this.zoneBtns) {
      this.zoneBtns.forEach(({ btn, zone, px, py }) => {
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

// ============================================================
// CLASSROOM PANEL (Grade-based topic selection — standalone)
// ============================================================
function showClassroomPanel(grade) {
  const panel = document.getElementById('classroom-panel');
  if (!panel) return;
  const titleEl = document.getElementById('classroom-grade-title');
  if (titleEl) titleEl.textContent = '🏫 ' + grade + ' 班房 — 課題選擇';
  const listEl = document.getElementById('classroom-topic-list');
  if (listEl) {
    const topicsForGrade = GRADE_TOPICS[grade] || [];
    listEl.innerHTML = topicsForGrade.map(topicName => {
      const topicData = LIBRARY_TOPICS.find(t => t.topic === topicName);
      if (!topicData) return '';
      return `<button class="panel-btn" onclick="startClassroomQuiz('${grade}','${topicName}')" style="justify-content:flex-start;gap:10px">
        <span style="font-size:20px">${topicData.icon}</span>
        <span style="color:${topicData.color};font-weight:bold">${topicName}</span>
        <span style="color:#aaa;font-size:11px;margin-left:auto">+5 學分</span>
      </button>`;
    }).join('');
  }
  panel.style.display = 'flex';
}

function startClassroomQuiz(grade, topic) {
  closeClassroomPanel();
  const topicData = LIBRARY_TOPICS.find(t => t.topic === topic);
  if (!topicData) return;
  startZoneQuiz({
    topic,
    icon: topicData.icon,
    color: parseInt(topicData.color.replace('#', ''), 16),
    roomId: 'classroom_' + grade + '_' + topic,
    label: '🏫 ' + grade + '班房 — ' + topic,
    creditReward: 5,
  });
}

// ============================================================
// HINT PANEL (Teacher interaction)
// ============================================================
function showHintPanel() {
  const panel = document.getElementById('hint-panel');
  if (!panel) return;
  const credEl = document.getElementById('hint-credits-count');
  if (credEl) credEl.textContent = gameState.credits || 0;

  const listEl = document.getElementById('hint-topic-list');
  if (listEl) {
    const topics = Object.keys(TEACHER_HINTS);
    listEl.innerHTML = topics.map(t => {
      const hints = TEACHER_HINTS[t];
      return `<div style="margin-bottom:10px">
        <div style="color:#FAAD14;font-weight:bold;font-size:13px;margin-bottom:4px">${t}</div>
        ${hints.map((h, i) =>
          `<button class="panel-btn" onclick="buyHint('${t}',${i})" style="font-size:12px">
            💡 提示 ${i + 1} — 10 學分
          </button>`
        ).join('')}
      </div>`;
    }).join('');
  }
  panel.style.display = 'flex';
}

function buyHint(topic, index) {
  const cost = 10;
  if (!spendCredits(cost)) {
    showToast('學分不足！先答題賺取學分。', '#F5222D');
    return;
  }
  const hints = TEACHER_HINTS[topic] || [];
  const hint = hints[index] || '暫無提示';
  const credEl = document.getElementById('hint-credits-count');
  if (credEl) credEl.textContent = gameState.credits || 0;

  const listEl = document.getElementById('hint-topic-list');
  if (listEl) {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = 'background:rgba(82,196,26,0.15);border:1px solid rgba(82,196,26,0.4);border-radius:8px;padding:10px 12px;color:#95de64;font-size:13px;margin-bottom:10px';
    msgDiv.innerHTML = `<strong>💡 ${topic} 提示：</strong><br>${hint}`;
    listEl.insertBefore(msgDiv, listEl.firstChild);
    showToast('獲得提示！ -' + cost + ' 學分', '#FAAD14');
  }
}

function closeClassroomPanel() {
  const panel = document.getElementById('classroom-panel');
  if (panel) panel.style.display = 'none';
}

function closeHintPanel() {
  const panel = document.getElementById('hint-panel');
  if (panel) panel.style.display = 'none';
}

// ============================================================
// LIBRARY PANEL (self-study topic selector)
// ============================================================
function showLibraryPanel() {
  const panel = document.getElementById('library-panel');
  if (!panel) return;
  const listEl = document.getElementById('library-topic-list');
  if (listEl) {
    listEl.innerHTML = LIBRARY_TOPICS.map(t =>
      `<button class="panel-btn" onclick="startLibraryQuiz('${t.topic}')" style="justify-content:flex-start;gap:10px">
        <span style="font-size:20px">${t.icon}</span>
        <span style="color:${t.color};font-weight:bold">${t.topic}</span>
        <span style="color:#aaa;font-size:11px;margin-left:auto">自學練習</span>
      </button>`
    ).join('');
  }
  panel.style.display = 'flex';
}

function startLibraryQuiz(topic) {
  closeLibraryPanel();
  const topicData = LIBRARY_TOPICS.find(t => t.topic === topic);
  if (!topicData) return;
  // Library: no credits, just XP — creditReward stays 0
  startZoneQuiz({
    topic,
    icon: topicData.icon,
    color: parseInt(topicData.color.replace('#', ''), 16),
    roomId: 'library_' + topic,
    label: '📚 圖書館 — ' + topic,
    creditReward: 0,
  });
}

function closeLibraryPanel() {
  const panel = document.getElementById('library-panel');
  if (panel) panel.style.display = 'none';
}

// ============================================================
// Navigation
// ============================================================
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
