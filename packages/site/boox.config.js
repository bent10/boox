import { doubleMetaphone } from 'double-metaphone'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'

const wordRegexp = /\b\w+\b/g

/** @type {() => import('boox').BooxOptions} */
export default function defineBooxConfig() {
  return {
    features: ['title', 'section', 'content'],
    attributes: ['url', 'group'],
    modelOptions: {
      tokenizer(input) {
        const tokens = Array.from(input.match(wordRegexp) || [])
        return removeStopwords(tokens)
      },
      stemmer: stemmer,
      phonetic: doubleMetaphone
    }
  }
}
