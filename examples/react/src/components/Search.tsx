import { useState, useEffect } from 'react'
import Boox, { type SearchResult } from 'boox'
import { useDebounce } from 'use-debounce'
import type { Pokemon } from '../types'
import SearchInfo from './SearchInfo'
import SearchResults from './SearchResults'

const DEBOUNCE_DELAY = 300
const PLACEHOLDER_TEXT = 'Search (e.g. pikachu, water pwer)'

interface SearchProps {
  model: Boox<Pokemon>
}

const Search: React.FC<SearchProps> = ({ model }) => {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<SearchResult<Pokemon>[]>([])
  const [query] = useDebounce(input, DEBOUNCE_DELAY)

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setResults([])
        return
      }

      const searchResults = await model.search(query)
      setResults(searchResults)
    }

    performSearch()
  }, [model, query])

  const totalDocuments = Object.keys(model.currentState.documents).length

  return (
    <>
      <form id='search-form' className='p-3' role='search'>
        <div className='form-group'>
          <input
            type='search'
            className='form-control form-control-lg'
            id='search-query'
            placeholder={PLACEHOLDER_TEXT}
            aria-label='Search pokemons'
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
          />

          <div className='form-text'>
            <strong>Note:</strong>
            <span> the </span>
            <code className='bg-body-secondary'>pwer</code>
            <span> demonstrates a typing error for </span>
            <code className='bg-body-secondary'>power</code>.
          </div>
        </div>
      </form>

      <SearchInfo results={results} totalDocuments={totalDocuments} />
      <SearchResults results={results} />
    </>
  )
}

export default Search
