import inquirer from 'inquirer'
import { Base } from '../base'
import { askUseTypeScript } from '../../functions'

export default class Vuejs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']
  public node: string = '>=18.3.0'
  /**
   * Base command for adonisjs
   */
  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`npx create-vue@latest ${projectName}`, data.args)
  }

  protected updateCommand(type: 'alias' | 'flag', data: any) {
    if (Array.isArray(data)) {
      data.forEach((item) => {
        this.command += ` --${item}`
      })
      return
    }
    super.updateCommand(type, data)
  }

  public async handle() {
    const useTypeScript = await askUseTypeScript(this.args)

    let data: any = {
      'jsx': this.args.jsx,
      'router': this.args.router,
      'pinia': this.args.pinia,
      'eslint': this.args.eslint,
      'eslint-with-prettier': this.args['eslint-with-prettier'] || this.args.eslintWithPrettier,
    }

    const questions: any = []
    if (data.jsx === undefined)
      questions.push({
        type: 'confirm',
        name: 'jsx',
        message: 'Add JSX Support?',
        default: false,
      })
    if (data.router === undefined)
      questions.push({
        type: 'confirm',
        name: 'router',
        message: 'Add Vue Router for Single Page Application development?',
        default: false,
      })
    if (data.pinia === undefined)
      questions.push({
        type: 'confirm',
        name: 'pinia',
        message: 'Add Pinia for state management?',
        default: false,
      })
    if (data.eslint === undefined)
      questions.push({
        type: 'confirm',
        name: 'eslint',
        message: 'Add ESLint for code quality?',
        default: true,
      })
    if (data['eslint-with-prettier'] === undefined && data.eslint !== false)
      questions.push({
        type: 'confirm',
        name: 'eslint-with-prettier',
        message: 'Add Prettier for code formatting?',
        default: true,
      })

    const answers = await inquirer.prompt(questions)
    data = {
      ...data,
      ...answers,
      'jsx': data.jsx ?? answers.jsx,
      'router': data.router ?? answers.router,
      'pinia': data.pinia ?? answers.pinia,
      'eslint': data.eslint ?? answers.eslint,
      'eslint-with-prettier': data['eslint-with-prettier'] ?? answers['eslint-with-prettier'],
    }

    let options = []

    if (useTypeScript) options.push('ts')
    if (data.jsx) options.push('jsx')
    if (data.router) options.push('router')
    if (data.pinia) options.push('pinia')
    if (data.eslint) options.push('eslint')
    if (data['eslint-with-prettier']) options.push('prettier')

    let testing: any = {
      'vitest': this.args.vitest,
      'testing-framework': this.args['testing-framework'] || this.args.testingFramework,
    }

    const testingQuestions: any = []
    if (testing.vitest === undefined)
      testingQuestions.push({
        type: 'confirm',
        name: 'vitest',
        message: 'Add Vitest for Unit Testing?',
        default: false,
      })

    if (testing['testing-framework'] === undefined && testing.vitest !== false)
      testingQuestions.push({
        type: 'list',
        name: 'testing-framework',
        message: 'Add an End-to-End Testing Solution?',
        choices: [
          { name: 'No', value: 'none' },
          { name: 'Cypress', value: 'cypress' },
          { name: 'Nightwatch', value: 'nightwatch' },
          { name: 'Playwright', value: 'playwright' },
        ],
        default: 'none',
      })

    const testingAnswers = await inquirer.prompt(testingQuestions)
    testing = {
      ...testing,
      ...testingAnswers,
      'vitest': testing.vitest ?? testingAnswers.vitest,
      'testing-framework': testing['testing-framework'] ?? testingAnswers['testing-framework'],
    }

    if (testing.vitest) {
      options.push('vitest')
    }
    if (testing['testing-framework'] && testing['testing-framework'] !== 'none') {
      options.push(testing['testing-framework'])
    }

    if (options.length === 0) {
      options.push('default')
    }

    this.updateCommand('alias', options)

    await this.scaffold()
  }
}
