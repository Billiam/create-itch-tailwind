// Dynamically add CSS to an HTML file so that it can be exported
// and remove the css link tag from the HTML output
export const injectCss = ({ build = true }) => {
  const cssPath = `${build ? '' : 'src'}/index.css`

  const injectPlugin = {
    name: 'inject-css',
    transformIndexHtml: {
      order: 'pre',
      handler: () => {
        return [
          {
            tag: "link",
            attrs: {
              href: cssPath,
              rel: 'stylesheet'
            },
            injectTo: "head"
          }
        ]
      }
    }
  }
  const cleanupPlugin = {
    name: 'remove-css',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => {
        return html.replace(/<link [^>]*rel="stylesheet"[^>]*>/g, '').trim()
      }
    }
  }

  return [
    injectPlugin,
    build && cleanupPlugin
  ].filter(Boolean)
}
