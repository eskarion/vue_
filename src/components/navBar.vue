<script>
export default {
  name: 'navBar',
  data() {
    return {
      projects: []
    }
  },
  methods: {
    async fetchProjects() {
      try {
        const url = apiUrl + '/projectlist'
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': key,
            Accept: '*/*',
            'User-Agent': 'Vue App'
          }
        })

        if (!response.ok) {
          throw new Error('Error fetching /projectlist')
        }

        const data = await response.json()
        this.projects = Object.values(data) // Konvertiert das Objekt in ein Array
      } catch (error) {
        console.error(`Error fetching /projectlist: ${error}`)
      }
    }
  },
  created() {
    this.fetchProjects()
  },
  onMounted() {}
}
</script>

<template>
  <ul>
    <li v-for="project in projects" :key="project.id">
      <router-link :to="`/project/${project.id}`">{{ project.name }}</router-link>
    </li>
  </ul>
  <ul>
    <li>
      <router-link to="/newProject">Neues Projekt</router-link>
    </li>
    <li>
      <button type="button">Projekte</button>
    </li>
  </ul>
</template>

<style></style>
