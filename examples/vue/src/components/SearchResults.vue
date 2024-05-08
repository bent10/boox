<template>
  <div
    id="results"
    class="list-group list-group-flush overflow-auto rounded-3"
    :class="{ 'd-none': !results.length }"
  >
    <SearchResult v-for="result in results" :key="result.id" :result="result" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Result } from '../types'
import SearchResult from './SearchResult.vue'

export default defineComponent({
  components: {
    SearchResult
  },
  props: {
    results: {
      type: Array as () => Result[],
      required: true
    }
  }
})
</script>
