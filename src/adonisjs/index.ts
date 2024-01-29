import inquirer from 'inquirer'
import { Base } from '../base';

export class adonisjs extends Base {

  public static SupportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  constructor(data: InitialInput) {

    let { packageManager, projectName } = data;

    super(packageManager)

    switch (packageManager) {
      case 'npm':
        this.command += ` init adonis-ts-app ${projectName} -- --name=${projectName}`
        break
      case 'yarn':
        this.command += ` create adonis-ts-app ${projectName} -- --name=${projectName}`
        break
      case 'pnpm':
        this.command += ` create adonis-ts-app ${projectName} -- --name=${projectName}`
        break
    }

  }


  public async handle() {

    const { boilerplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'boilerplate',
        message: 'Select the project boilerplate:',
        choices: ['api', 'web', 'slim'],
      },
    ]);
    const { eslint } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'eslint',
        message: 'Setup eslint?:',
        default: false,
      },
    ]);

    this.updateCommand('alias', { boilerplate, eslint });

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
    ]);

    this.updateCommand('alias', { encore, prettier });

    await this.scaffold();

  }
}
