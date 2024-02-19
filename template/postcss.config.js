import { templateClasses } from './build/template-classes.cjs'

export default {
  plugins: {
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
