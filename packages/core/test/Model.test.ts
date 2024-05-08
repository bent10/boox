/// <reference types="vitest/globals" />

import type { Document } from '../src/index.js'
import { Model } from '../src/Model.js'

interface Doc {
  title: string
  content: string
  [key: string]: unknown
}

describe('Model', () => {
  let model: Model<Doc>
  let document: Document<Doc>

  beforeEach(() => {
    document = {
      id: '1',
      attributes: {
        title: 'Foo Bar',
        content: 'This is a foo bar document.'
      },
      magnitude: 0
    }
    model = new Model<Doc>({
      featureKeys: ['title', 'content'],
      normalizer(input) {
        return input.trim()
      }
    })
  })

  it('should train the model with the provided document', () => {
    model.train(document)

    expect(model.features).toMatchSnapshot()
    expect(model.documents).toMatchSnapshot()
    expect(model.terms.has('foo')).toBe(true)
  })

  it('should normalize attribute value array', () => {
    model = new Model<Doc>({
      featureKeys: ['title', 'content', 'tags'],
      normalizer(input) {
        return input.trim()
      }
    })
    document.attributes.tags = ['foo', 'bar']
    model.train(document)

    expect(model.features).toMatchSnapshot()
    expect(model.documents).toMatchSnapshot()
    expect(model.terms.has('foo')).toBe(true)
  })

  it('should resolve unsupported feature format', () => {
    model = new Model<Doc>({
      featureKeys: ['title', 'content', 'tags', 'qux']
    })
    document.attributes.tags = ['foo', 'bar']
    document.attributes.qux = { qux: '' }
    model.train(document)

    expect(model.features).toMatchSnapshot()
    expect(model.documents).toMatchSnapshot()
    expect(model.terms.has('foo')).toBe(true)
  })

  it('should update the model with the provided document', () => {
    model.train(document)

    const updatedDocument: Document<Doc> = {
      id: '1',
      attributes: {
        title: 'Updated Title',
        content: 'This is an updated content.'
      },
      magnitude: 2
    }
    model.update(updatedDocument)

    expect(model.terms.has('foo')).toBe(false)
  })

  it('should remove a document from the model', () => {
    model.train(document)
    model.remove('1')
    const documents = model.documents

    expect(Object.keys(documents).length).toBe(0)
  })

  it('should calculate term frequency correctly', () => {
    const encodings = ['hello', 'world', 'hello', 'hello', 'world']
    const encoding = 'hello'
    const termFrequency = model.calculateTermFrequency(encodings, encoding)

    expect(termFrequency).toBe(0.6)
  })

  it('should calculate inverse document frequency correctly', () => {
    model.train(document)
    const idf = model.calculateIDF('foo')
    const missIDF = model.calculateIDF('hello')

    expect(idf).toBeGreaterThan(0) // 0.3068528194400547
    expect(missIDF).toBe(1)
  })
})
