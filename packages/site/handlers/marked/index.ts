import type { RouteHandlerFn } from '@headless-route/vite'
import { Marked } from 'marked'
import markedShiki from 'marked-shiki'
import { createDirectives, presetDirectiveConfigs } from 'marked-directive'
import markedAlertBootstrap from './alert.js'
import codeGroup from './directives/code-group.js'
import { applyTagsTemplate } from './hooks.js'
import bootstrapRenderer from './renderer/index.js'
import { highlight, shikiContainer } from './shiki.js'

const markedHandler: RouteHandlerFn = async function (content) {
  // Marked processor
  const processor = new Marked({
    async: true,
    gfm: true,
    hooks: {
      async preprocess(markdown) {
        return await applyTagsTemplate(markdown)
      }
    }
  }).use(
    { renderer: bootstrapRenderer },
    markedAlertBootstrap(),
    createDirectives([...presetDirectiveConfigs, codeGroup]),
    markedShiki({ container: shikiContainer, highlight })
  )

  content = await processor.parse(content)

  let html = content
  const { layout, block = 'content' } = this.context.matter || {}

  if (layout) {
    html = `<extends src="${layout}">`
    html += `<block name="${block}">`
    html += content
    html += '</block></extends>'
  }

  return html
}

export default markedHandler
