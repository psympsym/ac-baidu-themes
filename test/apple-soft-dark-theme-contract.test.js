const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const source = fs.readFileSync('apple-soft-dark.less', 'utf8');

assert.match(source, /@plastic-blur:\s*12px/);
assert.match(source, /@panel-radius:\s*22px/);
assert.match(source, /@breakpoint:\s*900px/);
assert.match(source, /--soft-page:\s*#080b13/);
assert.match(source, /--soft-panel:\s*rgba\(27,\s*34,\s*48,\s*0\.92\)/);
assert.match(source, /--soft-blue:\s*#0a84ff/);
assert.match(source, /\.soft-panel\(\)/);
assert.match(source, /\.RNNXgb/);
assert.match(source, /\.MjjYud/);
assert.match(source, /\.kp-wholepage/);
assert.match(source, /focus-visible/);
assert.match(source, /#rso:not\(:has\(> div:not\(\.MjjYud\):not\(\.g\):not\(\.ULSxyf\):not\(\.kp-wholepage\)\)\)/);
assert.match(source, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
assert.match(source, /@media \(max-width:\s*\(@breakpoint - 1px\)\)/);
assert.match(source, /@media \(max-width:[\s\S]*#rso\s*\{[\s\S]*display:\s*block/);
assert.match(source, /@supports not \(\(backdrop-filter:\s*blur\(1px\)\)\)/);
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
  assert.match(css, /backdrop-filter:\s*blur\(12px\)/);
  console.log('less compile ok');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('lessc unavailable; source contract checked');
}

console.log('apple soft dark theme contract ok');
