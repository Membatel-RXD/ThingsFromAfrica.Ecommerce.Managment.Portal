<template>
    <div class="craft-types-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-3">Craft Types</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage craft types for your products
            </p>
          </div>
          <v-btn
            color="orange-darken-2"
            variant="elevated"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Add Craft Type
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="4">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-tools</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalCraftTypes }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Total Craft Types</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activeCraftTypes }}</h3>
                  <p class="text-body-2 text-green-darken-1">Active Craft Types</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-calendar-clock</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ recentCraftTypes }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Recent Additions</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Filters and Search -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  label="Search craft types..."
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
  
        <!-- Craft Types Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-tools</v-icon>
            Craft Types Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredCraftTypes"
            :loading="craftTypeStore.loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'craftTypeName', order: 'asc' }]"
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
  
            <template v-slot:item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editCraftType(item)"
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
                @click="deleteCraftType(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="pa-6 bg-orange-lighten-5">
              <v-icon class="me-2" color="orange-darken-3">mdi-tools</v-icon>
              {{ editMode ? 'Edit Craft Type' : 'Add Craft Type' }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.craftTypeName"
                      label="Craft Type Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-tools"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.craftTypeDescription"
                      label="Description"
                      :rules="[rules.required]"
                      rows="3"
                      variant="outlined"
                      prepend-inner-icon="mdi-text"
                    />
                  </v-col>
                  <v-col cols="12">
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
                @click="saveCraftType"
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
  import { useSnackbarStore } from '@/stores/snackbar'
  import type { CraftType, CraftTypeCreationRequest } from '@/stores/types/member'
import { useCraftTypeStore } from '@/stores/craftStore'
  
  const craftTypeStore = useCraftTypeStore()
  const snackbar = useSnackbarStore()
  
  // Data
  const saving = ref(false)
  const dialog = ref(false)
  const editMode = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  
  // Form data
  const formData = ref<CraftTypeCreationRequest & { craftTypeId?: number }>({
    craftTypeName: '',
    craftTypeDescription: '',
    isActive: true,
    createdAt: new Date().toISOString()
  })
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Name', key: 'craftTypeName' },
    { title: 'Description', key: 'craftTypeDescription' },
    { title: 'Status', key: 'isActive' },
    { title: 'Created', key: 'createdAt' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required'
  }
  
  // Computed properties
  const filteredCraftTypes = computed(() => {
    let filtered = craftTypeStore.getCraftTypes
  
    if (statusFilter.value === 'active') {
      filtered = filtered.filter((item: { isActive: any }) => item.isActive)
    } else if (statusFilter.value === 'inactive') {
      filtered = filtered.filter((item: { isActive: any }) => !item.isActive)
    }
  
    return filtered
  })
  
  const totalCraftTypes = computed(() => craftTypeStore.getCraftTypes.length)
  const activeCraftTypes = computed(() => craftTypeStore.getActiveCraftTypes.length)
  const recentCraftTypes = computed(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return craftTypeStore.getCraftTypes.filter(ct => 
      new Date(ct.createdAt) >= thirtyDaysAgo
    ).length
  })
  
  // Methods
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const openCreateDialog = () => {
    editMode.value = false
    formData.value = {
      craftTypeName: '',
      craftTypeDescription: '',
      isActive: true,
      createdAt: new Date().toISOString()
    }
    dialog.value = true
  }
  
  const editCraftType = (item: CraftType) => {
    editMode.value = true
    formData.value = { ...item }
    dialog.value = true
  }
  
  const closeDialog = () => {
    dialog.value = false
    formData.value = {
      craftTypeName: '',
      craftTypeDescription: '',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  }
  
  const saveCraftType = async () => {
    saving.value = true
    
    try {
      if (editMode.value && formData.value.craftTypeId) {
        // Update existing craft type
        const response = await craftTypeStore.updateCraftType(formData.value.craftTypeId, formData.value)
        if (response.isSuccessful) {
          snackbar.success('Craft type updated successfully')
          closeDialog()
        } else {
          snackbar.error('Error updating craft type')
        }
      } else {
        // Create new craft type
        const { craftTypeId, ...createData } = formData.value
        const response = await craftTypeStore.createCraftType(createData)
        if (response.isSuccessful) {
          snackbar.success('Craft type created successfully')
          closeDialog()
        } else {
          snackbar.error('Error creating craft type')
        }
      }
    } catch (error) {
      console.error('Error saving craft type:', error)
      snackbar.error('Error saving craft type')
    } finally {
      saving.value = false
    }
  }
  
  const deleteCraftType = async (item: CraftType) => {
    if (confirm(`Are you sure you want to delete ${item.craftTypeName}?`)) {
      try {
        const response = await craftTypeStore.deleteCraftType(item.craftTypeId)
        if (response.isSuccessful) {
          snackbar.success('Craft type deleted successfully')
        } else {
          snackbar.error('Error deleting craft type')
        }
      } catch (error) {
        console.error('Error deleting craft type:', error)
        snackbar.error('Error deleting craft type')
      }
    }
  }
  
  const toggleStatus = async (item: CraftType) => {
    try {
      const response = await craftTypeStore.updateCraftType(item.craftTypeId, {
        ...item,
        isActive: !item.isActive
      })
      if (response.isSuccessful) {
        snackbar.success(`Craft type ${item.isActive ? 'deactivated' : 'activated'} successfully`)
      } else {
        snackbar.error('Error updating craft type status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      snackbar.error('Error updating craft type status')
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
  }
  
  onMounted(async () => {
    try {
      await craftTypeStore.fetchCraftTypes()
    } catch (error) {
      console.error('Error fetching craft types:', error)
      snackbar.error('Error loading craft types')
    }
  })
  </script>
  
  <style scoped>
  .craft-types-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>