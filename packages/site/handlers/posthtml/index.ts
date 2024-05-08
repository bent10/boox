import { join } from 'path'
import posthtml from 'posthtml'
import type { RouteHandlerFn } from '@headless-route/vite'
import { defineBootstrapUIConfig } from 'posthtml-bootstrap'
import posthtmlComponent from 'posthtml-component'
import posthtmlExtend from 'posthtml-extend'
import { getIcon } from './extended/icon.js'
import { createStackedNavItems } from './extended/nav-stacked.js'
import { getSvg } from './extended/svg.js'
import { generateToc } from './extended/toc.js'
import { parseHtmlHeadings } from './headings.js'

const posthtmlHandler: RouteHandlerFn = async function (content) {
  const { headings, updatedHtml } = parseHtmlHeadings(content)
  const { root, routesDir } = this.context.env
  const routesDirSegments = routesDir.split('/')
  const uiRoot =
    routesDirSegments.length > 1
      ? routesDirSegments.slice(0, -1).join('/')
      : root

  this.context.headings = headings

  const bootstrapUIConfig = defineBootstrapUIConfig({
    folders: [join(uiRoot, 'components')],
    expressions: { locals: this.context },
    utilities: { getSvg, getIcon, createStackedNavItems, generateToc }
  })

  // PostHTML processor with the bootstrap components
  const processor = posthtml([
    posthtmlExtend({
      root: join(uiRoot, 'layouts'),
      expressions: bootstrapUIConfig.expressions
    }),
    posthtmlComponent(bootstrapUIConfig)
  ])

  const { html } = await processor.process(updatedHtml)

  return html
}

export default posthtmlHandler
