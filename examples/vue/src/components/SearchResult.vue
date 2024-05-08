<template>
  <a
    class="list-group-item list-group-item-action d-flex gap-3 py-3"
    :href="result.image_url"
    target="_blank"
    rel="noreferrer"
  >
    <img
      loading="lazy"
      :src="result.image_url"
      :alt="result.image_alt"
      width="32"
      height="32"
      class="rounded-circle flex-shrink-0"
    />
    <div class="d-flex gap-2 w-100 justify-content-between">
      <div>
        <h6 class="mb-1">
          <span v-html="result.name"></span> –
          <span v-html="result.set_name"></span>
        </h6>
        <p class="mb-0 opacity-75"><span v-html="result.caption"></span>...</p>
      </div>
      <small class="opacity-50 text-nowrap">HP {{ result.hp }}</small>
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Result } from '../types'

export default defineComponent({
  props: {
    result: {
      type: Object as () => Result,
      required: true
    }
  }
})
</script>
