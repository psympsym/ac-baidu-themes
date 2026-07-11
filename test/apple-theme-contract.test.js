const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const source = fs.readFileSync('apple-glass.less', 'utf8');

assert.match(source, /@glass-blur:\s*24px/);
assert.match(source, /@panel-radius:\s*22px/);
assert.match(source, /--apple-page:\s*#060914/);
assert.match(source, /--apple-blue:\s*#0a84ff/);
assert.match(source, /\.apple-glass-panel\(\)/);
assert.match(source, /#searchform/);
assert.match(source, /\.RNNXgb/);
assert.match(source, /\.MjjYud/);
assert.match(source, /\.kp-wholepage/);
assert.match(source, /#botstuff/);
assert.match(source, /focus-visible/);
assert.match(source, /@supports not \(\(backdrop-filter:\s*blur\(1px\)\)\)/);
assert.match(source, /-webkit-backdrop-filter/);
assert.match(source, /prefers-reduced-motion:\s*reduce/);
assert.match(source, /@media \(max-width:\s*899px\)/);
assert.match(source, /@media \(max-width:\s*599px\)/);
assert.match(source, /#rcnt,\s*#center_col,\s*#rso\s*\{[^}]*display:\s*block\s*!important/s);
assert.match(source, /overflow-x:\s*clip/);
assert.doesNotMatch(source, /url\s*\(/i);
assert.doesNotMatch(source, /display:\s*none/i);
assert.doesNotMatch(source, /visibility:\s*hidden/i);
assert.doesNotMatch(source, /(?:left|right|top|bottom|margin[^:]*):\s*-\d{4,}px/i);
assert.doesNotMatch(source, /grid-template-columns:\s*repeat\(2/i);

try {
  const css = execFileSync('lessc', ['apple-glass.less'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  assert.match(css, /backdrop-filter:\s*blur\(24px\)/);
  assert.match(css, /background:\s*var\(--apple-glass\)/);
  console.log('less compile ok');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('lessc unavailable; source contract checked');
}

console.log('apple theme contract ok');
