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
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ typesWithProducts }}</h3>
                  <p class="text-body-2 text-blue-darken-1">With Products</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-star</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ popularWoodTypes }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Popular Types</p>
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
            :loading="loading"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:item.image="{ item }">
              <v-avatar size="40" class="ma-2">
                <v-img :src="item.image" :alt="item.name" />
              </v-avatar>
            </template>
  
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="item.status === 'active' ? 'green' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.status }}
              </v-chip>
            </template>
  
            <template v-slot:item.hardness="{ item }">
              <v-rating
                :model-value="item.hardness"
                readonly
                size="small"
                color="orange"
                half-increments
              />
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
                      v-model="formData.name"
                      label="Wood Type Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-tree"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.scientific_name"
                      label="Scientific Name"
                      variant="outlined"
                      prepend-inner-icon="mdi-flask"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.description"
                      label="Description"
                      rows="3"
                      variant="outlined"
                      prepend-inner-icon="mdi-text"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.origin"
                      label="Origin"
                      :items="originOptions"
                      variant="outlined"
                      prepend-inner-icon="mdi-earth"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.status"
                      label="Status"
                      :items="statusOptions"
                      variant="outlined"
                      prepend-inner-icon="mdi-check-circle"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-slider
                      v-model="formData.hardness"
                      label="Hardness Level"
                      :min="1"
                      :max="5"
                      :step="0.5"
                      thumb-label
                      prepend-icon="mdi-hammer"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.density"
                      label="Density (kg/m³)"
                      type="number"
                      variant="outlined"
                      prepend-inner-icon="mdi-weight"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.image"
                      label="Image URL"
                      variant="outlined"
                      prepend-inner-icon="mdi-image"
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
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  
  // Data
  const loading = ref(false)
  const saving = ref(false)
  const dialog = ref(false)
  const editMode = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const originFilter = ref('all')
  
  // Form data
  const formData = ref({
    id: null,
    name: '',
    scientific_name: '',
    description: '',
    origin: '',
    status: 'active',
    hardness: 3,
    density: '',
    image: '',
    products_count: 0
  })
  
  // Sample data
  const woodTypes = ref([
    {
      id: 1,
      name: 'Mahogany',
      scientific_name: 'Swietenia mahagoni',
      description: 'Premium hardwood with rich reddish-brown color',
      origin: 'Central America',
      status: 'active',
      hardness: 4.5,
      density: 560,
      image: '/images/wood/mahogany.jpg',
      products_count: 15
    },
    {
      id: 2,
      name: 'Oak',
      scientific_name: 'Quercus',
      description: 'Strong and durable hardwood with prominent grain',
      origin: 'North America',
      status: 'active',
      hardness: 4,
      density: 750,
      image: '/images/wood/oak.jpg',
      products_count: 23
    },
    {
      id: 3,
      name: 'Teak',
      scientific_name: 'Tectona grandis',
      description: 'Weather-resistant tropical hardwood',
      origin: 'Southeast Asia',
      status: 'active',
      hardness: 4.5,
      density: 655,
      image: '/images/wood/teak.jpg',
      products_count: 8
    },
    {
      id: 4,
      name: 'Ebony',
      scientific_name: 'Diospyros',
      description: 'Dense black hardwood, highly prized',
      origin: 'Africa',
      status: 'limited',
      hardness: 5,
      density: 1200,
      image: '/images/wood/ebony.jpg',
      products_count: 3
    }
  ])
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Limited', value: 'limited' },
    { title: 'Inactive', value: 'inactive' }
  ]
  
  const originOptions = [
    { title: 'All', value: 'all' },
    { title: 'Africa', value: 'Africa' },
    { title: 'Asia', value: 'Asia' },
    { title: 'North America', value: 'North America' },
    { title: 'South America', value: 'South America' },
    { title: 'Europe', value: 'Europe' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Image', key: 'image', sortable: false },
    { title: 'Name', key: 'name' },
    { title: 'Scientific Name', key: 'scientific_name' },
    { title: 'Origin', key: 'origin' },
    { title: 'Status', key: 'status' },
    { title: 'Hardness', key: 'hardness' },
    { title: 'Density', key: 'density' },
    { title: 'Products', key: 'products_count' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required'
  }
  
  // Computed properties
  const filteredWoodTypes = computed(() => {
    let filtered = woodTypes.value
  
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter.value)
    }
  
    if (originFilter.value !== 'all') {
      filtered = filtered.filter(item => item.origin === originFilter.value)
    }
  
    return filtered
  })
  
  const totalWoodTypes = computed(() => woodTypes.value.length)
  const activeWoodTypes = computed(() => woodTypes.value.filter(item => item.status === 'active').length)
  const typesWithProducts = computed(() => woodTypes.value.filter(item => item.products_count > 0).length)
  const popularWoodTypes = computed(() => woodTypes.value.filter(item => item.products_count > 10).length)
  
  // Methods
  const openCreateDialog = () => {
    editMode.value = false
    formData.value = {
      id: null,
      name: '',
      scientific_name: '',
      description: '',
      origin: '',
      status: 'active',
      hardness: 3,
      density: '',
      image: '',
      products_count: 0
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
      name: '',
      scientific_name: '',
      description: '',
      origin: '',
      status: 'active',
      hardness: 3,
      density: '',
      image: '',
      products_count: 0
    }
  }
  
  const saveWoodType = async () => {
    saving.value = true
    
    try {
      if (editMode.value) {
        // Update existing wood type
        const index = woodTypes.value.findIndex(item => item.id === formData.value.id)
        if (index !== -1) {
          woodTypes.value[index] = { ...formData.value }
        }
      } else {
        // Create new wood type
        const newWoodType = {
          ...formData.value,
          id: Date.now(), // Generate simple ID
          products_count: 0
        }
        woodTypes.value.push(newWoodType)
      }
      
      closeDialog()
    } catch (error) {
      console.error('Error saving wood type:', error)
    } finally {
      saving.value = false
    }
  }
  
  const deleteWoodType = (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      const index = woodTypes.value.findIndex(woodType => woodType.id === item.id)
      if (index !== -1) {
        woodTypes.value.splice(index, 1)
      }
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
    originFilter.value = 'all'
  }
  
  // Lifecycle
  onMounted(() => {
    // Load data
  })
  </script>
  
  <style scoped>
  .wood-types-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>