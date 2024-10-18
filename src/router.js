import { createRouter, createWebHistory } from 'vue-router'
import startPage from './components/startPage.vue'
import newProject from './components/newProject.vue'
import ProjectDetails from './components/projectDetails.vue'

const routes = [
  {
    path: '/',
    component: startPage
  },
  {
    path: '/project/:id',
    name: 'project-details',
    component: ProjectDetails
  },
  {
    path: '/newProject',
    name: 'new-project',
    component: newProject
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
