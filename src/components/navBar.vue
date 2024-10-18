<script>
import { useProjectStore } from '@/stores/projectStore'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'navBar',
  data() {
    return {
      newDialog: false,
      newProjectName: '',
      newProjectDescription: ''
    }
  },
  computed: {
    ...mapState(useProjectStore, ['projects'])
  },
  methods: {
    ...mapActions(useProjectStore, ['fetchProjects', 'newProject']),
    openNewDialog() {
      this.newDialog = true
      this.newProjectName = ''
      this.newProjectDescription = ''
    },
    async confirmCreation() {
      const newProject = {
        name: this.newProjectName,
        description: this.newProjectDescription
      }
      await this.newProject(newProject)
      await this.fetchProjects()
      this.newDialog = false
    }
  },
  mounted() {
    this.fetchProjects()
  }
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
        <router-link to="/" class="text-primary" style="text-decoration: none">Start</router-link>
      </v-btn>
      <v-btn @click="openNewDialog()">Neues Projekt</v-btn>
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
  <!-- New-Modal-->
  <v-dialog v-model="newDialog" max-width="500px">
    <v-card>
      <v-card-title>Neues Project anlegen</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <div class="text-subtitle-1 text-medium-emphasis">Projektname</div>
          <v-text-field
            v-model="newProjectName"
            label="neues Project"
            single-line=""
          ></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Beschreibung</div>
          <v-textarea v-model="newProjectDescription" label="Beschreibung"></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red-darken-4" text @click="newDialog = false">Abbrechen</v-btn>
        <v-btn color="green" text @click="confirmCreation">Speichern</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
