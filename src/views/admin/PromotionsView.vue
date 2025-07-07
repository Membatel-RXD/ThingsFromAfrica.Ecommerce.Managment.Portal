<template>
    <div class="promotions-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-deep-purple-darken-3">Promotions & Discounts</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage promotional campaigns and discount codes
            </p>
          </div>
          <v-btn
            color="deep-purple-darken-2"
            variant="elevated"
            prepend-icon="mdi-ticket-percent"
            @click="openCreateDialog"
          >
            Create Promotion
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="deep-purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="deep-purple-darken-3" size="40" class="me-3">mdi-ticket-percent</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-deep-purple-darken-3">{{ totalPromotions }}</h3>
                  <p class="text-body-2 text-deep-purple-darken-1">Total Promotions</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activePromotions }}</h3>
                  <p class="text-body-2 text-green-darken-1">Active Promotions</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-clock-outline</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ validPromotions }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Valid Now</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-airplane</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ touristOnlyPromotions }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Tourist Only</p>
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
                  label="Search promotions..."
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
                  v-model="validityFilter"
                  label="Validity"
                  :items="validityOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
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
                <v-select
                  v-model="touristFilter"
                  label="Tourist Only"
                  :items="touristOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="1">
                <v-btn
                  color="deep-purple-darken-2"
                  variant="outlined"
                  block
                  @click="clearFilters"
                >
                  Clear
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
  
        <!-- Promotions Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-deep-purple-lighten-5">
            <v-icon class="me-2" color="deep-purple-darken-3">mdi-ticket-percent</v-icon>
            Promotions Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredPromotions"
            :loading="promotionStore.loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'startDate', order: 'desc' }]"
          >
            <template v-slot:item.promotionCode="{ item }">
              <v-chip
                color="deep-purple"
                size="small"
                variant="flat"
                prepend-icon="mdi-tag"
              >
                {{ item.promotionCode }}
              </v-chip>
            </template>
  
            <template v-slot:item.discountValue="{ item }">
              <span class="font-weight-bold">
                {{ item.isPercentage ? item.discountValue + '%' : '$' + item.discountValue }}
              </span>
            </template>
  
            <template v-slot:item.startDate="{ item }">
              <span class="text-body-2">
                {{ formatDate(item.startDate) }}
              </span>
            </template>
  
            <template v-slot:item.endDate="{ item }">
              <span class="text-body-2">
                {{ formatDate(item.endDate) }}
              </span>
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
  
            <template v-slot:item.validity="{ item }">
              <v-chip
                :color="getValidityColor(item)"
                size="small"
                variant="flat"
              >
                {{ getValidityStatus(item) }}
              </v-chip>
            </template>
  
            <template v-slot:item.usage="{ item }">
              <div class="d-flex align-center">
                <v-progress-linear
                  :model-value="(item.currentUsageCount / item.maxUsageCount) * 100"
                  height="8"
                  color="deep-purple"
                  class="me-2"
                  style="width: 60px;"
                />
                <span class="text-body-2">
                  {{ item.currentUsageCount }}/{{ item.maxUsageCount }}
                </span>
              </div>
            </template>
  
            <template v-slot:item.isTouristOnly="{ item }">
              <v-chip
                :color="item.isTouristOnly ? 'blue' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.isTouristOnly ? 'Tourist Only' : 'All Users' }}
              </v-chip>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-eye"
                variant="text"
                size="small"
                color="primary"
                @click="viewPromotion(item)"
              />
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="warning"
                @click="editPromotion(item)"
              />
              <v-btn
                icon="mdi-toggle-switch"
                variant="text"
                size="small"
                color="info"
                @click="toggleStatus(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deletePromotion(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-card-title class="pa-6 bg-deep-purple-lighten-5">
              <v-icon class="me-2" color="deep-purple-darken-3">mdi-ticket-percent</v-icon>
              {{ editMode ? 'Edit Promotion' : 'Create Promotion' }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.promotionName"
                      label="Promotion Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-tag"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.promotionCode"
                      label="Promotion Code"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-ticket"
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
                      v-model.number="formData.discountValue"
                      label="Discount Value"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-percent"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="formData.discountTypeId"
                      label="Discount Type ID"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-format-list-numbered"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="formData.isPercentage"
                      label="Percentage Discount"
                      color="deep-purple"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.startDate"
                      label="Start Date"
                      type="datetime-local"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-calendar-start"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.endDate"
                      label="End Date"
                      type="datetime-local"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-calendar-end"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.minimumOrderAmount"
                      label="Minimum Order Amount"
                      type="number"
                      :rules="[rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-cash"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.maximumDiscountAmount"
                      label="Maximum Discount Amount"
                      type="number"
                      :rules="[rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-cash-check"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.maxUsageCount"
                      label="Maximum Usage Count"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-counter"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.maxUsagePerCustomer"
                      label="Max Usage Per Customer"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-account-multiple"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.applicableCountries"
                      label="Applicable Countries"
                      placeholder="US, UK, CA (comma-separated)"
                      variant="outlined"
                      prepend-inner-icon="mdi-earth"
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
                      v-model="formData.isTouristOnly"
                      label="Tourist Only"
                      color="blue"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="formData.createdBy"
                      label="Created By (User ID)"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
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
                color="deep-purple-darken-2"
                variant="elevated"
                @click="savePromotion"
                :disabled="!valid"
                :loading="saving"
              >
                {{ editMode ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- View Dialog -->
        <v-dialog v-model="viewDialog" max-width="600px">
          <v-card v-if="selectedPromotion">
            <v-card-title class="pa-6 bg-deep-purple-lighten-5">
              <v-icon class="me-2" color="deep-purple-darken-3">mdi-eye</v-icon>
              Promotion Details
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card class="pa-4 mb-4" color="deep-purple-lighten-5">
                    <h3 class="text-h6 mb-2">{{ selectedPromotion.promotionName }}</h3>
                    <v-chip color="deep-purple" size="small" class="mb-2">
                      {{ selectedPromotion.promotionCode }}
                    </v-chip>
                    <p class="text-body-2 mb-0">{{ selectedPromotion.description }}</p>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card class="pa-4 mb-4" color="green-lighten-5">
                    <h4 class="text-h6 mb-2">Discount Details</h4>
                    <p class="text-h4 font-weight-bold mb-1">
                      {{ selectedPromotion.isPercentage ? selectedPromotion.discountValue + '%' : '$' + selectedPromotion.discountValue }}
                    </p>
                    <p class="text-body-2">
                      {{ selectedPromotion.isPercentage ? 'Percentage Discount' : 'Fixed Amount' }}
                    </p>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="pa-4 mb-4" color="blue-lighten-5">
                    <h4 class="text-h6 mb-3">Usage Statistics</h4>
                    <v-row>
                      <v-col cols="6">
                        <div class="text-center">
                          <h3 class="text-h5 font-weight-bold">{{ selectedPromotion.currentUsageCount }}</h3>
                          <p class="text-body-2">Current Uses</p>
                        </div>
                      </v-col>
                      <v-col cols="6">
                        <div class="text-center">
                          <h3 class="text-h5 font-weight-bold">{{ selectedPromotion.maxUsageCount }}</h3>
                          <p class="text-body-2">Max Uses</p>
                        </div>
                      </v-col>
                    </v-row>
                    <v-progress-linear
                      :model-value="(selectedPromotion.currentUsageCount / selectedPromotion.maxUsageCount) * 100"
                      height="10"
                      color="deep-purple"
                      class="mt-2"
                    />
                  </v-card>
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
  import { usePromotionStore } from '@/stores/promotion'
  import { ref, computed, onMounted } from 'vue'
  import { useSnackbarStore } from '@/stores/snackbar'
import { PromotionDTO } from '@/stores/types/member'
  
  const promotionStore = usePromotionStore()
  const snackbar = useSnackbarStore()
  
  // Data
  const saving = ref(false)
  const dialog = ref(false)
  const viewDialog = ref(false)
  const editMode = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const validityFilter = ref('all')
  const typeFilter = ref('all')
  const touristFilter = ref('all')
  const selectedPromotion = ref<PromotionDTO | null>(null)
  
  // Form data
  const formData = ref({
    promotionName: '',
    promotionCode: '',
    description: '',
    discountValue: 0,
    discountTypeId: 1,
    isPercentage: false,
    startDate: '',
    endDate: '',
    minimumOrderAmount: 0,
    maximumDiscountAmount: 0,
    maxUsageCount: 1,
    maxUsagePerCustomer: 1,
    applicableCountries: '',
    isActive: true,
    isTouristOnly: false,
    createdBy: 1
  })
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' }
  ]
  
  const validityOptions = [
    { title: 'All', value: 'all' },
    { title: 'Valid Now', value: 'valid' },
    { title: 'Expired', value: 'expired' },
    { title: 'Future', value: 'future' }
  ]
  
  const typeOptions = [
    { title: 'All', value: 'all' },
    { title: 'Percentage', value: 'percentage' },
    { title: 'Fixed Amount', value: 'fixed' }
  ]
  
  const touristOptions = [
    { title: 'All', value: 'all' },
    { title: 'Tourist Only', value: 'tourist' },
    { title: 'All Users', value: 'all-users' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Code', key: 'promotionCode' },
    { title: 'Name', key: 'promotionName' },
    { title: 'Discount', key: 'discountValue' },
    { title: 'Start Date', key: 'startDate' },
    { title: 'End Date', key: 'endDate' },
    { title: 'Status', key: 'isActive' },
    { title: 'Validity', key: 'validity' },
    { title: 'Usage', key: 'usage' },
    { title: 'Tourist Only', key: 'isTouristOnly' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    number: (value: any) => !isNaN(value) || 'Must be a number'
  }
  
  // Computed properties
  const filteredPromotions = computed(() => {
    let filtered = promotionStore.getPromotions
  
    if (statusFilter.value === 'active') {
      filtered = filtered.filter(item => item.isActive)
    } else if (statusFilter.value === 'inactive') {
      filtered = filtered.filter(item => !item.isActive)
    }
  
    if (validityFilter.value === 'valid') {
      filtered = promotionStore.getValidPromotions
    } else if (validityFilter.value === 'expired') {
      const now = new Date()
      filtered = filtered.filter(item => new Date(item.endDate) < now)
    } else if (validityFilter.value === 'future') {
      const now = new Date()
      filtered = filtered.filter(item => new Date(item.startDate) > now)
    }
  
    if (typeFilter.value === 'percentage') {
      filtered = filtered.filter(item => item.isPercentage)
    } else if (typeFilter.value === 'fixed') {
      filtered = filtered.filter(item => !item.isPercentage)
    }
  
    if (touristFilter.value === 'tourist') {
      filtered = filtered.filter(item => item.isTouristOnly)
    } else if (touristFilter.value === 'all-users') {
      filtered = filtered.filter(item => !item.isTouristOnly)
    }
  
    return filtered
  })
  
  const totalPromotions = computed(() => promotionStore.getPromotions.length)
  const activePromotions = computed(() => promotionStore.getActivePromotions.length)
  const validPromotions = computed(() => promotionStore.getValidPromotions.length)
  const touristOnlyPromotions = computed(() => promotionStore.getTouristOnlyPromotions.length)
  
  // Methods
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getValidityStatus = (promotion: PromotionDTO) => {
    const now = new Date()
    const start = new Date(promotion.startDate)
    const end = new Date(promotion.endDate)
  
    if (start > now) return 'Future'
    if (end < now) return 'Expired'
    if (!promotion.isActive) return 'Inactive'
    return 'Valid'
  }
  
  const getValidityColor = (promotion: PromotionDTO) => {
    const status = getValidityStatus(promotion)
    switch (status) {
      case 'Valid': return 'green'
      case 'Future': return 'blue'
      case 'Expired': return 'red'
      case 'Inactive': return 'grey'
      default: return 'grey'
    }
  }
  
  const openCreateDialog = () => {
    editMode.value = false
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    
    formData.value = {
      promotionName: '',
      promotionCode: '',
      description: '',
      discountValue: 0,
      discountTypeId: 1,
      isPercentage: false,
      startDate: now.toISOString().slice(0, 16),
      endDate: futureDate.toISOString().slice(0, 16),
      minimumOrderAmount: 0,
      maximumDiscountAmount: 0,
      maxUsageCount: 1,
      maxUsagePerCustomer: 1,
      applicableCountries: '',
      isActive: true,
      isTouristOnly: false,
      createdBy: 1
    }
    dialog.value = true
  }
  
  const editPromotion = (item: PromotionDTO) => {
    editMode.value = true
    formData.value = {
      ...item,
      startDate: new Date(item.startDate).toISOString().slice(0, 16),
      endDate: new Date(item.endDate).toISOString().slice(0, 16)
    }
    dialog.value = true
  }
  
  const viewPromotion = (item: PromotionDTO) => {
    selectedPromotion.value = item
    viewDialog.value = true
  }
  
  const closeDialog = () => {
    dialog.value = false
    formData.value = {
      promotionName: '',
      promotionCode: '',
      description: '',
      discountValue: 0,
      discountTypeId: 1,
      isPercentage: false,
      startDate: '',
      endDate: '',
      minimumOrderAmount: 0,
      maximumDiscountAmount: 0,
      maxUsageCount: 1,
      maxUsagePerCustomer: 1,
      applicableCountries: '',
      isActive: true,
      isTouristOnly: false,
      createdBy: 1
    }
  }
  
  const savePromotion = async () => {
    saving.value = true
    
    try {
      // Convert dates to ISO strings
      const promotionData = {
        ...formData.value,
        startDate: new Date(formData.value.startDate).toISOString(),
        endDate: new Date(formData.value.endDate).toISOString(),
        currentUsageCount:0
      }
  
      if (editMode.value) {
        const response = await promotionStore.updatePromotion(selectedPromotion.value?.promotionId!, promotionData)
        if (response.isSuccessful) {
          snackbar.success('Promotion updated successfully')
          closeDialog()
        } else {
          snackbar.error('Error updating promotion')
        }
      } else {
        const response = await promotionStore.createPromotion(promotionData)
        if (response.isSuccessful) {
          snackbar.success('Promotion created successfully')
          closeDialog()
        } else {
          snackbar.error('Error creating promotion')
        }
      }
    } catch (error) {
      console.error('Error saving promotion:', error)
      snackbar.error('Error saving promotion')
    } finally {
      saving.value = false
    }
  }
  
  const deletePromotion = async (item: PromotionDTO) => {
    if (confirm(`Are you sure you want to delete ${item.promotionName}?`)) {
      try {
        const response = await promotionStore.deletePromotion(item.promotionId)
        if (response.isSuccessful) {
          snackbar.success('Promotion deleted successfully')
        } else {
          snackbar.error('Error deleting promotion')
        }
      } catch (error) {
        console.error('Error deleting promotion:', error)
        snackbar.error('Error deleting promotion')
      }
    }
  }
  
  const toggleStatus = async (item: PromotionDTO) => {
    try {
      const response = await promotionStore.updatePromotion(item.promotionId, {
        ...item,
        isActive: !item.isActive
      })
      if (response.isSuccessful) {
        snackbar.success(`Promotion ${item.isActive ? 'deactivated' : 'activated'} successfully`)
      } else {
        snackbar.error('Error updating promotion status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      snackbar.error('Error updating promotion status')
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = ''
  }
  
  onMounted(async () => {
    try {
      await promotionStore.fetchPromotions()
    } catch (error) {
      console.error('Error fetching categories:', error)
      snackbar.error('Error loading categories')
    }
  })
  </script>