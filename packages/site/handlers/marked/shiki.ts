import { Marked } from 'marked'
import { createDirectives } from 'marked-directive'
import type { Options } from 'marked-shiki'
import { getHighlighter } from 'shiki'
import fetchExample from './directives/fetch-example.js'

const highlighter = await getHighlighter({
  // applies the appropriate syntax highlighting for Markdown code blocks.
  langs: [
    'text',
    'bash',
    'html',
    'md',
    'json',
    'js',
    'jsx',
    'ts',
    'tsx',
    'vue',
    'svelte'
  ],
  themes: ['github-light', 'github-dark-dimmed']
})

const marked = new Marked(createDirectives([fetchExample]))

export const shikiContainer = `<div class="highlight mx-n3 mx-md-0">
%s
<ui:flex align="center" justify="between" class="mx-4 py-1 border-top">
<ui:button class="focus-ring" size="sm" title="Copy to clipboard" toggle="tooltip" data-bs-placement="bottom" data-js-copy="highlight-code">
<ui:icon name="copy" size="1rem" />
</ui:button>
<small class="text-lowercase text-muted">%l</small>
</ui:flex>
</div>
`

export const highlight: Options['highlight'] = async function (
  code,
  lang,
  props
) {
  if (code.startsWith('::fetch-example')) {
    code = await marked.parse(code)
  }

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark-dimmed'
    },
    meta: { __raw: props.join(' ') }
  })
}
