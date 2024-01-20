import chalk from 'chalk'
import path from 'path'
import { execSync } from 'child_process'

import {
  askFramework,
  askPackageManager,
  askProjectName,
  getPackageManager,
  isDirectoryNotEmpty,
  handlePackageManager,
  updatePkg,
  copyTemplates,
} from './src/functions'

import runAdonis from './src/adonisjs'
import runNext from './src/nextjs'
import runReactNative from './src/react-native'
import runStrapi from './src/strapi'
import config from './config'

/**
 * Running all the tasks to create a new project.
 */
export async function runTasks() {
  console.log(chalk.bold('\nWelcome to Project Initialization Wizard!'))

  const projectName = await askProjectName().catch((err) => {
    console.log(chalk.red.bold(err))
    process.exit(1)
  })

  const projectPath = path.join(process.cwd(), projectName)

  if (isDirectoryNotEmpty(projectPath)) {
    console.log(
      chalk.red.bold(
        '\nError: The project folder is not empty. Please choose a different name or use an empty folder.'
      )
    )
    process.exit(1)
  }

  const platform = await askFramework()

  const packageManager = await askPackageManager(
    getPackageManager(process.cwd()),
    config[platform]['package-manager']
  )

  try {
    switch (platform) {
      case 'adonisjs':
        await runAdonis({ projectName, packageManager })
        break
      case 'nextjs':
        await runNext({ projectName, packageManager })
        break
      case 'react native':
        await runReactNative({ projectName, packageManager })
        break
      case 'strapi':
        await runStrapi({ projectName, packageManager })
        break
      default:
        console.log(chalk.red.bold('Error: Invalid platform.'))
        process.exit(1)
    }
  } catch (err) {
    console.log(chalk.red.bold('\nOperation failed. Please try again'))
    process.exit(1)
  }

  console.log(
    chalk.green(`\nInitializing GIT and adding necessary packages to ${projectName}...\n`)
  )

  await updatePkg(projectPath, 'devDependencies', { chalk: '^4.1.2' })

  execSync('git init', { stdio: 'inherit', cwd: projectPath })

  execSync('npx husky-init', { stdio: 'inherit', cwd: projectPath })

  console.log(
    chalk.green(`\nHusky and commit message template added successfully to ${projectName}!\n`)
  )

  if (!isGitCzInstalled()) {
    console.log(chalk.yellow('\nGit-cz is not installed. Installing globally...\n'))

    await updatePkg(projectPath, 'devDependencies', { 'git-cz': '' })

    console.log(chalk.green('\nGit-cz installed successfully!\n'))
  }

  console.log(chalk.green(`\nCopying the templates`))

  await copyTemplates(projectPath)

  let command = handlePackageManager(projectPath, packageManager)

  if (!command) {
    console.log(chalk.green(`\nUnable to identify the package manager, Using NPM`))

    command = 'npm install'
  }
  execSync(command, { stdio: 'inherit', cwd: projectPath })
}

function isGitCzInstalled(): boolean {
  try {
    execSync('git-cz --version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

runTasks()
