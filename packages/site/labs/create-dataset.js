import { readFile, writeFile } from 'node:fs/promises'
import matter from 'gray-matter'
import { createRoutes } from 'headless-route'
import { splitContentByHeadings } from './helpers.js'
import markdownToPlaintext from './to-plaintext.js'

/**
 * @typedef {object} Dataset
 * @prop {string} id
 * @prop {string} url
 * @prop {string} title
 * @prop {string} group
 * @prop {string} section
 * @prop {string} content
 */

/** @type {Dataset[]} */
const dataset = []

await createRoutes({
  dir: 'src/views/pages',
  urlPrefix: '/boox',
  urlSuffix: '.html',
  extensions: ['.md'],
  async handler(route) {
    if (route.id.endsWith('.md')) {
      const segments = route.stem.split('/').slice(1)
      const lastSegment = String(
        segments.length ? segments.pop() : route.stem
      ).replace(/\-/g, ' ')
      const group =
        lastSegment.slice(0, 1).toUpperCase() +
        lastSegment.slice(1).toLowerCase()

      // split markdown content by heading
      // and store them to dataset
      const { data, content } = matter(await readFile(route.id, 'utf8'))
      const chunks = splitContentByHeadings(content)

      await Promise.all(
        chunks.map(async ({ id, depth, section, content }) => {
          dataset.push({
            id: `${route.stem.replace('/', '-')}-${id}`,
            url: depth === 1 ? route.url : `${route.url}#${id}`,
            title: data.title || group,
            group,
            section,
            content: await markdownToPlaintext(content)
          })
        })
      )
    }
  }
})

await writeFile('./labs/docs.json', JSON.stringify(dataset))
