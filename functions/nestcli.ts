import { execSync } from 'child_process'

export function isNestCliInstalled() {
  try {
    execSync('git --version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}
