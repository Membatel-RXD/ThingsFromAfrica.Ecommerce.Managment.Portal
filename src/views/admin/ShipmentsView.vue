<template>
  <div class="shipments-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Shipments</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage all outgoing shipments
          </p>
        </div>
        <v-btn
          color="orange-darken-2"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Add Shipment
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-truck-fast</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalShipments }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Shipments</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-package-variant</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ totalPackages }}</h3>
                <p class="text-body-2 text-green-darken-1">Total Packages</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-domain</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ uniqueCarriers }}</h3>
                <p class="text-body-2 text-blue-darken-1">Carriers Used</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="purple-darken-3" size="40" class="me-3">mdi-cash</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ totalWeight }} kg</h3>
                <p class="text-body-2 text-purple-darken-1">Total Weight</p>
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
                label="Search by Tracking Number, Carrier, Status..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                label="Shipment Status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="carrierFilter"
                label="Carrier"
                :items="carrierOptions"
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

      <!-- Shipments Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-truck-fast</v-icon>
          Shipments Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredShipments"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.packageWeight="{ item }">
            <span>{{ item.packageWeight }} kg</span>
          </template>
          <template v-slot:item.shippedDate="{ item }">
            <span>{{ formatDate(item.shippedDate || '') }}</span>
          </template>
          <template v-slot:item.estimatedDeliveryDate="{ item }">
            <span>{{ formatDate(item.estimatedDeliveryDate || '') }}</span>
          </template>
          <template v-slot:item.actualDeliveryDate="{ item }">
            <span>{{ formatDate(item.actualDeliveryDate || '') }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
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
          <v-icon color="orange" class="me-2">mdi-truck-fast</v-icon>
          {{ editMode ? 'Edit Shipment' : 'Add Shipment' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.orderId" label="Order ID" prepend-inner-icon="mdi-pound" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.shippingMethodId" label="Shipping Method ID" prepend-inner-icon="mdi-truck" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.trackingNumber" label="Tracking Number" prepend-inner-icon="mdi-barcode" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.carrierName" label="Carrier Name" prepend-inner-icon="mdi-domain" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.shippingLabelUrl" label="Shipping Label URL" prepend-inner-icon="mdi-link" />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="newItem.shipmentStatus" label="Shipment Status" :items="statusOptions" prepend-inner-icon="mdi-information" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.packageWeight" label="Package Weight (kg)" prepend-inner-icon="mdi-weight-kilogram" type="number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="4">
                    <v-text-field v-model="newItem.packageLength" label="Length (cm)" type="number" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field v-model="newItem.packageWidth" label="Width (cm)" type="number" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field v-model="newItem.packageHeight" label="Height (cm)" type="number" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.packagingNotes" label="Packaging Notes" prepend-inner-icon="mdi-note-text" />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.requiresPhytosanitaryCertificate" label="Requires Phytosanitary Certificate?" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.phytosanitaryCertificateNumber" label="Phytosanitary Certificate Number" prepend-inner-icon="mdi-certificate" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.customsDeclarationNumber" label="Customs Declaration Number" prepend-inner-icon="mdi-file-document" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.shippedDate" label="Shipped Date" prepend-inner-icon="mdi-calendar" type="date" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.estimatedDeliveryDate" label="Estimated Delivery Date" prepend-inner-icon="mdi-calendar" type="date" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.actualDeliveryDate" label="Actual Delivery Date" prepend-inner-icon="mdi-calendar" type="date" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.createdAt" label="Created At" prepend-inner-icon="mdi-calendar" type="date" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.createdBy" label="Created By (User ID)" prepend-inner-icon="mdi-account" type="number" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateShipment() : createShipment()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="700">
      <v-card>
        <v-card-title class="pa-4 bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          View Shipment
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
          Delete Shipment
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this shipment?</p>
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
import { useShipmentStore } from '@/stores/shipment';
import { useSnackbarStore } from '@/stores/snackbar';

const shipmentStore = useShipmentStore();
const snackbar = useSnackbarStore();
const loading = computed(() => shipmentStore.loading);
const error = computed(() => shipmentStore.error);
const search = ref('');
const statusFilter = ref('All');
const carrierFilter = ref('All');

const headers = [
  { title: 'Shipment ID', key: 'shipmentId' },
  { title: 'Order ID', key: 'orderId' },
  { title: 'Tracking Number', key: 'trackingNumber' },
  { title: 'Carrier', key: 'carrierName' },
  { title: 'Status', key: 'shipmentStatus' },
  { title: 'Package Weight', key: 'packageWeight' },
  { title: 'Shipped Date', key: 'shippedDate' },
  { title: 'Estimated Delivery', key: 'estimatedDeliveryDate' },
  { title: 'Actual Delivery', key: 'actualDeliveryDate' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const statusOptions = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];
const carrierOptions = computed(() => ['All', ...new Set(shipmentStore.getShipments.map(item => item.carrierName))]);

const filteredShipments = computed(() => {
  return shipmentStore.getShipments.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.trackingNumber.toLowerCase().includes(s) ||
      item.carrierName.toLowerCase().includes(s) ||
      item.shipmentStatus.toLowerCase().includes(s);
    const matchesStatus = statusFilter.value === 'All' || item.shipmentStatus === statusFilter.value;
    const matchesCarrier = carrierFilter.value === 'All' || item.carrierName === carrierFilter.value;
    return matchesSearch && matchesStatus && matchesCarrier;
  });
});

// Stats
const totalShipments = computed(() => shipmentStore.getShipments.length);
const totalPackages = computed(() => shipmentStore.getShipments.length); // 1 shipment = 1 package for now
const uniqueCarriers = computed(() => new Set(shipmentStore.getShipments.map(item => item.carrierName)).size);
const totalWeight = computed(() => shipmentStore.getShipments.reduce((sum, item) => sum + (item.packageWeight || 0), 0));

const clearFilters = () => {
  search.value = '';
  statusFilter.value = 'All';
  carrierFilter.value = 'All';
};

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref<any>({
  orderId: '',
  shippingMethodId: '',
  trackingNumber: '',
  carrierName: '',
  shippingLabelUrl: '',
  shipmentStatus: '',
  packageWeight: '',
  packageLength: '',
  packageWidth: '',
  packageHeight: '',
  packagingNotes: '',
  requiresPhytosanitaryCertificate: false,
  phytosanitaryCertificateNumber: '',
  customsDeclarationNumber: '',
  shippedDate: '',
  estimatedDeliveryDate: '',
  actualDeliveryDate: '',
  createdAt: '',
  createdBy: ''
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
    orderId: '',
    shippingMethodId: '',
    trackingNumber: '',
    carrierName: '',
    shippingLabelUrl: '',
    shipmentStatus: '',
    packageWeight: '',
    packageLength: '',
    packageWidth: '',
    packageHeight: '',
    packagingNotes: '',
    requiresPhytosanitaryCertificate: false,
    phytosanitaryCertificateNumber: '',
    customsDeclarationNumber: '',
    shippedDate: '',
    estimatedDeliveryDate: '',
    actualDeliveryDate: '',
    createdAt: '',
    createdBy: ''
  });
};
const createShipment = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    orderId: Number(newItem.value.orderId),
    shippingMethodId: Number(newItem.value.shippingMethodId),
    trackingNumber: newItem.value.trackingNumber,
    carrierName: newItem.value.carrierName,
    shippingLabelUrl: newItem.value.shippingLabelUrl,
    shipmentStatus: newItem.value.shipmentStatus,
    packageWeight: newItem.value.packageWeight ? Number(newItem.value.packageWeight) : undefined,
    packageLength: newItem.value.packageLength ? Number(newItem.value.packageLength) : undefined,
    packageWidth: newItem.value.packageWidth ? Number(newItem.value.packageWidth) : undefined,
    packageHeight: newItem.value.packageHeight ? Number(newItem.value.packageHeight) : undefined,
    packagingNotes: newItem.value.packagingNotes,
    requiresPhytosanitaryCertificate: newItem.value.requiresPhytosanitaryCertificate,
    phytosanitaryCertificateNumber: newItem.value.phytosanitaryCertificateNumber,
    customsDeclarationNumber: newItem.value.customsDeclarationNumber,
    shippedDate: newItem.value.shippedDate,
    estimatedDeliveryDate: newItem.value.estimatedDeliveryDate,
    actualDeliveryDate: newItem.value.actualDeliveryDate,
    createdBy: newItem.value.createdBy ? Number(newItem.value.createdBy) : undefined,
  };
  await shipmentStore.addShipment(payload);
  if (shipmentStore.error) {
    snackbar.error(shipmentStore.error);
  } else {
    snackbar.success('Shipment added successfully');
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
  newItem.value.shipmentId = item.shipmentId;
};
const updateShipment = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    orderId: Number(newItem.value.orderId),
    shippingMethodId: Number(newItem.value.shippingMethodId),
    trackingNumber: newItem.value.trackingNumber,
    carrierName: newItem.value.carrierName,
    shippingLabelUrl: newItem.value.shippingLabelUrl,
    shipmentStatus: newItem.value.shipmentStatus,
    packageWeight: newItem.value.packageWeight ? Number(newItem.value.packageWeight) : undefined,
    packageLength: newItem.value.packageLength ? Number(newItem.value.packageLength) : undefined,
    packageWidth: newItem.value.packageWidth ? Number(newItem.value.packageWidth) : undefined,
    packageHeight: newItem.value.packageHeight ? Number(newItem.value.packageHeight) : undefined,
    packagingNotes: newItem.value.packagingNotes,
    requiresPhytosanitaryCertificate: newItem.value.requiresPhytosanitaryCertificate,
    phytosanitaryCertificateNumber: newItem.value.phytosanitaryCertificateNumber,
    customsDeclarationNumber: newItem.value.customsDeclarationNumber,
    shippedDate: newItem.value.shippedDate,
    estimatedDeliveryDate: newItem.value.estimatedDeliveryDate,
    actualDeliveryDate: newItem.value.actualDeliveryDate,
    createdBy: newItem.value.createdBy ? Number(newItem.value.createdBy) : undefined,
  };
  await shipmentStore.updateShipment(Number(newItem.value.shipmentId), payload);
  if (shipmentStore.error) {
    snackbar.error(shipmentStore.error);
  } else {
    snackbar.success('Shipment updated successfully');
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
    await shipmentStore.deleteShipment(itemToDelete.value.shipmentId);
    if (shipmentStore.error) {
      snackbar.error(shipmentStore.error);
    } else {
      snackbar.success('Shipment deleted successfully');
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};
const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date || '').toLocaleDateString();
};

onMounted(() => {
  shipmentStore.fetchShipments();
});
</script>

<style scoped>
.shipments-view {
  background: #f8f9fa;
}
</style>
