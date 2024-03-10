import { execSync } from 'child_process'
import chalk from 'chalk'

//To check nest cli is installed or not
export function isNestCliInstalled(packageManager: PackageManager) {
  try {
    execSync('nest --version', { stdio: 'ignore' })
    return true
  } catch (error) {
    installNestCli(packageManager)
  }
}

function installNestCli(packageManager: PackageManager) {
  console.log(chalk.yellow(`\nYou do not have Nest Cli. Installing...`))

  execSync(
    packageManager === 'pnpm'
      ? 'pnpm add -g @nestjs/cli'
      : packageManager === 'yarn'
        ? 'yarn global add @nestjs/cli'
        : 'npm i -g @nestjs/cli'
  )

  return true
}
