import type {
  ModelOptions,
  NormalizerFn,
  PhoneticFn,
  StemmerFn,
  TokenizerFn
} from './types.js'

/**
 * A class for encoding text tokens with phonetic and stemming capabilities.
 */
export class Encoder {
  #normalizer?: NormalizerFn
  #tokenizer: TokenizerFn
  #phonetic?: PhoneticFn
  #stemmer?: StemmerFn
  #wordRegexp = /\b\w+\b/g

  /**
   * Creates a new encoder instance.
   *
   * @param options - Configuration options for encoding tokens.
   */
  constructor({
    normalizer,
    tokenizer,
    stemmer,
    phonetic
  }: Omit<ModelOptions, 'featureKeys'> = {}) {
    this.#normalizer = normalizer
    this.#tokenizer = tokenizer || this.#wordTokenizer
    this.#stemmer = stemmer
    this.#phonetic = phonetic
  }

  /**
   * Normalizes the input value.
   *
   * If the value is a string or an array, it applies the
   * configured normalizer function. If no normalizer function is provided, it
   * returns the original value.
   *
   * @param value - The value to normalize.
   * @returns The normalized value.
   */
  normalize(value: unknown): string {
    if (typeof value === 'string') {
      const lowercaseValue = value.toLowerCase()
      return this.#normalizer?.(lowercaseValue) || lowercaseValue
    }

    if (Array.isArray(value)) {
      return value
        .filter(v => typeof v === 'string')
        .map(v => this.normalize(v))
        .join(' ')
    }

    // not supported value, but keep silent for now!
    return ''
  }

  /**
   * Tokenizes the input string into words or stemmed words.
   */
  tokenize(input: string) {
    return typeof this.#stemmer === 'function'
      ? this.#tokenizer(input).map(token => this.#stemmer!(token))
      : this.#tokenizer(input)
  }

  /**
   * Encodes a token phonetically using the phonetic function after stemming it.
   *
   * @param token - The token to encode phonetically.
   * @returns The phonetic encoding of the token.
   */
  phoneticize(token: string) {
    const encoding = this.#phonetic?.(token) || token

    // normalize numbers and token with numbers
    if (/\d/.test(token)) {
      // just prevent phoneticize
      return typeof encoding === 'string' ? [token] : encoding.fill(token)
    }

    return typeof encoding === 'string' ? [encoding] : encoding
  }

  /**
   * Encodes input text into tokens and their corresponding phonetic
   * encodings.
   *
   * @param input - The input text to encode.
   * @returns An encodings of input text.
   */
  encode(input: string) {
    const tokens = this.tokenize(input)
    const encodings: string[] = []

    for (const token of tokens) {
      const encoding = this.phoneticize(token)
      encodings.push(...encoding)
    }

    return encodings
  }

  /**
   * The default word tokenizer.
   *
   * @param input - The input string to tokenize.
   * @returns An array of tokens.
   */
  #wordTokenizer(input: string) {
    return Array.from(input.match(this.#wordRegexp) || [])
  }
}
