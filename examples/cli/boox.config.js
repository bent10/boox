import { doubleMetaphone } from 'double-metaphone'
import { Marked } from 'marked'
import markedPlaintify from 'marked-plaintify'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'

const marked = new Marked({ gfm: true }).use(markedPlaintify())
const wordRegexp = /\b\w+\b/g

/** @type {() => import('boox').BooxOptions} */
export default () => ({
  modelOptions: {
    normalizer(input) {
      return marked.parse(input)
    },
    tokenizer(input) {
      const tokens = Array.from(input.match(wordRegexp) || [])
      return removeStopwords(tokens)
    },
    stemmer: stemmer,
    phonetic: doubleMetaphone
  }
})
