<template>
    <div class="artisans-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-3">Master Artisans</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage skilled craftspeople and their expertise
            </p>
          </div>
          <v-btn
            color="orange-darken-2"
            variant="elevated"
            prepend-icon="mdi-account-plus"
            @click="openCreateDialog"
          >
            Add Artisan
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-account-group</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalArtisans }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Total Artisans</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-account-check</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activeArtisans }}</h3>
                  <p class="text-body-2 text-green-darken-1">Active Artisans</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-map-marker</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ totalRegions }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Regions Covered</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-star</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ averageExperience }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Avg. Experience (Years)</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Filters and Search -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="search"
                  label="Search artisans..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="statusFilter"
                  label="Status"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="regionFilter"
                  label="Region"
                  :items="regionOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="specializationFilter"
                  label="Specialization"
                  :items="specializationOptions"
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
  
        <!-- Artisans Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-account-group</v-icon>
            Master Artisans Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredArtisans"
            :loading="artisanStore.loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'yearsOfExperience', order: 'desc' }]"
          >
            <template v-slot:item.profileImageUrl="{ item }">
              <v-avatar
                size="40"
                class="ma-2"
              >
                <v-img
                  v-if="item.profileImageUrl"
                  :src="item.profileImageUrl"
                  :alt="item.artisanName"
                />
                <v-icon v-else color="grey">mdi-account</v-icon>
              </v-avatar>
            </template>
  
            <template v-slot:item.artisanName="{ item }">
              <div>
                <div class="font-weight-bold">{{ item.artisanName }}</div>
                <div class="text-caption text-grey-darken-1">{{ item.village }}, {{ item.region }}</div>
              </div>
            </template>
  
            <template v-slot:item.yearsOfExperience="{ item }">
              <v-chip
                :color="getExperienceColor(item.yearsOfExperience)"
                size="small"
                variant="flat"
              >
                {{ item.yearsOfExperience }} years
              </v-chip>
            </template>
  
            <template v-slot:item.isActive="{ item }">
              <v-chip
                :color="item.isActive ? 'green' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.isActive ? 'Active' : 'Inactive' }}
              </v-chip>
            </template>
  
            <template v-slot:item.contactInfo="{ item }">
              <div class="d-flex flex-column">
                <span class="text-caption">{{ item.contactPhone }}</span>
                <span class="text-caption text-grey-darken-1">{{ item.contactEmail }}</span>
              </div>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-eye"
                variant="text"
                size="small"
                color="blue"
                @click="viewArtisan(item)"
              />
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editArtisan(item)"
              />
              <v-btn
                icon="mdi-toggle-switch"
                variant="text"
                size="small"
                color="warning"
                @click="toggleStatus(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deleteArtisan(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="900px">
          <v-card>
            <v-card-title class="pa-6 bg-orange-lighten-5">
              <v-icon class="me-2" color="orange-darken-3">mdi-account-group</v-icon>
              {{ editMode ? 'Edit Artisan' : 'Add New Artisan' }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.artisanName"
                      label="Artisan Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.artisanSlug"
                      label="Artisan Slug"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-link"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.village"
                      label="Village"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-home-city"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.region"
                      label="Region"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-map"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.biography"
                      label="Biography"
                      :rules="[rules.required]"
                      rows="3"
                      variant="outlined"
                      prepend-inner-icon="mdi-text"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.yearsOfExperience"
                      label="Years of Experience"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-star"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.specialization"
                      label="Specialization"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-tools"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contactPhone"
                      label="Contact Phone"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-phone"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contactEmail"
                      label="Contact Email"
                      :rules="[rules.required, rules.email]"
                      variant="outlined"
                      prepend-inner-icon="mdi-email"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.profileImageUrl"
                      label="Profile Image URL"
                      variant="outlined"
                      prepend-inner-icon="mdi-camera"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="formData.isActive"
                      label="Active Status"
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
                @click="saveArtisan"
                :disabled="!valid"
                :loading="saving"
              >
                {{ editMode ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- View Artisan Dialog -->
        <v-dialog v-model="viewDialog" max-width="600px">
          <v-card v-if="selectedArtisan">
            <v-card-title class="pa-6 bg-orange-lighten-5">
              <v-icon class="me-2" color="orange-darken-3">mdi-account</v-icon>
              {{ selectedArtisan.artisanName }}
            </v-card-title>
            
            <v-card-text class="pa-6">
              <div class="d-flex flex-column align-center mb-4">
                <v-avatar size="120" class="mb-3">
                  <v-img
                    v-if="selectedArtisan.profileImageUrl"
                    :src="selectedArtisan.profileImageUrl"
                    :alt="selectedArtisan.artisanName"
                  />
                  <v-icon v-else size="80" color="grey">mdi-account</v-icon>
                </v-avatar>
                <h3 class="text-h5 font-weight-bold">{{ selectedArtisan.artisanName }}</h3>
                <p class="text-body-2 text-grey-darken-1">{{ selectedArtisan.village }}, {{ selectedArtisan.region }}</p>
              </div>
              
              <v-divider class="mb-4" />
              
              <div class="mb-4">
                <h4 class="text-h6 mb-2">Biography</h4>
                <p class="text-body-1">{{ selectedArtisan.biography }}</p>
              </div>
              
              <v-row>
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="orange-darken-3" class="me-2">mdi-star</v-icon>
                    <span class="font-weight-bold">{{ selectedArtisan.yearsOfExperience }} years experience</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="orange-darken-3" class="me-2">mdi-tools</v-icon>
                    <span>{{ selectedArtisan.specialization }}</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="orange-darken-3" class="me-2">mdi-phone</v-icon>
                    <span>{{ selectedArtisan.contactPhone }}</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="orange-darken-3" class="me-2">mdi-email</v-icon>
                    <span>{{ selectedArtisan.contactEmail }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                text
                @click="viewDialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useArtisanStore } from '@/stores/artisan'
  import { ref, computed, onMounted } from 'vue'
  import { useSnackbarStore } from '@/stores/snackbar'
import { ArtisanDTO } from '@/stores/types/member'
  
  const artisanStore = useArtisanStore()
  const snackbar = useSnackbarStore()
  
  // Data
  const saving = ref(false)
  const dialog = ref(false)
  const viewDialog = ref(false)
  const editMode = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const regionFilter = ref('all')
  const specializationFilter = ref('all')
  const selectedArtisan = ref<ArtisanDTO|null>(null)
  
  // Form data
  const formData = ref({
    artisanName: '',
    artisanSlug: '',
    village: '',
    region: '',
    biography: '',
    yearsOfExperience: 0,
    specialization: '',
    contactPhone: '',
    contactEmail: '',
    profileImageUrl: '',
    isActive: true
  })
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' }
  ]
  
  const regionOptions = computed(() => [
    { title: 'All', value: 'all' },
    ...Array.from(new Set(artisanStore.getArtisans.map(a => a.region)))
      .map(region => ({ title: region, value: region }))
  ])
  
  const specializationOptions = computed(() => [
    { title: 'All', value: 'all' },
    ...Array.from(new Set(artisanStore.getArtisans.map(a => a.specialization)))
      .map(spec => ({ title: spec, value: spec }))
  ])
  
  // Table headers
  const headers = [
    { title: 'Photo', key: 'profileImageUrl', sortable: false },
    { title: 'Name', key: 'artisanName' },
    { title: 'Experience', key: 'yearsOfExperience' },
    { title: 'Specialization', key: 'specialization' },
    { title: 'Contact', key: 'contactInfo', sortable: false },
    { title: 'Status', key: 'isActive' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    number: (value: any) => !isNaN(value) || 'Must be a number',
    email: (value: string) => /.+@.+\..+/.test(value) || 'Must be a valid email'
  }
  
  // Computed properties
  const filteredArtisans = computed(() => {
    let filtered = artisanStore.getArtisans
  
    if (statusFilter.value === 'active') {
      filtered = filtered.filter(item => item.isActive)
    } else if (statusFilter.value === 'inactive') {
      filtered = filtered.filter(item => !item.isActive)
    }
  
    if (regionFilter.value !== 'all') {
      filtered = filtered.filter(item => item.region === regionFilter.value)
    }
  
    if (specializationFilter.value !== 'all') {
      filtered = filtered.filter(item => item.specialization === specializationFilter.value)
    }
  
    return filtered
  })
  
  const totalArtisans = computed(() => artisanStore.getArtisans.length)
  const activeArtisans = computed(() => artisanStore.getActiveArtisans.length)
  const totalRegions = computed(() => new Set(artisanStore.getArtisans.map(a => a.region)).size)
  const averageExperience = computed(() => {
    const artisans = artisanStore.getArtisans
    if (artisans.length === 0) return 0
    return Math.round(artisans.reduce((sum, a) => sum + a.yearsOfExperience, 0) / artisans.length)
  })
  
  // Methods
  const getExperienceColor = (years: number) => {
    if (years >= 20) return 'purple'
    if (years >= 10) return 'blue'
    if (years >= 5) return 'green'
    return 'orange'
  }
  
  const openCreateDialog = () => {
    editMode.value = false
    formData.value = {
      artisanName: '',
      artisanSlug: '',
      village: '',
      region: '',
      biography: '',
      yearsOfExperience: 0,
      specialization: '',
      contactPhone: '',
      contactEmail: '',
      profileImageUrl: '',
      isActive: true
    }
    dialog.value = true
  }
  
  const editArtisan = (item: any) => {
    editMode.value = true
    formData.value = { ...item }
    dialog.value = true
  }
  
  const viewArtisan = (item: any) => {
    selectedArtisan.value = item
    viewDialog.value = true
  }
  
  const closeDialog = () => {
    dialog.value = false
    formData.value = {
      artisanName: '',
      artisanSlug: '',
      village: '',
      region: '',
      biography: '',
      yearsOfExperience: 0,
      specialization: '',
      contactPhone: '',
      contactEmail: '',
      profileImageUrl: '',
      isActive: true
    }
  }
  
  const saveArtisan = async () => {
    saving.value = true
    
    try {
      if (editMode.value) {
        // Update existing artisan
        const response = await artisanStore.updateArtisan(selectedArtisan.value?.artisanId!, formData.value)
        if (response.isSuccessful) {
          snackbar.success('Artisan updated successfully')
          closeDialog()
        } else {
          snackbar.error('Error updating artisan')
        }
      } else {
        // Create new artisan
        const response = await artisanStore.createArtisan(formData.value)
        if (response.isSuccessful) {
          snackbar.success('Artisan created successfully')
          closeDialog()
        } else {
          snackbar.error('Error creating artisan')
        }
      }
    } catch (error) {
      console.error('Error saving artisan:', error)
      snackbar.error('Error saving artisan')
    } finally {
      saving.value = false
    }
  }
  
  const deleteArtisan = async (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.artisanName}?`)) {
      try {
        const response = await artisanStore.deleteArtisan(item.artisanId)
        if (response.isSuccessful) {
          snackbar.success('Artisan deleted successfully')
        } else {
          snackbar.error('Error deleting artisan')
        }
      } catch (error) {
        console.error('Error deleting artisan:', error)
        snackbar.error('Error deleting artisan')
      }
    }
  }
  
  const toggleStatus = async (item: any) => {
    try {
      const updatedData = { ...item, isActive: !item.isActive }
      const response = await artisanStore.updateArtisan(item.artisanId, updatedData)
      if (response.isSuccessful) {
        snackbar.success(`Artisan ${item.isActive ? 'deactivated' : 'activated'} successfully`)
      } else {
        snackbar.error('Error updating artisan status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      snackbar.error('Error updating artisan status')
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
    regionFilter.value = 'all'
    specializationFilter.value = 'all'
  }
  
  onMounted(async () => {
    try {
      await artisanStore.fetchArtisans()
    } catch (error) {
      console.error('Error fetching artisans:', error)
      snackbar.error('Error loading artisans')
    }
  })
  </script>
  
  <style scoped>
  .artisans-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>