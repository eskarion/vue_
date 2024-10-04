<script>
import navBar from './components/navBar.vue'

export default {
  components: {
    navBar
  }
}
</script>

<template>
  <v-app>
    <navBar />
    <v-main class="main_background">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.main_background {
  background-color: #070f1b;
}
</style>
