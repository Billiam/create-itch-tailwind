import posthtml from 'posthtml'

// Allows a set of postHTML plugins to be applied only to an inner tree based on classname
export default ({ classFilter, plugins = [] } = {}) => {
  if (!classFilter) {
    return plugins
  }

  const classList = [classFilter]
    .flat()
    .map((className) => className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')

  const classRegex = new RegExp(`(^|\\s)${classList}($|\\s)`)

  return [
    (tree) => {
      return tree.match({ attrs: { class: classRegex } }, (node) => {
        if (node.content) {
          posthtml(plugins).process(node.content, { skipParse: true })
        }
        return node
      })
    }
  ]
}
