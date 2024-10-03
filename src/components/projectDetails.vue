<script>
import { apiUrl, key } from '../api'

export default {
  data() {
    return {
      projectId: null,
      project: null
    }
  },
  onMounted() {
    console.log('mounted projectdetails')
    this.projectId = this.$route.params.id
    console.log(`found this id ${this.projectId}`)
    this.fetchProjectDetails(this.projectId)
  },
  methods: {
    async fetchProjectDetails(projectId) {
      // Beispiel: API-Aufruf, um Projektdetails basierend auf der ID zu laden
      const url = apiUrl + `/project/${projectId}`
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': key,
            Accept: '*/*',
            'User-Agent': 'Vue App'
          }
        })

        if (response.ok) {
          this.project = await response.json()
          console.log(this.project)
        } else {
          console.error('Fehler beim Laden der Projektdetails.')
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error)
      }
    }
  }
}
</script>
<template>
  <div>
    <p>Route params id: {{ $route.params.id }}</p>
  </div>
</template>
