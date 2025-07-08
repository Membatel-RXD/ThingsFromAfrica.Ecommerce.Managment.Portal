<template>
    <div class="payment-methods-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-blue-darken-3">Payment Methods</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage payment methods for your business
            </p>
          </div>
          <v-btn
            color="blue-darken-2"
            variant="elevated"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Add Payment Method
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-credit-card-multiple</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ totalPaymentMethods }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Total Methods</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activePaymentMethods }}</h3>
                  <p class="text-body-2 text-green-darken-1">Active Methods</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-web</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ onlinePaymentMethods }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Online Methods</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-store</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ offlinePaymentMethods }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Offline Methods</p>
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
                  label="Search payment methods..."
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
                  v-model="typeFilter"
                  label="Type"
                  :items="typeOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="blue-darken-2"
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
  
        <!-- Payment Methods Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-blue-lighten-5">
            <v-icon class="me-2" color="blue-darken-3">mdi-credit-card-multiple</v-icon>
            Payment Methods Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredPaymentMethods"
            :loading="paymentMethodStore.loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'sortOrder', order: 'asc' }]"
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
  
            <template v-slot:item.isOnline="{ item }">
              <v-chip
                :color="item.isOnline ? 'purple' : 'orange'"
                size="small"
                variant="flat"
              >
                {{ item.isOnline ? 'Online' : 'Offline' }}
              </v-chip>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editPaymentMethod(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deletePaymentMethod(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="700px">
          <v-card>
            <v-card-title class="pa-6 bg-blue-lighten-5">
              <v-icon class="me-2" color="blue-darken-3">mdi-credit-card-multiple</v-icon>
              {{ editMode ? 'Edit Payment Method' : 'Add Payment Method' }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.methodName"
                      label="Method Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-credit-card"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.methodCode"
                      label="Method Code"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-barcode"
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
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="formData.sortOrder"
                      label="Sort Order"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-sort"
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
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="formData.isOnline"
                      label="Online Method"
                      color="purple"
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
                color="blue-darken-2"
                variant="elevated"
                @click="savePaymentMethod"
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
  import { usePaymentMethodStore } from '@/stores/paymentMethod'
  import { ref, computed, onMounted } from 'vue'
  import { useSnackbarStore } from '@/stores/snackbar'
  
  const paymentMethodStore = usePaymentMethodStore()
  const snackbar = useSnackbarStore()
  
  // Data
  const saving = ref(false)
  const dialog = ref(false)
  const editMode = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const typeFilter = ref('all')
  
  // Form data
  const formData = ref({
    paymentMethodId: null as number | null,
    methodName: '',
    methodCode: '',
    description: '',
    sortOrder: 0,
    isActive: true,
    isOnline: false
  })
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' }
  ]
  
  const typeOptions = [
    { title: 'All', value: 'all' },
    { title: 'Online', value: 'online' },
    { title: 'Offline', value: 'offline' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Sort Order', key: 'sortOrder' },
    { title: 'Method Name', key: 'methodName' },
    { title: 'Code', key: 'methodCode' },
    { title: 'Description', key: 'description' },
    { title: 'Status', key: 'isActive' },
    { title: 'Type', key: 'isOnline' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    number: (value: any) => !isNaN(value) || 'Must be a number'
  }
  
  // Computed properties
  const filteredPaymentMethods = computed(() => {
    let filtered = paymentMethodStore.getPaymentMethods
  
    if (statusFilter.value === 'active') {
      filtered = filtered.filter(item => item.isActive)
    } else if (statusFilter.value === 'inactive') {
      filtered = filtered.filter(item => !item.isActive)
    }
  
    if (typeFilter.value === 'online') {
      filtered = filtered.filter(item => item.isOnline)
    } else if (typeFilter.value === 'offline') {
      filtered = filtered.filter(item => !item.isOnline)
    }
  
    return filtered
  })
  
  const totalPaymentMethods = computed(() => paymentMethodStore.getPaymentMethods.length)
  const activePaymentMethods = computed(() => paymentMethodStore.getActivePaymentMethods.length)
  const onlinePaymentMethods = computed(() => paymentMethodStore.getOnlinePaymentMethods.length)
  const offlinePaymentMethods = computed(() => paymentMethodStore.getPaymentMethods.filter(pm => !pm.isOnline).length)
  
  // Methods
  const openCreateDialog = () => {
    editMode.value = false
    formData.value = {
      paymentMethodId: null,
      methodName: '',
      methodCode: '',
      description: '',
      sortOrder: paymentMethodStore.getPaymentMethods.length + 1,
      isActive: true,
      isOnline: false
    }
    dialog.value = true
  }
  
  const editPaymentMethod = (item: any) => {
    editMode.value = true
    formData.value = { ...item }
    dialog.value = true
  }
  
  const closeDialog = () => {
    dialog.value = false
    formData.value = {
      paymentMethodId: null,
      methodName: '',
      methodCode: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      isOnline: false
    }
  }
  
  const savePaymentMethod = async () => {
    saving.value = true
    
    try {
      if (editMode.value && formData.value.paymentMethodId) {
        // Update existing payment method
        const response = await paymentMethodStore.updatePaymentMethod(formData.value.paymentMethodId, formData.value)
        if (response.isSuccessful) {
          snackbar.success('Payment method updated successfully')
          closeDialog()
        } else {
          snackbar.error('Error updating payment method')
        }
      } else {
        // Create new payment method
        const response = await paymentMethodStore.createPaymentMethod(formData.value)
        if (response.isSuccessful) {
          snackbar.success('Payment method created successfully')
          closeDialog()
        } else {
          snackbar.error('Error creating payment method')
        }
      }
    } catch (error) {
      console.error('Error saving payment method:', error)
      snackbar.error('Error saving payment method')
    } finally {
      saving.value = false
    }
  }
  
  const deletePaymentMethod = async (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.methodName}?`)) {
      try {
        const response = await paymentMethodStore.deletePaymentMethod(item.paymentMethodId)
        if (response.isSuccessful) {
          snackbar.success('Payment method deleted successfully')
        } else {
          snackbar.error('Error deleting payment method')
        }
      } catch (error) {
        console.error('Error deleting payment method:', error)
        snackbar.error('Error deleting payment method')
      }
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
    typeFilter.value = 'all'
  }
  
  onMounted(async () => {
    try {
      await paymentMethodStore.fetchPaymentMethods()
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      snackbar.error('Error loading payment methods')
    }
  })
  </script>
  
  <style scoped>
  .payment-methods-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>