const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const source = fs.readFileSync('apple-soft-dark.less', 'utf8');

assert.match(source, /@panel-radius:\s*22px/);
assert.match(source, /@breakpoint:\s*900px/);
assert.match(source, /--soft-page:\s*#1c1c1e/);
assert.match(source, /--soft-panel:\s*#2c2c2e/);
assert.match(source, /--soft-text:\s*#ffffff/);
assert.match(source, /--soft-muted:\s*rgba\(235,\s*235,\s*245,\s*0\.6\)/);
assert.match(source, /--soft-blue:\s*#0a84ff/);
assert.doesNotMatch(source, /backdrop-filter/i);
assert.doesNotMatch(source, /radial-gradient|linear-gradient/i);
assert.doesNotMatch(source, /translateY/i);
assert.match(source, /html\.zAoYTe/);
assert.match(source, /#searchform\s+\.sfbg\s*\*/);
assert.match(source, /#gb\s*>\s*div[\s\S]*background:\s*var\(--soft-page\)\s*!important/);
assert.match(source, /#rso\s+>\s+[^\{]*\.A6K0A[\s\S]*border:\s*0\s*!important/);
assert.match(source, /\.soft-panel\(\)/);
assert.match(source, /\.RNNXgb/);
assert.match(source, /\.MjjYud/);
assert.match(source, /\.kp-wholepage/);
assert.match(source, /focus-visible/);
assert.match(source, /#rso:not\(:has\(> div:not\(\.MjjYud\):not\(\.g\):not\(\.ULSxyf\):not\(\.kp-wholepage\)\)\)/);
assert.match(source, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
assert.match(source, /@media \(max-width:\s*\(@breakpoint - 1px\)\)/);
assert.match(source, /@media \(max-width:[\s\S]*#rso\s*\{[\s\S]*display:\s*block/);
assert.match(source, /prefers-reduced-motion:\s*reduce/);
assert.doesNotMatch(source, /url\s*\(/i);
assert.doesNotMatch(source, /@import/i);
assert.doesNotMatch(source, /display:\s*none/i);
assert.doesNotMatch(source, /visibility:\s*hidden/i);
assert.doesNotMatch(source, /position:\s*fixed/i);
assert.doesNotMatch(source, /(?:left|right|top|bottom|margin[^:]*):\s*-\d{4,}px/i);
assert.doesNotMatch(source, /transform:\s*scale/i);

try {
  const css = execFileSync('lessc', ['apple-soft-dark.less'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  assert.match(css, /background:\s*var\(--soft-panel\)/);
  assert.doesNotMatch(css, /backdrop-filter|radial-gradient|linear-gradient/);
  console.log('less compile ok');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('lessc unavailable; source contract checked');
}

console.log('apple soft dark theme contract ok');
