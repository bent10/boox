/// <reference types="vitest/globals" />

import { Encoder } from '../src/Encoder.js'

describe('Encoder', () => {
  it('should tokenize input text correctly', () => {
    const encoder = new Encoder()
    const tokens = encoder.tokenize('This is a foo bar.')

    expect(tokens).toEqual(['This', 'is', 'a', 'foo', 'bar'])
  })

  it('should stem tokens correctly if a stemmer function is provided', () => {
    const encoder = new Encoder({
      stemmer(token) {
        return token.slice(0, -1)
      }
    })
    const tokens = encoder.tokenize('running swimming jumping')

    expect(tokens).toEqual(['runnin', 'swimmin', 'jumpin'])
  })

  it('should phoneticize tokens correctly if a phonetic function is provided', () => {
    const encoder = new Encoder({
      phonetic(token) {
        return token.toUpperCase()
      }
    })
    const phoneticizedTokens = encoder.phoneticize('hello')

    expect(phoneticizedTokens).toEqual(['HELLO'])
  })

  it('should handle double phonetic correctly', () => {
    const encoder = new Encoder({
      phonetic(token) {
        return [token.toUpperCase(), token.toUpperCase()]
      }
    })
    const phoneticizedTokens = encoder.phoneticize('hello')

    expect(phoneticizedTokens).toEqual(['HELLO', 'HELLO'])
  })

  it('should encode input text into tokens with their corresponding phonetic encodings', () => {
    const encoder = new Encoder({
      phonetic(token) {
        return token.toUpperCase()
      }
    })
    const encodedText = encoder.encode('hello world')

    expect(encodedText).toEqual(['HELLO', 'WORLD'])
  })

  it('should handle numbers correctly in phoneticize method', () => {
    const encoder = new Encoder({
      phonetic(token) {
        return token.toUpperCase()
      }
    })
    const encodedText = encoder.encode('hello 123 world3')

    expect(encodedText).toEqual(['HELLO', '123', 'world3'])
  })

  it('should handle numbers correctly with double phonetic', () => {
    const encoder = new Encoder({
      phonetic(token) {
        return [token.toUpperCase(), token.toUpperCase()]
      }
    })
    const encodedText = encoder.encode('hello 123 world3')

    expect(encodedText).toEqual([
      'HELLO',
      'HELLO',
      '123',
      '123',
      'world3',
      'world3'
    ])
  })
})
