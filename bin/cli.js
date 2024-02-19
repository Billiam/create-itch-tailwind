#!/usr/bin/env node
import process from 'process'

import loadTemplates, { validateUrl } from '../lib/itch-templates.js'
import chalk from 'chalk'

import { program, InvalidArgumentError } from 'commander'

const validateUrlOption = (url) => {
  if (!validateUrl(url)) {
    throw new InvalidArgumentError('Must be a valid itch.io URL')
  }
  return url
}

program
  .name('create-itch-tailwind')
  .description('CLI for creating new itch.io pages based on vite and tailwind')
  .version('0.0.1')

program.configureOutput({
  outputError: (str, write) => write(chalk.red(str))
})

program
  .command('fetch-templates')
  .description('Create templates for project, profile, or game jam URL')
  .argument('<url>', 'Project, profile, or jam URL', validateUrlOption)
  .option('-f, --force', 'overwrite existing files')
  .action((url, options) => {
    const directory = process.cwd()
    loadTemplates(directory, url, options)
  })

program
  .command('create', { isDefault: true })
  .description('Create new project structure')
  .action(async () => {
    const createApp = (await import('../lib/create-app.js')).default

    createApp()
  })

program.parse()
