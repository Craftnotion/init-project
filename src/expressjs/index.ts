import chalk from 'chalk'
import inquirer from 'inquirer'
import { Base } from '../base'

export default class Expressjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn']
  public node: string = '18.0.0'
  constructor(data: InitialInput) {
    let { projectName } = data
    super(`npx express-generator ${projectName}`)

    console.log(chalk.yellowBright('Please make sure you have python installed'))
  }

  public async handle() {
    const { needView } = await inquirer.prompt({
      type: 'confirm',
      name: 'needView',
      message: 'Do you need templating engine ?',
      default: true,
    })

    if (needView) {
      const { view } = await inquirer.prompt([
        {
          type: 'list',
          name: 'view',
          message: 'Select templating engine',
          choices: ['ejs', 'hbs', 'hjs', 'jade', 'pug', 'twig', 'vash'],
          default: 'ejs',
        },
      ])

      const { css } = await inquirer.prompt([
        {
          type: 'list',
          name: 'css',
          message: 'Select templating engine',
          choices: ['css', 'less', 'sass', 'compass', 'stylus'],
          default: 'css',
        },
      ])

      this.updateCommand('alias', { css, view })
    }

    await this.scaffold()
  }
}
