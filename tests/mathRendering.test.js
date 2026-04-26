'use strict';

/**
 * mathRendering.test.js
 *
 * Tests for renderMath() and renderMathInline() – the KaTeX wrapper
 * functions that parse $...$ LaTeX blocks inside question text.
 */

const { loadSharedMain } = require('./loadShared');

beforeAll(() => {
  loadSharedMain();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a fresh detached DOM element for each test. */
function el() {
  return document.createElement('span');
}

// ---------------------------------------------------------------------------
// renderMath – fallback when KaTeX is absent
// ---------------------------------------------------------------------------

describe('renderMath – without KaTeX', () => {
  beforeEach(() => {
    // Ensure KaTeX is not defined (default in jsdom/Node environment).
    delete window.katex;
  });

  test('sets element textContent to the raw TeX string', () => {
    const span = el();
    window.renderMath(span, 'hello $x^2$ world');
    expect(span.textContent).toBe('hello $x^2$ world');
  });

  test('handles empty string without throwing', () => {
    const span = el();
    expect(() => window.renderMath(span, '')).not.toThrow();
    expect(span.textContent).toBe('');
  });

  test('handles plain text (no $ markers) without throwing', () => {
    const span = el();
    window.renderMath(span, 'just plain text');
    expect(span.textContent).toBe('just plain text');
  });

  test('handles text with only a math block', () => {
    const span = el();
    window.renderMath(span, '$a+b=c$');
    expect(span.textContent).toBe('$a+b=c$');
  });
});

// ---------------------------------------------------------------------------
// renderMath – with KaTeX mock
// ---------------------------------------------------------------------------

describe('renderMath – with KaTeX mock', () => {
  beforeEach(() => {
    // Provide a minimal KaTeX mock that records calls.
    window.katex = {
      render: jest.fn((math, container) => {
        container.textContent = `[RENDERED:${math}]`;
      }),
    };
  });

  afterEach(() => {
    delete window.katex;
  });

  test('renders math segments through katex.render', () => {
    const span = el();
    window.renderMath(span, '$x^2$');
    expect(window.katex.render).toHaveBeenCalledWith(
      'x^2',
      expect.any(HTMLElement),
      expect.objectContaining({ throwOnError: false })
    );
  });

  test('splits text and math parts correctly', () => {
    const span = el();
    window.renderMath(span, 'Area = $\\pi r^2$ units');
    // The element should have 3 child nodes: text, rendered math, text
    expect(span.childNodes.length).toBe(3);
  });

  test('plain text segments are added as text nodes', () => {
    const span = el();
    window.renderMath(span, 'before $math$ after');
    // First child: text node "before "
    expect(span.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
    expect(span.childNodes[0].textContent).toBe('before ');
    // Last child: text node " after"
    expect(span.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
    expect(span.childNodes[2].textContent).toBe(' after');
  });

  test('clears previous innerHTML before rendering', () => {
    const span = el();
    span.innerHTML = '<b>old content</b>';
    window.renderMath(span, 'new text');
    expect(span.innerHTML).not.toContain('old content');
  });

  test('handles multiple math segments in one string', () => {
    const span = el();
    window.renderMath(span, '$a$ plus $b$ equals $c$');
    expect(window.katex.render).toHaveBeenCalledTimes(3);
  });

  test('does not crash when katex.render throws', () => {
    window.katex.render = jest.fn(() => { throw new Error('KaTeX error'); });
    const span = el();
    expect(() => window.renderMath(span, '$bad$')).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// renderMathInline – fallback when KaTeX is absent
// ---------------------------------------------------------------------------

describe('renderMathInline – without KaTeX', () => {
  beforeEach(() => {
    delete window.katex;
  });

  test('sets element textContent to the raw string', () => {
    const span = el();
    window.renderMathInline(span, 'Solve $x + 1 = 0$');
    expect(span.textContent).toBe('Solve $x + 1 = 0$');
  });

  test('handles empty string without throwing', () => {
    const span = el();
    expect(() => window.renderMathInline(span, '')).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Dollar-sign edge cases
// ---------------------------------------------------------------------------

describe('renderMath – edge cases', () => {
  beforeEach(() => {
    window.katex = {
      render: jest.fn((math, container) => {
        container.textContent = math;
      }),
    };
  });

  afterEach(() => {
    delete window.katex;
  });

  test('adjacent math blocks are each rendered separately', () => {
    const span = el();
    window.renderMath(span, '$a$$b$');
    expect(window.katex.render).toHaveBeenCalledTimes(2);
  });

  test('string with no $ produces a single text node', () => {
    const span = el();
    window.renderMath(span, 'no math here');
    // Should be a single text node child
    expect(span.childNodes.length).toBe(1);
    expect(span.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
  });
});
