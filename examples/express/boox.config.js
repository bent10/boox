import { metaphone } from 'metaphone'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'

const wordRegexp = /\b\w+\b/g

/** @type {() => import('boox').BooxOptions<import('./types').Pokemon>} */
export default function defineBooxConfig() {
  return {
    features: ['name', 'set_name', 'caption'],
    attributes: ['image_url', 'hp'],
    modelOptions: {
      tokenizer(input) {
        const tokens = Array.from(input.match(wordRegexp) || [])
        return removeStopwords(tokens)
      },
      stemmer: stemmer,
      phonetic: metaphone
    }
  }
}
