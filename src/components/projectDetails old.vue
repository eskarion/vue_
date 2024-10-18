<script>
import { useProjectStore } from '@/stores/projectStore'
import { useCostStore } from '@/stores/costsStore'
import { mapState, mapActions } from 'pinia'
import { mdiPencilOutline,  mdiDeleteOutline } from '@mdi/js'

export default {
  data() {
    return {
      mdiDeleteOutline,
      mdiPencilOutline,
      projectId: null,
      project: null,
      headers: [        
        { title: 'Titel', value: 'title' },
        { title: 'Info', value: 'info' },
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
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        number: '',
        title: '',
        info: '',
        actualAmountToShow: null,
        actualCurrencyToShow: '',
        // Weitere Felder hinzufügen falls nötig
      },
      defaultItem: {
        number: '',
        title: '',
        info: '',
        actualAmountToShow: null,
        actualCurrencyToShow: '',
        // Weitere Felder hinzufügen falls nötig
      },
      // availableCurrencies: ['EUR', 'USD', 'GBP', 'SEK'], // Verfügbare Währungen
    }
  },
  computed: {
    ...mapState(useProjectStore, ['projects', 'projectDetails']),
    formTitle() {
      return this.editedIndex === -1 ? 'Neuen Kosten-Eintrag hinzufügen' : 'Kosten-Eintrag bearbeiten';
    },
  },
  methods: {
    ...mapActions(useProjectStore, ['fetchProjects', 'fetchProjectDetails']),
    ...mapActions(useCostStore, ['newCostEntry', 'updateCostEntry', 'deleteCostEntry']),
    initialize() {
      // Logik zum Initialisieren oder Zurücksetzen
      this.fetchProjectDetails(this.$route.params.id);
    },
    editItem(item) {
      this.editedIndex = this.projectDetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.projectDetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      // Löschen Sie das Element aus Ihrem Store oder über eine API
      this.deleteCostEntry(this.editedItem)
        .then(() => {
          this.fetchProjectDetails(this.$route.params.id);
          this.closeDelete();
        })
        .catch(error => {
          console.error('Fehler beim Löschen:', error);
        });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        // Aktualisieren Sie das bestehende Element
        this.updateCostEntry(this.editedItem)
          .then(() => {
            this.fetchProjectDetails(this.$route.params.id);
            this.close();
          })
          .catch(error => {
            console.error('Fehler beim Aktualisieren:', error);
          });
      } else {
        // Fügen Sie ein neues Element hinzu
        this.newCostEntry(this.editedItem)
          .then(() => {
            this.fetchProjectDetails(this.$route.params.id);
            this.close();
          })
          .catch(error => {
            console.error('Fehler beim Hinzufügen:', error);
          });
      }
    },
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
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn class="mb-2" color="primary" dark v-bind="props">Neue Eingabe</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
    
                <v-card-text>
                  <v-container>
                    <v-row>
                      <!-- Formularfelder für Ihren Kosten-Eintrag -->
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="editedItem.title"
                          label="Titel"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="editedItem.info"
                          label="Info"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="editedItem.actualAmountToShow"
                          label="Betrag"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="editedItem.actualCurrencyToShow"
                          :items="availableCurrencies"
                          label="Währung"
                        ></v-select>
                      </v-col>
                      <!-- Weitere Felder hinzufügen falls nötig -->
                    </v-row>
                  </v-container>
                </v-card-text>
    
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    Abbrechen
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="save">
                    Speichern
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- Dialog zum Löschen eines Kosten-Eintrags -->
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Möchten Sie diesen Kosten-Eintrag wirklich löschen?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Abbrechen</v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!-- Aktionen für jede Zeile -->
        <template>
          <v-icon
            class="me-2"
            size="small"
            :icon="mdiPencilOutline"
            @click="editItem(item)"
          />
          
          
          <v-icon :icon="mdiDeleteOutline" color="red-darken-4" @click="deleteItem(item)"
            />
          
        </template>
        <!-- Anzeige, wenn keine Daten vorhanden sind -->
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">
            Zurücksetzen
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>
