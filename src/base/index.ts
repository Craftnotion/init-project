import { execSync } from 'child_process'

export class Base {
  protected command: string

  constructor(command: string) {
    this.command = command
  }

  protected updateCommand(
    type: 'alias' | 'option',
    data: { [key: string]: undefined | string | boolean }
  ) {
    for (const [key, value] of Object.entries(data))
      this.command = `${this.command} ${type === 'alias' ? '--' : '-'}${key}${value === undefined ? '' : `=${String(value)}`}`
  }

  protected scaffold() {
    execSync(this.command, { stdio: 'inherit' })
  }
}
