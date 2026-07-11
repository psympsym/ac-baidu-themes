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
assert.match(source, /@media \(min-width:\s*@breakpoint\)/);
assert.match(source, /#rso[\s\S]*display:\s*grid/);
assert.match(source, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
assert.match(source, /@media \(min-width:\s*@wide-breakpoint\)/);
assert.match(source, /@media \(max-width:\s*\(@breakpoint - 1px\)\)/);
assert.match(source, /overflow-x:\s*clip/);
console.log('theme contract ok');
