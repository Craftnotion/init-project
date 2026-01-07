import { test } from 'node:test'
import assert from 'node:assert'
import Nextjs from '../src/nextjs'
import Nestjs from '../src/nestjs'

test('Next.js should allow node versions >= 18.18.0', () => {
  // @ts-ignore
  const nextjs = new Nextjs({ projectName: 'test-app', packageManager: 'npm' })
  assert.strictEqual(nextjs.node, '>=18.18.0')
})

test('NestJS should allow node versions >= 16.0.0', () => {
  // @ts-ignore
  const nestjs = new Nestjs({ projectName: 'test-app', packageManager: 'npm' })
  assert.strictEqual(nestjs.node, '>=16.0.0')
})
