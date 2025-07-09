<template>
  <div style="padding: 20px;">
    <h2 class="font-weight-bold mb-4">Customer: {{ customer.name || '—' }}</h2>
    <v-tabs v-model="tab">
      <v-tab>Profile</v-tab>
      <v-tab>Addresses</v-tab>
      <v-tab>Wishlist</v-tab>
      <v-tab>Orders</v-tab>
      <v-tab>Promotion Usage</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item><CustomerProfileTab :customer="customer" /></v-tab-item>
      <v-tab-item><CustomerAddressesTab :addresses="addresses" /></v-tab-item>
      <v-tab-item><CustomerWishlistTab :wishlist="wishlist" /></v-tab-item>
      <v-tab-item><CustomerOrdersTab :orders="orders" /></v-tab-item>
      <v-tab-item><CustomerPromotionUsageTab :usages="promotionUsages" /></v-tab-item>
    </v-tabs-items>
    <v-btn class="mt-4" @click="goBack">Back to All Customers</v-btn>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import CustomerProfileTab from './tabs/CustomerProfileTab.vue';
import CustomerAddressesTab from './tabs/CustomerAddressesTab.vue';
import CustomerWishlistTab from './tabs/CustomerWishlistTab.vue';
import CustomerOrdersTab from './tabs/CustomerOrdersTab.vue';
import CustomerPromotionUsageTab from './tabs/CustomerPromotionUsageTab.vue';
const tab = ref(0);
const customer = ref({ name: 'Alice Smith' });
const addresses = ref([]);
const wishlist = ref([]);
const orders = ref([]);
const promotionUsages = ref([]);
function goBack() {
  // To be implemented: navigate back to AllCustomersView
  alert('Back to All Customers');
}
</script> 