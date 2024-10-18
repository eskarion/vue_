<script>
import { useProjectStore } from '@/stores/projectStore'
import { useCostStore } from '@/stores/costsStore'
import { mapState, mapActions } from 'pinia'
import { mdiPencilOutline, mdiDeleteOutline } from '@mdi/js'

export default {
  data() {
    return {
      mdiDeleteOutline,
      mdiPencilOutline,
      item: null,
      newDialog: false,
      editDialog: false,
      deleteDialog: false,
      newCostTitle: null,
      newCostInfo: null,
      newCostAmount: null,
      newCostCategory: null,
      newCostBiller: null,
      projectId: null,
      project: null,
      headers: [
        {
          title: 'Datum',
          key: 'Datum',
          value: (projectDetail) => {
            const dateToShow = new Date(projectDetail.date).toLocaleString('de-DE', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            })
            return `${dateToShow}`
          }
        },
        { title: 'Titel', value: 'title' },
        { title: 'Info', value: 'info' },
        { title: 'Kategorie', value: 'category' },
        { title: 'Rechnungssteller', value: 'billers' },
        {
          title: 'Betrag',
          key: 'amount',
          value: (projectDetail) => {
            let amount, currency
            if (projectDetail.actualAmountToShow != null) {
              amount = projectDetail.actualAmountToShow.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
              currency = projectDetail.actualCurrencyToShow.toUpperCase()
            } else {
              amount = '0,00'
              currency = ''
            }
            return `${amount} ${currency}`
          }
        },
        { title: 'Aktionen', value: 'actions', sortable: false }
      ],
      fromDateMenu: false,
      newDate: null,
      minDate: '2020-01-01',
      maxDate: '2025-12-31',
      rules: {
        required: (value) => !!value || 'Notwenige Eingabe.',
        amount: (value) => {
          const pattern = /^\d+(,\d+)*$/
          return pattern.test(value) || 'Ungültiger Betrag, bitte mit Komma.'
        }
      }
    }
  },
  computed: {
    ...mapState(useProjectStore, ['projects', 'projectDetails']),
    fromDateDisp() {
      return this.newDate
    }
  },
  methods: {
    ...mapActions(useProjectStore, ['fetchProjects', 'fetchProjectDetails']),
    ...mapActions(useCostStore, ['newCostEntry', 'updateCostEntry', 'deleteCostEntry']),
    openNewDialog() {
      this.newDate = null
      this.item = ''
      this.newCostTitle = ''
      this.newCostInfo = ''
      this.newCostCategory = ''
      this.newCostBiller = ''
      this.newCostAmount = ''
      this.newDialog = true
    },
    async confirmNew() {
      let dateToSave
      if (this.newDate === null) {
        let date = new Date()
        dateToSave = date.toISOString()
      } else {
        dateToSave = this.newDate.toISOString()
      }
      const costEntry = {
        projectId: this.$route.params.id,
        date: dateToSave,
        category: this.newCostCategory,
        billers: this.newCostBiller,
        entryTitle: this.newCostTitle,
        entryInfo: this.newCostInfo,
        originalAmount: this.newCostAmount
      }
      const response = await this.newCostEntry(costEntry)
      if (response === 200) {
        await this.fetchProjectDetails(this.$route.params.id)
        this.newDialog = false
      }
    },
    openEditDialog(item) {
      this.newDate = new Date(item.date)
      this.item = item
      this.newCostTitle = item.title
      this.newCostInfo = item.info
      this.newCostCategory = item.category
      this.newCostBiller = item.billers
      this.newCostAmount = item.actualAmountToShow
      this.editDialog = true
      console.log('item: ', JSON.stringify(item))
    },
    async confirmEdit() {
      const updatedCostEntry = {
        ...this.item,
        costID: this.item._id,
        entryTitle: this.newCostTitle,
        entryInfo: this.newCostInfo,
        category: this.newCostCategory,
        billers: this.newCostBiller,
        actualAmountToShow: this.newCostAmount,
        actualCurrencyToShow: this.item.actualCurrencyToShow,
        date: this.newDate,
        pretax: this.item.pretax //unchanged value
      }
      await this.updateCostEntry(updatedCostEntry)
      await this.fetchProjectDetails(this.$route.params.id)
      this.editDialog = false
    },
    openDeleteDialog(item) {
      this.costEntryId = item._id
      this.projectId = item.project
      this.deleteDialog = true
      console.log(`Item aus delete ${JSON.stringify(item)}`)
    },
    async confirmDelete() {
      await this.deleteCostEntry(this.costEntryId, this.projectId)
      await this.fetchProjectDetails(this.$route.params.id)
      this.deleteDialog = false
    }
  },
  mounted() {
    this.fetchProjects()
    this.fetchProjectDetails(this.$route.params.id)
  },
  watch: {
    '$route.params.id'(neueId) {
      this.fetchProjectDetails(neueId)
    }
  }
}
</script>

