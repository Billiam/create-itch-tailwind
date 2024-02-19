import fs from 'fs/promises'
import path from 'path'

import { confirm } from '@inquirer/prompts'
import { parse } from 'node-html-parser'
import beautify from 'js-beautify'
import chalk from 'chalk'
import URL from 'url'

const { html_beautify } = beautify
const exists = async (path) => {
  try {
    await fs.access(path)
    return true
  } catch (e) {
    return false
  }
}

const writeFile = async (filename, content, directory, { force = false } = {}) => {
  const outputPath = path.join(directory, filename)
  const outputDir = path.dirname(outputPath)

  if (!(await exists(outputDir))) {
    const relativePath = path.relative(directory, outputDir)

    const confirmed = await confirm({
      message: `${relativePath} directory does not exist. Would you like to create it now? `
    })

    if (confirmed) {
      await fs.mkdir(outputDir, { recursive: true })
    } else {
      console.log(chalk.red(`${outputPath} could not be created`))
      return
    }
  }

  if (!(await exists(outputPath)) || force) {
    await fs.writeFile(outputPath, content, { encoding: 'utf-8' })
    console.log(chalk.blue(`Created ${filename}`))
  } else {
    console.log(chalk.yellow(`File ${filename} already exists, skipping...`))
  }
}

export default async (directory, url, options = {}) => {
  console.log(chalk.blue(`Fetching ${url} ...`))
  const request = await fetch(url)
  const body = await request.text()

  const root = parse(body)
  let pageNode = root.querySelector('.user_formatted')
  if (!pageNode) {
    pageNode = root.querySelector('.user_profile.formatted')
  }
  const originalContent = pageNode.innerHTML

  let customStyle = root.querySelector('.custom_css')
  if (!customStyle) {
    customStyle = root.querySelector('#custom_css')
  }

  const head = root.querySelector('head')
  if (customStyle) {
    head.removeChild(customStyle)
  } else {
    const jamNode = root.querySelector('#jam_theme')
    if (jamNode) {
      const sections = jamNode.innerHTML.match(
        /([\s\S]+\.jam_filter_picker \.divider {[^}]+})\s*([\s\S]*)/
      )
      if (sections) {
        jamNode.set_content(sections[1])
      }
    }
  }

  pageNode.set_content('<include src="index.html"></include>')

  await writeFile('index.html', html_beautify(root.innerHTML), directory, options)
  return writeFile('src/index.html', html_beautify(originalContent), directory, options)
}

export const validateUrl = (url) => {
  try {
    const parsedUrl = new URL.URL(url)
    return (
      /(^|\.)itch\.io$/.test(parsedUrl.host) && ['https:', 'http:'].includes(parsedUrl.protocol)
    )
  } catch (e) {
    console.error(e)
    return false
  }
}
