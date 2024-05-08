<template>
  <form id="search-form" class="p-3" role="search">
    <div class="form-group">
      <input
        type="search"
        class="form-control form-control-lg"
        id="search-query"
        placeholder="Search (e.g. pikachu, water pwer)"
        aria-label="Search pokemons"
        autoFocus
        v-model.debounce.300ms="query"
      />

      <div class="form-text">
        <strong>Note:</strong>
        <span> the </span>
        <code class="bg-body-secondary">pwer</code>
        <span> demonstrates a typing error for </span>
        <code class="bg-body-secondary">power</code>.
      </div>
    </div>
  </form>

  <SearchInfo :results="results" :documents="model.currentState.documents" />

  <SearchResults :results="results" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Boox from 'boox'
import type { Pokemon, Result } from '../types'
import SearchInfo from './SearchInfo.vue'
import SearchResults from './SearchResults.vue'

export default defineComponent({
  components: {
    SearchInfo,
    SearchResults
  },
  props: {
    model: {
      type: Boox<Pokemon>,
      required: true
    }
  },
  setup(props) {
    const query = ref('')
    const results = ref<Result[]>([])

    watch(
      query,
      async newQuery => {
        if (newQuery) {
          const searchResults = await props.model.search(newQuery)

          results.value = searchResults.map(result => {
            const {
              id,
              image_url,
              name: image_alt,
              hp
            } = result.attributes as unknown as Pokemon

            return {
              id,
              image_url,
              image_alt,
              hp,
              name: result.context('name').text,
              set_name: result.context('set_name').text,
              caption: result.context('caption', 80).text
            }
          })
        } else {
          results.value = []
        }
      },
      { immediate: false } // Perform search on initial render
    )

    return { query, results }
  }
})
</script>
