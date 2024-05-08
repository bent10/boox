<template>
  <p
    id="results-length"
    class="px-3 text-muted"
    :class="{ 'd-none': !results.length }"
  >
    {{
      results.length
        ? `Found ${results.length} of ${Object.keys(documents).length} pokemons`
        : ''
    }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Documents } from 'boox'
import type { Pokemon, Result } from '../types'

export default defineComponent({
  props: {
    results: {
      type: Array as () => Result[],
      required: true
    },
    documents: {
      type: Object as () => Documents<Pokemon>,
      required: true
    }
  }
})
</script>
