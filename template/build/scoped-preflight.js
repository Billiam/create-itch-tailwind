import { withOptions } from 'tailwindcss/plugin.js'
import { readFileSync } from 'fs'
import postcss from 'postcss'

const scopedPreflightStyles = withOptions(({ cssSelector }) => ({ addBase }) => {
  const baseCssPath = require.resolve('tailwindcss/lib/css/preflight.css')
  const baseCssStyles = postcss.parse(readFileSync(baseCssPath, 'utf8'))

  baseCssStyles.walkRules((rule) => {
    rule.selectors = rule.selectors.map((s) => {
      if (s === 'html') {
        return cssSelector
      }
      return `${cssSelector} ${s}`
    })
    rule.selector = rule.selectors.join(',\n')
  })
  addBase(baseCssStyles.nodes)
})

export { scopedPreflightStyles }
