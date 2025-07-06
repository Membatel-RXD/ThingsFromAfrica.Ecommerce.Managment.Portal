<template>
  <div class="wood-types-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Wood Types</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage wood types available for crafts
          </p>
        </div>
        <v-btn
          color="orange-darken-2"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Add Wood Type
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-tree</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalWoodTypes }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Wood Types</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activeWoodTypes }}</h3>
                <p class="text-body-2 text-green-darken-1">Active Types</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-package-variant</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ nativeWoodTypes }}</h3>
                <p class="text-body-2 text-blue-darken-1">Native Types</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="purple-darken-3" size="40" class="me-3">mdi-star</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ rareWoodTypes }}</h3>
                <p class="text-body-2 text-purple-darken-1">Rare Types</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                label="Search wood types..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                label="Status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="originFilter"
                label="Origin"
                :items="originOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-btn
                color="orange-darken-2"
                variant="outlined"
                block
                @click="clearFilters"
              >
                Clear Filters
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Wood Types Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-tree</v-icon>
          Wood Types Management
        </v-card-title>
        
        <v-data-table
          :headers="headers"
          :items="filteredWoodTypes"
          :loading="woodStore.loading"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:item.isActive="{ item }">
            <v-chip
              :color="item.isActive ? 'green' : 'grey'"
              size="small"
              variant="flat"
            >
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>

          <template v-slot:item.isNative="{ item }">
            <v-chip
              :color="item.isNative ? 'blue' : 'grey'"
              size="small"
              variant="flat"
            >
              {{ item.isNative ? 'Native' : 'Imported' }}
            </v-chip>
          </template>

          <template v-slot:item.isRare="{ item }">
            <v-chip
              :color="item.isRare ? 'purple' : 'grey'"
              size="small"
              variant="flat"
            >
              {{ item.isRare ? 'Rare' : 'Common' }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="editWoodType(item)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="deleteWoodType(item)"
            />
          </template>
        </v-data-table>
      </v-card>

      <!-- Create/Edit Dialog -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-tree</v-icon>
            {{ editMode ? 'Edit Wood Type' : 'Add Wood Type' }}
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.woodName"
                    label="Wood Type Name"
                    :rules="[rules.required]"
                    variant="outlined"
                    prepend-inner-icon="mdi-tree"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.woodOrigin"
                    label="Wood Origin"
                    :rules="[rules.required]"
                    variant="outlined"
                    prepend-inner-icon="mdi-earth"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.woodDescription"
                    label="Description"
                    :rules="[rules.required]"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-text"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.woodCharacteristics"
                    label="Characteristics"
                    :rules="[rules.required]"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-clipboard-text"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.woodHardness"
                    label="Hardness"
                    :rules="[rules.required]"
                    variant="outlined"
                    prepend-inner-icon="mdi-hammer"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.woodColor"
                    label="Color"
                    :rules="[rules.required]"
                    variant="outlined"
                    prepend-inner-icon="mdi-palette"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-switch
                    v-model="formData.isNative"
                    label="Native"
                    color="blue"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-switch
                    v-model="formData.isRare"
                    label="Rare"
                    color="purple"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-switch
                    v-model="formData.isActive"
                    label="Active"
                    color="green"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn
              text
              @click="closeDialog"
            >
              Cancel
            </v-btn>
            <v-btn
              color="orange-darken-2"
              variant="elevated"
              @click="saveWoodType"
              :disabled="!valid"
              :loading="saving"
            >
              {{ editMode ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Error/Success Snackbar -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
      >
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn
            variant="text"
            @click="snackbar.show = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWoodTypeStore } from '@/stores/woodStore'

const woodStore = useWoodTypeStore()

// Data
const saving = ref(false)
const dialog = ref(false)
const editMode = ref(false)
const valid = ref(false)
const search = ref('')
const statusFilter = ref('all')
const originFilter = ref('all')

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Form data
const formData = ref({
  id: null as number | null,
  woodName: '',
  woodDescription: '',
  woodCharacteristics: '',
  woodOrigin: '',
  woodHardness: '',
  woodColor: '',
  isNative: false,
  isRare: false,
  isActive: true,
  createdAt: ''
})

// Options
const statusOptions = [
  { title: 'All', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' }
]

const originOptions = computed(() => {
  const origins = ['all', ...new Set(woodStore.getWoodTypes.map(w => w.woodOrigin))]
  return origins.map(origin => ({
    title: origin === 'all' ? 'All' : origin,
    value: origin
  }))
})

// Table headers
const headers = [
  { title: 'Name', key: 'woodName' },
  { title: 'Origin', key: 'woodOrigin' },
  { title: 'Color', key: 'woodColor' },
  { title: 'Hardness', key: 'woodHardness' },
  { title: 'Status', key: 'isActive' },
  { title: 'Native', key: 'isNative' },
  { title: 'Rare', key: 'isRare' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Validation rules
const rules = {
  required: (value: string) => !!value || 'This field is required'
}

// Computed properties
const filteredWoodTypes = computed(() => {
  let filtered = woodStore.getWoodTypes

  if (statusFilter.value === 'active') {
    filtered = filtered.filter(item => item.isActive)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(item => !item.isActive)
  }

  if (originFilter.value !== 'all') {
    filtered = filtered.filter(item => item.woodOrigin === originFilter.value)
  }

  return filtered
})

const totalWoodTypes = computed(() => woodStore.getWoodTypes.length)
const activeWoodTypes = computed(() => woodStore.getActiveWoodTypes.length)
const nativeWoodTypes = computed(() => woodStore.getNativeWoodTypes.length)
const rareWoodTypes = computed(() => woodStore.getRareWoodTypes.length)

// Methods
const showSnackbar = (text: string, color: string = 'success') => {
  snackbar.value.text = text
  snackbar.value.color = color
  snackbar.value.show = true
}

const openCreateDialog = () => {
  editMode.value = false
  formData.value = {
    id: null,
    woodName: '',
    woodDescription: '',
    woodCharacteristics: '',
    woodOrigin: '',
    woodHardness: '',
    woodColor: '',
    isNative: false,
    isRare: false,
    isActive: true,
    createdAt: ''
  }
  dialog.value = true
}

const editWoodType = (item: any) => {
  editMode.value = true
  formData.value = { ...item }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  formData.value = {
    id: null,
    woodName: '',
    woodDescription: '',
    woodCharacteristics: '',
    woodOrigin: '',
    woodHardness: '',
    woodColor: '',
    isNative: false,
    isRare: false,
    isActive: true,
    createdAt: ''
  }
}

const saveWoodType = async () => {
  saving.value = true
  
  try {
    if (editMode.value && formData.value.id) {
      // Update existing wood type
      await woodStore.updateWoodType(formData.value.id, formData.value)
      showSnackbar('Wood type updated successfully')
    } else {
      // Create new wood type
      const createData = {
        ...formData.value,
        createdAt: new Date().toISOString()
      }
      await woodStore.createWoodType(createData)
      showSnackbar('Wood type created successfully')
    }
    
    closeDialog()
  } catch (error) {
    console.error('Error saving wood type:', error)
    showSnackbar('Error saving wood type', 'error')
  } finally {
    saving.value = false
  }
}

const deleteWoodType = async (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.woodName}?`)) {
    try {
      await woodStore.deleteWoodType(item.id)
      showSnackbar('Wood type deleted successfully')
    } catch (error) {
      console.error('Error deleting wood type:', error)
      showSnackbar('Error deleting wood type', 'error')
    }
  }
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'all'
  originFilter.value = 'all'
}

// Lifecycle
onMounted(async () => {
  try {
    await woodStore.fetchWoodTypes()
  } catch (error) {
    console.error('Error fetching wood types:', error)
    showSnackbar('Error loading wood types', 'error')
  }
})
</script>

<style scoped>
.wood-types-view {
  background-color: #fafafa;
  min-height: 100vh;
}
</style>