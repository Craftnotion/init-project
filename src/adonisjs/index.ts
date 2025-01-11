import inquirer from 'inquirer'
import { Base } from '../base'

export default class Adonisjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  public packageManager: PackageManager
  public projectName: string
  public node: string = '^20.0.0 || >=22.0.0'

  constructor(data: InitialInput) {
    const { packageManager, projectName } = data

    super('npm init ')

    this.packageManager = packageManager
    this.projectName = projectName
  }

  public async handle() {
    const { boilerplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'boilerplate',
        message: 'Select the project boilerplate:',
        choices: ['api', 'web', 'slim'],
      },
    ])

    await this.handleVersion6(boilerplate)

    await this.scaffold()
  }

  private async handleVersion6(boilerplate: string) {
    this.command += ` adonisjs -- ${this.projectName}`

    this.updateCommand('alias', { kit: boilerplate, pkg: this.packageManager })

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
      },
    ])

    this.updateCommand('alias', options)
  }

  private databases = [
    {
      name: 'SQLite',
      value: 'sqlite',
    },
    {
      name: 'MySQL / MariaDB',
      value: 'mysql',
    },
    {
      name: 'PostgreSQL',
      value: 'postgres',
    },
    {
      name: 'Microsoft SQL Server',
      value: 'mssql',
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
      value: 'session',
      hint: 'Authenticate users using cookies and session.',
    },
    {
      name: 'Access Token',
      value: 'access_tokens',
      hint: 'Authenticate clients using tokens.',
    },
    {
      name: 'Skip',
      alias: undefined,
      hint: 'I want to configures guards by myself.',
    },
  ]
}
