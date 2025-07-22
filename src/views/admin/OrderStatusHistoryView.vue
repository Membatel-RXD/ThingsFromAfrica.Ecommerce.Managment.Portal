<template>
  <div class="order-status-history-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Order Status History</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Track all changes to order statuses in the system
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
            Add History
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
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalHistories }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total History Records</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ notifiedCount }}</h3>
                <p class="text-body-2 text-green-darken-1">Customer Notified</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="grey-lighten-3" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="grey-darken-2" size="40" class="me-3">mdi-cancel</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-grey-darken-3">{{ notNotifiedCount }}</h3>
                <p class="text-body-2 text-grey-darken-1">Not Notified</p>
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
                label="Search by Status, Notes, Order ID..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="notifiedFilter"
                label="Customer Notified"
                :items="notifiedOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="dateFilter"
                    label="Status Date"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </template>
                <v-date-picker v-model="dateFilter" @input="dateMenu = false" />
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- History Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-format-list-numbered</v-icon>
          Order Status History Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredHistories"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.isCustomerNotified="{ item }">
            <v-chip :color="item.isCustomerNotified ? 'green' : 'grey'" size="small">
              {{ item.isCustomerNotified ? 'Yes' : 'No' }}
            </v-chip>
          </template>
          <template v-slot:item.statusDate="{ item }">
            <span>{{ formatDate(item.statusDate) }}</span>
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
          <v-icon color="orange" class="me-2">mdi-format-list-numbered</v-icon>
          {{ editMode ? 'Edit History' : 'Add History' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.orderId" label="Order ID" prepend-inner-icon="mdi-pound" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="newItem.oldStatus" :items="statusOptions" label="Old Status" prepend-inner-icon="mdi-information" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="newItem.newStatus" :items="statusOptions" label="New Status" prepend-inner-icon="mdi-information" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.statusDate" label="Status Date" prepend-inner-icon="mdi-calendar" type="datetime-local" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.isCustomerNotified" label="Customer Notified?" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.notes" label="Notes" prepend-inner-icon="mdi-note-text" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateHistory() : createHistory()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="700">
      <v-card>
        <v-card-title class="pa-4 bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          View History
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
          Delete History
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this history record?</p>
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
          Export Order Status History
        </v-card-title>
        <v-card-text>
          <p>Export all order status history records to CSV.</p>
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
import { useOrderStatusHistoryStore } from '@/stores/orderStatusHistory';
import { useSnackbarStore } from '@/stores/snackbar';
import { useUserStore } from '@/stores/user';

const historyStore = useOrderStatusHistoryStore();
const snackbar = useSnackbarStore();
const userStore = useUserStore();
const loading = computed(() => historyStore.loading);
const error = computed(() => historyStore.error);
const search = ref('');
const notifiedFilter = ref('All');
const notifiedOptions = ['All', 'Yes', 'No'];
const dateFilter = ref('');
const dateMenu = ref(false);

const statusOptions = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
];

const headers = [
  { title: 'ID', key: 'historyId' },
  { title: 'Order ID', key: 'orderId' },
  { title: 'Old Status', key: 'oldStatus' },
  { title: 'New Status', key: 'newStatus' },
  { title: 'Status Date', key: 'statusDate' },
  { title: 'Notes', key: 'notes' },
  { title: 'Updated By', key: 'updatedBy' },
  { title: 'Customer Notified', key: 'isCustomerNotified' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const filteredHistories = computed(() => {
  return historyStore.getHistories.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.oldStatus.toLowerCase().includes(s) ||
      item.newStatus.toLowerCase().includes(s) ||
      (item.notes && item.notes.toLowerCase().includes(s)) ||
      item.orderId.toString().includes(s);
    const matchesNotified = notifiedFilter.value === 'All' ||
      (notifiedFilter.value === 'Yes' && item.isCustomerNotified) ||
      (notifiedFilter.value === 'No' && !item.isCustomerNotified);
    const matchesDate = !dateFilter.value || (item.statusDate && item.statusDate.startsWith(dateFilter.value));
    return matchesSearch && matchesNotified && matchesDate;
  });
});

const totalHistories = computed(() => historyStore.getHistories.length);
const notifiedCount = computed(() => historyStore.getHistories.filter(h => h.isCustomerNotified).length);
const notNotifiedCount = computed(() => historyStore.getHistories.filter(h => !h.isCustomerNotified).length);

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref<any>({
  orderId: '',
  oldStatus: '',
  newStatus: '',
  statusDate: '',
  notes: '',
  updatedBy: '',
  isCustomerNotified: false,
});
const editMode = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const exportDialog = ref(false);
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
    oldStatus: '',
    newStatus: '',
    statusDate: '',
    notes: '',
    updatedBy: '',
    isCustomerNotified: false,
  });
  addFormValid.value = false;
  if (addForm.value) addForm.value.resetValidation();
};
const createHistory = async () => {
  if (!addForm.value?.validate()) {
    snackbar.error('Please fill all required fields.');
    return;
  }
  const payload = {
    orderId: Number(newItem.value.orderId),
    oldStatus: newItem.value.oldStatus,
    newStatus: newItem.value.newStatus,
    statusDate: newItem.value.statusDate,
    notes: newItem.value.notes,
    updatedBy: userStore.user?.userId || 0,
    isCustomerNotified: !!newItem.value.isCustomerNotified,
  };
  await historyStore.addHistory(payload);
  await historyStore.fetchHistories();
  if (historyStore.error) {
    snackbar.error(historyStore.error);
  } else {
    snackbar.success('Order status history added successfully');
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
  newItem.value.historyId = item.historyId;
  addFormValid.value = false;
  if (addForm.value) addForm.value.resetValidation();
};
const updateHistory = async () => {
  if (!addForm.value?.validate()) {
    snackbar.error('Please fill all required fields.');
    return;
  }
  const payload = {
    orderId: Number(newItem.value.orderId),
    oldStatus: newItem.value.oldStatus,
    newStatus: newItem.value.newStatus,
    statusDate: newItem.value.statusDate,
    notes: newItem.value.notes,
    updatedBy: userStore.user?.userId || 0,
    isCustomerNotified: !!newItem.value.isCustomerNotified,
  };
  await historyStore.updateHistory(Number(newItem.value.historyId), payload);
  await historyStore.fetchHistories();
  if (historyStore.error) {
    snackbar.error(historyStore.error);
  } else {
    snackbar.success('Order status history updated successfully');
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
    await historyStore.deleteHistory(itemToDelete.value.historyId);
    await historyStore.fetchHistories();
    if (historyStore.error) {
      snackbar.error(historyStore.error);
    } else {
      snackbar.success('Order status history deleted successfully');
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};
function formatDate(date: string) {
  if (!date) return '';
  return new Date(date).toLocaleString();
}
function exportCSV() {
  const items = filteredHistories.value;
  if (!items.length) {
    snackbar.error('No history records to export.');
    return;
  }
  const headers = [
    'ID', 'Order ID', 'Old Status', 'New Status', 'Status Date', 'Notes', 'Updated By', 'Customer Notified'
  ];
  const rows = items.map(item => [
    item.historyId,
    item.orderId,
    item.oldStatus,
    item.newStatus,
    formatDate(item.statusDate),
    item.notes,
    item.updatedBy,
    item.isCustomerNotified ? 'Yes' : 'No',
  ]);
  const csvContent = [headers, ...rows].map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'order_status_history.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  exportDialog.value = false;
}
onMounted(() => {
  historyStore.fetchHistories();
});
</script>

<style scoped>
.order-status-history-view {
  background: #f8f9fa;
}
</style> 