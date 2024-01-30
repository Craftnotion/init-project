import chalk from 'chalk';
import path from 'path';
import { execSync } from 'child_process';

import {
  askFramework,
  askPackageManager,
  askProjectName,
  getPackageManager,
  isDirectoryNotEmpty,
  handlePackageManager,
  updatePkg,
  copyTemplates,
  isGitCzInstalled,
} from './src/functions';

async function initializeProject(projectPath: string, projectName: string) {
  console.log(chalk.green(`\nInitializing GIT and adding necessary packages to ${projectName}...\n`));
  await updatePkg(projectPath, 'devDependencies', { chalk: '^4.1.2' });
  execSync('git init', { stdio: 'inherit', cwd: projectPath });
  execSync('npx husky-init', { stdio: 'inherit', cwd: projectPath });
  console.log(chalk.green(`\nHusky and commit message template added successfully to ${projectName}!\n`));
}

async function installGitCz(projectPath: string) {
  if (!isGitCzInstalled()) {
    console.log(chalk.yellow('\nGit-cz is not installed. Installing globally...\n'));
    await updatePkg(projectPath, 'devDependencies', { 'git-cz': '' });
    console.log(chalk.green('\nGit-cz installed successfully!\n'));
  }
}

async function runPackageManager(projectPath: string, packageManager: string) {
  let command = handlePackageManager(projectPath, packageManager);
  if (!command) {
    console.log(chalk.green(`\nUnable to identify the package manager, Using NPM`));
    command = 'npm install';
  }
  try {
    execSync(command, { stdio: 'inherit', cwd: projectPath });
  } catch (err) {
    console.log(chalk.red.bold('Unable to run the command. Please try again.'));
    process.exit(1);
  }
}

/**
 * Running all the tasks to create a new project.
 */
export async function runTasks() {
  console.log(chalk.bold('\nWelcome to Project Initialization Wizard!'));

  const projectName = await askProjectName().catch((err) => {
    console.log(chalk.red.bold(err));
    process.exit(1);
  });

  const projectPath = path.join(process.cwd(), projectName);

  if (isDirectoryNotEmpty(projectPath)) {
    console.log(chalk.red.bold('\nError: The project folder is not empty. Please choose a different name or use an empty folder.'));
    process.exit(1);
  }

  const platform = await askFramework();
  const PlatformClass = await import(`./src/${platform}`).catch(console.log);

  if (!PlatformClass) {
    console.log(chalk.red.bold(`\nError: ${platform} is not a valid platform.`));
    process.exit(1);
  }

  const packageManager = await askPackageManager(getPackageManager(process.cwd()), PlatformClass.default.supportedPackageManagers);
  const platformInstance = new PlatformClass.default({ projectName, packageManager });

  try {
    await platformInstance.handle();
  } catch (err) {
    console.log(chalk.red.bold("Couldn't initialize the project. Please try again."));
    process.exit(1);
  }

  await initializeProject(projectPath, projectName);
  await installGitCz(projectPath);

  console.log(chalk.green(`\nCopying the templates \n`));
  await copyTemplates(projectPath);

  await runPackageManager(projectPath, packageManager);
}