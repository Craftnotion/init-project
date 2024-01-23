import { execSync } from 'child_process'
import inquirer from 'inquirer'

export default async function run(data: InitialInput) {
  let { projectName, packageManager } = data
  // Project options
  const { routing, type, inlineStyle, template, prefix } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'routing',
      message: 'Include routing?',
    },
    {
      type: 'list',
      name: 'inlineStyle',
      message: 'Styles:',
      choices: [
        { name: 'inline', value: true },
        { name: 'separate', value: false },
      ],
    },
    {
      type: 'list',
      name: 'template',
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
  ])

  // Testing frameworks
  const { unitTests, ssr, style } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'unitTests',
      message: 'Include unit testing (Karma/Jasmine)?',
    },
    {
      type: 'confirm',
      name: 'ssr',
      message:
        'Creates an application with Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering) enabled',
      default: false,
    },
    {
      type: 'list',
      name: 'style',
      message: 'Which stylesheet format would you like to use? ',
      choices: ['css', 'scss', 'sass', 'less'],
      default: 'css',
    },
  ])

  // Build command
  const command = `npx -p @angular/cli ng new ${projectName} ${routing ? '--routing' : ''} ${inlineStyle ? '--s' : ''} ${template ? '--t' : ''} ${prefix ? `--prefix=${prefix}` : ''} ${style ? `--style=${style}` : ''}  --${type} ${!unitTests ? '--skip-tests' : ''} ${ssr ? '--ssr=true' : '--ssr=false'}`

  execSync(command, { stdio: 'inherit' })
}
