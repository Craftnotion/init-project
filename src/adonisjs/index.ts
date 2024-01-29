import { execSync } from 'child_process'
import inquirer from 'inquirer'

export class adonisjs {

  public packageManager: string
  public projectName: string
  public SupportedPackageManagers: Array<PackageManager> = ['npm', 'yarn', 'pnpm']

  constructor(packageManager: string, projectName: string) {
    this.packageManager = packageManager
    this.projectName = projectName
  }


  public async handle() { }

}
export const SupportedPackageManagers = ['npm', 'yarn', 'pnpm']

export default async function run(data: InitialInput) {
  let { packageManager, projectName } = data

  let command =
    packageManager === 'yarn'
      ? 'yarn create adonis-ts-app'
      : packageManager === 'pnpm'
        ? 'pnpm create adonis-ts-app'
        : 'npm init adonis-ts-app'

  const { boilerplate } = await inquirer.prompt([
    {
      type: 'list',
      name: 'boilerplate',
      message: 'Select the project boilerplate:',
      choices: ['api', 'web', 'slim'],
    },
  ])

  execSync(`${command} ${projectName} -- --boilerplate=${boilerplate} --name=${projectName}`, {
    stdio: 'inherit',
  })
}
