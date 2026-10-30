import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../client/src/App.jsx', import.meta.url), 'utf8')

test('PNG export includes the selected logo preset and its symbol', () => {
  assert.match(source, /const preset=logoPreset\|\|current\.logoPreset\|\|'monogram'/)
  assert.match(source, /preset==='monogram'/)
  assert.match(source, /preset==='orbit'/)
  assert.match(source, /preset==='bloom'/)
  assert.match(source, /preset==='frame'/)
  assert.match(source, /const symbol=/)
  assert.match(source, /const shape=/)
})

test('PNG export includes the brand name, tagline, palette and PNG download', () => {
  assert.match(source, /escapeHtml\(current\.name\)/)
  assert.match(source, /current\.slogan\|\|'Ideas into identity'/)
  assert.match(source, /current\.colors\.slice\(0,4\)/)
  assert.match(source, /canvas\.toBlob\(blob=>/)
  assert.match(source, /link\.download=`\$\{safeFileName\}-preview\.png`/)
})

test('preview editor supports dragging, positions, resizing, layers, reset and image selection', () => {
  assert.match(source, /const dragDesignElement=/)
  assert.match(source, /setDesignPosition\(selectedDesignElement/)
  assert.match(source, /setDesignSize\(selectedDesignElement/)
  assert.match(source, /setDesignLayer\(selectedDesignElement,1\)/)
  assert.match(source, /setDesignLayer\(selectedDesignElement,-1\)/)
  assert.match(source, /const resetDesign=/)
  assert.match(source, /current\.assets\.map\(a=><option/)
  assert.match(source, /designPositions\.headline/)
  assert.match(source, /designPositions\.slogan/)
})

test('PNG export uses the current element positions and layer order', () => {
  assert.match(source, /const pos=key=>designPositions\[key\]/)
  assert.match(source, /const layer=\(key\)=>designLayers\[key\]/)
  assert.match(source, /sort\(\(a,b\)=>layer\(a\.key\)-layer\(b\.key\)\)/)
  assert.match(source, /placedAsset\?\.url/)
})
