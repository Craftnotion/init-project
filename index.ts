import chalk from 'chalk';
import path from 'path';
import { execSync } from 'child_process';
import { addPackageDependencies } from 'write-package';

import { askFramework, askPackageManager, askProjectName, getPackageManager, isDirectoryNotEmpty, handlePackageManager } from './src/functions';

import runAdonis from './src/adonisjs';
import runNext from './src/nextjs';
import runReactNative from './src/react-native';
import runStrapi from './src/strapi';
import config from './config';

/**
 * Running all the tasks to create a new project.
 */
export async function runTasks() {

    console.log(chalk.bold('Welcome to Project Initialization Wizard!\n'));

    const projectName = await askProjectName();

    const projectPath = path.join(process.cwd(), projectName);

    if (isDirectoryNotEmpty(projectPath)) {
        console.log(chalk.red.bold('Error: The project folder is not empty. Please choose a different name or use an empty folder.'));
        process.exit(1);
    }

    const platform = await askFramework();

    const packageManager = await askPackageManager(getPackageManager(process.cwd()), config[platform]['package-manager']);



    switch (platform) {
        case 'adonisjs':
            await runAdonis({ projectName, packageManager });
            break;
        case 'nextjs':
            await runNext({ projectName, packageManager });
            break;
        case 'react native':
            await runReactNative({ projectName, packageManager });
            break;
        case 'strapi':
            await runStrapi({ projectName, packageManager });
            break;
        default:
            console.log(chalk.red.bold('Error: Invalid platform.'));
            process.exit(1);
    }


    console.log(chalk.green(`Initializing GIT and adding necessary packages to ${projectName}...\n`));

    await addPackageDependencies(process.cwd(), { devDependencies: { chalk: '^5.3.0' } })

    execSync('git init', { stdio: 'inherit', cwd: projectPath });

    execSync('npx husky-init', { stdio: 'inherit', cwd: projectPath });

    let command = handlePackageManager(projectPath, packageManager);

    if (!command) {
        console.log(chalk.green(`Unable to identify the package manager, Using NPM`));
        command = "npm install";
    }
    execSync(command, { stdio: 'inherit', cwd: projectPath });

}

runTasks()