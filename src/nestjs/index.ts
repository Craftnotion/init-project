import inquirer from 'inquirer'
import { Base } from '../base'
import { isNestCliInstalled } from '../../functions/index'

export default class Nestjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']
  public node: string = '>=16.0.0'
  public packageManager: PackageManager

  /**
   * Base command for nestjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`npx @nestjs/cli new ${projectName} --package-manager=${packageManager}`, data.args)

    this.packageManager = packageManager
  }

  public async handle() {
    let strictMode = this.args.strict || this.args.strictMode

    if (strictMode === undefined) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'strictMode',
          message: 'Enables strict mode in TypeScript.',
          default: false,
        },
      ])
      strictMode = answers.strictMode
    }

    strictMode && this.updateCommand('alias', 'strict')

    //In case of nest js checking for nest cli and installing
    isNestCliInstalled(this.packageManager)

    this.scaffold()
  }
}
