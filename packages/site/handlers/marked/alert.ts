import type { MarkedExtension } from 'marked'
import markedAlert from 'marked-alert'

/**
 * Creates a Marked extension for rendering Bootstrap-styled alerts with
 * [`marked-alert`](https://www.npmjs.com/package/marked-alert).
 *
 * @returns The Marked extension object.
 */
export default function markedAlertBootstrap(): MarkedExtension {
  return {
    ...markedAlert({ className: 'alert' }),
    extensions: [
      {
        name: 'alert',
        level: 'block',
        renderer({ meta, tokens = [] }) {
          let { variant, title } = meta

          switch (meta.variant) {
            case 'note':
              variant = 'info'
              title = 'Good to know'
              break
            case 'tip':
              variant = 'success'
              title = 'Did you know?'
              break
            case 'important':
              variant = 'primary'
              title = 'Heads up'
              break
            case 'warning':
              variant = 'warning'
              title = 'Be aware'
              break
            case 'caution':
              variant = 'danger'
              title = 'Handle with care'
              break
          }

          // use default renderer
          let tmpl = `<ui:alert variant="${variant} pb-0">\n`
          tmpl += `<ui:alert.heading as="h4">`
          tmpl += `<ui:icon class="me-2" name="${meta.variant}"></ui:icon>`
          tmpl += title
          tmpl += '</ui:alert.heading>\n'
          tmpl += this.parser.parse(tokens)
          tmpl += '</ui:alert>\n'

          return tmpl.replace(/\<a /, '<a class="alert-link" ')
        }
      }
    ]
  }
}
