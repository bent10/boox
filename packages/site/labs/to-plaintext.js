import { Marked } from 'marked'
import markedAlert from 'marked-alert'
import { createDirectives, presetDirectiveConfigs } from 'marked-directive'
import markedPlaintify from 'marked-plaintify'
import stophtml from 'stophtml'

const marked = new Marked({ async: true, gfm: true }).use(
  markedPlaintify({
    code() {
      return ''
    },
    html(text) {
      return stophtml(text).join('\n') + '\n\n'
    }
  }),
  createDirectives([
    ...presetDirectiveConfigs,
    {
      level: 'container',
      marker: ':::',
      renderer(token) {
        if (token.meta.name === 'code-group') {
          return this.parser.parse(token.tokens)
        }
        return false
      }
    }
  ]),
  {
    ...markedAlert(),
    extensions: [
      {
        name: 'alert',
        level: 'block',
        renderer({ meta, tokens }) {
          return meta.variant.toUpperCase() + ': ' + this.parser.parse(tokens)
        }
      }
    ]
  }
)

export default async function markdownToPlaintext(content) {
  return (await marked.parse(content)).trimEnd()
}
