import { Encoder } from './Encoder.js'
import type {
  Dataset,
  Document,
  Documents,
  Features,
  ModelOptions
} from './types.js'

/**
 * Represents a model for full-text search using [TF-IDF](https://en.wikipedia.org/wiki/Tf-idf) score with
 * [inverted index](https://en.wikipedia.org/wiki/Inverted_index) weight.
 */
export class Model<T extends object = Dataset> {
  /**
   * The model encoder.
   */
  encoder: Encoder

  /**
   * The collection of documents indexed by reference identifier.
   */
  documents: Documents<T>

  /**
   * Represents the trained data as an inverted index, utilized for full-text
   * search. The index maps encoded information to relevant index entries,
   * facilitating structured database operations. Enables efficient retrieval of
   * information based on encoded representations.
   */
  features: Features

  /**
   * The dataset fields that will be indexed.
   */
  #featureKeys: string[]

  /**
   * Creates a new Model instance.
   *
   * @param options - Options for configuring the model.
   */
  constructor(options: ModelOptions = {}) {
    const { featureKeys = [], ...encoderOptions } = options

    this.encoder = new Encoder(encoderOptions)
    this.documents = {}
    this.features = {}

    this.#featureKeys = featureKeys
  }

  /**
   * Set of unique terms in the corpus.
   */
  get terms() {
    const terms = new Set<string>()
    for (const feature of Object.values(this.features)) {
      Object.keys(feature).forEach(term => terms.add(term))
    }
    return terms
  }

  /**
   * Trains the model with the provided document.
   *
   * @param document - The document to train the model with.
   */
  train(document: Document<T>) {
    const { id, attributes } = document
    // Store the magnitude for this document
    let magnitudeSquare = 0

    for (const key of this.#featureKeys) {
      const value = attributes[key as keyof T]

      if (value) {
        const normalizedValue = this.encoder.normalize(value)
        // encode feature value
        const encodings = this.encoder.encode(normalizedValue)

        if (!this.features[key]) {
          this.features[key] = {}
        }

        const attribute = this.features[key]

        encodings.forEach(encoding => {
          if (!attribute[encoding]) {
            attribute[encoding] = {}
          }

          const tf = this.calculateTermFrequency(encodings, encoding)
          attribute[encoding][id] = tf
          // update magnitude square
          magnitudeSquare += Math.pow(tf, 2)
        })
      }
    }

    // store the calculated magnitude for the document
    document.magnitude = Math.sqrt(magnitudeSquare)
    // store document
    this.documents[id] = document
  }

  /**
   * Updates the model with the provided document.
   *
   * @param document - The document to update the model with.
   */
  update(document: Document<T>) {
    // remove old document from features
    this.remove(document.id)
    // re-train
    this.train(document)
  }

  /**
   * Removes a document from the model.
   *
   * @param id - The identifier of the document to remove.
   */
  remove(id: string) {
    for (const key in this.features) {
      const attribute = this.features[key]

      for (const encoding in attribute) {
        const docs = attribute[encoding]

        for (const docId in docs) {
          if (docId === id) {
            delete docs[id]
          }
        }

        if (!Object.keys(docs).length) {
          delete attribute[encoding]
        }
      }
    }

    // remove document
    delete this.documents[id]
  }

  /**
   * Calculates the term frequency of an encoding token.
   *
   * @param encodings - The document encodings.
   * @param encoding - The encoding token.
   * @returns The term frequency of the encoding token.
   */
  calculateTermFrequency(encodings: string[], encoding: string): number {
    const termFrequency = encodings.reduce((count, te) => {
      return te === encoding ? count + 1 : count
    }, 0)

    // normalize term frequency by dividing by the total number of encodings
    return termFrequency / encodings.length
  }

  /**
   * Calculates the inverse document frequency of an encoding token.
   *
   * @param key - The feature key.
   * @param encoding - The encoding token.
   * @returns The inverse document frequency of the encoding token.
   */
  calculateIDF(encoding: string): number {
    const totalDocuments = Object.keys(this.documents).length
    let documentFrequency = 0

    for (const docId of Object.keys(this.documents)) {
      const hasDF = Object.values(this.features).some(
        attribute => !!attribute[encoding]?.[docId]
      )

      if (hasDF) {
        documentFrequency++
      }
    }

    // idf smooth
    return Math.log(totalDocuments / (1 + documentFrequency)) + 1
  }
}
