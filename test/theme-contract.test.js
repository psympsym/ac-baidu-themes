const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('google-glass.less', 'utf8');
assert.match(source, /@glass-blur:\s*18px/);
assert.match(source, /prefers-color-scheme:\s*dark/);
assert.doesNotMatch(source, /url\s*\(/i);

assert.match(source, /radial-gradient/);
assert.match(source, /@glass-blur:\s*18px/);
assert.match(source, /\.glass-panel\(\)[\s\S]*background:\s*var\(--glass\)/);
assert.match(source, /\.RNNXgb,[\s\S]*\.glass-panel\(\);/);
assert.match(source, /focus-visible/);
assert.match(source, /@supports not[\s\S]*backdrop-filter/);
assert.doesNotMatch(source, /display:\s*none/);
assert.doesNotMatch(source, /visibility:\s*hidden/);
console.log('theme contract ok');
