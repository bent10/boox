<script lang="ts">
  import type { SearchResult } from 'boox'
  import type { Pokemon } from '../types'
  import SearchResultComponents from './SearchResult.svelte'

  export let results: SearchResult<Pokemon>[] = []
</script>

{#if results.length}
  <div id="results" class="list-group list-group-flush overflow-auto rounded-3">
    {#each results as result}
      <SearchResultComponents {result} />
    {/each}
  </div>
{/if}
