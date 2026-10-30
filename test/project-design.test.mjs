import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../client/src/App.jsx', import.meta.url), 'utf8')

test('project design state loads from keys scoped to the opened brand', () => {
  assert.match(source, /const loadProjectDesign=\(brand\)=>\{const id=brand\._id;setTypeStyles\(readScoped\('type-styles',id,\{\}\)\)/)
  assert.match(source, /setDesignPositions\(readScoped\('design-positions',id,\{\}\)\)/)
  assert.match(source, /setDesignSizes\(readScoped\('design-sizes',id,\{\.\.\.defaultDesignSizes\}\)\)/)
  assert.match(source, /setDesignLayers\(readScoped\('design-layers',id,\{\.\.\.defaultDesignLayers\}\)\)/)
  assert.match(source, /loadProjectDesign\(d\.brand\);setCurrent\(d\.brand\)/)
})

test('layout positions, sizes, layers, typography and selected assets save per brand', () => {
  for (const key of ['type-styles', 'design-positions', 'design-sizes', 'design-layers', 'placed-asset', 'asset-position']) {
    assert.ok(source.includes(`writeScoped('${key}',current._id`), `missing per-project save for ${key}`)
  }
  assert.match(source, /const writeScoped=\(name,id,value\)=>\{try\{localStorage\.setItem\(`brandforge-\$\{name\}-\$\{id\}`/)
})

test('new brands load clean default layout settings and reset saves those defaults', () => {
  assert.match(source, /loadProjectDesign\(d\.brand\);setCurrent\(d\.brand\)/)
  assert.match(source, /setDesignPositions\(\{\}\);writeScoped\('design-positions',current\._id,\{\}\)/)
  assert.match(source, /setDesignSizes\(\{\.\.\.defaultDesignSizes\}\);writeScoped\('design-sizes',current\._id,\{\.\.\.defaultDesignSizes\}\)/)
  assert.match(source, /setDesignLayers\(\{\.\.\.defaultDesignLayers\}\);writeScoped\('design-layers',current\._id,\{\.\.\.defaultDesignLayers\}\)/)
})

test('font purpose selectors submit stable backend values for all three roles', () => {
  for (const value of ['Headline', 'Body', 'Accent']) assert.ok(source.includes(`<option value=\"${value}\">`), `missing stable option value ${value}`)
})

test('color picker updates the swatch immediately and persists the final color on blur', () => {
  assert.match(source, /const previewColor=\(color,hex\)=>/)
  assert.match(source, /onChange=\{e=>previewColor\(c,e\.target\.value\)\} onBlur=\{\(\)=>persistColor\(c\)\}/)
  assert.match(source, /colorRequestVersions=useRef\(\{\}\)/)
})

test('reopened projects restore the selected image by matching it against saved project assets', () => {
  assert.match(source, /const savedAsset=readScoped\('placed-asset',id,null\)/)
  assert.match(source, /find\(asset=>asset\.url===savedAsset\.url\|\|asset\.fileName===savedAsset\.fileName\)/)
  assert.match(source, /setPlacedAssetState\(matchingAsset\?\{_id:matchingAsset\._id,url:matchingAsset\.url,fileName:matchingAsset\.fileName\}:null\)/)
})
