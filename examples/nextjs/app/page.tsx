'use client'

import Boox from 'boox'
import { metaphone } from 'metaphone'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'
import Footer from './components/Footer'
import Search from './components/Search'
import type { Pokemon } from './types'

const Home: React.FC = () => {
  const boox = new Boox<Pokemon>({
    features: ['name', 'caption', 'set_name'],
    attributes: ['hp', 'image_url'],
    modelOptions: {
      tokenizer(input) {
        return removeStopwords(Array.from(input.match(/\b\w+\b/g) || []))
      },
      stemmer: stemmer,
      phonetic: metaphone
    }
  })

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://stilearning.com/boox/demo/datasets/pokemon-100r.json',
        { cache: 'default' }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const pokemons: Pokemon[] = await response.json()
      await boox.addDocuments(pokemons)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  fetchData()

  return (
    <>
      <main
        className='mx-auto my-4 bg-body w-100 rounded-3 shadow'
        style={{ maxWidth: '30rem' }}
        role='main'
      >
        <Search model={boox} />
      </main>

      <Footer />
    </>
  )
}

export default Home
