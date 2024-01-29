import inquirer from 'inquirer'
import { Base } from '../base'
import { askUseTypeScript } from '../functions'

export default class Nextjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(packageManager)

    switch (packageManager) {
      case 'npm':
        this.command += ` init create-next-app ${projectName}`
        break
      case 'yarn':
        this.command += ` create next-app ${projectName}`
        break
      case 'pnpm':
        this.command += ` create next-app ${projectName}`
        break
    }
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
    Object.keys(data).map((key) => {
      if (data[key]) {
        data[key] = undefined
      } else {
        data[key] += `--no-${key}`
      }
    })

    data[useTypeScript ? 'ts' : 'js'] = undefined

    this.updateCommand('alias', data)

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
