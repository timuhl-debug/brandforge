const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidHex, normalizeHex, isSupportedImageSignature } = require('../utils/validation');
test('accepts valid six-digit HEX colors', () => {
  assert.equal(isValidHex('#6C5CE7'), true);
  assert.equal(isValidHex('FFFFFF'), true);
  assert.equal(isValidHex('#abc'), false);
  assert.equal(isValidHex('not-a-color'), false);
});
test('normalizes HEX colors to uppercase with a leading hash', () => {
  assert.equal(normalizeHex('6c5ce7'), '#6C5CE7');
  assert.equal(normalizeHex('#abcdef'), '#ABCDEF');
});
test('checks common image file signatures', () => {
  assert.equal(isSupportedImageSignature(Buffer.from([137,80,78,71,13,10,26,10])), true);
  assert.equal(isSupportedImageSignature(Buffer.from([255,216,255,0])), true);
  assert.equal(isSupportedImageSignature(Buffer.from('RIFF0000WEBP')), true);
  assert.equal(isSupportedImageSignature(Buffer.from('not an image')), false);
});
