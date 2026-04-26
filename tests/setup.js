// ============================================================
// Global mocks that must be set up BEFORE shared-main.js loads
// ============================================================

// Mock AudioContext so sound effects don't fail
const mockOscillator = {
  type: '',
  frequency: { value: 0 },
  connect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
};
const mockGain = {
  gain: {
    setValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
  },
  connect: jest.fn(),
};
const mockAudioCtx = {
  createOscillator: jest.fn(() => ({ ...mockOscillator })),
  createGain: jest.fn(() => ({
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
    connect: jest.fn(),
  })),
  destination: {},
  currentTime: 0,
};
global.AudioContext = jest.fn(() => mockAudioCtx);
global.webkitAudioContext = undefined;

// Mock Firebase (must be set before shared-main.js initialises it)
const mockDbRef = {
  update: jest.fn(() => Promise.resolve()),
  set: jest.fn(() => Promise.resolve()),
  once: jest.fn(() =>
    Promise.resolve({ exists: () => false, val: () => null })
  ),
  orderByChild: jest.fn().mockReturnThis(),
  limitToLast: jest.fn().mockReturnThis(),
  onDisconnect: jest.fn(() => ({ remove: jest.fn() })),
  child: jest.fn().mockReturnThis(),
  forEach: jest.fn(),
};
const mockAuthInstance = {
  signInWithPopup: jest.fn(() => Promise.resolve({ user: null })),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(),
};
global.firebase = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => mockAuthInstance),
  database: jest.fn(() => ({ ref: jest.fn(() => mockDbRef) })),
};
// GoogleAuthProvider on the auth namespace
global.firebase.auth.GoogleAuthProvider = jest.fn(function () {
  this.setCustomParameters = jest.fn();
});

// Mock fetch
global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

// Mock Web Animations API (used by spawnFireworks inside addXP level-up)
global.Element.prototype.animate = jest.fn(() => ({
  onfinish: null,
  finished: Promise.resolve(),
}));

// Silence console.log spam from shared-main.js
global.console.log = jest.fn();
