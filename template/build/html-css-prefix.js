// prefix HTML classes
const processTree = (prefix) => (tree) => {
  tree.walk((node) => {
    const classes = node?.attrs?.class?.trim()?.split(/\s+/)?.filter(Boolean)
    if (classes) {
      node.attrs.class = classes
        .map((className) => {
          if (className.startsWith(prefix)) {
            return className
          }
          return prefix + className
        })
        .join(' ')
    }
    if (typeof node.content === 'string' && node.content.indexOf('<') !== -1) {
      node.content = tree.parser(node.content);
    }
    return node
  })
}

export default ({ prefix } = {}) => {
  return processTree(prefix)
}
