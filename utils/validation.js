function isValidHex(value) {
  return /^#?([0-9a-fA-F]{6})$/.test(String(value || ''));
}
function normalizeHex(value) {
  return `#${String(value).replace('#', '').toUpperCase()}`;
}
function isSupportedImageSignature(buffer) {
  if (!Buffer.isBuffer(buffer)) return false;
  const png = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpeg = buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
  const webp = buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  return png || jpeg || webp;
}
module.exports = { isValidHex, normalizeHex, isSupportedImageSignature };
