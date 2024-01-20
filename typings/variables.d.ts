type PackageManager = 'npm' | 'yarn' | 'pnpm'

type Framework = 'adonisjs' | 'nextjs' | 'react native' | 'strapi'

type InitialInput = {
  projectName: string
  packageManager: PackageManager
}

type Prompt = {
  type: string
  name: string
  message: string
  choices?: Array<string>
  default?: boolean
}

type FrameworkConfig = {
  [key in Framework]: {
    'prompts'?: Array<Prompt>
    'package-manager': PackageManager[]
  }
}
