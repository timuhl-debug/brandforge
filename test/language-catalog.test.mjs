import test from 'node:test';
import assert from 'node:assert/strict';
import { languageOptions, translateCommon } from '../client/src/translations.js';

test('the language selector contains exactly English, German and French', () => {
  assert.deepEqual(languageOptions.map(([code]) => code), ['en', 'de', 'fr']);
});

test('each supported language has a unique code and display name', () => {
  assert.equal(new Set(languageOptions.map(([code]) => code)).size, 3);
  assert.ok(languageOptions.every(([code, name]) => code.length === 2 && name.trim().length > 0));
});

test('French interface copy is translated and English and German remain available', () => {
  assert.equal(translateCommon('Create brand', 'Marke erstellen', 'fr'), 'Créer la marque');
  assert.equal(translateCommon('Create brand', 'Marke erstellen', 'de'), 'Marke erstellen');
  assert.equal(translateCommon('Create brand', 'Marke erstellen', 'en'), 'Create brand');
});

test('i18next catalog contains only English, German and French', async () => {
  const fs = await import('node:fs/promises');
  const source = await fs.readFile(new URL('../client/src/i18n.js', import.meta.url), 'utf8');
  const resourceBlock = source.match(/const resources = \{([\s\S]*?)\n\};/);
  assert.ok(resourceBlock);
  const codes = [...resourceBlock[1].matchAll(/^\s*([a-z]{2}):/gm)].map((match) => match[1]);
  assert.deepEqual(codes, ['en', 'de', 'fr']);
});
