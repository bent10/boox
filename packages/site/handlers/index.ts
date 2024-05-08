import type { RouteHandler } from '@headless-route/vite'
import markedHandler from './marked/index.js'
import posthtmlHandler from './posthtml/index.js'

export default <RouteHandler>{
  html: posthtmlHandler,
  md: [markedHandler, 'html']
}
