import inquirer from 'inquirer'
import { Base } from '../base'
import { isSailsCliInstalled } from '../../functions/index'

export default class Sailsjs extends Base {
    public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

    public packageManager: PackageManager

    /**
     * Base command for sailsjs
     */
    constructor(data: InitialInput) {
        let { packageManager = 'npm', projectName } = data

        super(`sails new ${projectName} --package-manager=${packageManager}`)

        this.packageManager = packageManager
    }

    public async handle() {
        const { strictMode } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'strictMode',
                message: 'Enable strict mode in TypeScript.',
                default: false,
            },
        ])

        strictMode && this.updateCommand('flag', '--typescript')

        // In case of Sails.js, check if the CLI is installed and install if necessary
        isSailsCliInstalled(this.packageManager)

        this.scaffold()
    }
}
