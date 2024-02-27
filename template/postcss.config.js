import { templateClasses } from './build/template-classes.cjs'
const normalizedClasses = Array.from(templateClasses).map(className => `.${className}`)

export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    './build/postcss/prefixer/prefixer.cjs': {
      prefix: 'custom-',
      ignore: [...Array.from(templateClasses), /^custom-/]
    },
    autoprefixer: {},
    cssnano: { preset: 'default' }
  }
}
