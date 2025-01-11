import inquirer from 'inquirer';
import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import { updatePkg } from '.';
import { join } from 'path';

export class GitSetup {
  constructor(
    private projectName: string,
    private projectPath: string,
    private platform: string
  ) { }

  /**
   * Checks if Git is installed on the system.
   */
  private static isGitInstalled(): boolean {
    try {
      execSync('git --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if Git is configured with a user name and email.
   */
  private static isGitConfigured(): boolean {
    try {
      execSync('git config --get user.name');
      execSync('git config --get user.email');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Prompts the user for Git configuration details (username and email),
   * then sets them globally.
   */
  private static async configureGit(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter your Git username:',
        validate: (input: string) => input.trim() !== '',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter your Git email:',
        validate: (input: string) => /\S+@\S+\.\S+/.test(input),
      },
    ]);

    execSync(`git config --global user.name "${answers.name}"`);
    execSync(`git config --global user.email "${answers.email}"`);

    console.log(chalk.blue('\nGit configuration updated.'));
  }

  /**
   * Checks if `git-cz` (Commitizen) is installed.
   */
  private static isGitCzInstalled(): boolean {
    try {
      execSync('git-cz --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Installs and sets up Husky & Commitizen (if necessary),
   * and copies relevant templates for standardized commits.
   */
  private async standardiseCommits(): Promise<void> {
    if (!GitSetup.isGitCzInstalled()) {
      console.log(chalk.yellow('\nCommitizen is not installed. Installing globally...'));
      // Install commitizen (version unspecified) as a dev dependency
      await updatePkg(this.projectPath, 'devDependencies', { commitizen: '' });
    }

    // Example: ensures chalk is in devDependencies
    await updatePkg(this.projectPath, 'devDependencies', { chalk: '^4.1.2' });
    console.log(chalk.green('\nCommitizen installed successfully!'));

    // Initialize Husky for Git hooks
    execSync('npx husky-init', { stdio: 'inherit', cwd: this.projectPath });
    execSync('chmod ug+x .husky/*', { stdio: 'inherit', cwd: this.projectPath });
    console.log(
      chalk.green(`\nHusky and commit message template added successfully to ${this.projectName}!`)
    );

    console.log(chalk.green(`\nCopying the templates...`));
    await this.copyTemplates();
  }

  /**
   * Copies commit message templates, validation scripts, and changelog configs.
   * Also removes the default pre-commit hook if present.
   */
  private async copyTemplates(): Promise<void> {
    const preCommitPath = join(this.projectPath, '.husky', 'pre-commit');
    if (fs.existsSync(preCommitPath)) {
      fs.unlinkSync(preCommitPath);
    }

    // Dynamically load the correct commit-msg template
    const commitMsgFile = join(
      __dirname,
      `../templates/commit-msg${this.platform === 'react-native' ? '-react-native' : ''}.txt`
    );
    const commitMessage = fs.readFileSync(commitMsgFile, 'utf-8');
    fs.writeFileSync(join(this.projectPath, '.husky', 'commit-msg'), commitMessage, 'utf-8');

    // Copy validate script
    const validatePath = join(__dirname, '../templates/validate.txt');
    const validateScript = fs.readFileSync(validatePath, 'utf-8');
    fs.writeFileSync(join(this.projectPath, 'validate.js'), validateScript, 'utf-8');

    // Copy changelog config
    const changelogConfigPath = join(__dirname, '../templates/changelog.config.txt');
    const changeLogConfig = fs.readFileSync(changelogConfigPath, 'utf-8');
    fs.writeFileSync(join(this.projectPath, 'changelog.config.cjs'), changeLogConfig, 'utf-8');

    // Make Husky scripts executable on non-Windows systems
    if (process.platform !== 'win32') {
      execSync('chmod ug+x .husky/*', { stdio: 'inherit', cwd: this.projectPath });
    }
  }

  /**
   * Prompts the user to optionally initialize Git and standardize commit messages.
   * If Git is not installed or configured, it helps the user set up Git configuration.
   */
  public async setupGit(): Promise<boolean> {
    // Check if Git is installed
    if (!GitSetup.isGitInstalled()) {
      console.log(chalk.red.bold('\nGit is not installed. Please install Git and try again.'));
      return false;
    }

    // Check if Git is configured, if not, configure it
    if (!GitSetup.isGitConfigured()) {
      console.log(chalk.blue('Git is not configured. Please enter details to configure Git.'));
      await GitSetup.configureGit();
    }

    // Ask user if they want to initialize Git and set up Husky
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

    // Initialize Git repository
    if (git) {
      console.log(chalk.green(`\nInitializing Git in ${this.projectPath}`));
      execSync('git init', { stdio: 'inherit', cwd: this.projectPath });
    }

    // Standardize commit messages if chosen
    if (husky) {
      await this.standardiseCommits();
    }

    return true;
  }
}
