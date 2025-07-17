<template>
  <div class="shipment-items-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Shipment Items</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage all items included in shipments
          </p>
        </div>
        <v-btn
          color="orange-darken-2"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Add Item to Shipment
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-package-variant-closed</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalItems }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Items Shipped</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-truck-delivery</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ uniqueShipments }}</h3>
                <p class="text-body-2 text-green-darken-1">Total Shipments</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-earth</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ uniqueCountries }}</h3>
                <p class="text-body-2 text-blue-darken-1">Countries of Origin</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="purple-darken-3" size="40" class="me-3">mdi-cash</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ totalCustomsValue }}</h3>
                <p class="text-body-2 text-purple-darken-1">Total Customs Value</p>
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
                label="Search by Product, Shipment ID..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="shipmentIdFilter"
                label="Filter by Shipment ID"
                variant="outlined"
                density="compact"
                hide-details
                type="number"
              />
            </v-col>
            <v-col cols="12" md="3">
                 <v-select
                  v-model="countryFilter"
                  label="Country of Origin"
                  :items="countryOptions"
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

      <!-- Shipment Items Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-package-variant</v-icon>
          Shipment Items Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.customsValue="{ item }">
            <span>${{ item.customsValue.toFixed(2) }}</span>
          </template>
          <template v-slot:item.createdAt="{ item }">
            <span>{{ new Date(item.createdAt).toLocaleDateString() }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-eye" variant="text" size="small" color="blue" @click="viewItem(item)" />
            <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="editItem(item)" />
            <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteItem(item)" />
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Dialogs for Add/Edit/View/Delete will be implemented next -->
    <v-dialog v-model="addDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4" style="background:#fff3e0;">
          <v-icon color="orange" class="me-2">mdi-package-variant</v-icon>
          {{ editMode ? 'Edit Shipment Item' : 'Add Shipment Item' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.productName" label="Product Name" prepend-inner-icon="mdi-cube-outline" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.productId" label="Product ID" prepend-inner-icon="mdi-pound" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.shipmentId" label="Shipment ID" prepend-inner-icon="mdi-truck" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.orderItemId" label="Order Item ID" prepend-inner-icon="mdi-format-list-numbered" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.quantity" label="Quantity" prepend-inner-icon="mdi-counter" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.customsValue" label="Customs Value" prepend-inner-icon="mdi-cash" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.customsDescription" label="Customs Description" prepend-inner-icon="mdi-text" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.harmonizedCode" label="Harmonized Code" prepend-inner-icon="mdi-barcode" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.countryOfOrigin" label="Country of Origin" prepend-inner-icon="mdi-earth" />
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
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateShipmentItem() : createShipmentItem()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4 bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          View Shipment Item
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
          Delete Shipment Item
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this shipment item?</p>
          <p class="text-caption text-grey-darken-1 mt-2">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-2" variant="elevated" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useShipmentItemStore } from '@/stores/shipmentItem';
import { useSnackbarStore } from '@/stores/snackbar';

const shipmentItemStore = useShipmentItemStore();
const snackbar = useSnackbarStore();
const loading = computed(() => shipmentItemStore.loading);
const error = computed(() => shipmentItemStore.error);
const search = ref('');
const shipmentIdFilter = ref('');
const countryFilter = ref('All');

const headers = [
  { title: 'Shipment ID', key: 'shipmentId' },
  { title: 'Product Name', key: 'productName' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Customs Value', key: 'customsValue' },
  { title: 'Origin', key: 'countryOfOrigin' },
  { title: 'HS Code', key: 'harmonizedCode' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const countryOptions = computed(() => ['All', ...new Set(shipmentItemStore.getItems.map(item => item.countryOfOrigin))]);

const filteredItems = computed(() => {
  return shipmentItemStore.getItems.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.productName.toLowerCase().includes(s) ||
      item.shipmentId.toString().includes(s);

    const matchesShipmentId = !shipmentIdFilter.value ||
      item.shipmentId.toString() === shipmentIdFilter.value;

    const matchesCountry = countryFilter.value === 'All' ||
      item.countryOfOrigin === countryFilter.value;

    return matchesSearch && matchesShipmentId && matchesCountry;
  });
});

// Stats
const totalItems = computed(() => shipmentItemStore.getItems.reduce((sum, item) => sum + item.quantity, 0));
const uniqueShipments = computed(() => new Set(shipmentItemStore.getItems.map(item => item.shipmentId)).size);
const uniqueCountries = computed(() => new Set(shipmentItemStore.getItems.map(item => item.countryOfOrigin)).size);
const totalCustomsValue = computed(() => {
    const total = shipmentItemStore.getItems.reduce((sum, item) => sum + (item.customsValue * item.quantity), 0);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
});

const clearFilters = () => {
  search.value = '';
  shipmentIdFilter.value = '';
  countryFilter.value = 'All';
};

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref({
  productName: '',
  productId: '',
  shipmentId: '',
  orderItemId: '',
  quantity: '',
  customsValue: '',
  customsDescription: '',
  harmonizedCode: '',
  countryOfOrigin: '',
  createdAt: new Date().toISOString().slice(0, 10),
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
    productName: '',
    productId: '',
    shipmentId: '',
    orderItemId: '',
    quantity: '',
    customsValue: '',
    customsDescription: '',
    harmonizedCode: '',
    countryOfOrigin: '',
    createdAt: new Date().toISOString().slice(0, 10),
  });
};
const createShipmentItem = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    productName: newItem.value.productName,
    productId: Number(newItem.value.productId),
    shipmentId: Number(newItem.value.shipmentId),
    orderItemId: Number(newItem.value.orderItemId),
    quantity: Number(newItem.value.quantity),
    customsValue: Number(newItem.value.customsValue),
    customsDescription: newItem.value.customsDescription,
    harmonizedCode: newItem.value.harmonizedCode,
    countryOfOrigin: newItem.value.countryOfOrigin,
  };
  await shipmentItemStore.addItem(payload);
  if (shipmentItemStore.error) {
    snackbar.error(shipmentItemStore.error);
  } else {
    snackbar.success('Shipment item added successfully');
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
const updateShipmentItem = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    productName: newItem.value.productName,
    productId: Number(newItem.value.productId),
    shipmentId: Number(newItem.value.shipmentId),
    orderItemId: Number(newItem.value.orderItemId),
    quantity: Number(newItem.value.quantity),
    customsValue: Number(newItem.value.customsValue),
    customsDescription: newItem.value.customsDescription,
    harmonizedCode: newItem.value.harmonizedCode,
    countryOfOrigin: newItem.value.countryOfOrigin,
  };
  await shipmentItemStore.updateItem(Number(newItem.value.shipmentItemId), payload);
  if (shipmentItemStore.error) {
    snackbar.error(shipmentItemStore.error);
  } else {
    snackbar.success('Shipment item updated successfully');
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
    await shipmentItemStore.deleteItem(itemToDelete.value.shipmentItemId);
    if (shipmentItemStore.error) {
      snackbar.error(shipmentItemStore.error);
    } else {
      snackbar.success('Shipment item deleted successfully');
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};

onMounted(() => {
  shipmentItemStore.fetchItems();
});
</script>

<style scoped>
.shipment-items-view {
  background: #f8f9fa;
}
</style> 