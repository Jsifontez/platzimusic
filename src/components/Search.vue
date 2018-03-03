<template lang="pug">
  main
    transition(name="move")
      pm-notification(v-show="showNotification")
        p(slot="body") No se encontraron resultados

    transition(name="move")
      pm-loader(v-show="isLoading")

    section.section(v-show="!isLoading")
      nav.nav
        .container
          input.input.is-large(
            type="text",
            placeholder="Buscar canciones", v-model="searchQuery",
            @keyup.enter="search"
          )
          a.button.is-info.is-large(@click="search") Buscar
          a.button.is-danger.is-large &times;
      .container
        p
          small {{ searchMessage }}

      .container.results
        .columns.is-multiline
          .column.is-one-quarter(v-for="t in tracks")
            pm-track(
              v-blur="t.preview_url",
              :class="{ 'is-active': t.id === selectedTrack }",
              :track="t",
              @select="setSelectedTrack"
            )

        .columns(v-show="tracks.length && !pagination.hasEnd")
          .column.has-text-centered
            button.button(
              @click="loadNextPage()",
              :class="{ 'is-loading': pagination.isLoading }",
              :disabled="pagination.isLoading"
            ) Cargar Mas
</template>

<script>
import trackService from '@/services/track'

import PmTrack from '@/components/Track.vue'

import PmLoader from '@/components/shared/Loader.vue'
import PmNotification from '@/components/shared/Notification.vue'

export default {
  name: 'app',

  components: { PmTrack, PmLoader, PmNotification },

  data () {
    return {
      searchQuery: '',
      tracks: [],

      isLoading: false,
      showNotification: false,

      selectedTrack: '',

      pagination: {
        offset: 0,
        limit: 20,
        hasEnd: false,
        isLoading: false
      }
    }
  },

  methods: {
    search () {
      if (!this.searchQuery) { return }

      this.isLoading = true

      trackService.search(this.searchQuery)
        .then(res => {
          this.pagination.offset += this.pagination.limit // Incrementamos el valor de offset en base a limit
          this.pagination.total += res.tracks.total // Nos guardamos la verdadera cantidad de resultados encontrados

          this.showNotification = res.tracks.total === 0
          this.tracks = res.tracks.items
          this.isLoading = false
        })
    },

    setSelectedTrack (id) {
      this.selectedTrack = id
    },

    loadNextPage () {
      if (!this.searchQuery) { return }

      this.pagination.isLoading = true

      trackService.search(this.searchQuery, this.pagination.offset)
        .then(res => {
          this.pagination.offset += this.pagination.limit // Incrementamos el valor de offset en base a
          this.pagination.hasEnd = res.tracks.next === null // Checamos si hay mas resultados para obtener

          this.tracks = [...this.tracks, ...res.tracks.items] // Usamos el spread operator para concatenar arrays: lo que ya tenemos en tracks de paginas anteriores + lo nuevo de la siguiente página

          this.pagination.isLoading = false // Usamos otra propiedad isLoading para mostrar otro tipo de loader y mejorar la UX
        })
    }
  },

  computed: {
    searchMessage () {
      return `Encontrados: ${this.tracks.length}`
    }
  },

  watch: {
    showNotification () {
      if (this.showNotification) {
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
      }
    },
    searchQuery () {
      this.pagination.offset = 0
      this.pagination.hasEnd = false
      this.pagination.isLoading = false
    }
  }
}
</script>

<style lang="scss">
  .results{
    margin-top: 50px;
  }

  .is-active{
    border: 3px solid #23d160;
  }
</style>
