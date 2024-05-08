<script lang="ts">
  import type { SearchResult } from 'boox'
  import type { Pokemon } from '../types'

  export let result: SearchResult<Pokemon>
</script>

<a
  class="list-group-item list-group-item-action d-flex gap-3 py-3"
  href={result.attributes.image_url}
  target="_blank"
>
  <img
        loading='lazy'
    src={result.attributes.image_url}
    alt={result.attributes.name}
    width="32"
    height="32"
    class="rounded-circle flex-shrink-0"
  />
  <div class="d-flex gap-2 w-100 justify-content-between">
    <div>
      <h6 class="mb-1">
        {@html result.context('name').text} – {@html result.context('set_name')
          .text}
      </h6>
      <p class="mb-0 opacity-75">
        {@html result.context('caption', 80).text}...
      </p>
    </div>
    <small class="opacity-50 text-nowrap">HP {result.attributes.hp}</small>
  </div>
</a>
