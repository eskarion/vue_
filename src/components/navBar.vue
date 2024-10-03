<script>
import { useProjectStore } from '@/stores/projectStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'navBar',
  setup() {
    const projectStore = useProjectStore()
    const { projects } = storeToRefs(projectStore)
    projectStore.fetchProjects()

    return { projects, fetchProjects: projectStore.fetchProjects }
  },
  created() {
    console.log('created')
  },
  onMounted() {}
}
</script>

<template>
  <v-app-bar :elevation="12" dense dark class="nav_bar">
    <template v-slot:prepend>
      <router-link class="ml-4" to="/"
        ><img src="/invoiceKeeper.png" alt="Logo" height="40"
      /></router-link>
    </template>

    <div class="d-flex justify-center align-center text-primary" style="width: 100%">
      <v-btn color="primary">
        <router-link to="/newProject" class="text-primary" style="text-decoration: none"
          >Neues Projekt</router-link
        >
      </v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="primary" class="nav_btn" v-bind="props"> Projekte </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="project in projects" :key="project.id">
            <v-list-item-title>
              <router-link :to="`/project/${project.id}`" style="text-decoration: none">{{
                project.name
              }}</router-link></v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped>
a,
.v-btn__content,
nav_btn {
  text-decoration: none;
  color: #fff;
}
.nav_bar {
  background-color: #1f2937;
}
</style>
