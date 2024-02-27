const blacklistedTags = ['address', 'article', 'aside', 'audio', 'bdi', 'button', 'canvas', 'caption', 'data',
  'embed',  'fieldset', 'footer', 'form', 'header', 'hgroup',  'input', 'ins', 'label', 'link', 'main', 'math',
  'meter', 'nav', 'object', 'optgroup', 'option', 'picture', 'progress', 'script', 'section', 'select', 'svg']

export default ({ pageUrl } = {}) => (tree) =>
  tree.walk((node) => {
    // id attributes not allowed
    delete node?.attrs?.id

    // escape HTML comments
    if (typeof node === 'string') {
      return node.replace(/<!--/g, '&lt;!--')
    }

    // only http links allowed
    if (node.tag === 'a' && node.attrs?.href) {
      if (pageUrl && node.attrs.href.startsWith('#')) {
        node.attrs.href = pageUrl + node.attrs.href
      } else if (!node.attrs.href.startsWith('http')) {
        delete node.attrs.href
      }
    }

    // some tags not allowed
    if (blacklistedTags.includes(node.tag)) {
      const tagAttributes = Object.entries(node.attrs).map(([key, val]) => {
        return `${key}="${val}"`
      }).join(' ')

      return [
        `&lt;${node.tag}${tagAttributes ? ' ' + tagAttributes: ''}&gt;`,
        ...node.content,
        `&lt;/${node.tag}&gt;`
      ]
    }
    return node
  })
