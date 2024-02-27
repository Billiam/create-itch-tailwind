// const colors from 'tailwindcss/colors')
import { scopedPreflightStyles } from './build/scoped-preflight'
import typography from '@tailwindcss/typography'
import { templateClasses } from './build/template-classes'

export default {
  // HTML files will be scanned for tailwind classes.
  content: ['./src/**/*.html'],
  theme: {
    extend: {}
  },
  plugins: [
    // Prefix tailwind's preflight reset with user_formatted class, so that itch.io UI isn't affected
    scopedPreflightStyles({ cssSelector: '.user_formatted' })
    // Enable .prose class. Remove to reduce CSS if not needed
    // typography({ target: 'legacy' })
  ],
  // whitelist all class names from template file so that they can be targeted if needed.
  // add your own classes here if they're part of the itch.io UI you're targeting
  // but don't appear in your base template
  safelist: [...Array.from(templateClasses)],
  corePlugins: {
    preflight: false
  },
  important: true,
  experimental: {
    optimizeUniversalDefaults: true
  }
}
