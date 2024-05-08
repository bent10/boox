<template>
  <main
    class="mx-auto my-4 bg-body w-100 rounded-3 shadow"
    style="max-width: 30rem"
    role="main"
  >
    <Search :model="boox" />
  </main>

  <Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Boox from 'boox'
import { metaphone } from 'metaphone'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'
import Footer from './components/Footer.vue'
import Search from './components/Search.vue'
import type { Pokemon } from './types'

export default defineComponent<{ boox: Boox<Pokemon> }>({
  components: {
    Footer,
    Search
  },
  computed: {
    boox() {
      return new Boox<Pokemon>({
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
    }
  },
  async mounted() {
    try {
      const response = await fetch(
        'https://stilearning.com/boox/demo/datasets/pokemon-100r.json',
        { cache: 'default' }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const pokemons: Pokemon[] = await response.json()
      await this.boox.addDocuments(pokemons)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
})
</script>
