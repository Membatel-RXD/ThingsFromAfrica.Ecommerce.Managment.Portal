<template>
  <div class="shipping-rates-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Shipping Rates</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage all shipping rates by country, weight, and value
          </p>
        </div>
        <v-btn
          color="orange-darken-2"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Add Shipping Rate
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-currency-usd</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalRates }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Rates</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-earth</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ uniqueCountries }}</h3>
                <p class="text-body-2 text-green-darken-1">Countries</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ activeCount }}</h3>
                <p class="text-body-2 text-blue-darken-1">Active Rates</p>
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
                label="Search by Country, Method, Currency..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="activeFilter"
                label="Active Status"
                :items="activeOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="currencyFilter"
                label="Currency"
                :items="currencyOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Shipping Rates Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-currency-usd</v-icon>
          Shipping Rates Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredRates"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.isActive="{ item }">
            <v-chip :color="item.isActive ? 'green' : 'grey'" size="small">
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>
          <template v-slot:item.createdAt="{ item }">
            <span>{{ formatDate(item.createdAt) }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn :icon="item.isActive ? 'mdi-check-circle' : 'mdi-cancel'"
                   variant="text"
                   size="small"
                   :color="item.isActive ? 'green' : 'grey'"
                   @click="toggleStatus(item)"
                   :title="item.isActive ? 'Deactivate' : 'Activate'"
            />
            <v-btn icon="mdi-eye" variant="text" size="small" color="blue" @click="viewItem(item)" />
            <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="editItem(item)" />
            <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteItem(item)" />
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="addDialog" max-width="700">
      <v-card>
        <v-card-title class="pa-4" style="background:#fff3e0;">
          <v-icon color="orange" class="me-2">mdi-currency-usd</v-icon>
          {{ editMode ? 'Edit Shipping Rate' : 'Add Shipping Rate' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.shippingMethodId" label="Shipping Method ID" prepend-inner-icon="mdi-truck" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.countryCode" label="Country Code" prepend-inner-icon="mdi-earth" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.countryName" label="Country Name" prepend-inner-icon="mdi-earth" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.rate" label="Rate" prepend-inner-icon="mdi-currency-usd" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.currency" label="Currency" prepend-inner-icon="mdi-currency-usd" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.isActive" label="Active?" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.minWeight" label="Min Weight" prepend-inner-icon="mdi-weight-kilogram" type="number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.maxWeight" label="Max Weight" prepend-inner-icon="mdi-weight-kilogram" type="number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.minValue" label="Min Value" prepend-inner-icon="mdi-cash" type="number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.maxValue" label="Max Value" prepend-inner-icon="mdi-cash" type="number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.createdAt" label="Created At" prepend-inner-icon="mdi-calendar" type="date" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateRate() : createRate()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="700">
      <v-card>
        <v-card-title class="pa-4 bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          View Shipping Rate
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(value, key) in selectedItem" :key="key">
              <v-list-item-title class="font-weight-bold">{{ key }}</v-list-item-title>
              <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-red-lighten-4 text-red-darken-3">
          <v-icon class="me-2">mdi-delete</v-icon>
          Delete Shipping Rate
        </v-card-title>
        <v-card-text class="pa-6">
          <p>
            Are you sure you want to delete this shipping rate?
            <span v-if="itemToDelete">
              <br>
              <strong>
                {{ itemToDelete.countryName }} ({{ itemToDelete.countryCode }}) - {{ itemToDelete.currency }} {{ itemToDelete.rate }}
              </strong>
            </span>
          </p>
          <p class="text-caption text-grey-darken-1 mt-2">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-2" variant="elevated" @click="confirmDelete" :loading="loading" :disabled="loading">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useShippingRateStore } from '@/stores/shippingRate';
import { useSnackbarStore } from '@/stores/snackbar';

const shippingRateStore = useShippingRateStore();
const snackbar = useSnackbarStore();
const loading = computed(() => shippingRateStore.loading);
const error = computed(() => shippingRateStore.error);
const search = ref('');
const activeFilter = ref('All');
const currencyFilter = ref('All');

const headers = [
  { title: 'ID', key: 'rateId' },
  { title: 'Shipping Method ID', key: 'shippingMethodId' },
  { title: 'Country', key: 'countryName' },
  { title: 'Country Code', key: 'countryCode' },
  { title: 'Rate', key: 'rate' },
  { title: 'Currency', key: 'currency' },
  { title: 'Active', key: 'isActive' },
  { title: 'Min Weight', key: 'minWeight' },
  { title: 'Max Weight', key: 'maxWeight' },
  { title: 'Min Value', key: 'minValue' },
  { title: 'Max Value', key: 'maxValue' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const activeOptions = ['All', 'Active', 'Inactive'];
const currencyOptions = computed(() => ['All', ...new Set(shippingRateStore.getRates.map(item => item.currency))]);

const filteredRates = computed(() => {
  return shippingRateStore.getRates.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.countryName.toLowerCase().includes(s) ||
      item.countryCode.toLowerCase().includes(s) ||
      item.currency.toLowerCase().includes(s);
    const matchesActive = activeFilter.value === 'All' ||
      (activeFilter.value === 'Active' && item.isActive) ||
      (activeFilter.value === 'Inactive' && !item.isActive);
    const matchesCurrency = currencyFilter.value === 'All' || item.currency === currencyFilter.value;
    return matchesSearch && matchesActive && matchesCurrency;
  });
});

// Stats
const totalRates = computed(() => shippingRateStore.getRates.length);
const uniqueCountries = computed(() => new Set(shippingRateStore.getRates.map(item => item.countryCode)).size);
const activeCount = computed(() => shippingRateStore.getRates.filter(i => i.isActive).length);

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref({
  shippingMethodId: '',
  countryCode: '',
  countryName: '',
  rate: '',
  currency: '',
  isActive: true,
  createdAt: '',
  minWeight: '',
  maxWeight: '',
  minValue: '',
  maxValue: '',
});
const editMode = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const selectedItem = ref<any>(null);
const itemToDelete = ref<any>(null);
const rules = {
  required: (v: any) => !!v || 'Required',
};
const openCreateDialog = () => {
  addDialog.value = true;
  editMode.value = false;
  Object.assign(newItem.value, {
    shippingMethodId: '',
    countryCode: '',
    countryName: '',
    rate: '',
    currency: '',
    isActive: true,
    createdAt: '',
    minWeight: '',
    maxWeight: '',
    minValue: '',
    maxValue: '',
  });
};
const createRate = async () => {
  if (!addForm.value?.validate()) return;
  // Prepare payload as CreateShippingRate
  const payload = {
    shippingMethodId: Number(newItem.value.shippingMethodId),
    countryCode: newItem.value.countryCode,
    countryName: newItem.value.countryName,
    rate: Number(newItem.value.rate),
    currency: newItem.value.currency,
    isActive: newItem.value.isActive,
    minWeight: newItem.value.minWeight ? Number(newItem.value.minWeight) : undefined,
    maxWeight: newItem.value.maxWeight ? Number(newItem.value.maxWeight) : undefined,
    minValue: newItem.value.minValue ? Number(newItem.value.minValue) : undefined,
    maxValue: newItem.value.maxValue ? Number(newItem.value.maxValue) : undefined,
  };
  await shippingRateStore.addRate(payload);
  if (shippingRateStore.error) {
    snackbar.error(shippingRateStore.error);
  } else {
    snackbar.success('Shipping rate added successfully');
  }
  addDialog.value = false;
};
const viewItem = (item: any) => {
  selectedItem.value = { ...item };
  viewDialog.value = true;
};
const editItem = (item: any) => {
  editMode.value = true;
  addDialog.value = true;
  Object.assign(newItem.value, { ...item });
};
const updateRate = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    shippingMethodId: Number(newItem.value.shippingMethodId),
    countryCode: newItem.value.countryCode,
    countryName: newItem.value.countryName,
    rate: Number(newItem.value.rate),
    currency: newItem.value.currency,
    isActive: newItem.value.isActive,
    minWeight: newItem.value.minWeight ? Number(newItem.value.minWeight) : undefined,
    maxWeight: newItem.value.maxWeight ? Number(newItem.value.maxWeight) : undefined,
    minValue: newItem.value.minValue ? Number(newItem.value.minValue) : undefined,
    maxValue: newItem.value.maxValue ? Number(newItem.value.maxValue) : undefined,
  };
  await shippingRateStore.updateRate(Number(newItem.value.rateId), payload);
  if (shippingRateStore.error) {
    snackbar.error(shippingRateStore.error);
  } else {
    snackbar.success('Shipping rate updated successfully');
  }
  addDialog.value = false;
  editMode.value = false;
};
const deleteItem = (item: any) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};
const confirmDelete = async () => {
  if (itemToDelete.value) {
    await shippingRateStore.deleteRate(itemToDelete.value.rateId);
    if (shippingRateStore.error) {
      snackbar.error(shippingRateStore.error);
    } else {
      snackbar.success('Shipping rate deleted successfully');
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};
const toggleStatus = async (item: any) => {
  await shippingRateStore.updateRate(item.rateId, { isActive: !item.isActive });
  if (shippingRateStore.error) {
    snackbar.error(shippingRateStore.error);
  } else {
    snackbar.success('Shipping rate status updated');
  }
};
const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  shippingRateStore.fetchRates();
});
</script>

<style scoped>
.shipping-rates-view {
  background: #f8f9fa;
}
</style> 