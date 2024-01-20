import { execSync } from 'child_process'
import inquirer from 'inquirer'

import { askUseTypeScript } from '../functions'

export const SupportedPackageManagers = ['npm', 'yarn']

export default async function run(data: InitialInput) {
  let { packageManager, projectName } = data

  let database = {} as { [key in DatabaseConfigOptions]: string }

  let command =
    packageManager === 'yarn' ? 'yarn create strapi-app' : 'npx create-strapi-app@latest'

  const useTypeScript = await askUseTypeScript()

  const { quick } = await inquirer.prompt({
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

  if (!quick) {
    const { dbclient } = await inquirer.prompt([
      {
        type: 'list',
        name: 'dbclient',
        message: 'Database client',
        choices: ['sqlite', 'postgres', 'mysql'],
        default: 'sqlite',
      },
    ])

    database.dbclient = dbclient as Dbclient

    if (dbclient === 'sqlite') {
      let { dbfile } = await inquirer.prompt([
        {
          type: 'input',
          name: 'dbfile',
          message: 'Database file path for sqlite',
          default: '.tmp/data.db',
        },
      ])

      database.dbfile = dbfile
    } else {
      for (let prompt of databaseConfig) {
        let { [prompt.field]: value } = await inquirer.prompt([
          {
            type: prompt.type || 'input',
            name: prompt.field,
            message: prompt?.message,
            ...(prompt.field === 'dbport'
              ? {
                  default: defaultPorts[database.dbclient as Dbclient],
                }
              : prompt.default
                ? {
                    default: prompt.default,
                  }
                : {}),
          },
        ])

        database[prompt.field] = value
      }
    }
  }

  execSync(
    `${command} ${projectName.trim()} ${quick ? '--quickstart' : ''} ${
      !quick
        ? `${Object.keys(database)
            .map((key: string) => `--${key}=${database[key as DatabaseConfigOptions]}`)
            .join(' ')}`
        : ''
    } --no-run ${useTypeScript ? '--ts' : ''}`,
    {
      stdio: 'inherit',
    }
  )
}

const defaultPorts: PortType = {
  postgres: 5432,
  mysql: 3306,
  sqlite: 3306,
}

type DatabaseConfigOptions =
  | 'dbclient'
  | 'dbusername'
  | 'dbname'
  | 'dbhost'
  | 'dbport'
  | 'dbuser'
  | 'dbpassword'
  | 'dbssl'
  | 'dbfile'
  | 'dbforce'

type Dbclient = 'sqlite' | 'postgres' | 'mysql'

type PortType = { [key in Dbclient]: number }

const databaseConfig: Array<{
  field: DatabaseConfigOptions
  message: string
  default?: any
  type?: string
}> = [
  {
    field: 'dbname',
    message: 'Database name',
  },
  {
    field: 'dbhost',
    message: 'Database host',
    default: '127.0.0.1',
  },
  {
    field: 'dbport',
    message: 'Database port',
    default: defaultPorts,
  },
  {
    field: 'dbusername',
    message: 'Database username',
  },
  {
    field: 'dbpassword',
    message: 'Database password',
    type: 'password',
  },
  {
    field: 'dbssl',
    message: 'Database SSL',
    type: 'confirm',
    default: false,
  },
]
