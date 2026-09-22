/**
 * Test fixture loader — reads JSON fixtures from /test/fixtures/
 */
import fs from 'fs'
import path from 'path'

const FIXTURE_DIR = path.join(process.cwd(), 'test', 'fixtures')

export function loadFixture<T = unknown>(name: string): T {
  const filePath = path.join(FIXTURE_DIR, name.endsWith('.json') ? name : `${name}.json`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fixture not found: ${filePath}`)
  }
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

export function fixtureExists(name: string): boolean {
  const filePath = path.join(FIXTURE_DIR, name.endsWith('.json') ? name : `${name}.json`)
  return fs.existsSync(filePath)
}
