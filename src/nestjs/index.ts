import inquirer from 'inquirer'
import { Base } from '../base'
import { isNestCliInstalled } from '../../functions/index'

export default class Nestjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']
  public node: string = '16.0.0'
  public packageManager: PackageManager

  /**
   * Base command for nestjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`nest new ${projectName} --package-manager=${packageManager}`)

    this.packageManager = packageManager
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

    //In case of nest js checking for nest cli and installing
    isNestCliInstalled(this.packageManager)

    this.scaffold()
  }
}
