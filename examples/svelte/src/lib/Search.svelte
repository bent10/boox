<script lang="ts">
  import Boox, { type SearchResult } from 'boox'
  import { onMount } from 'svelte'
  import debounce from 'debounce'
  import { metaphone } from 'metaphone'
  import { stemmer } from 'stemmer'
  import { removeStopwords } from 'stopword'
  import type { Pokemon } from '../types'
  import SearchInfo from './SearchInfo.svelte'
  import SearchResults from './SearchResults.svelte'

  let pokemons: Pokemon[] = []
  let totalDocuments: number = 0
  let results: SearchResult<Pokemon>[] = []
  let query = ''

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

  onMount(async () => {
    pokemons = await fetchData()
    await boox.addDocuments(pokemons)

    totalDocuments = Object.keys(boox.currentState.documents).length
  })

  const performSearch = debounce(async () => {
    results = await boox.search(query)
  }, 300)

  async function fetchData(): Promise<Pokemon[]> {
    try {
      const response = await fetch(
        'https://stilearning.com/boox/demo/datasets/pokemon-100r.json',
        { cache: 'default' }
      )
      return await response.json()
    } catch (error) {
      throw error
    }
  }
</script>

<form id="search-form" class="p-3" role="search">
  <div class="form-group">
    <input
      name="search"
      type="search"
      class="form-control form-control-lg"
      bind:value={query}
      on:input={performSearch}
      placeholder="Search (e.g. pikachu, water pwer)"
      aria-label="Search pokemons"
    />

    <div class="form-text">
      <strong>Note:</strong>
      the
      <code class="bg-body-secondary">pwer</code>
      demonstrates a typing error for
      <code class="bg-body-secondary">power</code>.
    </div>
  </div>
</form>

<SearchInfo bind:results bind:totalDocuments />

<SearchResults bind:results />
