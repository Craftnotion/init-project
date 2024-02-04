import fs, { writeFileSync, readFileSync } from 'fs'
import inquirer from 'inquirer'
import path, { resolve, join } from 'path'
import { pathExistsSync } from 'fs-extra'
import { execSync } from 'child_process'

import { validateNpmName } from './validate-pkg'
import chalk from 'chalk'

/**
 * Function to prompt the user for the project name.
 * @returns {string} The project name.
 */
export async function askProjectName(): Promise<string> {
  const { projectName } = await inquirer.prompt({
    type: 'input',
    name: 'projectName',
    message: 'Enter the name of your project:',
    validate: (input) =>
      input.trim() !== ''
        ? validateNpmName(input)
          ? true
          : 'Package names can only contain lowercase letters, numbers, hyphens (-), and underscores (_). They must start and end with a lowercase letter or a number name should only contain lowercase alphabets'
        : 'Project name cannot be empty',
  })
  return projectName as string
}

/**
 * Function to check if a directory is empty or not.
 * @param {string} directoryPath - The path to the directory you want to check.
 * @returns {boolean} A boolean value indicating whether the directory is empty or
 */
export function isDirectoryNotEmpty(directoryPath: string): boolean {
  try {
    const files = fs.readdirSync(directoryPath)
    return files.length > 0
  } catch (error) {
    return false
  }
}

/**
 * Ask the user which package manager to use.
 * @param {string} value - The default value for the package manager.
 * @returns {package_manager} The package manager that the user chose.
 */
export async function askPackageManager(
  value: PackageManager,
  available: Array<PackageManager>
): Promise<PackageManager> {
  const { packageManager } = await inquirer.prompt({
    type: 'list',
    name: 'packageManager',
    message: 'Choose a package manager:',
    choices: available.length ? available : ['npm', 'yarn', 'pnpm'],
    default: available.includes(value) ? value : available[0],
  })
  return packageManager
}

/**
 * Ask the user which framework to use.
 * @returns {string} The framework that the user chose.
 */
export async function askFramework(): Promise<Framework> {
  const { platform } = await inquirer.prompt({
    type: 'list',
    name: 'platform',
    message: 'Select the platform to create:',
    choices: [
      'Adonisjs',
      'Nextjs',
      'Strapi',
      { value: 'react-native', name: 'React Native' },
      'Angular',
      'ExpressJs',
    ],
  })
  return platform.toLowerCase() as Framework
}

/**
 * Check which package manager is used
 * @param {string} appRoot - The root directory of the project.
 * @returns {package_manager} The package manager that is used.
 */
export function getPackageManager(appRoot: string): 'yarn' | 'pnpm' | 'npm' {
  if (pathExistsSync(resolve(appRoot, 'yarn.lock'))) {
    return 'yarn'
  }

  if (pathExistsSync(resolve(appRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }

  if (process.env.npm_config_user_agent) {
    if (process.env.npm_config_user_agent.includes('yarn')) {
      return 'yarn'
    }

    if (process.env.npm_config_user_agent.includes('pnpm')) {
      return 'pnpm'
    }
  }

  return 'npm'
}

/**
 * Ask the user if they want to use TypeScript.
 * @returns {boolean} A boolean value indicating whether the user wants to use TypeScript or not.
 */
export async function askUseTypeScript(): Promise<boolean> {
  const { useTypeScript } = await inquirer.prompt({
    type: 'confirm',
    name: 'useTypeScript',
    message: 'Do you want to use TypeScript?',
    default: false,
  })
  return useTypeScript
}

export function sanitizeProjectName(name: string): string {
  // Remove invalid characters
  const sanitizedName = name.replace(/[^a-z0-9-_]/g, '')

  // Ensure the name doesn't start or end with a dot or underscore
  const trimmedName = sanitizedName.replace(/^[\._]+|[\._]+$/g, '')

  // Ensure the name is not empty
  return trimmedName.length > 0 ? trimmedName : ''
}

export function handlePackageManager(projectPath: string, packageManager: string): string {
  const packageJsonPath = path.join(projectPath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return ''
  }

  if (packageManager === 'yarn') {
    const packageLockPath = path.join(projectPath, 'package-lock.json')
    const shrinkwrapPath = path.join(projectPath, 'pnpm-lock.yaml')
    fs.existsSync(packageLockPath) && fs.unlinkSync(packageLockPath)
    fs.existsSync(shrinkwrapPath) && fs.unlinkSync(shrinkwrapPath)
    return 'yarn'
  } else if (packageManager === 'npm') {
    const yarnLockPath = path.join(projectPath, 'yarn.lock')
    const shrinkwrapPath = path.join(projectPath, 'pnpm-lock.yaml')

    fs.existsSync(yarnLockPath) && fs.unlinkSync(yarnLockPath)
    fs.existsSync(shrinkwrapPath) && fs.unlinkSync(shrinkwrapPath)

    return 'npm install'
  } else if (packageManager === 'pnpm') {
    const packageLockPath = path.join(projectPath, 'package-lock.json')
    const yarnLockPath = path.join(projectPath, 'yarn.lock')

    fs.existsSync(yarnLockPath) && fs.unlinkSync(yarnLockPath)
    fs.existsSync(packageLockPath) && fs.unlinkSync(packageLockPath)

    return 'pnpm install'
  } else {
    return ''
  }
}

export async function getLatestVersion(
  packageManager: PackageManager,
  packageName: string
): Promise<string> {
  try {
    const command = `${packageManager} info ${packageName} version --json`
    const result = execSync(command, { encoding: 'utf-8' })
    let version = JSON.parse(result.trim())
    return version
  } catch (error: any) {
    console.error(
      chalk.red(
        `Error fetching latest version for ${packageName}. Installing latest version available.`
      )
    )
    execSync(`${packageManager} ${packageManager === 'npm' ? 'i' : 'add'} ${packageName}`, {
      encoding: 'utf-8',
    })
    return ''
  }
}

export async function updatePkg(
  projectPath: string,
  type: 'devDependencies' | 'dependencies' | 'scripts',
  data: { [key: string]: string }
) {
  let str = readFileSync(`${projectPath}/package.json`, 'utf-8')

  const pkg = JSON.parse(str) as any

  if (!pkg || !pkg[type]) {
    return false
  }

  for (let key in data) {
    let value = data[key]
    pkg[type] = pkg[type] || { [key]: value }

    if (!value && type !== 'scripts') {
      value = await getLatestVersion(getPackageManager(process.cwd()), key)

      if (!value) return false
    } else {
      return false
    }

    pkg[type][key] = value
  }
  const regex = /^[ ]+|\t+/m

  const indent = regex.exec(str)?.[0]

  writeFileSync(`${projectPath}/package.json`, `${JSON.stringify(pkg, null, indent)}\n`)
}
