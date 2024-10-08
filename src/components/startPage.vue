<script>
import { useProjectStore } from '@/stores/projectStore'
import { mdiFolderEditOutline, mdiOpenInNew, mdiDeleteOutline } from '@mdi/js'
import { mapState, mapActions } from 'pinia'

export default {
  data() {
    return {
      deleteDialog: false,
      projectToDelete: null,
      editDialog: false,
      projectToEdit: null,
      newProjectName: '',
      newProjectDescription: '',
      mdiFolderEditOutline,
      mdiOpenInNew,
      mdiDeleteOutline
    }
  },
  computed: {
    ...mapState(useProjectStore, ['projects'])
  },
  methods: {
    ...mapActions(useProjectStore, ['fetchProjects', 'deleteProject', 'editProject']),
    openDeleteDialog(id) {
      this.projectToDelete = id
      this.deleteDialog = true
    },
    async confirmDelete() {
      await this.deleteProject(this.projectToDelete)
      this.deleteDialog = false
    },
    openEditDialog(project) {
      this.projectToEdit = project.id
      this.projectToEditName = project.name
      this.projectToEditDescription = project.description
      this.newProjectName = project.name
      this.newProjectDescription = project.description
      this.editDialog = true
    },
    async confirmEdit() {
      console.log('ConfirmEdit triggered')
      const updatedProject = {
        id: this.projectToEdit,
        name: this.newProjectName,
        description: this.newProjectDescription
      }
      await this.editProject(updatedProject)
      this.editDialog = false
    }
  },
  mounted() {
    this.fetchProjects()
  }
}
</script>

<template>
  <h1 class="text-center mt-5 mb-5 text-h4">Projektübersicht</h1>

  <v-row>
    <v-col cols="12" md="4" v-for="project in projects" :key="project.id">
      <v-card style="min-height: 160px" :elevation="10">
        <template v-slot:title> {{ project.name }} </template>

        <template v-slot:text>
          {{ project.description }}
        </template>
        <v-card-actions class="d-flex justify-end">
          <v-btn-group density="compact" variant="outlined" divided>
            <v-btn @click="openEditDialog(project)">
              <v-icon :icon="mdiFolderEditOutline" color="primary"
            /></v-btn>
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

  <!-- Delete-Modal -->
  <v-dialog v-model="deleteDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">Bist du sicher?</v-card-title>
      <v-card-text> Dieses Projekt wird dauerhaft gelöscht. </v-card-text>
      <v-card-actions>
        <v-btn color="green" text @click="deleteDialog = false">Abbrechen</v-btn>
        <v-btn color="red" text @click="confirmDelete">Löschen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Edit-Modal-->
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">Ändere "{{ projectToEditName }}"</v-card-title>
      <v-divider></v-divider>
      <v-card-text
        ><v-form>
          <div class="text-subtitle-1 text-medium-emphasis">Neuer Projektname:</div>
          <v-text-field
            v-model="newProjectName"
            label="neuer Name"
            :placeholder="projectToEditName"
          ></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Neue ProjektBeschreibung:</div>
          <v-textarea
            v-model="newProjectDescription"
            label="Neue Beschreibung"
            :placeholder="projectToEditDescription"
            maxlength="120"
            counter
            single-line
          ></v-textarea> </v-form
      ></v-card-text>
      <v-card-actions>
        <v-btn color="red-darken-4" text @click="editDialog = false">Abbrechen</v-btn>
        <v-btn color="green" text @click="confirmEdit">Speichern</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
h1 {
  color: #2a6f75;
}
</style>
