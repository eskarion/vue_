<script>
import { useProjectStore } from '@/stores/projectStore'
import { useCostStore } from '@/stores/costsStore'
import { mapState, mapActions } from 'pinia'
import {  mdiPencilOutline,  mdiDeleteOutline } from '@mdi/js'

export default {
  data() {
    return {
      //icons
      mdiDeleteOutline,
      mdiPencilOutline,
      item:null,
      editDialog:false, 
      newEntryDialog: false,
      projectId: null,
      project: null,
      headers: [        
        {title: 'Datum',
        key: 'Datum',
         value: projectDetail => {        
          const dateToShow = new Date(projectDetail.date).toLocaleString('de-DE', {month: "2-digit", day: "2-digit", year:"numeric"})          
          return `${dateToShow}`
        }},
        { title: 'Titel', value: 'title' },
        { title: 'Info', value: 'info' },
        {title: 'Kategorie', value: 'category'},
        {title: 'Rechnugssteller', value: 'billers'},
        {
          title: 'Betrag',
          key: 'amount',
          value: projectDetail => {
            const amount = projectDetail.actualAmountToShow != null
              ? projectDetail.actualAmountToShow.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : '0,00';
            const currency = projectDetail.actualCurrencyToShow
              ? projectDetail.actualCurrencyToShow.toUpperCase()
              : '---';
            return `${amount} ${currency}`;
          }
        },
        { title: 'Aktionen', value: 'actions', sortable: false }
      ],              
    }
  },
  computed: {
    ...mapState(useProjectStore, ['projects', 'projectDetails']),
   
  },
  methods: {
    ...mapActions(useProjectStore, ['fetchProjects', 'fetchProjectDetails']),
    ...mapActions(useCostStore, ['newCostEntry', 'updateCostEntry', 'deleteCostEntry']),
    openEditDialog(item){
      this.item = item;
      this.newCostTitle = item.title;
      this.newCostInfo = item.info;
      this.newCostCategory = item.category;
      this.newCostBiller = item.billers;
      this.newCostAmount = item.actualAmountToShow;
      this.editDialog = true;
      console.log('item: ', JSON.stringify(item))
    },
    async confirmEdit(){
      const updatedCostEntry = {
        ...this.item,
        costID: this.item._id,
        entryTitle: this.newCostTitle,
        entryInfo: this.newCostInfo,
        category: this.newCostCategory,
        billers: this.newCostBiller,
        actualAmountToShow: this.actualAmountToShow,
        actualCurrencyToShow: this.item.actualCurrencyToShow,         
        date : this.item.date,      //unchanged value
        pretax: this.item.pretax,   //unchanged value
      }
      await this.updateCostEntry(updatedCostEntry)
      this.editDialog = false
    }
  },
  mounted() {  
    this.fetchProjects();
    this.fetchProjectDetails(this.$route.params.id);
  },
  watch: {
    '$route.params.id'(neueId) {
      this.fetchProjectDetails(neueId);
    }
  }
}
</script>

<template>
  <v-container fluid>
    <div>
      <p>Route params id: {{ $route.params.id }}</p>  
      <v-data-table
        :items="projectDetails"
        :headers="headers"
      >
        <!-- Toolbar oben -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Projektdetails</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer> 
            <!-- Dialog zum Hinzufügen eines neuen Kosten-Eintrags -->
            <v-dialog v-model="newEntryDialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn class="mb-2" color="primary" dark v-bind="props">
                  Neuer Eintrag
                </v-btn>
              </template>              
            </v-dialog>
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
          
          
          <v-icon :icon="mdiDeleteOutline" color="red-darken-4" @click="deleteItem(item)"
            />
          
        </template>

      </v-data-table>
    </div>
  </v-container>
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
       <v-card-title class="headline">
        Ändere Eintrag {{ item.title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <div class="text-subtitle-1 text-medium-emphasis"> Neuer Titel:</div>
          <v-text-field
            v-model="newCostTitle"            
            :placeholder="item.title"
          ></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis"> Neue Info:</div>
          <v-textarea
            v-model="newCostInfo"
            label="Neue Beschreibung"
            :placeholder="item.info"
            maxlength="120"
            counter
            single-line
          ></v-textarea>
          <div class="text-subtitle-1 text-medium-emphasis"> Neuer Kategorie:</div>
          <v-text-field
            v-model="newCostCategory"            
            :placeholder="item.category"
          ></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis"> Neuer Rechnungssteller:</div>
          <v-text-field
            v-model="newCostBiller"            
            :placeholder="item.billers"
          ></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis"> Neuer Betrag:</div>
          <v-text-field
          v-model.number="newCostAmount"          
          :placeholder="String(item.actualAmountToShow)"
          type="number"
          suffix="EUR">
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


