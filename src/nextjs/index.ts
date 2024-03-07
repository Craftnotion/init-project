import inquirer from 'inquirer'
import { Base } from '../base'
import { askUseTypeScript } from '../../functions'

export default class Nextjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`npx create-next-app@latest ${projectName} --use-${packageManager}`)
  }

  public async handle() {
    const useTypeScript = await askUseTypeScript()

    const data = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'tailwind',
        message: 'Initialize with Tailwind CSS config. (default)',
        default: false,
      },
      {
        type: 'confirm',
        name: 'eslint',
        message: 'Enable/disable eslint setup:',
        default: true,
      },
      {
        type: 'confirm',
        name: 'app',
        message: 'Initialize as an App Router project.',
        default: true,
      },
      {
        type: 'confirm',
        name: 'src-dir',
        message: 'Initialize inside a `src/` directory',
        default: true,
      },
    ])

    //Nextjs does not use boolean. So we have to do this
    let options = []

    Object.keys(data).map((key) => {
      options.push(data[key] ? key : `no-${key}`)
    })

    options.push(useTypeScript ? 'ts' : 'js')

    this.updateCommand('alias', options)

    let { alias } = await inquirer.prompt({
      type: 'input',
      name: 'alias',
      message: 'What import alias would you like configured? (default @/*)',
      default: '@/*',
      validate: (value) =>
        /.+\/\*/.test(value) ? true : 'Import alias must follow the pattern <prefix>/*',
    })

    this.updateCommand('alias', { 'import-alias': alias || '@/*' })

    await this.scaffold()
  }
}
