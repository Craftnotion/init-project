import inquirer from 'inquirer'
import { Base } from '../base'

export default class Adonisjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  public packageManager: PackageManager
  public projectName: string
  public node: string = '14'

  constructor(data: InitialInput) {
    const { packageManager, projectName } = data

    super(packageManager)

    this.packageManager = packageManager
    this.projectName = projectName
  }

  public async handle() {
    const { version } = await inquirer.prompt([
      {
        type: 'list',
        name: 'version',
        message: 'Select the adonisjs version:',
        choices: ['v5', 'v6'],
      },
    ])

    const { boilerplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'boilerplate',
        message: 'Select the project boilerplate:',
        choices: ['api', 'web', 'slim'],
      },
    ])

    version === 'v5'
      ? await this.handleVersion5(boilerplate)
      : await this.handleVersion6(boilerplate)

    await this.scaffold()
  }

  private async handleVersion5(boilerplate: string) {
    this.node = '14'

    this.command = `npx create-adonis-ts-app ${this.projectName}`

    this.updateCommand('alias', { client: this.packageManager, name: this.projectName })

    const { eslint } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'eslint',
        message: 'Setup eslint?:',
        default: false,
      },
    ])

    this.updateCommand('alias', { boilerplate, eslint })

    const { encore, prettier } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'prettier',
        message: 'Setup prettier?:',
        default: false,
        when: eslint,
      },
      {
        type: 'confirm',
        name: 'encore',
        message: 'Configure webpack encore for compiling frontend assets?',
        default: false,
        when: boilerplate === 'web',
      },
    ])

    this.updateCommand('alias', { encore, prettier })
    this.updateCommand('alias', ['debug'])
  }
  private async handleVersion6(boilerplate: string) {
    this.node = '20.7'

    this.command = `npx create-adonisjs ${this.projectName}`

    this.updateCommand('alias', { kit: boilerplate, pkg: this.packageManager })

    this.updateCommand('alias', 'install')

    const options = await inquirer.prompt([
      {
        type: 'list',
        name: 'db',
        message: 'Define the database dialect to use with Lucid',
        choices: this.databases,
      },
      {
        type: 'list',
        name: 'auth-guard',
        message: 'Define the authentication guard for the Auth package',
        choices: this.authGuards,
        when: boilerplate === 'api',
      },
    ])

    this.updateCommand('alias', options)
  }

  private databases = [
    {
      name: 'SQLite',
      alias: 'sqlite',
    },
    {
      name: 'MySQL / MariaDB',
      alias: 'mysql',
    },
    {
      name: 'PostgreSQL',
      alias: 'postgres',
    },
    {
      name: 'Microsoft SQL Server',
      alias: 'mssql',
    },
    {
      name: 'Skip',
      hint: 'I want to configures the Lucid package by myself.',
      alias: undefined,
    },
  ]

  private authGuards = [
    {
      name: 'Session',
      alias: 'session',
      hint: 'Authenticate users using cookies and session.',
    },
    {
      name: 'Access Token',
      alias: 'access_tokens',
      hint: 'Authenticate clients using tokens.',
    },
    {
      name: 'Skip',
      alias: undefined,
      hint: 'I want to configures guards by myself.',
    },
  ]
}
