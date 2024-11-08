import { execSync } from 'child_process'

export class Base {
  protected command: string

  constructor(command: string) {
    this.command = command
  }

  protected updateCommand(
    type: 'alias' | 'flag',
    data: { [key: string]: undefined | string | boolean } | string | Array<string>
  ) {
    // Add prefix based on type
    const prefix = type === 'alias' ? ' --' : ' -'

    // If data is an array, append each item with prefix to the command
    if (Array.isArray(data)) {
      data.forEach((item) => {
        this.command += `${prefix}${item}`
      })
      return
    }

    // If data is a string, simply append it to the command
    if (typeof data === 'string') {
      this.command += `${prefix}${data}`
      return
    }

    // If data is an object, iterate over its entries
    Object.entries(data).forEach(([key, value]) => {
      // If value is not undefined, append key=value, otherwise just append key
      this.command += `${prefix}${key}${value !== undefined ? `=${value}` : ''}`
    })
  }

  protected scaffold() {
    execSync('npx clear-npx-cache', { stdio: 'inherit' })
    execSync(this.command, { stdio: 'inherit' })
  }
}
