import inquirer from 'inquirer'
import { Base } from '../base'
import { askUseTypeScript } from '../../functions'

export default class Vuejs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']
  public node: string = '18.3.0'
  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`${packageManager} create vue@latest ${projectName} --`)
  }

  public async handle() {
    const useTypeScript = await askUseTypeScript()

    const data = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'jsx',
        message: 'Add JSX Support?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'router',
        message: 'Add Vue Router for Single Page Application development?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'pinia',
        message: 'Add Pinia for state management?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'eslint',
        message: 'Add ESLint for code quality?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'eslint-with-prettier',
        message: 'Add Prettier for code formatting?',
        default: true,
      },
    ])

    let options = []

    options.push(useTypeScript ? 'ts' : 'js')

    Object.keys(data).map((key) => data[key] && options.push(key))

    this.updateCommand('alias', options)

    const testing = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'vitest',
        message: 'Add Vitest for Unit testing?',
        default: true,
      },
      {
        type: 'list',
        name: 'testing-framework',
        message: 'Add an End-to-End Testing Solution?',
        choices: ['cypress', 'playwright', 'nightwatch', { value: '', name: 'none' }],
        default: '',
      },
    ])

    testing.vitest && this.updateCommand('alias', 'vitest')
    testing['testing-framework'] && this.updateCommand('alias', testing['testing-framework'])

    await this.scaffold()
  }
}
