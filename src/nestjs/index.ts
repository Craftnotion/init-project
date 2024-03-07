import inquirer from 'inquirer'
import { Base } from '../base'
import { isNestCliInstalled } from '../../functions/nestcli'

export default class Nestjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    !isNestCliInstalled() &&
      super(
        packageManager === 'npm'
          ? 'npm i -g @nestjs/cli'
          : packageManager === 'yarn'
            ? 'yarn global add @nestjs/cli'
            : 'pnpm add -g @nestjs/cli'
      )

    super(`nest new ${projectName} --package-manager=${packageManager}`)
  }

  public async handle() {
    const { strictMode } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'strictMode',
        message: 'Enables strict mode in TypeScript.',
        default: false,
      },
    ])

    strictMode && this.updateCommand('flag', '-strict')

    this.scaffold()
  }
}
