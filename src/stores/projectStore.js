import { defineStore } from 'pinia'
import { apiUrl, key } from '@/api'

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    projects: []
  }),
  actions: {
    async fetchProjects() {
      const url = apiUrl + '/projectlist'
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': key,
            Accept: '*/*',
            'User-Agent': 'Vue App'
          }
        })
        const data = await response.json()
        this.projects = Object.values(data)
        console.log('Projects: ' + this.projects)
      } catch (error) {
        console.error('Fehler beim Abrufen der Projekte:', error)
      }
    },
    addProject(newProject) {
      this.projects.push(newProject)
    }
  }
})
