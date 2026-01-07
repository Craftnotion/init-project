import inquirer from 'inquirer'
import { Base } from '../base'
import { askProjectName, askUseTypeScript, getPackageManager } from '../../functions'

export default class Nuxtjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']
  public node: string = '>=18.0.0'
  /**
   * Base command for adonisjs
   */

  public packageManager: string
  public projectName: string

  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`npx nuxi@latest init ${projectName} -t v3`, data.args)

    this.packageManager = packageManager
    this.projectName = projectName
  }

  public async handle() {
    // nuxi init supports --template and other flags.
    // We can also pass --force to skip some prompts if needed.
    this.updateCommand('alias', 'force')

    if (this.args.template) {
      this.command += ` -t ${this.args.template}`
    }

    await this.scaffold()
  }
}
