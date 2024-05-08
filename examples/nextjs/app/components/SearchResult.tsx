import type { SearchResult } from 'boox'
import Image from 'next/image'
import type { Pokemon } from '../types'

interface SearchResultProps {
  result: SearchResult<Pokemon>
}

const SearchResultComponent: React.FC<SearchResultProps> = ({ result }) => {
  const {
    image_url,
    name: image_alt,
    hp
  } = result.attributes as unknown as Pokemon
  const { text: name } = result.context('name')
  const { text: set_name } = result.context('set_name')
  const { text: caption } = result.context('caption', 80)

  return (
    <a
      className='list-group-item list-group-item-action d-flex gap-3 py-3'
      href={String(image_url)}
      target='_blank'
      rel='noreferrer'
    >
      <Image
        loading='lazy'
        src={image_url}
        alt={image_alt}
        loader={img => img.src}
        width='32'
        height='32'
        className='rounded-circle flex-shrink-0'
      />
      <div className='d-flex gap-2 w-100 justify-content-between'>
        <div>
          <h6
            className='mb-1'
            dangerouslySetInnerHTML={{ __html: `${name} – ${set_name}` }}
          />
          <p
            className='mb-0 opacity-75'
            dangerouslySetInnerHTML={{ __html: `${caption}...` }}
          />
        </div>
        <small className='opacity-50 text-nowrap'>HP {hp}</small>
      </div>
    </a>
  )
}

export default SearchResultComponent
