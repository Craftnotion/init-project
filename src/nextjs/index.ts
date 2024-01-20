import { execSync } from 'child_process'
import { askUseTypeScript } from '../functions'
import inquirer from 'inquirer'

export const SupportedPackageManagers = ['npm', 'yarn', 'pnpm']

export default async function run(data: InitialInput) {
  let { packageManager, projectName } = data

  let command =
    packageManager === 'yarn'
      ? 'yarn create next-app'
      : packageManager === 'pnpm'
        ? 'pnpm create next-app'
        : 'npx init create-next-app'

  const useTypeScript = await askUseTypeScript()

  const { tailwind } = await inquirer.prompt({
    type: 'confirm',
    name: 'tailwind',
    message: 'Initialize with Tailwind CSS config. (default)',
    default: false,
  })

  const { eslint } = await inquirer.prompt({
    type: 'confirm',
    name: 'eslint',
    message: 'Enable/disable eslint setup:',
    default: true,
  })

  const { app } = await inquirer.prompt({
    type: 'confirm',
    name: 'app',
    message: 'Initialize as an App Router project.',
    default: true,
  })

  const { srcDir } = await inquirer.prompt({
    type: 'confirm',
    name: 'srcDir',
    message: 'Initialize inside a `src/` directory',
    default: true,
  })

  const { importAlias } = await inquirer.prompt({
    type: 'input',
    name: 'importAlias',
    message: 'What import alias would you like configured? (default @/*)',
    default: '@/*',
    validate: (value) =>
      /.+\/\*/.test(value) ? true : 'Import alias must follow the pattern <prefix>/*',
  })

  execSync(
    `${command} ${projectName} ${useTypeScript ? '--ts' : '--js'} ${tailwind ? '--tailwind' : '--no-tailwind'} ${eslint ? '--eslint' : '--no-eslint'} ${app ? '--app' : '--no-app'} ${srcDir ? '--src-dir' : '--no-src-dir'} ${`--import-alias ${importAlias}`}`,
    { stdio: 'inherit' }
  )
}
