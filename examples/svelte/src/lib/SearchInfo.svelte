<script lang="ts">
  import type { SearchResult } from 'boox'
  import type { Pokemon } from '../types'

  export let results: SearchResult<Pokemon>[] = []
  export let totalDocuments: number = 0
</script>

{#if results.length}
  <p id="results-length" class="px-3 text-muted">
    Found {results.length} of {totalDocuments} pokemons
  </p>
{/if}
