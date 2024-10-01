import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import startPage from './components/startPage.vue'

const routes = [{ path: '/', component: startPage }]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
