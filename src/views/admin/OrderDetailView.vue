<template>
  <div class="order-detail-view">
    <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-6">
            <v-card-title>Order Details</v-card-title>
            <v-card-text v-if="order">
              <div><strong>Order Number:</strong> {{ order.orderNumber }}</div>
              <div><strong>Status:</strong> {{ order.orderStatus }}</div>
              <div><strong>Customer Email:</strong> {{ order.customerEmail }}</div>
              <div><strong>Total:</strong> {{ order.currency }} {{ order.totalAmount }}</div>
              <div><strong>Order Date:</strong> {{ formatDate(order.orderDate) }}</div>
              <!-- Add more fields as needed -->
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="teal" variant="outlined" class="ml-2" @click="generatePickingList(order)">
                <v-icon left>mdi-clipboard-list-outline</v-icon> Picking List
              </v-btn>
              <v-btn color="brown" variant="outlined" class="ml-2" @click="generatePackingSlip(order)">
                <v-icon left>mdi-package-variant-closed</v-icon> Packing Slip
              </v-btn>
              <v-btn color="deep-purple" variant="outlined" class="ml-2" @click="generateShippingLabel(order)">
                <v-icon left>mdi-label</v-icon> Shipping Label
              </v-btn>
            </v-card-actions>
            <v-card-text v-else>
              <v-progress-circular indeterminate color="orange-darken-2" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Status History</v-card-title>
            <v-card-text>
              <v-btn color="orange-darken-2" class="mb-2" @click="openAddHistoryDialog">Add Status History</v-btn>
              <v-list v-if="filteredHistories.length">
                <v-list-item v-for="history in filteredHistories" :key="history.historyId">
                  <v-list-item-content>
                    <v-list-item-title>{{ history.oldStatus }} → {{ history.newStatus }}</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(history.statusDate) }} | Notified: {{ history.isCustomerNotified ? 'Yes' : 'No' }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ history.notes }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="openEditHistoryDialog(history)" />
                    <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="openDeleteHistoryDialog(history)" />
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <div v-else class="text-grey">No status history found for this order.</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- Add Status History Dialog -->
    <v-dialog v-model="addHistoryDialog" max-width="600">
      <v-card>
        <v-card-title>Add Order Status History</v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="newHistory.oldStatus" :items="statusOptions" label="Old Status" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="newHistory.newStatus" :items="statusOptions" label="New Status" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newHistory.statusDate" label="Status Date" type="datetime-local" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newHistory.isCustomerNotified" label="Customer Notified?" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newHistory.notes" label="Notes" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addHistoryDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="submitAddHistory">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit Status History Dialog -->
    <v-dialog v-model="editHistoryDialog" max-width="600">
      <v-card>
        <v-card-title>Edit Order Status History</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="editHistory.oldStatus" :items="statusOptions" label="Old Status" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="editHistory.newStatus" :items="statusOptions" label="New Status" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editHistory.statusDate" label="Status Date" type="datetime-local" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="editHistory.isCustomerNotified" label="Customer Notified?" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editHistory.notes" label="Notes" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editHistoryDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" :disabled="!editFormValid" @click="submitEditHistory">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteHistoryDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-red-lighten-4 text-red-darken-3">
          <v-icon class="me-2">mdi-delete</v-icon>
          Delete Status History
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this status history record?</p>
          <p class="text-caption text-grey-darken-1 mt-2">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="outlined" @click="deleteHistoryDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-2" variant="elevated" @click="confirmDeleteHistory">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <FulfillmentDialog
      v-if="fulfillmentDialog.open"
      :type="fulfillmentDialog.type"
      :order="fulfillmentDialog.order"
      :items="fulfillmentDialog.items"
      @close="fulfillmentDialog.open = false"
      @confirm="handleFulfillmentConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';
import { useOrderStatusHistoryStore } from '@/stores/orderStatusHistory';
import { useSnackbarStore } from '@/stores/snackbar';
import { useUserStore } from '@/stores/user';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FulfillmentDialog from '@/components/FulfillmentDialog.vue';
import { useOrderItemStore } from '@/stores/orderItem';

const route = useRoute();
const orderStore = useOrderStore();
const historyStore = useOrderStatusHistoryStore();
const snackbar = useSnackbarStore();
const userStore = useUserStore();
const orderItemStore = useOrderItemStore();
const fulfillmentDialog = ref({ open: false, type: '', order: null, items: [] });

const orderId = Number(route.params.id);
const order = computed(() => orderStore.getOrderById(orderId));
const loading = computed(() => orderStore.loading || historyStore.loading);

