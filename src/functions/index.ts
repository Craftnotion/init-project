import fs from 'fs';
import inquirer from 'inquirer';
import path, { resolve } from 'path'
import { pathExistsSync } from 'fs-extra'
import { validateNpmName } from './validate-pkg';

/**
 * Function to prompt the user for the project name.
 * @returns {string} The project name.
 */
export async function askProjectName(): Promise<string> {
    const { projectName } = await inquirer.prompt({
        type: 'input',
        name: 'projectName',
        message: 'Enter the name of your project:',
        validate: (input) => (input.trim() !== '' ? (validateNpmName(input) ? true : "Package names can only contain lowercase letters, numbers, hyphens (-), and underscores (_). They must start and end with a lowercase letter or a number name should only contain lowercase alphabets") : 'Project name cannot be empty'),
    });
    return projectName as string;
}




/**
 * Function to check if a directory is empty or not.
 * @param {string} directoryPath - The path to the directory you want to check. 
 * @returns {boolean} A boolean value indicating whether the directory is empty or
 */
export function isDirectoryNotEmpty(directoryPath: string): boolean {
    try {
        const files = fs.readdirSync(directoryPath);
        return files.length > 0;
    } catch (error) {
        return false;
    }
}

/**
 * Ask the user which package manager to use.
 * @param {string} value - The default value for the package manager.   
 * @returns {package_manager} The package manager that the user chose.
 */
export async function askPackageManager(value: package_manager, available: Array<package_manager>): Promise<package_manager> {
    const { packageManager } = await inquirer.prompt({
        type: 'list',
        name: 'packageManager',
        message: 'Choose a package manager:',
        choices: available.length ? available : ['npm', 'yarn', 'pnpm'],
        default: available.includes(value) ? value : available[0]
    });
    return packageManager;
}

/**
 * Ask the user which framework to use.
 * @returns {string} The framework that the user chose.
 */
export async function askFramework(): Promise<framework> {
    const { platform } = await inquirer.prompt({
        type: 'list',
        name: 'platform',
        message: 'Select the platform to create:',
        choices: ['AdonisJS', 'Nextjs', 'Strapi', 'React Native'],
    });
    return platform.toLowerCase() as framework;
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
    });
    return useTypeScript;
}

export function sanitizeProjectName(name: string): string {
    // Remove invalid characters
    const sanitizedName = name.replace(/[^a-z0-9-_]/g, '');

    // Ensure the name doesn't start or end with a dot or underscore
    const trimmedName = sanitizedName.replace(/^[\._]+|[\._]+$/g, '');

    // Ensure the name is not empty
    return trimmedName.length > 0 ? trimmedName : "";
}


export function handlePackageManager(projectPath: string, packageManager: string): string {

    const packageJsonPath = path.join(projectPath, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
        return "";
    }

    if (packageManager === 'yarn') {
        const packageLockPath = path.join(projectPath, 'package-lock.json');
        const shrinkwrapPath = path.join(projectPath, 'pnpm-lock.yaml');
        fs.existsSync(packageLockPath) && fs.unlinkSync(packageLockPath);
        fs.existsSync(shrinkwrapPath) && fs.unlinkSync(shrinkwrapPath);
        return "yarn";
    }
    else if (packageManager === 'npm') {

        const yarnLockPath = path.join(projectPath, 'yarn.lock');
        const shrinkwrapPath = path.join(projectPath, 'pnpm-lock.yaml');

        fs.existsSync(yarnLockPath) && fs.unlinkSync(yarnLockPath);
        fs.existsSync(shrinkwrapPath) && fs.unlinkSync(shrinkwrapPath);

        return 'npm install';
    } else if (packageManager === 'pnpm') {
        const packageLockPath = path.join(projectPath, 'package-lock.json');
        const yarnLockPath = path.join(projectPath, 'yarn.lock');

        fs.existsSync(yarnLockPath) && fs.unlinkSync(yarnLockPath);
        fs.existsSync(packageLockPath) && fs.unlinkSync(packageLockPath);

        return 'pnpm install'
    } else {
        return "";
    }
}