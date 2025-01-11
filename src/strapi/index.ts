import inquirer from 'inquirer'
import { Base } from '../base'
import { askUseTypeScript } from '../../functions'

export default class Strapi extends Base {
  public static supportedPackageManagers: Array<Exclude<PackageManager, 'pnpm'>> = ['npm', 'yarn']
  public node: string = '18.0.0'
  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    const { packageManager = 'npm', projectName } = data

    super(packageManager)

    if (packageManager === 'pnpm') return

    this.command += this.baseCommand(packageManager, projectName)
  }

  private baseCommand(
    packageManager: Exclude<PackageManager, 'pnpm'>,
    projectName: string
  ): string {
    const commandMap: Record<Exclude<PackageManager, 'pnpm'>, string> = {
      npm: ` strapi-app@latest ${projectName}`,
      yarn: ` create strapi-app ${projectName}`,
    }
    return commandMap[packageManager]
  }

  public async handle() {
    const useTypeScript = await askUseTypeScript()

    if (useTypeScript) {
      this.updateCommand('alias', 'typescript')
    }

    this.updateCommand('alias', 'no-run')

    const { quick } = await this.promptInstallationType()

    if (!quick) {
      const { dbclient } = await this.promptDatabaseClient()

      if (dbclient === 'sqlite') {
        const { dbfile } = await this.promptDatabaseFilePath()
        this.updateCommand('alias', { dbclient, dbfile })
      } else {
        const database = await this.promptDatabaseDetails(dbclient)
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
