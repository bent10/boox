import type { SearchResult } from 'boox'
import type { Pokemon } from '../types'
import SearchResultComponent from './SearchResult'

interface SearchResultsProps {
  results: SearchResult<Pokemon>[]
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div
      id='results'
      className={`list-group list-group-flush overflow-auto rounded-3 ${
        results.length ? 'd-block' : 'd-none'
      }`}
    >
      {results.map(result => (
        <SearchResultComponent key={result.id} result={result} />
      ))}
    </div>
  )
}

export default SearchResults
