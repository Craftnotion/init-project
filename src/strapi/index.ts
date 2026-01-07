import inquirer from 'inquirer'
import { Base } from '../base'
import { askUseTypeScript } from '../../functions'

export default class Strapi extends Base {
  public static supportedPackageManagers: Array<Exclude<PackageManager, 'pnpm'>> = ['npm', 'yarn']
  public node: string = '>=18.0.0'
  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    const { packageManager = 'npm', projectName } = data

    super('', data.args) // Pass empty string to avoid "npm" prefix duplication

    if (packageManager === 'pnpm') return

    this.command += this.baseCommand(packageManager, projectName)
  }

  private baseCommand(
    packageManager: Exclude<PackageManager, 'pnpm'>,
    projectName: string
  ): string {
    const commandMap: Record<Exclude<PackageManager, 'pnpm'>, string> = {
      npm: `npx create-strapi-app@latest ${projectName}`,
      yarn: `yarn create strapi-app ${projectName}`,
    }
    return commandMap[packageManager]
  }

  public async handle() {
    const useTypeScript = await askUseTypeScript(this.args)

    if (useTypeScript) {
      this.updateCommand('alias', 'typescript')
    }

    this.updateCommand('alias', 'no-run')

    let quick = this.args.quick

    if (quick === undefined) {
      // const result = await this.promptInstallationType()
      // quick = result.quick
      // Default to quick if not specified? Or let CLI handle it?
      // If we don't pass quick, Strapi usually asks.
      // But if we want to avoid double prompting, we might default to one or the other if user didn't specify.
      // However, the rule is "if framework is not following our prompts, don't show ours".
      // So we just pass undefined/nothing and let Strapi ask.
    }

    if (!quick) {
      let dbclient = this.args.dbclient
      // if (!dbclient) {
      //   const result = await this.promptDatabaseClient()
      //   dbclient = result.dbclient
      // }

      if (dbclient === 'sqlite') {
        let dbfile = this.args.dbfile
        // if (!dbfile) {
        //   const result = await this.promptDatabaseFilePath()
        //   dbfile = result.dbfile
        // }
        this.updateCommand('alias', { dbclient, dbfile })
      } else {
        const database = {
          dbname: this.args.dbname,
          dbhost: this.args.dbhost,
          dbport: this.args.dbport,
          dbusername: this.args.dbusername,
          dbpassword: this.args.dbpassword,
          dbssl: this.args.dbssl,
        }

        // If any required DB field is missing, we must prompt for ALL (or selectively, but simple is ALL)
        // Actually, promptDatabaseDetails prompts for ALL. So if any is missing, prompt.
        // Wait, strapi prompt is a list of questions. We can merge.

        if (
          !database.dbname ||
          !database.dbhost ||
          !database.dbport ||
          !database.dbusername ||
          !database.dbpassword
        ) {
          const result = await this.promptDatabaseDetails(dbclient)
          // merge
          Object.assign(database, result)
        }

        this.updateCommand('alias', { ...database, dbclient })
      }
    } else {
      this.updateCommand('alias', 'quickstart')
    }

    await this.scaffold()
  }

  private async promptInstallationType() {
    return await inquirer.prompt({
      type: 'list',
      name: 'quick',
      message: 'Choose your installation type',
      choices: [
        {
          name: 'Quickstart (recommended)',
          value: true,
        },
        {
          name: 'Custom (manual settings)',
          value: false,
        },
      ],
    })
  }

  private async promptDatabaseClient() {
    return await inquirer.prompt({
      type: 'list',
      name: 'dbclient',
      message: 'Database client',
      choices: ['sqlite', 'postgres', 'mysql'],
      default: 'sqlite',
    })
  }

  private async promptDatabaseFilePath() {
    return await inquirer.prompt({
      type: 'input',
      name: 'dbfile',
      message: 'Database file path for sqlite',
      default: '.tmp/data.db',
    })
  }

  private async promptDatabaseDetails(dbclient: string) {
    return await inquirer.prompt([
      {
        type: 'input',
        name: 'dbname',
        message: 'Database name',
        default: 'default',
      },
      {
        type: 'input',
        name: 'dbhost',
        message: 'Database host',
        default: '127.0.0.1',
      },
      {
        type: 'input',
        name: 'dbport',
        message: 'Database port',
        default: defaultPorts[dbclient as Dbclient],
      },
      {
        type: 'input',
        name: 'dbusername',
        message: 'Database username',
      },
      {
        type: 'password',
        name: 'dbpassword',
        message: 'Database password',
      },
      {
        type: 'confirm',
        name: 'dbssl',
        message: 'Database SSL',
        default: false,
      },
    ])
  }
}

const defaultPorts: PortType = {
  postgres: 5432,
  mysql: 3306,
  sqlite: 3306,
}

type Dbclient = 'sqlite' | 'postgres' | 'mysql'

type PortType = { [key in Dbclient]: number }
