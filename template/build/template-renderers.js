import fs from 'fs'
import ejs from 'ejs'

export default {
  ejs: (templatePath, { encoding, locals, root }) => {
    const fileContent = fs.readFileSync(templatePath, encoding)
    return ejs.render(fileContent, locals, { root })
  },
  html: (templatePath, { encoding }) => {
    return fs.readFileSync(templatePath, encoding)
  }
}
