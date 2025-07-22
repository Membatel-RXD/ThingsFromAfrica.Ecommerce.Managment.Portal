<template>
  <div style="padding: 20px;">
    <!-- Header -->
    <div style="background: #fff3e0;" class="pa-4 d-flex align-center mb-2">
      <v-icon color="orange-darken-2" class="mr-2">mdi-sale</v-icon>
      <span class="text-h5 font-weight-bold text-orange-darken-4">Promotion Usage</span>
    </div>
    <v-card class="pa-0">
      <v-data-table
        :headers="headers"
        :items="usageList"
        :items-per-page="itemsPerPage"
        :page.sync="page"
        show-current-page
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100], 'items-per-page-text': 'Items per page:' }"
        class="elevation-0"
      >
        <template #item.promotionCode="{ item }">
          <span>{{ getPromotionCode(item.promotionId) }}</span>
        </template>
        <template #item.customer="{ item }">
          <span>{{ getCustomerName(item.customerId) }}</span>
        </template>
        <template #item.discountAmount="{ item }">
          <span>{{ formatCurrency(item.discountAmount) }}</span>
        </template>
        <template #item.usedAt="{ item }">
          <span>{{ formatDate(item.usedAt) }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-icon size="20" color="blue" style="cursor:pointer;" @click="viewUsage(item)">mdi-eye</v-icon>
          <v-icon size="20" color="red" style="cursor:pointer;" @click="askDeleteUsage(item)">mdi-delete</v-icon>
        </template>
        <template #no-data>
          <tr>
            <td colspan="7" class="text-center text-grey">No promotion usage found.</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="500px">
      <v-card>
        <div class="d-flex align-center pa-4" style="background: #fff3e0;">
          <v-icon color="orange-darken-2" class="mr-2">mdi-sale</v-icon>
          <span class="text-h6 font-weight-bold text-orange-darken-4">Promotion Usage Details</span>
        </div>
        <v-card-text>
          <div v-if="selectedUsage">
            <div class="mb-2"><b>Usage ID:</b> {{ selectedUsage.usageId }}</div>
            <div class="mb-2"><b>Promotion:</b> {{ getPromotionCode(selectedUsage.promotionId) }}</div>
            <div class="mb-2"><b>Customer:</b> {{ getCustomerName(selectedUsage.customerId) }}</div>
            <div class="mb-2"><b>Order #:</b> {{ selectedUsage.orderId }}</div>
            <div class="mb-2"><b>Discount:</b> {{ formatCurrency(selectedUsage.discountAmount) }}</div>
            <div class="mb-2"><b>Used At:</b> {{ formatDate(selectedUsage.usedAt) }}</div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="viewDialog = false">Close</v-btn>
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
          <p class="text-body-1">Are you sure you want to delete this promotion usage record?</p>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-spacer />
          <v-btn color="red-darken-2" variant="elevated" @click="confirmDeleteUsage" :loading="loading">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api';
import { useSnackbarStore } from '@/stores/snackbar';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const snackbar = useSnackbarStore();

const viewDialog = ref(false);
const deleteDialog = ref(false);
const selectedUsage = ref<any>(null);
const deleteId = ref<number|null>(null);
const loading = ref(false);
const usageList = ref<any[]>([]);
const promotions = ref<any[]>([]);
const customers = ref<any[]>([]);

const page = ref(1);
const itemsPerPage = ref(10);

async function fetchUsage() {
  loading.value = true;
  try {
    const res = await apiService.get(`${API_BASE}PromotionUsage/GetAll`);
    if (res.isSuccessful && Array.isArray(res.payload)) {
      usageList.value = res.payload;
    } else {
      snackbar.error(res.remark || 'Failed to fetch promotion usage');
    }
  } catch (e: any) {
    snackbar.error(e?.message || 'Failed to fetch promotion usage');
  } finally {
    loading.value = false;
  }
}

onMounted(fetchUsage);

function getPromotionCode(promotionId: number) {
  const promo = promotions.value.find(p => p.promotionId === promotionId);
  return promo ? promo.promotionCode : promotionId;
}
function getCustomerName(customerId: number) {
  const cust = customers.value.find(c => c.customerId === customerId);
  return cust ? cust.name : customerId;
}
function formatCurrency(amount: number) {
  return 'MWK ' + (amount ? amount.toLocaleString() : '0');
}
function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toLocaleString();
}
function viewUsage(item: any) {
  selectedUsage.value = item;
  viewDialog.value = true;
}
function askDeleteUsage(item: any) {
  deleteId.value = item.usageId;
  deleteDialog.value = true;
}
async function confirmDeleteUsage() {
  if (!deleteId.value) return;
  loading.value = true;
  try {
    const res = await apiService.delete(`${API_BASE}PromotionUsage/Delete?usageid=${deleteId.value}`);
    if (res.isSuccessful) {
      snackbar.success('Promotion usage deleted successfully');
      await fetchUsage();
    } else {
      snackbar.error(res.remark || 'Failed to delete promotion usage');
    }
  } catch (e: any) {
    snackbar.error(e?.message || 'Failed to delete promotion usage');
  } finally {
    loading.value = false;
    deleteDialog.value = false;
    deleteId.value = null;
  }
}

const headers = [
  { title: 'Usage ID', key: 'usageId' },
  { title: 'Promotion Code', key: 'promotionCode' },
  { title: 'Customer', key: 'customer' },
  { title: 'Order #', key: 'orderId' },
  { title: 'Discount', key: 'discountAmount' },
  { title: 'Used At', key: 'usedAt' },
  { title: 'Actions', key: 'actions', sortable: false }
];
</script> 