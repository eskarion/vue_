<script>
import { useProjectStore } from '@/stores/projectStore'
import { mapState, mapActions } from 'pinia'
const costs = {
  originalCurrency: 'EUR',
  originalAmount: 110.0
}

const headers = [
  { title: 'Nummer', value: 'costs.number' },
  { title: 'Titel', key: 'name.last' },
  { title: 'Info' },
  {
    title: 'Betrag',
    key: 'fullName',
    value: (items) => `${costs.originalAmount} ${costs.originalCurrency}`
  }
]

export default {
  data() {
    return {
      projectId: null,
      project: null,
      name: name,
      headers: headers
    }
  },
  computed: {
    ...mapState(useProjectStore, ['projects'])
  },
  methods: { ...mapActions(useProjectStore, ['fetchProjects']) },
  mounted() {
    this.fetchProjects()
  }
}
</script>
<template>
  <v-container fluid>
    <div>
      <p>Route params id: {{ $route.params.id }}</p>
      <v-data-table :items="items" :headers="headers"></v-data-table>
    </div>
  </v-container>
</template>
