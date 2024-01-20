import { execSync } from 'child_process'
import { askUseTypeScript } from '../functions'

export const SupportedPackageManagers = ['npm', 'yarn']

export default async function run(data: InitialInput) {
  let { packageManager, projectName } = data

  let command =
    packageManager === 'yarn' ? 'yarn create strapi-app' : 'npx create-strapi-app@latest'

  const useTypeScript = await askUseTypeScript()

  execSync(`${command} ${projectName} --quickstart --no-run ${useTypeScript ? '--ts' : '--js'}`, {
    stdio: 'inherit',
  })
}
