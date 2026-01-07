import { test, describe, before, after } from 'node:test'
import * as fs from 'fs'
import { TEST_DIR, execCLI, verifyFile, verifyPackageJson } from './helpers'

describe('E2E Integration Suite: CLI Binary Verification', { concurrency: true }, () => {
  const commonFlags = ['--package-manager=npm', '--git=false']

  before(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true })
    }
    fs.mkdirSync(TEST_DIR)
  })

  test('ExpressJS: should scaffold via CLI', async () => {
    const name = 'e2e-express-app'
    await execCLI(name, ['--platform=expressjs', '--view=ejs', '--css=css', ...commonFlags])
    verifyFile(name, 'app.js')
    verifyPackageJson(name, 'express')
  })

  test('Next.js: should scaffold via CLI', async () => {
    const name = 'e2e-next-app'
    await execCLI(name, [
      '--platform=nextjs',
      '--tailwind=true',
      '--eslint=true',
      '--app=true',
      '--src-dir=true',
      '--import-alias=@/*',
      '--typescript=false',
      ...commonFlags,
    ])
    verifyFile(name, 'package.json')
    verifyPackageJson(name, 'next')
  })

  test('React Native: should scaffold via CLI', async () => {
    const name = 'e2eRnApp'
    await execCLI(name, [
      '--platform=react-native',
      '--install-pods=false',
      '--skip-install',
      '--typescript=false',
      ...commonFlags,
    ])
    verifyFile(name, 'package.json')
    verifyPackageJson(name, 'react-native')
  })

  test('VueJS: should scaffold via CLI', async () => {
    const name = 'e2e-vue-app'
    await execCLI(name, [
      '--platform=vuejs',
      '--typescript=false',
      '--jsx=false',
      '--router=false',
      '--pinia=false',
      '--vitest=false',
      '--eslint=false',
      '--testing-framework=none',
      ...commonFlags,
    ])
    verifyFile(name, 'package.json')
    verifyPackageJson(name, 'vue')
  })

  test('Angular: should scaffold via CLI', async () => {
    const name = 'e2e-angular-app'
    await execCLI(name, [
      '--platform=angular',
      '--routing=true',
      '--style=css',
      '--ssr=false',
      '--skip-tests=true',
      '--type=standalone',
      '--prefix=app',
      ...commonFlags,
    ])
    verifyFile(name, 'package.json')
    verifyPackageJson(name, '@angular/core')
  })

  test('NuxtJS: should scaffold via CLI', async () => {
    const name = 'e2e-nuxt-app'
    await execCLI(name, [
      '--platform=nuxtjs',
      '--mode=universal',
      '--ui=none',
      '--test=none',
      '--target=server',
      '--typescript=false',
      '--minimal=true',
      ...commonFlags,
    ])
    verifyFile(name, 'package.json')
    verifyPackageJson(name, 'nuxt')
  })

  test('NestJS: should scaffold via CLI', async () => {
    const name = 'e2e-nest-app'
    await execCLI(name, ['--platform=nestjs', '--strict=true', ...commonFlags])
    verifyFile(name, 'package.json')
    verifyPackageJson(name, '@nestjs/core')
  })

  test('AdonisJS: should scaffold via CLI', async () => {
    const name = 'e2e-adonis-app'
    await execCLI(name, [
      '--platform=adonisjs',
      '--boilerplate=api',
      '--db=sqlite',
      '--auth-guard=session',
      ...commonFlags,
    ])
    verifyFile(name, 'package.json')
    verifyPackageJson(name, '@adonisjs/core')
  })

  test('ExpressJS with Git & Husky: should scaffold and initialize git', async () => {
    const name = 'e2e-git-app'
    await execCLI(name, [
      '--platform=expressjs',
      '--view=ejs',
      '--css=css',
      '--package-manager=npm',
      '--git=true',
      '--husky=true',
    ])
    verifyFile(name, '.git')
    verifyFile(name, '.husky')
    verifyFile(name, 'validate.js')
    verifyPackageJson(name, 'express')
  })

  // after(() => {
  //      if (fs.existsSync(TEST_DIR)) {
  //          fs.rmSync(TEST_DIR, { recursive: true, force: true })
  //      }
  // })
})
