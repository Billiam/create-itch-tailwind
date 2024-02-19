import posthtml from 'posthtml'

export default ({ classFilter, plugins } = {}) => {
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
      // return tree
      return tree.match({ attrs: { class: classRegex } }, (node) => {
        if (node.content) {
          posthtml().use(plugins).process(node.content, { skipParse: true })
        }
        return node
      })
    }
  ]
}
