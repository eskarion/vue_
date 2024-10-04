<script>
import { useProjectStore } from '@/stores/projectStore'
import { storeToRefs } from 'pinia'
import { mdiFolderEditOutline, mdiOpenInNew, mdiDeleteOutline } from '@mdi/js'

export default {
  name: 'navBar',
  setup() {
    const projectStore = useProjectStore()
    const { projects } = storeToRefs(projectStore)
    projectStore.fetchProjects()

    return {
      projects,
      fetchProjects: projectStore.fetchProjects,
      mdiFolderEditOutline,
      mdiOpenInNew,
      mdiDeleteOutline
    }
  },
  created() {
    console.log('created')
  }
}
</script>

<template>
  <h1 class="text-center mt-5 mb-5 text-h4">Projektübersicht</h1>

  <v-row>
    <v-col cols="12" md="4" v-for="project in projects" :key="project.id">
      <v-card>
        <template v-slot:title> {{ project.name }} </template>

        <template v-slot:text>
          {{ project.description }}
        </template>
        <v-card-actions class="d-flex justify-end">
          <v-btn-group density="compact" variant="outlined" divided>
            <v-btn size="small"> <v-icon :icon="mdiFolderEditOutline" color="primary" /></v-btn>
            <v-btn color="teal-darken-4" :to="`/project/${project.id}`">
              <v-icon :icon="mdiOpenInNew" color="teal-darken-4" />
            </v-btn>
            <v-btn base-color="red-darken-4">
              <v-icon :icon="mdiDeleteOutline" color="red-darken-4"
            /></v-btn>
          </v-btn-group>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style>
h1 {
  color: #2a6f75;
}
</style>
