import { defineStore } from 'pinia'
import { apiUrl, key } from '@/api'

const requestHeader = {
  'x-api-key': key,
  Accept: '*/*',
  'User-Agent': 'Vue App'
}

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    projects: []
  }),
  actions: {
    async fetchProjects() {
      const url = apiUrl + '/projectlist'
      try {
        const response = await fetch(url, { headers: requestHeader })
        const data = await response.json()
        this.projects = Object.values(data)
        console.log('Projects: ' + JSON.stringify(this.projects))
      } catch (error) {
        console.error('Fehler beim Abrufen der Projekte:', error)
      }
    },
    addProject(newProject) {
      this.projects.push(newProject)
    },
    async deleteProject(id) {
      const url = apiUrl + '/deleteproject'
      const encodedParams = new URLSearchParams()
      encodedParams.set('projectID', id)
      requestHeader['Content-Type'] = 'application/x-www-form-urlencoded'
      requestHeader['method'] = 'DELETE'

      try {
        console.log(`requestHeader is ${JSON.stringify(requestHeader)}`)
        console.log(`body is ${encodedParams}`)

        const response = await fetch(url, {
          method: 'DELETE',
          headers: requestHeader,
          body: new URLSearchParams(encodedParams)
        })

        const data = await response.json()
        console.log('delete response is ' + JSON.stringify(data))
        this.projects = this.projects.filter((project) => project.id !== id)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
