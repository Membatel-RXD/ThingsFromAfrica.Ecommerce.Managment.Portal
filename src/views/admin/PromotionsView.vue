<template>
    <div class="promotions-view">
      <v-container fluid class="pa-6 promotions-main-container">
        <!-- Page Header -->
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between mb-6">
              <div>
                <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                  Promotions
                </h1>
                <p class="text-subtitle-1 text-grey-darken-2">
                  Manage your promotional campaigns and discount codes
                </p>
              </div>
              <v-btn color="orange-darken-2" variant="elevated" size="large" @click="openCreateDialog">
                <v-icon start icon="mdi-plus"></v-icon>
                Create Promotion
              </v-btn>
            </div>
          </v-col>
        </v-row>
  
        <!-- Stat Cards -->
        <v-row class="mb-6">
          <v-col cols="12" sm="3">
            <v-card color="orange-lighten-3" variant="elevated">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="orange-darken-2" icon="mdi-ticket-percent" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-orange-darken-4">{{ totalPromotions }}</h3>
                <p class="mb-0">Total Promotions</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="green-lighten-4" variant="elevated">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="green-darken-2" icon="mdi-check-circle" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-green-darken-2">{{ activePromotions }}</h3>
                <p class="mb-0">Active Promotions</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="blue-lighten-4" variant="elevated">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="blue-darken-2" icon="mdi-clock-outline" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-blue-darken-2">{{ validPromotions }}</h3>
                <p class="mb-0">Valid Now</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="purple-lighten-4" variant="elevated">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="purple-darken-2" icon="mdi-airplane" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-purple-darken-2">{{ touristOnlyPromotions }}</h3>
                <p class="mb-0">Tourist Only</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Filters and Search -->
        <v-card class="elevation-4 mb-6">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  label="Search promotions..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn color="orange-darken-2" variant="outlined" block @click="clearFilters">
                  Clear Filters
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
  
        <!-- Promotions Table -->
        <v-card class="elevation-4">
          <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
            <v-icon icon="mdi-ticket-percent" class="me-2"></v-icon>
            Promotions Management
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="filteredPromotions"
            :loading="promotionStore.loading"
            :search="search"
            class="elevation-0"
            :sort-by="[{ key: 'startDate', order: 'desc' }]"
            :items-per-page="itemsPerPage"
            :page.sync="page"
            show-current-page
            :footer-props="{ 'items-per-page-options': [10, 20, 50, 100], 'items-per-page-text': 'Items per page:' }"
          >
            <template v-slot:item.promotionCode="{ item }">
              <v-chip color="orange-darken-2" size="small" variant="flat" prepend-icon="mdi-tag">
                {{ item.promotionCode }}
              </v-chip>
            </template>
            <template v-slot:item.discountValue="{ item }">
              <span class="font-weight-bold">
                {{ item.isPercentage ? item.discountValue + '%' : '$' + item.discountValue }}
              </span>
            </template>
            <template v-slot:item.isActive="{ item }">
              <v-chip :color="item.isActive ? 'green' : 'grey'" size="small" variant="flat">
                {{ item.isActive ? 'Active' : 'Inactive' }}
              </v-chip>
            </template>
            <template v-slot:item.isTouristOnly="{ item }">
              <v-chip :color="item.isTouristOnly ? 'purple-darken-2' : 'grey'" size="small" variant="flat">
                {{ item.isTouristOnly ? 'Tourist Only' : 'All Users' }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon="mdi-eye" size="small" variant="text" color="blue" @click="viewPromotion(item)"></v-btn>
              <v-btn icon="mdi-pencil" size="small" variant="text" color="orange" @click="editPromotion(item)"></v-btn>
              <v-btn icon="mdi-toggle-switch" size="small" variant="text" color="info" @click="toggleStatus(item)"></v-btn>
              <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="askDeletePromotion(item)"></v-btn>
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
                      color="purple-darken-2"
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

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="400px">
          <v-card>
            <v-card-title class="pa-6 bg-red-lighten-5">
              <v-icon class="me-2" color="red-darken-3">mdi-delete</v-icon>
              Confirm Deletion
            </v-card-title>
            <v-card-text class="pa-6 text-center">
              <p class="text-body-1">Are you sure you want to delete this promotion?</p>
            </v-card-text>
            <v-card-actions class="pa-6">
              <v-btn
                variant="outlined"
                @click="deleteDialog = false"
              >
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn
                color="red-darken-2"
                variant="elevated"
                @click="confirmDeletePromotion"
                :loading="saving"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { usePromotionStore } from '@/stores/promotion';
  import { useSnackbarStore } from '@/stores/snackbar';

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const promotionStore = usePromotionStore();
  const snackbar = useSnackbarStore();

  const dialog = ref(false);
  const viewDialog = ref(false);
  const deleteDialog = ref(false);
  const editMode = ref(false);
  const saving = ref(false);
  const valid = ref(false);
  const deleteId = ref<number|null>(null);
  const selectedPromotion = ref(null);
  const search = ref('');
  const itemsPerPage = ref(10);
  const page = ref(1);

  const formData = ref({
    promotionName: '',
    promotionCode: '',
    description: '',
    discountTypeId: 1,
    discountValue: 0,
    isPercentage: false,
    startDate: '',
    endDate: '',
    isActive: true,
    isTouristOnly: false,
    minimumOrderAmount: 0,
    maximumDiscountAmount: 0,
    maxUsageCount: 1,
    maxUsagePerCustomer: 1,
    applicableCountries: '',
    createdBy: 1
  });

  async function fetchPromotions() {
    try {
      await promotionStore.fetchPromotions();
    } catch (e: any) {
      snackbar.error(e?.message || 'Failed to fetch promotions');
    }
  }

  onMounted(fetchPromotions);

  function openCreateDialog() {
    editMode.value = false;
    formData.value = {
      promotionName: '',
      promotionCode: '',
      description: '',
      discountTypeId: 1,
      discountValue: 0,
      isPercentage: false,
      startDate: '',
      endDate: '',
      isActive: true,
      isTouristOnly: false,
      minimumOrderAmount: 0,
      maximumDiscountAmount: 0,
      maxUsageCount: 1,
      maxUsagePerCustomer: 1,
      applicableCountries: '',
      createdBy: 1
    };
    dialog.value = true;
  }

  function editPromotion(item: any) {
    editMode.value = true;
    formData.value = { ...item };
    dialog.value = true;
  }

  function closeDialog() {
    dialog.value = false;
    editMode.value = false;
  }

  async function savePromotion() {
    saving.value = true;
    try {
      if (editMode.value) {
        const id = formData.value.promotionId;
        const res = await promotionStore.updatePromotion(id, { ...formData.value, promotionId: id });
        if (res.isSuccessful) {
          snackbar.success('Promotion updated successfully');
          dialog.value = false;
        } else {
          snackbar.error(res.remark || 'Failed to update promotion');
        }
      } else {
        const res = await promotionStore.createPromotion({ ...formData.value });
        if (res.isSuccessful) {
          snackbar.success('Promotion created successfully');
          dialog.value = false;
        } else {
          snackbar.error(res.remark || 'Failed to create promotion');
        }
      }
      await fetchPromotions();
    } catch (e: any) {
      snackbar.error(e?.message || 'Failed to save promotion');
    } finally {
      saving.value = false;
    }
  }

  function viewPromotion(item: any) {
    selectedPromotion.value = item;
    viewDialog.value = true;
  }

  function askDeletePromotion(item: any) {
    deleteId.value = item.promotionId;
    deleteDialog.value = true;
  }

  async function confirmDeletePromotion() {
    if (!deleteId.value) return;
    saving.value = true;
    try {
      const res = await promotionStore.deletePromotion(deleteId.value);
      if (res.isSuccessful) {
        snackbar.success('Promotion deleted successfully');
      } else {
        snackbar.error(res.remark || 'Failed to delete promotion');
      }
      await fetchPromotions();
    } catch (e: any) {
      snackbar.error(e?.message || 'Failed to delete promotion');
    } finally {
      saving.value = false;
      deleteDialog.value = false;
      deleteId.value = null;
    }
  }

  async function toggleStatus(item: any) {
    try {
      const res = await promotionStore.updatePromotion(item.promotionId, { ...item, isActive: !item.isActive });
      if (res.isSuccessful) {
        snackbar.success(`Promotion ${item.isActive ? 'deactivated' : 'activated'} successfully`);
        await fetchPromotions();
      } else {
        snackbar.error(res.remark || 'Failed to update status');
      }
    } catch (e: any) {
      snackbar.error(e?.message || 'Failed to update status');
    }
  }

  function clearFilters() {
    search.value = '';
  }

  const filteredPromotions = computed(() => {
    const s = search.value.toLowerCase();
    return promotionStore.getPromotions.filter((item: any) =>
      item.promotionName.toLowerCase().includes(s) ||
      item.promotionCode.toLowerCase().includes(s)
    );
  });

  const headers = [
    { title: 'Code', key: 'promotionCode' },
    { title: 'Name', key: 'promotionName' },
    { title: 'Discount', key: 'discountValue' },
    { title: 'Start Date', key: 'startDate' },
    { title: 'End Date', key: 'endDate' },
    { title: 'Status', key: 'isActive' },
    { title: 'Usage', key: 'usage' },
    { title: 'Tourist Only', key: 'isTouristOnly' },
    { title: 'Actions', key: 'actions', sortable: false }
  ];

  function formatDate(date: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
  
  const totalPromotions = computed(() => promotionStore.getPromotions.length)
  const activePromotions = computed(() => promotionStore.getActivePromotions.length)
  const validPromotions = computed(() => promotionStore.getValidPromotions.length)
  const touristOnlyPromotions = computed(() => promotionStore.getTouristOnlyPromotions.length)
  
  // Methods
  const getValidityStatus = (promotion: any) => {
    const now = new Date()
    const start = new Date(promotion.startDate)
    const end = new Date(promotion.endDate)
  
    if (start > now) return 'Future'
    if (end < now) return 'Expired'
    if (!promotion.isActive) return 'Inactive'
    return 'Valid'
  }
  
  const getValidityColor = (promotion: any) => {
    const status = getValidityStatus(promotion)
    switch (status) {
      case 'Valid': return 'green'
      case 'Future': return 'blue'
      case 'Expired': return 'red'
      case 'Inactive': return 'grey'
      default: return 'grey'
    }
  }
  
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    number: (value: any) => !isNaN(value) || 'Must be a number'
  }
  </script>