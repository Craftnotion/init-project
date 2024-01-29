import inquirer from 'inquirer'
import { Base } from '../base'

export default class Angular extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  constructor(data: InitialInput) {
    let { projectName } = data
    super(`npx -p @angular/cli ng new ${projectName}`)
  }

  public async handle() {
    // Project options
    const projectOptions = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'routing',
        message: 'Include routing?',
      },
      {
        type: 'list',
        name: 's',
        message: 'Styles:',
        choices: [
          { name: 'inline', value: true },
          { name: 'separate', value: false },
        ],
      },
      {
        type: 'list',
        name: 't',
        message: 'Template:',
        choices: [
          { name: 'inline', value: true },
          { name: 'separate', value: false },
        ],
      },
      {
        type: 'input',
        name: 'prefix',
        message: 'Selector prefix (optional)',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Type of application required ?',
        choices: ['standalone', 'strict', 'minimal'],
      },
      {
        type: 'list',
        name: 'style',
        message: 'Which stylesheet format would you like to use? ',
        choices: ['css', 'scss', 'sass', 'less'],
        default: 'css',
      },
    ])

    this.updateCommand('alias', projectOptions)

    const otherOptions = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'skip-tests',
        message: 'Include unit testing (Karma/Jasmine)?',
      },
      {
        type: 'confirm',
        name: 'ssr',
        message:
          'Creates an application with Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering) enabled',
        default: false,
      },
    ])

    this.updateCommand('alias', otherOptions)

    await this.scaffold()
  }
}
