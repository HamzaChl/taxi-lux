import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const base = process.argv[2] ?? 'http://localhost:3100'
const path = '/wp-json/taxilux/v1/pricing'
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
assert.equal(config.rewrites.find((rule) => rule.source === path)?.destination, '/api/pricing')

const response = await fetch(new URL(path, base), { headers: { Origin: 'https://example.com' } })
assert.equal(response.status, 200)
assert.equal(response.headers.get('content-type'), 'application/json')
assert.equal(response.headers.get('cache-control'), 'no-store')
assert.equal(response.headers.get('access-control-allow-origin'), '*')
const data = await response.json()
assert.deepEqual(data, {
  version: 1,
  pickupFee: { day: 2.6, night: 4.6 },
  includedKm: 0,
  rate: { upToKm: 35, upToRate: 2.3, afterRate: 2.3 },
  hourlyRate: 0,
  updatedAt: '2026-09-15T00:00:00.000Z',
})
for (const value of [data.version, data.pickupFee.day, data.pickupFee.night, data.includedKm,
  data.rate.upToKm, data.rate.upToRate, data.rate.afterRate, data.hourlyRate]) {
  assert.equal(typeof value, 'number')
}
assert.equal(typeof data.updatedAt, 'string')

const options = await fetch(new URL(path, base), {
  method: 'OPTIONS',
  headers: { Origin: 'https://example.com', 'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Content-Type' },
})
assert.equal(options.status, 204)
assert.equal(await options.text(), '')
assert.equal(options.headers.get('access-control-allow-origin'), '*')
assert.equal(options.headers.get('access-control-allow-methods'), 'GET, OPTIONS')
assert.equal(options.headers.get('access-control-allow-headers'), 'Content-Type')
assert.equal(options.headers.get('cache-control'), 'no-store')

const post = await fetch(new URL(path, base), { method: 'POST' })
assert.equal(post.status, 405)
assert.equal(post.headers.get('allow'), 'GET, OPTIONS')
assert.equal(post.headers.get('content-type'), 'application/json')

for (const rule of config.rewrites.filter((rule) => rule.destination === '/index.html')) {
  const page = await fetch(new URL(rule.source, base))
  assert.equal(page.status, 200, rule.source)
  assert.match(page.headers.get('content-type'), /text\/html/, rule.source)
  assert.match(await page.text(), /<div id="root"><\/div>/, rule.source)
}
console.log('OK : JSON exact, types, CORS, absence de cache, méthodes et routes SPA.')
