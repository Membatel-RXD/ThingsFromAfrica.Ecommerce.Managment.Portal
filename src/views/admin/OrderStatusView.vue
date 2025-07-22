<template>
  <div class="order-status-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Order Statuses</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage all order statuses used in the system
          </p>
        </div>
        <div class="d-flex align-center gap-2">
          <v-btn
            style="background-color: #FFE0B2; color: #333;"
            variant="elevated"
            prepend-icon="mdi-download"
            class="me-2"
            @click="exportDialog = true"
          >
            Export
          </v-btn>
          <v-btn
            color="orange-darken-2"
            variant="elevated"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Add Status
          </v-btn>
        </div>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-format-list-numbered</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalStatuses }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Statuses</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activeCount }}</h3>
                <p class="text-body-2 text-green-darken-1">Active</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="grey-lighten-3" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="grey-darken-2" size="40" class="me-3">mdi-cancel</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-grey-darken-3">{{ inactiveCount }}</h3>
                <p class="text-body-2 text-grey-darken-1">Inactive</p>
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
                label="Search by Name, Description..."
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
              <v-text-field
                v-model="sortOrderFilter"
                label="Sort Order"
                type="number"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Order Status Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-format-list-numbered</v-icon>
          Order Status Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredStatuses"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.isActive="{ item }">
            <v-chip :color="item.isActive ? 'green' : 'grey'" size="small">
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
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
    <v-dialog v-model="addDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4" style="background:#fff3e0;">
          <v-icon color="orange" class="me-2">mdi-format-list-numbered</v-icon>
          {{ editMode ? 'Edit Status' : 'Add Status' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newItem.statusName"
                  :items="statusOptions"
                  label="Status Name"
                  prepend-inner-icon="mdi-information"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.sortOrder" label="Sort Order" prepend-inner-icon="mdi-sort" type="number" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.statusDescription" label="Description" prepend-inner-icon="mdi-note-text" />
              </v-col>
              <v-col cols="12">
                <v-switch v-model="newItem.isActive" label="Active?" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateStatus() : createStatus()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4 bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          View Status
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
          Delete Status
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this status?</p>
          <p class="text-caption text-grey-darken-1 mt-2">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-2" variant="elevated" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Export Dialog -->
    <v-dialog v-model="exportDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-green-lighten-4 text-green-darken-3">
          <v-icon class="me-2">mdi-download</v-icon>
          Export Order Statuses
        </v-card-title>
        <v-card-text>
          <p>Export all order statuses to CSV.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="exportDialog = false">Cancel</v-btn>
          <v-btn style="background-color: #FFE0B2; color: #333;" @click="exportCSV">Export</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOrderStatusStore } from '@/stores/orderStatus';
import { useSnackbarStore } from '@/stores/snackbar';

const orderStatusStore = useOrderStatusStore();
const snackbar = useSnackbarStore();
const loading = computed(() => orderStatusStore.loading);
const error = computed(() => orderStatusStore.error);
const search = ref('');
const activeFilter = ref('All');
const sortOrderFilter = ref('');

const headers = [
  { title: 'ID', key: 'statusId' },
  { title: 'Name', key: 'statusName' },
  { title: 'Description', key: 'statusDescription' },
  { title: 'Active', key: 'isActive' },
  { title: 'Sort Order', key: 'sortOrder' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const activeOptions = ['All', 'Active', 'Inactive'];

const statusOptions = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
];

const filteredStatuses = computed(() => {
  return orderStatusStore.getStatuses.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.statusName.toLowerCase().includes(s) ||
      (item.statusDescription && item.statusDescription.toLowerCase().includes(s));
    const matchesActive = activeFilter.value === 'All' ||
      (activeFilter.value === 'Active' && item.isActive) ||
      (activeFilter.value === 'Inactive' && !item.isActive);
    const matchesSortOrder = !sortOrderFilter.value || item.sortOrder === Number(sortOrderFilter.value);
    return matchesSearch && matchesActive && matchesSortOrder;
  });
});

const totalStatuses = computed(() => orderStatusStore.getStatuses.length);
const activeCount = computed(() => orderStatusStore.getActiveStatuses.length);
const inactiveCount = computed(() => orderStatusStore.getInactiveStatuses.length);

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref<any>({
  statusName: '',
  statusDescription: '',
  isActive: true,
  sortOrder: '',
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
    statusName: statusOptions[0],
    statusDescription: '',
    isActive: true,
    sortOrder: '',
  });
  addFormValid.value = false;
  if (addForm.value) addForm.value.resetValidation();
};
const createStatus = async () => {
  if (!addForm.value?.validate()) {
    snackbar.error('Please fill all required fields.');
    return;
  }
  const payload = {
    statusName: newItem.value.statusName,
    statusDescription: newItem.value.statusDescription,
    isActive: newItem.value.isActive,
    sortOrder: newItem.value.sortOrder ? Number(newItem.value.sortOrder) : undefined,
  };
  await orderStatusStore.addStatus(payload);
  await orderStatusStore.fetchStatuses();
  if (orderStatusStore.error) {
    snackbar.error(orderStatusStore.error);
  } else {
    snackbar.success('Order status added successfully');
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
  newItem.value.statusId = item.statusId;
  if (!newItem.value.statusName) newItem.value.statusName = statusOptions[0];
  addFormValid.value = false;
  if (addForm.value) addForm.value.resetValidation();
};
const updateStatus = async () => {
  if (!addForm.value?.validate()) {
    snackbar.error('Please fill all required fields.');
    return;
  }
  const payload = {
    statusName: newItem.value.statusName,
    statusDescription: newItem.value.statusDescription,
    isActive: newItem.value.isActive,
    sortOrder: newItem.value.sortOrder ? Number(newItem.value.sortOrder) : undefined,
  };
  await orderStatusStore.updateStatus(Number(newItem.value.statusId), payload);
  await orderStatusStore.fetchStatuses();
  if (orderStatusStore.error) {
    snackbar.error(orderStatusStore.error);
  } else {
    snackbar.success('Order status updated successfully');
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
    await orderStatusStore.deleteStatus(itemToDelete.value.statusId);
    await orderStatusStore.fetchStatuses();
    if (orderStatusStore.error) {
      snackbar.error(orderStatusStore.error);
    } else {
      snackbar.success('Order status deleted successfully');
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};
const exportDialog = ref(false);
function exportCSV() {
  const items = filteredStatuses.value;
  if (!items.length) {
    snackbar.error('No statuses to export.');
    return;
  }
  const headers = [
    'Status ID', 'Status Name', 'Description', 'Active', 'Sort Order'
  ];
  const rows = items.map(item => [
    item.statusId,
    item.statusName,
    item.statusDescription,
    item.isActive ? 'Active' : 'Inactive',
    item.sortOrder
  ]);
  const csvContent = [headers, ...rows].map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'order_statuses.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  exportDialog.value = false;
}
onMounted(() => {
  orderStatusStore.fetchStatuses();
});
</script>

<style scoped>
.order-status-view {
  background: #f8f9fa;
}
</style> 