const statusOptions = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
];

const filteredHistories = computed(() =>
  historyStore.getHistories.filter(h => h.orderId === orderId)
);

const addHistoryDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newHistory = ref<any>({
  oldStatus: '',
  newStatus: '',
  statusDate: '',
  notes: '',
  isCustomerNotified: false,
});
const rules = {
  required: (v: any) => !!v || 'Required',
};

function openAddHistoryDialog() {
  addHistoryDialog.value = true;
  Object.assign(newHistory.value, {
    oldStatus: '',
    newStatus: '',
    statusDate: '',
    notes: '',
    isCustomerNotified: false,
  });
  addFormValid.value = false;
  if (addForm.value) addForm.value.resetValidation();
}

async function submitAddHistory() {
  if (!addForm.value?.validate()) {
    snackbar.error('Please fill all required fields.');
    return;
  }
  const payload = {
    orderId,
    oldStatus: newHistory.value.oldStatus,
    newStatus: newHistory.value.newStatus,
    statusDate: newHistory.value.statusDate,
    notes: newHistory.value.notes,
    updatedBy: userStore.user?.userId || 0,
    isCustomerNotified: !!newHistory.value.isCustomerNotified,
  };
  await historyStore.addHistory(payload);
  await historyStore.fetchHistories();
  if (historyStore.error) {
    snackbar.error(historyStore.error);
  } else {
    snackbar.success('Order status history added successfully');
  }
  addHistoryDialog.value = false;
}

const editHistoryDialog = ref(false);
const editForm = ref();
const editFormValid = ref(false);
const editHistory = ref<any>({});
const deleteHistoryDialog = ref(false);
const historyToDelete = ref<any>(null);

function openEditHistoryDialog(history: any) {
  editHistoryDialog.value = true;
  Object.assign(editHistory.value, { ...history });
  editFormValid.value = false;
  if (editForm.value) editForm.value.resetValidation();
}

async function submitEditHistory() {
  if (!editForm.value?.validate()) {
    snackbar.error('Please fill all required fields.');
    return;
  }
  const payload = {
    orderId,
    oldStatus: editHistory.value.oldStatus,
    newStatus: editHistory.value.newStatus,
    statusDate: editHistory.value.statusDate,
    notes: editHistory.value.notes,
    updatedBy: userStore.user?.userId || 0,
    isCustomerNotified: !!editHistory.value.isCustomerNotified,
  };
  await historyStore.updateHistory(Number(editHistory.value.historyId), payload);
  await historyStore.fetchHistories();
  if (historyStore.error) {
    snackbar.error(historyStore.error);
  } else {
    snackbar.success('Order status history updated successfully');
  }
  editHistoryDialog.value = false;
}

function openDeleteHistoryDialog(history: any) {
  historyToDelete.value = history;
  deleteHistoryDialog.value = true;
}

async function confirmDeleteHistory() {
  if (historyToDelete.value) {
    await historyStore.deleteHistory(historyToDelete.value.historyId);
    await historyStore.fetchHistories();
    if (historyStore.error) {
      snackbar.error(historyStore.error);
    } else {
      snackbar.success('Order status history deleted successfully');
    }
  }
  deleteHistoryDialog.value = false;
  historyToDelete.value = null;
}

function formatDate(date: string) {
  if (!date) return '';
  return new Date(date).toLocaleString();
}

// Fulfillment Operation Methods (functional)
async function openFulfillmentDialog(type, order) {
  await orderItemStore.fetchItems();
  const items = orderItemStore.getByOrder(order.orderId);
  fulfillmentDialog.value = { open: true, type, order, items: JSON.parse(JSON.stringify(items)) };
}
function handleFulfillmentConfirm({ type, order, items }) {
  // Call the appropriate PDF generation function with edited data
  if (type === 'picking') generatePickingList(order, items);
  if (type === 'packing') generatePackingSlip(order, items);
  if (type === 'label') generateShippingLabel(order, items);
  fulfillmentDialog.value.open = false;
}
function generatePickingList(order) { openFulfillmentDialog('picking', order); }
function generatePackingSlip(order) { openFulfillmentDialog('packing', order); }
function generateShippingLabel(order) { openFulfillmentDialog('label', order); }

onMounted(async () => {
  await orderStore.fetchOrderById(orderId);
  await historyStore.fetchHistories();
});
</script>

<style scoped>
.order-detail-view {
  background: #f8f9fa;
}
</style>
