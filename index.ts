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
} from './functions'
import { setupGit } from './functions/git'

async function runPackageManager(projectPath: string, packageManager: string) {
  let command = handlePackageManager(projectPath, packageManager)
  if (!command) {
    console.log(chalk.green(`\nUnable to identify the package manager, Using NPM`))
    command = 'npm install'
  }
  try {
    execSync(command, { stdio: 'inherit', cwd: projectPath })
  } catch (err) {
    console.log(chalk.red.bold('\nUnable to run the command. Please try again.'))
    process.exit(1)
  }
}

/**
 * Running all the tasks to create a new project.
 */
export async function runTasks() {
  console.log(chalk.bold('\nWelcome to Project Initialization Wizard!'))

  const projectName = await askProjectName()

  const projectPath = path.join(process.cwd(), projectName)

  if (isDirectoryNotEmpty(projectPath)) {
    console.log(
      chalk.red.bold(
        '\nError: The project folder is not empty. Please choose a different name or use an empty folder.'
      )
    )
  }

  const platform = await askFramework()
  const PlatformClass = await import(`./src/${platform.toLocaleLowerCase()}`).catch(console.log)

  if (!PlatformClass) {
    console.log(chalk.red.bold(`\nError: ${platform} is not a valid platform.`))
    process.exit(1)
  }

  const packageManager = await askPackageManager(
    getPackageManager(process.cwd()),
    PlatformClass.default.supportedPackageManagers
  )
  const platformInstance = new PlatformClass.default({ projectName, packageManager })

  try {
    await platformInstance.handle()
  } catch (err) {
    console.log(err)
    console.log(chalk.red.bold("\nCouldn't initialize the project. Please try again."))
    process.exit(1)
  }

  await setupGit(projectName, projectPath).catch((err) => {
    console.log(chalk.red.bold("\nCouldn't initialize GIT. Please run git init"))
    console.log(err)
    process.exit(1)
  })

  await runPackageManager(projectPath, packageManager)
}
