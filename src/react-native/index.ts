import inquirer from 'inquirer'
import { askUseTypeScript } from '../../functions'

import { Base } from '../base'

export default class ReactNative extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn']
  public node: string = '>=18.0.0'
  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`npx @react-native-community/cli@latest init ${projectName}`, data.args)
  }

  public async handle() {
    const useTypeScript = await askUseTypeScript(this.args)

    // We need to pass it as an object
    const data = {
      'skip-install': this.args['skip-install'] || this.args.skipInstall,
      'install-pods': this.args['install-pods'] || this.args.installPods || false,
      'typescript': useTypeScript,
    }

    this.updateCommand('alias', data)

    await this.scaffold()
  }
}
