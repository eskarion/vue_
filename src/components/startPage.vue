<script>
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { storeToRefs } from 'pinia'
import { mdiFolderEditOutline, mdiOpenInNew, mdiDeleteOutline } from '@mdi/js'

export default {
  setup() {
    const projectStore = useProjectStore()
    const { projects } = storeToRefs(projectStore)

    const deleteDialog = ref(false)
    const projectToDelete = ref(null)

    projectStore.fetchProjects()

    const openDeleteDialog = (id) => {
      projectToDelete.value = id
      deleteDialog.value = true
    }

    const confirmDelete = async () => {
      console.log(`confirmDelete is triggered`)
      await projectStore.deleteProject(projectToDelete.value)
      deleteDialog.value = false
    }

    return {
      projects,
      fetchProjects: projectStore.fetchProjects,
      mdiFolderEditOutline,
      mdiOpenInNew,
      mdiDeleteOutline,
      deleteDialog,
      projectToDelete,
      openDeleteDialog,
      confirmDelete
    }
  }
}
</script>

<template>
  <h1 class="text-center mt-5 mb-5 text-h4">Projektübersicht</h1>

  <v-row>
    <v-col cols="12" md="4" v-for="project in projects" :key="project.id">
      <v-card style="min-height: 160px">
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
            <v-btn @click="openDeleteDialog(project.id)" base-color="red-darken-4">
              <v-icon :icon="mdiDeleteOutline" color="red-darken-4"
            /></v-btn>
          </v-btn-group>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <!-- Bestätigungs-Modal -->
  <v-dialog v-model="deleteDialog" max-width="500px">
    <!-- Hier verwenden wir deleteDialog -->
    <v-card>
      <v-card-title class="headline">Bist du sicher?</v-card-title>
      <v-card-text> Dieses Projekt wird dauerhaft gelöscht. </v-card-text>
      <v-card-actions>
        <v-btn color="green" text @click="deleteDialog = false">Abbrechen</v-btn>
        <v-btn color="red" text @click="confirmDelete">Löschen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
h1 {
  color: #2a6f75;
}
</style>
