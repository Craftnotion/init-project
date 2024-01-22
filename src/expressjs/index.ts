import chalk from 'chalk'
import { execSync } from 'child_process'
import inquirer from 'inquirer'

export default async function run(data: InitialInput) {
  let { projectName } = data

  let command = 'npx express-generator'

  console.log(chalk.yellowBright('Please make sure you have python installed'))

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

    command += ` --view=${view} --css=${css}`
  }

  execSync(`${command} ${projectName}`, {
    stdio: 'inherit',
  })
}
