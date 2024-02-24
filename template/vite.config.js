import path from 'path'
import fs from 'fs'

import yaml from 'yaml'
import { defineConfig } from 'vite'

import posthtml from '@vituum/vite-plugin-posthtml'
import include from 'posthtml-include'
import whatever from 'posthtml-include-whatever'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

import { injectCss } from './build/inject-css'
import templateRenderers from './build/template-renderers'
import watchExtraFiles from './build/watch-extra-files'
import htmlCssPrefix from './build/html-css-prefix'
import filterInnerTree from './build/filter-inner-tree'
import stripLimitedAttributes from './build/strip-limited-attributes'

const src = path.resolve(__dirname, './src')
const outDir = path.resolve(__dirname, './dist')

const loadLocals = (path) => {
  if (!path) {
    return {}
  }

  const fileData = fs.readFileSync(path, 'utf-8')

  if (path.endsWith('.yml')) {
    return yaml.parse(fileData)
  } else if (path.endsWith('.json')) {
    return JSON.parse(fileData)
  }
  return {}
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  const dataFilePath = ['data.yml', 'data.json']
    .map((filename) => path.resolve(__dirname, 'src', filename))
    .find((pathName) => fs.existsSync(pathName))

  const locals = loadLocals(dataFilePath)

  const config = {
    alias: {
      '@': src
    },
    assetsDir: '.',
    build: {
      cssCodeSplit: false,
      emptyOutDir: true,
      minify: false,
      outDir,
      rollupOptions: {
        output: {
          assetFileNames: `[name].[ext]`
        }
      }
    },
    plugins: [
      injectCss({ build: isBuild }),
      posthtml({
        root: src,
        include: false,
        plugins: [
          whatever({
            renderers: templateRenderers,
            root: src,
            locals
          }),
          include({ root: src, posthtmlExpressionsOptions: { locals, missingLocal: '' } }),
          ...filterInnerTree({
            classFilter: isBuild ? null : 'user_formatted',
            plugins: [
              htmlCssPrefix({ prefix: 'custom-' }),
              stripLimitedAttributes({ pageUrl: locals?.itch_url ?? '' })
            ]
          })
        ]
      }),
      isBuild && ViteMinifyPlugin(),
      watchExtraFiles([dataFilePath].filter(Boolean), (file, server) => {
        server.restart()
      })
    ].filter(Boolean)
  }

  if (isBuild) {
    config.root = src
  }

  return config
})
