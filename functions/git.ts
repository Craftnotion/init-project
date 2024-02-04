import inquirer from 'inquirer'
import { execSync } from 'child_process'
import chalk from 'chalk'
import fs from 'fs'
import { updatePkg } from '.'
import { join } from 'path'

function isGitInstalled() {
  try {
    execSync('git --version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

function isGitConfigured() {
  try {
    execSync('git config --get user.name')
    execSync('git config --get user.email')
    return true
  } catch (error) {
    return false
  }
}
async function configureGit() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter your Git username:',
      validate: (input) => input.trim() !== '',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter your Git email:',
      validate: (input) => /\S+@\S+\.\S+/.test(input),
    },
  ])

  execSync(`git config --global user.name "${answers.name}"`)
  execSync(`git config --global user.email "${answers.email}"`)

  console.log(chalk.blue('\nGit configuration updated.'))
}

function isGitCzInstalled(): boolean {
  try {
    execSync('git-cz --version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

async function standardiseCommits(projectName: string, projectPath: string) {
  if (!isGitCzInstalled()) {
    console.log(chalk.yellow('\nGit-cz is not installed. Installing globally...'))
    await updatePkg(projectPath, 'devDependencies', { 'git-cz': '' })
    await updatePkg(projectPath, 'devDependencies', { chalk: '^4.1.2' })
    console.log(chalk.green('\nGit-cz installed successfully!'))
    execSync('npx husky-init', { stdio: 'inherit', cwd: projectPath })
    console.log(
      chalk.green(`\nHusky and commit message template added successfully to ${projectName}!`)
    )

    console.log(chalk.green(`\nCopying the templates`))
    await copyTemplates(projectPath)
  }
}

export async function copyTemplates(projectPath: string) {
  //Remove default pre-commit

  if (fs.existsSync(`${projectPath}/.husky/pre-commit`)) {
    fs.unlinkSync(`${projectPath}/.husky/pre-commit`)
  }

  const commitMessage = fs.readFileSync(join(__dirname, `../../templates/commit-msg.txt`), 'utf-8')

  fs.writeFileSync(`${projectPath}/.husky/commit-msg`, commitMessage, 'utf-8')

  const validate = fs.readFileSync(join(__dirname, `../../templates/validate.txt`), 'utf-8')

  fs.writeFileSync(`${projectPath}/validate.js`, validate, 'utf-8')

  const changeLogConfig = fs.readFileSync(
    join(__dirname, `../../templates/changelog.config.txt`),
    'utf-8'
  )

  fs.writeFileSync(`${projectPath}/changelog.config.js`, changeLogConfig, 'utf-8')
}

/**
 * Ask the user if they want to use TypeScript.
 * @returns {boolean} A boolean value indicating whether the user wants to use TypeScript or not.
 */
export async function setupGit(projectName: string, projectPath: string): Promise<boolean> {
  if (!isGitInstalled()) {
    console.log(chalk.red.bold('\nGit is not installed. Please install git and try again.'))
    return true
  }

  if (!isGitConfigured()) {
    console.log(chalk.blue('Git is not configured. Please enter the details to configure GIT'))
    configureGit()
  }

  const { git, husky } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'git',
      message: 'Do you want to initialise git?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'husky',
      message: 'Do you want to standardise commit messages?',
      default: false,
      when: (answers: any) => answers.git === true,
    },
  ])

  if (git) {
    console.log(chalk.green(`\nInitializing GIT`))
    execSync('git init', { stdio: 'inherit', cwd: projectPath })
  }

  if (husky) {
    await standardiseCommits(projectName, projectPath)
  }

  return true
}
