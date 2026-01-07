import * as assert from 'node:assert'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { exec, spawn } from 'child_process'

export const TEST_DIR = path.join(__dirname, '..', 'e2e-test-projects')
export const BIN_PATH = path.join(__dirname, '..', 'build', 'bin', 'index.js')

export function verifyFile(projectName: string, filePath: string) {
  const fullPath = path.join(TEST_DIR, projectName, filePath)
  assert.ok(fs.existsSync(fullPath), `File ${filePath} should exist`)
}

export function verifyPackageJson(projectName: string, dependency: string) {
  const packageJsonPath = path.join(TEST_DIR, projectName, 'package.json')
  assert.ok(fs.existsSync(packageJsonPath), 'package.json should exist')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  assert.ok(
    (packageJson.dependencies && packageJson.dependencies[dependency]) ||
      (packageJson.devDependencies && packageJson.devDependencies[dependency]),
    `Dependency ${dependency} should be present in package.json`
  )
}

export function execCLI(projectName: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true })
    }

    const command = 'node'
    const cliArgs = [BIN_PATH, projectName, ...args]

    console.log(`Running: ${command} ${cliArgs.join(' ')}`)

    const child = spawn(command, cliArgs, {
      cwd: TEST_DIR,
      env: { ...process.env, CI: 'true' },
    })

    child.stdout.on('data', (data) => {
      process.stdout.write(`[${projectName}] ${data}`)
    })

    child.stderr.on('data', (data) => {
      process.stderr.write(`[${projectName} ERR] ${data}`)
    })

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`CLI for ${projectName} exited with code ${code}`)
        reject(new Error(`Exited with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}
