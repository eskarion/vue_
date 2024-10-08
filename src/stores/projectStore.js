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
    async newProject(newProject) {
      const url = apiUrl + '/newproject'
      const encodedParams = new URLSearchParams()
      encodedParams.set('newProjectName', newProject.name)
      encodedParams.set('description', newProject.description)
      requestHeader['Content-Type'] = 'application/x-www-form-urlencoded'

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: requestHeader,
          body: encodedParams
        })
        await response
      } catch (error) {
        console.log(`Error while creating new project ${error}`)
      }
    },
    async fetchProjects() {
      const url = apiUrl + '/projectlist'
      try {
        const response = await fetch(url, { headers: requestHeader })
        const data = await response.json()
        this.projects = Object.values(data)
      } catch (error) {
        console.error('Fehler beim Abrufen der Projekte:', error)
      }
    },
    async deleteProject(projectId) {
      const url = apiUrl + '/deleteproject'
      const encodedParams = new URLSearchParams()
      encodedParams.set('projectID', projectId)
      requestHeader['Content-Type'] = 'application/x-www-form-urlencoded'
      requestHeader['method'] = 'DELETE'

      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: requestHeader,
          body: encodedParams
        })

        await response.json()
        this.projects = this.projects.filter((project) => project.id !== projectId)
      } catch (error) {
        console.error(error)
      }
    },
    async editProject(projectDetails) {
      const url = apiUrl + '/updateProject/' + projectDetails.id
      const encodedParams = new URLSearchParams()
      encodedParams.set('projectName', projectDetails.name)
      encodedParams.set('projectDescription', projectDetails.description)
      encodedParams.set('projectID', projectDetails.id)
      requestHeader['Content-Type'] = 'application/x-www-form-urlencoded'
      requestHeader['method'] = 'POST'
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: requestHeader,
          body: new URLSearchParams(encodedParams)
        })

        if (response.ok) {
          const index = this.projects.findIndex((project) => project.id === projectDetails.id)
          if (index !== -1) {
            this.projects[index] = { ...this.projects[index], ...projectDetails }
          }
        } else {
          console.log('Fehler beim Aktualisieren des Projekts:', response.statusText)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
})
