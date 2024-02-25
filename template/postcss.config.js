import { templateClasses } from './build/template-classes.cjs'

export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-prefixer': {
      prefix: 'custom-',
      ignore: [...Array.from(templateClasses), /^custom-/]
    },
    autoprefixer: {},
    cssnano: { preset: 'default' }
  }
}
