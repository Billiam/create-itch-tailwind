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
    return node
  })
}

export default ({ classFilter, prefix } = {}) => {
  return processTree(prefix)
}
