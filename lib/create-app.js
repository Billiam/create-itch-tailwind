import fs from 'fs/promises'
import path from 'path'

import fetchTemplates, { validateUrl } from './itch-templates.js'
import { confirm, input } from '@inquirer/prompts'
import chalk from 'chalk'

export default async () => {
  const dirname = process.cwd()
  const projectName = (await input({ message: 'Project name: ', default: 'itch-project' })).trim()

  const directoryName = projectName.replace(/[,./\\]/, '')
  const projectDir = path.resolve(dirname, directoryName)

  try {
    const dirInfo = await fs.stat(projectDir)
    if (!dirInfo.isDirectory()) {
      console.error(`file ${directoryName} already exists`)
      return
    }
  } catch (e) {
    const create = await confirm({ message: `Create ${directoryName} directory? ` })
    if (!create) {
      console.error('Directory was not created')
      return
    }
    await fs.mkdir(projectDir)
  }

  const templateDir = path.resolve(import.meta.dirname, '../template')

  await fs.mkdir(path.resolve(projectDir, 'src'))

  const fileList = [
    'build',

    'src/data.yml',
    'src/index.css',

    '.prettierignore',
    '.prettierrc.json',
    'package.json',
    'postcss.config.js',
    'tailwind.config.js',
    'vite.config.js'
  ]

  const fileMap = {
    ...Object.fromEntries(fileList.map((fileName) => [fileName, fileName])),
    gitignore: '.gitignore'
  }

  console.log(`Creating project in ${projectDir}...\n`)
  await Promise.all(
    Object.entries(fileMap).map(([fromName, toName]) => {
      return fs.cp(path.resolve(templateDir, fromName), path.resolve(projectDir, toName), {
        recursive: true
      })
    })
  )

  const projectUrl = (
    await input({
      message: '[optional] Enter the project URL to fetch existing content and layout: ',
      validate: (url) => !url.trim() || validateUrl(url)
    })
  ).trim()

  if (projectUrl) {
    await fetchTemplates(projectDir, projectUrl)
  } else {
    console.log(
      chalk.yellow(
        'You can fetch template files later by calling\n  create-itch-tailwind fetch-templates\n'
      )
    )
  }

  console.log('Done, now run:\n')
  console.log(chalk.green(`  cd ${directoryName}`))
  console.log(chalk.green(`  npm install`))
  console.log(chalk.green(`  npm run dev`))
}
