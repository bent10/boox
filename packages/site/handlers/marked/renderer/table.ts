import type { RendererObject } from 'marked'

/**
 * Renders a table element with provided header and body.
 *
 * @param header The HTML string representing the table header.
 * @param body The HTML string representing the table body.
 * @returns The complete HTML string representing the table element.
 */
export const table: RendererObject['table'] = (header, body) => {
  if (body) body = `<tbody>${body}</tbody>`

  return `<div class="table-wrapper mx-n3 mx-md-0 mb-4">\n<div class="table-responsive px-3 px-md-0">\n<table class="table mb-0">\n<thead>\n${header}</thead>\n${body}</table>\n</div>\n</div>\n`
}
