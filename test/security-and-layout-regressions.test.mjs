import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const server = readFileSync(new URL('../server.js', import.meta.url), 'utf8')
const app = readFileSync(new URL('../client/src/App.jsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../client/src/styles.css', import.meta.url), 'utf8')

test('headline stays on one line while moving horizontally in the preview', () => {
  assert.match(styles, /\.editable-preview h2\.design-item\s*\{[^}]*white-space:\s*nowrap/s)
  assert.match(styles, /\.editable-preview h2\.design-item\s*\{[^}]*word-break:\s*keep-all/s)
})

test('uploaded image delivery is protected by authentication and project ownership', () => {
  assert.match(server, /app\.get\('\/api\/brands\/:id\/assets\/:assetId\/file',auth,owned/)
  assert.doesNotMatch(server, /app\.use\('\/uploads',express\.static\(uploadDir\)\)/)
  assert.match(app, /fetch\(`\/api\/brands\/\$\{current\._id\}\/assets\/\$\{asset\._id\}\/file`/)
})

test('duplicating a project copies uploaded files instead of sharing paths', () => {
  assert.match(server, /fs\.copyFileSync\(source,destination\)/)
  assert.match(server, /data\.assets=data\.assets\.map/)
})

test('authentication routes have request throttling', () => {
  assert.match(server, /function authRateLimit/)
  assert.match(server, /app\.use\('\/api\/auth',authRateLimit,require\('\.\/routes\/auth'\)\)/)
})

test('search terms are escaped before being used as regular expressions', () => {
  assert.ok(server.includes('const term=clean(req.query.search,80).replace('))
  assert.ok(server.includes("$options:'i'"))
})

test('uploaded files are cleaned after failed writes and only deleted after database save', () => {
  assert.match(server, /if\(savedFile&&fs\.existsSync\(savedFile\)\)fs\.unlinkSync\(savedFile\)/)
  assert.match(server, /a\.deleteOne\(\);await req\.brand\.save\(\);if\(filePath&&filename\)/)
})

test('uploaded image bytes are stored in MongoDB and served after a server restart', () => {
  const model = readFileSync(new URL('../models/Brand.js', import.meta.url), 'utf8')
  assert.match(model, /dataBase64:\s*\{\s*type:\s*String,\s*select:\s*false\s*\}/)
  assert.match(server, /storage:multer\.memoryStorage\(\)/)
  assert.match(server, /dataBase64:req\.file\.buffer\.toString\('base64'\)/)
  assert.match(server, /asset\.dataBase64.*Buffer\.from\(asset\.dataBase64,'base64'\)/)
  assert.match(server, /select\('\+assets\.data \+assets\.dataBase64'\)/)
})
