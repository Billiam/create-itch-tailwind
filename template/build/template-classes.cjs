const posthtml = require('posthtml')
const path = require('path')
const fs = require('fs')

const templateClasses = new Set()

const template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')

posthtml()
  .use((tree) => {
    tree.walk((node) => {
      const classes = (node?.attrs?.['class']?.split(/ +/) || [])
        .map((className) => className.trim())
        .filter(className => className && className !== 'hidden')

      classes.forEach((className) => templateClasses.add(className))

      if (!classes.includes('.user_formatted')) {
        return node
      }
    })
  })
  .process(template, { sync: true })

module.exports = { templateClasses }
