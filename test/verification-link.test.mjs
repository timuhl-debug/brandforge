import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const authRoute = await readFile(new URL('../routes/auth.js', import.meta.url), 'utf8')
const authPage = await readFile(new URL('../client/src/pages/AuthPage.jsx', import.meta.url), 'utf8')
const app = await readFile(new URL('../client/src/App.jsx', import.meta.url), 'utf8')

test('verification email contains a clickable button and fallback link', () => {
  assert.match(authRoute, /html:\s*`[\s\S]*<a href=\"\$\{url\}\"/)
  assert.match(authRoute, /text:\s*`Welcome to BrandForge[\s\S]*\$\{url\}/)
})

test('local registration displays a clickable verification link', () => {
  assert.match(authRoute, /verificationUrl:directVerificationUrl/)
  assert.match(authPage, /setVerificationUrl\(d\.verificationUrl\|\|''\)/)
  assert.match(authPage, /href=\{verificationUrl\}/)
})

test('verification page reads the token and calls the verification API', () => {
  assert.match(app, /path=\"\/verify-email\"/)
  assert.ok(app.includes('/verify-email'))
  assert.ok(app.includes('api(`/auth/verify?token=${encodeURIComponent(token)}`)'))
})
