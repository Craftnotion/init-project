import inquirer from 'inquirer'
import { Base } from '../base'
import { askProjectName, askUseTypeScript } from '../../functions'

export default class Nextjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']
  public node: string = '>=18.18.0'
  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`npx create-next-app@latest ${projectName} --use-${packageManager} --yes`, data.args)
  }

  public async handle() {
    const ts = await askUseTypeScript(this.args)

    const hasArgs =
      this.args.tailwind !== undefined ||
      this.args.eslint !== undefined ||
      this.args.app !== undefined ||
      this.args['src-dir'] !== undefined

    let data
    if (hasArgs) {
      data = {
        'tailwind': this.args.tailwind ?? true,
        'eslint': this.args.eslint ?? true,
        'app': this.args.app ?? true,
        'src-dir': this.args['src-dir'] || this.args.srcDir || true,
      }
    } else {
      data = await inquirer.prompt([
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
    }

    //Nextjs does not use boolean. So we have to do this
    let options: string[] = []

    Object.keys(data).map((key) => {
      options.push(data[key] ? key : `no-${key}`)
    })

    this.updateCommand('alias', options)

    if (ts) {
      this.updateCommand('alias', 'typescript')
    }
    let alias = this.args['import-alias'] || this.args.importAlias

    if (alias === undefined) {
      const answers = await inquirer.prompt({
        type: 'input',
        name: 'alias',
        message: 'What import alias would you like configured? (default @/*)',
        default: '@/*',
        validate: (value) =>
          /.+\/\*/.test(value) ? true : 'Import alias must follow the pattern <prefix>/*',
      })
      alias = answers.alias
    }

    this.updateCommand('alias', { 'import-alias': alias || '@/*' })

    await this.scaffold()
  }
}
