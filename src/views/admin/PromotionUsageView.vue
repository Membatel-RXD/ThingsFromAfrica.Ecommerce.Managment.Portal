<template>
  <div style="padding: 20px;">
    <!-- Header -->
    <div style="background: #fff3e0;" class="pa-4 d-flex align-center mb-2">
      <v-icon color="orange-darken-2" class="mr-2">mdi-sale</v-icon>
      <span class="text-h5 font-weight-bold text-orange-darken-4">Promotion Usage</span>
    </div>
    <v-card class="pa-0">
      <v-table>
        <thead>
          <tr>
            <th>Usage ID</th>
            <th>Promotion Code</th>
            <th>Customer</th>
            <th>Order #</th>
            <th>Discount</th>
            <th>Used At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in usageList" :key="idx">
            <td>{{ item.usageId }}</td>
            <td>{{ getPromotionCode(item.promotionId) }}</td>
            <td>{{ getCustomerName(item.customerId) }}</td>
            <td>{{ item.orderId }}</td>
            <td>{{ formatCurrency(item.discountAmount) }}</td>
            <td>{{ formatDate(item.usedAt) }}</td>
            <td>
              <v-icon size="20" color="blue" style="cursor:pointer;" @click="viewUsage(idx)">mdi-eye</v-icon>
            </td>
          </tr>
          <tr v-if="usageList.length === 0">
            <td colspan="7" class="text-center text-grey">No promotion usage found.</td>
          </tr>
        </tbody>
      </v-table>
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
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const viewDialog = ref(false);
const selectedUsage = ref<any>(null);
const usageList = ref([
  { usageId: 1, promotionId: 1, orderId: 1001, discountAmount: 500, usedAt: '2025-07-09T17:33:05.973Z', customerId: 1 },
  { usageId: 2, promotionId: 2, orderId: 1002, discountAmount: 1000, usedAt: '2025-07-10T10:15:00.000Z', customerId: 2 }
]);
const promotions = [
  { promotionId: 1, code: 'SUMMER2025', title: 'Summer Sale' },
  { promotionId: 2, code: 'WELCOME', title: 'Welcome Discount' }
];
const customers = [
  { customerId: 1, name: 'Alice Smith', email: 'alice@example.com' },
  { customerId: 2, name: 'Bob Jones', email: 'bob@example.com' }
];
function getPromotionCode(promotionId) {
  const promo = promotions.find(p => p.promotionId === promotionId);
  return promo ? promo.code : '—';
}
function getCustomerName(customerId) {
  const cust = customers.find(c => c.customerId === customerId);
  return cust ? cust.name : '—';
}
function formatCurrency(amount) {
  return 'MWK ' + amount.toLocaleString();
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}
function viewUsage(idx) {
  selectedUsage.value = usageList.value[idx];
  viewDialog.value = true;
}
</script> 