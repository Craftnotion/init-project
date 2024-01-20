import { execSync } from 'child_process'
import inquirer from 'inquirer'

export const SupportedPackageManagers = ['npm', 'yarn']

export default async function run(data: InitialInput) {
  let { packageManager, projectName } = data

  let command =
    packageManager === 'yarn' ? 'npx react-native@latest init' : 'npx react-native@latest init'

  const { pods } = await inquirer.prompt({
    type: 'confirm',
    name: 'pods',
    message: 'Do you want to install CocoaPods now?',
    default: true,
  })

  execSync(`${command} ${projectName} --install-pods=${pods} --pm=${packageManager}`, {
    stdio: 'inherit',
  })
}
