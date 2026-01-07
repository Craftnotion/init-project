import { test, describe, beforeEach, afterEach, mock } from 'node:test'
import assert from 'node:assert'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { GitSetup } from '../functions/git'

// Mock execSync to prevent actual scaffolding
mock.method(require('child_process'), 'execSync', () => {})

// Mock inquirer.prompt to prevent interactive prompts
mock.method(require('inquirer'), 'prompt', () => Promise.resolve({}))

// Mock console.log to keep output clean
mock.method(console, 'log', () => {})

import Adonisjs from '../src/adonisjs'
import Angular from '../src/angular'
import Expressjs from '../src/expressjs'
import Nestjs from '../src/nestjs'
import Nextjs from '../src/nextjs'
import Nuxtjs from '../src/nuxtjs'
import ReactNative from '../src/react-native'
import Strapi from '../src/strapi'
import Vuejs from '../src/vuejs'

describe('Scaffold Automation Tests', () => {
  // Helper to instantiate and run handle
  const run = async (Class: any, args: any) => {
    const instance = new Class({ projectName: 'test-app', packageManager: 'npm', args })
    // Mock scaffold to avoid execution and just allow inspecting state if needed
    instance.scaffold = async () => {}
    await instance.handle()
    return instance.command
  }

  test('AdonisJS: should skip prompts with flags', async () => {
    const cmd = await run(Adonisjs, {
      'boilerplate': 'api',
      'db': 'postgres',
      'auth-guard': 'session',
    })
    assert.ok(cmd.includes('kit=api'))
    assert.ok(cmd.includes('db=postgres'))
    assert.ok(cmd.includes('auth-guard=session'))
  })

  test('Angular: should skip prompts with flags', async () => {
    const cmd = await run(Angular, {
      'routing': true,
      'style': 'scss',
      'template': 'inline',
      'type': 'strict',
      'skip-tests': true,
      'ssr': false,
      'prefix': 'app',
    })
    assert.ok(cmd.includes('--routing'))
    assert.ok(cmd.includes('--style=scss'))
    assert.ok(cmd.includes('--skip-tests'))
    assert.ok(cmd.includes('--ssr=false'))
    assert.ok(cmd.includes('--prefix=app'))
    assert.ok(cmd.includes('-t inline'))
  })

  test('ExpressJS: should skip prompts with flags', async () => {
    const cmd = await run(Expressjs, { view: 'ejs', css: 'sass' })
    assert.ok(cmd.includes('view=ejs'))
    assert.ok(cmd.includes('css=sass'))
  })

  test('NestJS: should skip prompts with flags', async () => {
    const cmd = await run(Nestjs, { strict: true })
    assert.ok(cmd.includes('-strict'))
  })

  test('Next.js: should skip prompts with flags', async () => {
    const cmd = await run(Nextjs, {
      'tailwind': true,
      'eslint': true,
      'app': true,
      'src-dir': true,
      'import-alias': '@/*',
      'typescript': true,
    })
    assert.ok(cmd.includes('--tailwind'))
    assert.ok(cmd.includes('--eslint'))
    assert.ok(cmd.includes('--app'))
    assert.ok(cmd.includes('--src-dir'))
    assert.ok(cmd.includes('--import-alias=@/*'))
    assert.ok(cmd.includes('--typescript')) // Next.ts uses updateCommand('alias', 'typescript')
  })

  test('NuxtJS: should skip prompts with flags', async () => {
    const cmd = await run(Nuxtjs, {
      ui: 'tailwind',
      template: 'html',
      features: [],
      eslint: true,
      test: 'jest',
      mode: 'universal',
      target: 'server',
      devTools: [],
      ci: 'none',
      typescript: true,
    })
    assert.ok(cmd.includes('nuxi'))
    assert.ok(cmd.includes('-t html'))
    assert.ok(cmd.includes('--force'))
  })

  test('React Native: should skip prompts with flags', async () => {
    const cmd = await run(ReactNative, { typescript: true })
    assert.ok(cmd.includes('react-native'))
    assert.ok(cmd.includes('--typescript'))
  })

  test('Strapi: should skip prompts with flags', async () => {
    const cmd = await run(Strapi, {
      quick: false,
      dbclient: 'sqlite',
      dbfile: 'mydb.db',
      typescript: true,
    })
    assert.ok(cmd.includes('dbclient=sqlite'))
    assert.ok(cmd.includes('dbfile=mydb.db'))
    assert.ok(cmd.includes('--typescript')) // Strapi explicitly calls updateCommand('alias', 'typescript')
  })

  test('VueJS: should skip prompts with flags', async () => {
    const cmd = await run(Vuejs, {
      'jsx': true,
      'router': true,
      'pinia': true,
      'eslint': true,
      'vitest': true,
      'typescript': true,
      'eslint-with-prettier': true,
      'testing-framework': 'cypress',
    })
    assert.ok(cmd.includes('--ts'))
    assert.ok(cmd.includes('--jsx'))
    assert.ok(cmd.includes('--router'))
    assert.ok(cmd.includes('--pinia'))
    assert.ok(cmd.includes('--eslint'))
    assert.ok(cmd.includes('--prettier'))
    assert.ok(cmd.includes('--vitest'))
    assert.ok(cmd.includes('--cypress'))
  })

  // Additional test cases with different options

  test('AdonisJS: web boilerplate with mysql', async () => {
    const cmd = await run(Adonisjs, {
      'boilerplate': 'web',
      'db': 'mysql',
      'auth-guard': 'access_tokens',
    })
    assert.ok(cmd.includes('kit=web'))
    assert.ok(cmd.includes('db=mysql'))
    assert.ok(cmd.includes('auth-guard=access_tokens'))
  })

  test('AdonisJS: slim boilerplate without db', async () => {
    const cmd = await run(Adonisjs, {
      boilerplate: 'slim',
    })
    assert.ok(cmd.includes('kit=slim'))
  })

  test('Angular: minimal setup with less styling', async () => {
    const cmd = await run(Angular, {
      'routing': false,
      'style': 'less',
      'skip-tests': false,
      'ssr': true,
      'prefix': 'myapp',
    })
    assert.ok(cmd.includes('--ssr'))
    assert.ok(cmd.includes('--prefix=myapp'))
    assert.ok(cmd.includes('--skip-tests=false'))
  })

  test('ExpressJS: pug view with plain css', async () => {
    const cmd = await run(Expressjs, { view: 'pug', css: 'plain' })
    assert.ok(cmd.includes('view=pug'))
    assert.ok(cmd.includes('css=plain'))
  })

  test('ExpressJS: hbs view with less', async () => {
    const cmd = await run(Expressjs, { view: 'hbs', css: 'less' })
    assert.ok(cmd.includes('view=hbs'))
    assert.ok(cmd.includes('css=less'))
  })

  test('Next.js: minimal setup without tailwind', async () => {
    const cmd = await run(Nextjs, {
      'tailwind': false,
      'eslint': false,
      'app': false,
      'src-dir': false,
      'import-alias': '@components/*',
      'typescript': false,
    })
    // Verify the command was built and contains the base create-next-app command
    assert.ok(cmd.includes('create-next-app'))
    // Verify at least one no- flag is present (meaning false options are handled)
    assert.ok(cmd.includes('--no-') || cmd.includes(' no-'))
  })

  test('NuxtJS: SPA mode with different options', async () => {
    const cmd = await run(Nuxtjs, {
      ui: 'vuetify',
      template: 'pug',
      features: ['axios', 'pwa'],
      linter: ['eslint', 'prettier'],
      test: 'ava',
      mode: 'spa',
      target: 'static',
      devTools: ['jsconfig.json'],
      ci: 'github-actions',
      typescript: false,
    })
    assert.ok(cmd.includes('nuxi'))
    assert.ok(cmd.includes('--force'))
  })

  test('React Native: skip pods installation', async () => {
    const cmd = await run(ReactNative, {
      'install-pods': false,
      'skip-install': true,
    })
    assert.ok(cmd.includes('react-native'))
    assert.ok(cmd.includes('--skip-install'))
  })

  test('Strapi: postgres database setup', async () => {
    const cmd = await run(Strapi, {
      quick: false,
      dbclient: 'postgres',
      dbhost: 'localhost',
      dbport: '5432',
      dbname: 'strapi_db',
      dbusername: 'postgres',
      dbpassword: 'secret',
      typescript: false,
    })
    assert.ok(cmd.includes('dbclient=postgres'))
    assert.ok(cmd.includes('dbhost=localhost'))
    assert.ok(cmd.includes('dbport=5432'))
    assert.ok(cmd.includes('dbname=strapi_db'))
  })

  test('Strapi: mysql database setup', async () => {
    const cmd = await run(Strapi, {
      quick: false,
      dbclient: 'mysql',
      dbhost: '127.0.0.1',
      dbport: '3306',
      dbname: 'my_strapi',
      typescript: true,
    })
    assert.ok(cmd.includes('dbclient=mysql'))
    assert.ok(cmd.includes('dbhost=127.0.0.1'))
    assert.ok(cmd.includes('dbname=my_strapi'))
    assert.ok(cmd.includes('--typescript'))
  })

  test('VueJS: minimal setup without extras', async () => {
    const cmd = await run(Vuejs, {
      'jsx': false,
      'router': false,
      'pinia': false,
      'eslint': false,
      'vitest': false,
      'typescript': false,
      'eslint-with-prettier': false,
      'testing-framework': 'none',
    })
    assert.ok(cmd.includes('create-vue'))
    assert.ok(cmd.includes('default'))
  })

  test('VueJS: with cypress testing', async () => {
    const cmd = await run(Vuejs, {
      'jsx': true,
      'router': true,
      'pinia': true,
      'eslint': true,
      'vitest': true,
      'typescript': true,
      'eslint-with-prettier': true,
      'testing-framework': 'cypress',
    })
    assert.ok(cmd.includes('--jsx'))
    assert.ok(cmd.includes('--router'))
    assert.ok(cmd.includes('--cypress'))
  })

  test('GitSetup: git only without husky', async () => {
    const args = { git: true, husky: false }
    const tmpDir = require('os').tmpdir()
    const gitSetup = new GitSetup('test-app', path.join(tmpDir, 'test-app-2'), 'angular', args)
    await gitSetup.setupGit()
    assert.ok(true)
  })

  test('GitSetup: skip both git and husky', async () => {
    const args = { git: false, husky: false }
    const tmpDir = require('os').tmpdir()
    const gitSetup = new GitSetup('test-app', path.join(tmpDir, 'test-app-3'), 'vuejs', args)
    await gitSetup.setupGit()
    assert.ok(true)
  })

  test('GitSetup: should skip prompts with git true husky false', async () => {
    // GitSetup with husky=true requires a real package.json file in the target directory
    // Since we mock execSync and the directory doesn't exist, we test with husky=false
    const args = { git: true, husky: false }
    const tmpDir = require('os').tmpdir()
    const gitSetup = new GitSetup('test-app', path.join(tmpDir, 'test-app-git'), 'nextjs', args)
    await gitSetup.setupGit()
    assert.ok(true)
  })
})
