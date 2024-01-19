import { execSync } from 'child_process';
import inquirer from 'inquirer';

export const supported_package_managers = ['npm', 'yarn', 'pnpm'];

export default async function run(data: initial_input) {

    let { packageManager, projectName } = data;

    let command = packageManager === 'yarn'
        ? 'yarn create adonis-ts-app'
        : packageManager === 'pnpm'
            ? 'pnpm init adonis-ts-app'
            : 'npm init adonis-ts-app'

    const { boilerplate } = await inquirer.prompt(
        [
            {
                type: 'list',
                name: 'boilerplate',
                message: 'Select the project boilerplate:',
                choices: ["api", "web", "slim"],
            }
        ]
    );



    execSync(`${command} ${projectName} -- --boilerplate=${boilerplate} --name=${projectName}`, { stdio: 'inherit' });
}