<template>
  <v-container fluid>
    <div>
      <p>Route params id: {{ $route.params.id }}</p>
      <v-data-table :items="projectDetails" :headers="headers">
        <!-- Toolbar oben -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Projektdetails</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn class="mb-2" color="primary" dark @click="openNewDialog"> Neuer Eintrag </v-btn>
          </v-toolbar>
        </template>
        <!-- Aktionen für jede Zeile -->
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="me-2"
            size="small"
            :icon="mdiPencilOutline"
            @click="openEditDialog(item)"
          />
          <v-icon
            class="me-2"
            size="small"
            :icon="mdiDeleteOutline"
            color="red-darken-4"
            @click="openDeleteDialog(item)"
          />
        </template>
      </v-data-table>
    </div>
  </v-container>

  <!-- new dialog -->
  <v-dialog v-model="newDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">Neuer Eintrag</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <div class="text-subtitle-1 text-medium-emphasis">Datum:</div>
          <v-date-picker
            height="300px"
            :hide-header="true"
            bg-color="grey-darken-3"
            locale="de-de"
            v-model="newDate"
            no-title
            @input="fromDateMenu = false"
            :min="minDate"
          ></v-date-picker>
          <div class="text-subtitle-1 text-medium-emphasis">Titel:</div>
          <v-text-field v-model="newCostTitle" :rules="[rules.required]"></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Neue Info:</div>
          <v-textarea
            v-model="newCostInfo"
            maxlength="120"
            counter
            single-line
            :rules="[rules.required]"
          ></v-textarea>
          <div class="text-subtitle-1 text-medium-emphasis">Neuer Kategorie:</div>
          <v-text-field v-model="newCostCategory" :rules="[rules.required]"></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Neuer Rechnungssteller:</div>
          <v-text-field v-model="newCostBiller" :rules="[rules.required]"></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Neuer Betrag:</div>
          <v-text-field
            v-model.number="newCostAmount"
            type="number"
            suffix="EUR"
            :rules="[rules.required, rules.amount]"
          >
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red-darken-4" text @click="newDialog = false">Abbrechen</v-btn>
        <v-btn color="green" text @click="confirmNew">Speichern</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- delete dialog -->
  <v-dialog v-model="deleteDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">Eintrag löschen?</v-card-title>
      <v-card-text>Dieser Eintrag wird dauerhaft gelöscht</v-card-text>
      <v-card-actions>
        <v-btn color="green" text @click="deleteDialog = false"> Abbrechen</v-btn>
        <v-btn color="red" text @click="confirmDelete"> Löschen!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- edit dialog -->
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline"> Ändere Eintrag {{ item.title }} </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <div class="text-subtitle-1 text-medium-emphasis">Neues Datum:</div>
          <v-date-picker
            height="300px"
            :hide-header="true"
            bg-color="grey-darken-3"
            locale="de-de"
            v-model="newDate"
            no-title
            @input="fromDateMenu = false"
            :min="minDate"
          ></v-date-picker>
          <div class="text-subtitle-1 text-medium-emphasis">Neuer Titel:</div>
          <v-text-field v-model="newCostTitle" :placeholder="item.title"></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Neue Info:</div>
          <v-textarea
            v-model="newCostInfo"
            label="Neue Beschreibung"
            :placeholder="item.info"
            maxlength="120"
            counter
            single-line
          ></v-textarea>
          <div class="text-subtitle-1 text-medium-emphasis">Neuer Kategorie:</div>
          <v-text-field v-model="newCostCategory" :placeholder="item.category"></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Neuer Rechnungssteller:</div>
          <v-text-field v-model="newCostBiller" :placeholder="item.billers"></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Neuer Betrag:</div>
          <v-text-field
            v-model.number="newCostAmount"
            :placeholder="String(item.actualAmountToShow)"
            type="number"
            suffix="EUR"
          >
          </v-text-field>
          <v-card-actions>
            <v-btn color="red-darken-4" text @click="editDialog = false">Abbrechen</v-btn>
            <v-btn color="green" text @click="confirmEdit">Speichern</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
