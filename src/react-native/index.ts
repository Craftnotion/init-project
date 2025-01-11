import inquirer from 'inquirer'

import { Base } from '../base'

export default class ReactNative extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn']
  public node: string = '>=18.0.0'
  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`npx @react-native-community/cli@latest init ${projectName}`)
  }

  public async handle() {
    const data = await inquirer.prompt<{ 'install-pods': boolean }>({
      type: 'confirm',
      name: 'install-pods',
      message: 'Do you want to install CocoaPods now?',
      default: true,
    })

    this.updateCommand('alias', data)

    await this.scaffold()
  }
}
