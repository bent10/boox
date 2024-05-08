import attrsParser from 'attributes-parser'
import type { Tokens } from 'marked'
import type { DirectiveConfig } from 'marked-directive'

const codeGroup: DirectiveConfig = {
  level: 'container',
  marker: ':::',
  renderer(token) {
    if (token.meta.name === 'code-group') {
      const { id = 'tab-' + String(Math.random()).slice(2) } =
        token.attrs || ({} as NonNullable<typeof token.attrs>)

      const codes = [...(token.tokens || [])]
        ?.filter(token => 'lang' in token)
        .map(token => {
          Object.assign(token, {
            attrs: attrsParser('lang' in token ? token.lang : '')
          })
          return token
        }) as Array<Tokens.Code & { attrs: { [key: string]: string } }>

      let html = ''

      // wrapper
      html += '<div class="code-group mx-n3 mx-md-0">\n'

      // build nav
      html += `<ul class="nav nav-underline px-4 pt-2 border-bottom" id="${id}" role="tablist">\n`
      codes.forEach((code, idx) => {
        const { title } = code.attrs
        const codeId = `${String(Math.random()).slice(2)}-tab`
        const target = `${codeId}-pane`
        const defaultActive = idx === 0

        Object.assign(code.attrs, {
          codeId,
          target,
          defaultActive
        })

        html += '<li class="nav-item" role="presentation">\n'
        html += `<button class="nav-link${defaultActive ? ' active' : ''}" id="${codeId}" data-bs-toggle="tab" data-bs-target="#${target}" type="button" role="tab" aria-controls="${target}" aria-selected="${defaultActive}">${title}</button>`
        html += '</li>\n'
      })
      html += '</ul>\n'

      // build tab-content
      html += `<div class="tab-content px-n3 px-md-0" id="${id}-content">\n`
      for (const { attrs, text } of codes) {
        const { codeId, target, defaultActive } = attrs
        html += `<div class="tab-pane${defaultActive ? ' show active' : ''}" id="${target}" role="tabpanel" aria-labelledby="${codeId}">\n`
        html += '<raw>\n'
        html += text
        html += '</raw>\n'
        html += '</div>\n'
      }
      html += '</div>\n'

      // end wrapper
      html += '</div>\n'

      return html
    }

    return false
  }
}

export default codeGroup
