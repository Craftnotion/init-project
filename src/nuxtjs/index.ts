import inquirer from 'inquirer'
import { Base } from '../base'
import { askUseTypeScript } from '../../functions'

export default class Nuxtjs extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  /**
   * Base command for adonisjs
   */

  public packageManager: string
  public projectName: string

  constructor(data: InitialInput) {
    let { packageManager = 'npm', projectName } = data

    super(`npx create-nuxt-app ${projectName}`)

    this.packageManager = packageManager
    this.projectName = projectName
  }

  public async handle() {
    const useTypeScript = await askUseTypeScript()

    const data = await inquirer.prompt([
      {
        type: 'list',
        name: 'ui',
        message: 'UI framework:',
        choices: [
          { name: 'None', value: '' },
          { name: 'Ant Design Vue', value: 'ant-design-vue' },
          { name: 'BalmUI', value: 'balm-ui' },
          { name: 'Bootstrap Vue', value: 'bootstrap' },
          { name: 'Buefy', value: 'buefy' },
          { name: 'Chakra UI', value: 'chakra-ui' },
          { name: 'Element', value: 'element-ui' },
          { name: 'Oruga', value: 'oruga' },
          { name: 'Primevue', value: 'primevue' },
          { name: 'Tachyons', value: 'tachyons' },
          { name: 'Tailwind CSS', value: 'tailwind' },
          { name: 'Windi CSS', value: 'windicss' },
          { name: 'Vant', value: 'vant' },
          { name: 'View UI', value: 'view-ui' },
          { name: 'Vuetify.js', value: 'vuetify' },
        ],
        default: 'none',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Template engine:',
        choices: [
          { name: 'HTML', value: 'html' },
          { name: 'Pug', value: 'pug' },
        ],
        default: 'html',
      },
      {
        name: 'features',
        message: 'Nuxt.js modules:',
        type: 'checkbox',
        choices: [
          { name: 'Axios - Promise based HTTP client', value: 'axios' },
          { name: 'Progressive Web App (PWA)', value: 'pwa' },
          { name: 'Content - Git-based headless CMS', value: 'content' },
        ],
        default: [],
      },
      {
        name: 'linter',
        message: 'Linting tools:',
        type: 'checkbox',
        pageSize: 10,
        choices: [
          { name: 'ESLint', value: 'eslint' },
          { name: 'Prettier', value: 'prettier' },
          { name: 'StyleLint', value: 'stylelint' },
        ],
        default: [],
      },
      {
        name: 'test',
        message: 'Testing framework:',
        type: 'list',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'Jest', value: 'jest' },
          { name: 'AVA', value: 'ava' },
          { name: 'WebdriverIO', value: 'webdriverio' },
          { name: 'Nightwatch', value: 'nightwatch' },
        ],
        default: 'none',
      },
      {
        name: 'mode',
        message: 'Rendering mode:',
        type: 'list',
        choices: [
          { name: 'Universal (SSR / SSG)', value: 'universal' },
          { name: 'Single Page App', value: 'spa' },
        ],
        default: 'universal',
      },
      {
        name: 'target',
        message: 'Deployment target:',
        type: 'list',
        choices: [
          { name: 'Server (Node.js hosting)', value: 'server' },
          { name: 'Static (Static/Jamstack hosting)', value: 'static' },
        ],
        default: 'server',
      },
      {
        name: 'devTools',
        message: 'Development tools:',
        type: 'checkbox',
        choices: [
          {
            name: "jsconfig.json (Recommended for VS Code if you're not using typescript)",
            value: 'jsconfig.json',
          },
          { name: 'Semantic Pull Requests', value: 'semantic-pull-requests' },
          { name: 'Dependabot (For auto-updating dependencies, GitHub only)', value: 'dependabot' },
        ],
        default: [],
      },
      {
        when: ({ test, linter }) => test !== 'none' || linter.length > 0,
        name: 'ci',
        message: 'Continuous integration:',
        type: 'list',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'GitHub Actions (GitHub only)', value: 'github-actions' },
          { name: 'Travis CI', value: 'travis-ci' },
          { name: 'CircleCI', value: 'circleci' },
        ],
        default: 'none',
      },
    ])

    this.updateCommand('alias', {
      answers: JSON.stringify(
        JSON.stringify({
          ...data,
          language: useTypeScript ? 'ts' : 'js',
          pm: this.packageManager,
          name: this.projectName,
        })
      ),
    })

    await this.scaffold()
  }
}
