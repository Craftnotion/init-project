import inquirer from 'inquirer'
import { Base } from '../base'

export default class Angular extends Base {
  public static supportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']
  public node: string = '>=18.19.1'
  constructor(data: InitialInput) {
    let { projectName, packageManager } = data
    super(
      `npx -p @angular/cli ng new ${projectName} --package-manager=${packageManager}`,
      data.args
    )
  }

  public async handle() {
    // Project options
    let projectOptions: Record<string, any> = {
      routing: this.args.routing,
      s: this.args.style,
      prefix: this.args.prefix || undefined,
      type: this.args.type,
      style: this.args.style,
    }

    if (this.args.template) {
      this.command += ` -t ${this.args.template}`
    }

    // If options are missing, we don't prompt. We let the Angular CLI handle it.
    projectOptions = { ...projectOptions }

    let type = projectOptions.type

    delete projectOptions.type

    this.updateCommand('alias', 'skip-git')
    this.updateCommand('alias', { [type]: true })

    this.updateCommand('alias', projectOptions)

    let otherOptions = {
      'skip-tests': this.args['skip-tests'],
      'ssr': this.args.ssr,
    }

    const otherQuestions = []
    if (
      this.args['skip-tests'] === undefined &&
      this.args.skipTests === undefined &&
      type !== 'minimal'
    )
      otherQuestions.push({
        type: 'confirm',
        name: 'skip-tests',
        message: 'Include unit testing (Karma/Jasmine)?',
      })
    if (this.args.ssr === undefined)
      otherQuestions.push({
        type: 'confirm',
        name: 'ssr',
        message:
          'Creates an application with Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering) enabled',
        default: false,
      })

    const otherAnswers = await inquirer.prompt(otherQuestions)

    otherOptions['skip-tests'] =
      this.args['skip-tests'] ?? this.args.skipTests ?? otherAnswers['skip-tests']
    otherOptions.ssr = this.args.ssr ?? otherAnswers.ssr

    this.updateCommand('alias', otherOptions)

    await this.scaffold()
  }
}
