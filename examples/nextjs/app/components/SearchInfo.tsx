import type { SearchResult } from 'boox'
import type { Pokemon } from '../types'

interface SearchInfoProps {
  results: SearchResult<Pokemon>[]
  totalDocuments: number
}

const SearchInfo: React.FC<SearchInfoProps> = ({ results, totalDocuments }) => {
  const { length } = results

  return (
    <p
      id='results-length'
      className={`px-3 text-muted ${length ? '' : 'd-none'}`}
    >
      {length ? `Found ${length} of ${totalDocuments} pokemons` : ''}
    </p>
  )
}

export default SearchInfo
