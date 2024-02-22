const blacklistedTags = ['script', 'link', 'picture']
export default (tree) =>
  tree.walk((node) => {
    // id attributes not allowed
    delete node?.attrs?.id
    // only http links allowed
    if (node.tag === 'a' && node.attrs?.href && !node.attrs.href.startsWith('http')) {
      delete node.attrs.href
    }
    // some tags not allowed
    if (blacklistedTags.includes(node.tag)) {
      return
    }
    return node
  })
