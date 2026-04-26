'use strict';

/**
 * questions.test.js
 *
 * Data-integrity tests for every question bank defined in shared-main.js.
 * Tests verify structure, required fields, valid answer keys, and unique IDs.
 */

const { loadSharedMain } = require('./loadShared');

const VALID_ANSWER_KEYS = new Set(['A', 'B', 'C', 'D']);
const VALID_DIFFICULTIES = new Set([1, 2, 3]);

beforeAll(() => {
  loadSharedMain();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Run the full suite of structural checks against an array of questions.
 * Each check uses Jest matchers so failures are easy to diagnose.
 */
function assertQuestionsValid(questions, label) {
  describe(`${label} – structural integrity`, () => {
    test('array is non-empty', () => {
      expect(questions.length).toBeGreaterThan(0);
    });

    test('every question has a non-empty string id', () => {
      questions.forEach(q => {
        expect(typeof q.id).toBe('string');
        expect(q.id.length).toBeGreaterThan(0);
      });
    });

    test('every question has a non-empty topic string', () => {
      questions.forEach(q => {
        expect(typeof q.topic).toBe('string');
        expect(q.topic.length).toBeGreaterThan(0);
      });
    });

    test('every question has a valid difficulty (1, 2, or 3)', () => {
      questions.forEach(q => {
        expect(VALID_DIFFICULTIES.has(q.difficulty)).toBe(true);
      });
    });

    test('every question has a non-empty question string', () => {
      questions.forEach(q => {
        expect(typeof q.question).toBe('string');
        expect(q.question.length).toBeGreaterThan(0);
      });
    });

    test('every question has options A, B, C, D', () => {
      questions.forEach(q => {
        expect(q.options).toBeDefined();
        expect(typeof q.options.A).toBe('string');
        expect(typeof q.options.B).toBe('string');
        expect(typeof q.options.C).toBe('string');
        expect(typeof q.options.D).toBe('string');
      });
    });

    test('every question answer is A, B, C, or D', () => {
      questions.forEach(q => {
        expect(VALID_ANSWER_KEYS.has(q.answer)).toBe(true);
      });
    });

    test('all question IDs within the set are unique', () => {
      const ids = questions.map(q => q.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });
  });
}

// ---------------------------------------------------------------------------
// Run checks against every question bank
// ---------------------------------------------------------------------------

describe('QUESTIONS_ORIGINAL', () => {
  let qs;
  beforeAll(() => { qs = window.__QUESTIONS_ORIGINAL; });
  test('is exported and non-empty', () => expect(qs.length).toBeGreaterThan(0));

  assertQuestionsValid(
    // We call with a lazy proxy because window.__QUESTIONS_ORIGINAL is not
    // available until loadSharedMain() runs in beforeAll above.
    // Use a wrapper to defer access.
    new Proxy([], {
      get(_, prop) {
        if (prop === 'length') return window.__QUESTIONS_ORIGINAL.length;
        if (prop === 'forEach') return fn => window.__QUESTIONS_ORIGINAL.forEach(fn);
        if (prop === 'map') return fn => window.__QUESTIONS_ORIGINAL.map(fn);
        return window.__QUESTIONS_ORIGINAL[prop];
      }
    }),
    'QUESTIONS_ORIGINAL'
  );
});

describe('QUESTIONS_PHASE1B', () => {
  assertQuestionsValid(
    new Proxy([], {
      get(_, prop) {
        if (prop === 'length') return window.__QUESTIONS_PHASE1B.length;
        if (prop === 'forEach') return fn => window.__QUESTIONS_PHASE1B.forEach(fn);
        if (prop === 'map') return fn => window.__QUESTIONS_PHASE1B.map(fn);
        return window.__QUESTIONS_PHASE1B[prop];
      }
    }),
    'QUESTIONS_PHASE1B'
  );
});

describe('QUESTIONS_PHASE2', () => {
  assertQuestionsValid(
    new Proxy([], {
      get(_, prop) {
        if (prop === 'length') return window.__QUESTIONS_PHASE2.length;
        if (prop === 'forEach') return fn => window.__QUESTIONS_PHASE2.forEach(fn);
        if (prop === 'map') return fn => window.__QUESTIONS_PHASE2.map(fn);
        return window.__QUESTIONS_PHASE2[prop];
      }
    }),
    'QUESTIONS_PHASE2'
  );
});

describe('QUESTIONS_PHASE4', () => {
  assertQuestionsValid(
    new Proxy([], {
      get(_, prop) {
        if (prop === 'length') return window.__QUESTIONS_PHASE4.length;
        if (prop === 'forEach') return fn => window.__QUESTIONS_PHASE4.forEach(fn);
        if (prop === 'map') return fn => window.__QUESTIONS_PHASE4.map(fn);
        return window.__QUESTIONS_PHASE4[prop];
      }
    }),
    'QUESTIONS_PHASE4'
  );
});

describe('DAILY_CHALLENGE_QUESTIONS', () => {
  assertQuestionsValid(
    new Proxy([], {
      get(_, prop) {
        if (prop === 'length') return window.__DAILY_CHALLENGE_QUESTIONS.length;
        if (prop === 'forEach') return fn => window.__DAILY_CHALLENGE_QUESTIONS.forEach(fn);
        if (prop === 'map') return fn => window.__DAILY_CHALLENGE_QUESTIONS.map(fn);
        return window.__DAILY_CHALLENGE_QUESTIONS[prop];
      }
    }),
    'DAILY_CHALLENGE_QUESTIONS'
  );
});

// ---------------------------------------------------------------------------
// ALL_QUESTIONS combined checks
// ---------------------------------------------------------------------------

describe('ALL_QUESTIONS (combined bank)', () => {
  test('is exported and non-empty', () => {
    expect(window.__ALL_QUESTIONS.length).toBeGreaterThan(0);
  });

  test('contains at least as many questions as QUESTIONS_ORIGINAL + PHASE1B + PHASE2 + PHASE4', () => {
    const minExpected =
      window.__QUESTIONS_ORIGINAL.length +
      window.__QUESTIONS_PHASE1B.length +
      window.__QUESTIONS_PHASE2.length +
      window.__QUESTIONS_PHASE4.length;
    expect(window.__ALL_QUESTIONS.length).toBeGreaterThanOrEqual(minExpected);
  });

  test('all questions in ALL_QUESTIONS have valid answer keys', () => {
    window.__ALL_QUESTIONS.forEach(q => {
      expect(VALID_ANSWER_KEYS.has(q.answer)).toBe(true);
    });
  });

  test('all questions in ALL_QUESTIONS have required fields', () => {
    window.__ALL_QUESTIONS.forEach(q => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('topic');
      expect(q).toHaveProperty('difficulty');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('answer');
    });
  });

  test('all question IDs in ALL_QUESTIONS are unique strings', () => {
    const ids = window.__ALL_QUESTIONS.map(q => q.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('all questions have a valid difficulty (1, 2, or 3)', () => {
    window.__ALL_QUESTIONS.forEach(q => {
      expect(VALID_DIFFICULTIES.has(q.difficulty)).toBe(true);
    });
  });

  test('covers expected topics', () => {
    const topics = new Set(window.__ALL_QUESTIONS.map(q => q.topic));
    // The game covers at minimum these topics
    const expectedTopics = ['代數', '幾何', '統計'];
    expectedTopics.forEach(t => expect(topics.has(t)).toBe(true));
  });
});

// ---------------------------------------------------------------------------
// DAILY_CHALLENGE_QUESTIONS specific: exactly 50 questions
// ---------------------------------------------------------------------------

describe('DAILY_CHALLENGE_QUESTIONS count', () => {
  test('has exactly 50 questions', () => {
    expect(window.__DAILY_CHALLENGE_QUESTIONS).toHaveLength(50);
  });
});
