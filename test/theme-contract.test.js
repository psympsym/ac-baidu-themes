const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('google-glass.less', 'utf8');
assert.match(source, /@glass-blur:\s*18px/);
assert.match(source, /prefers-color-scheme:\s*dark/);
assert.doesNotMatch(source, /url\s*\(/i);

assert.match(source, /radial-gradient/);
assert.match(source, /@glass-blur:\s*18px/);
console.log('theme contract ok');
