import './assets/main.css'
import router from './router'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  components,
  directives
})
const pinia = createPinia()
createApp(App).use(router).use(vuetify).use(pinia).mount('#app')
