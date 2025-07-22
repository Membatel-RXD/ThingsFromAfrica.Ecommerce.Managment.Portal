<template>
  <div class="orders-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Orders</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage all customer orders
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
            Create Order
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
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalOrders }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Orders</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-currency-usd</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ totalRevenue }}</h3>
                <p class="text-body-2 text-green-darken-1">Total Revenue</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ deliveredCount }}</h3>
                <p class="text-body-2 text-blue-darken-1">Delivered Orders</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="search"
                label="Search by Order Number, Customer Email..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                label="Status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="emailFilter"
                label="Customer Email"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="dateFilter"
                    label="Order Date"
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

      <!-- Quick Status Filter Chips -->
      <div class="mb-4 d-flex flex-wrap gap-2">
        <v-chip
          v-for="status in statusOptions"
          :key="status"
          :color="statusFilter === status ? statusColor(status) : 'grey-lighten-2'"
          class="ma-1"
          @click="statusFilter = status"
          :variant="statusFilter === status ? 'elevated' : 'outlined'"
        >
          {{ status }}
        </v-chip>
        <v-btn variant="outlined" color="orange-darken-2" class="ml-4" @click="clearFilters">Clear All Filters</v-btn>
      </div>

      <!-- Orders Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-format-list-numbered</v-icon>
          Orders Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredOrders"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:loading>
            <v-overlay :model-value="loading" class="align-center justify-center">
              <v-progress-circular indeterminate color="orange-darken-2" size="64" />
            </v-overlay>
          </template>
          <template v-slot:item.orderStatus="{ item }">
            <v-chip :color="statusColor(item.orderStatus)" size="small">
              {{ item.orderStatus }}
            </v-chip>
          </template>
          <template v-slot:item.orderDate="{ item }">
            <span>{{ formatDate(item.orderDate || '') }}</span>
          </template>
          <template v-slot:item.totalAmount="{ item }">
            <span>{{ item.currency }} {{ item.totalAmount.toFixed(2) }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-eye" variant="text" size="small" color="blue" @click="viewItem(item)" />
            <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="editItem(item)" />
            <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteItem(item)" />
            <v-btn icon="mdi-printer" variant="text" size="small" color="purple" @click="printOrder(item)" />
            <!-- Fulfillment Operation Buttons -->
            <v-btn icon="mdi-clipboard-list-outline" variant="text" size="small" color="teal" @click="openFulfillmentDialog('picking', item)" title="Generate Picking List" />
            <v-btn icon="mdi-package-variant-closed" variant="text" size="small" color="brown" @click="openFulfillmentDialog('packing', item)" title="Generate Packing Slip" />
            <v-btn icon="mdi-label" variant="text" size="small" color="deep-purple" @click="openFulfillmentDialog('label', item)" title="Generate Shipping Label" />
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Order Details Drawer -->
    <v-navigation-drawer v-model="detailsDrawer" location="right" width="500" temporary>
      <v-card>
        <v-card-title class="bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          Order Details
        </v-card-title>
        <v-card-text v-if="selectedItem">
          <v-list>
            <v-list-subheader>General</v-list-subheader>
            <v-list-item>
              <v-list-item-title>Order Number</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.orderNumber }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Status</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.orderStatus }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Order Date</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(selectedItem.orderDate) }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Total</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.currency }} {{ selectedItem.totalAmount }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-subheader>Billing</v-list-subheader>
            <v-list-item>
              <v-list-item-title>Name</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.billingFirstName }} {{ selectedItem.billingLastName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Address</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.billingAddressLine1 }}, {{ selectedItem.billingCity }}, {{ selectedItem.billingCountryName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-subheader>Shipping</v-list-subheader>
            <v-list-item>
              <v-list-item-title>Name</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.shippingFirstName }} {{ selectedItem.shippingLastName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Address</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.shippingAddressLine1 }}, {{ selectedItem.shippingCity }}, {{ selectedItem.shippingCountryName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-subheader>Notes</v-list-subheader>
            <v-list-item>
              <v-list-item-title>Customer Notes</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.customerNotes }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Admin Notes</v-list-item-title>
              <v-list-item-subtitle>{{ selectedItem.adminNotes }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <!-- Mini-table for order items (dummy for now) -->
          <v-list-subheader class="mt-4">Order Items</v-list-subheader>
          <v-table density="compact">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sample Product</td>
                <td>2</td>
                <td>50.00</td>
                <td>100.00</td>
              </tr>
              <!-- Replace with real order items if available -->
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="detailsDrawer = false">Close</v-btn>
          <!-- Fulfillment Operation Buttons in Drawer -->
          <v-btn color="teal" variant="outlined" class="ml-2" @click="openFulfillmentDialog('picking', selectedItem)">
            <v-icon left>mdi-clipboard-list-outline</v-icon> Picking List
          </v-btn>
          <v-btn color="brown" variant="outlined" class="ml-2" @click="openFulfillmentDialog('packing', selectedItem)">
            <v-icon left>mdi-package-variant-closed</v-icon> Packing Slip
          </v-btn>
          <v-btn color="deep-purple" variant="outlined" class="ml-2" @click="openFulfillmentDialog('label', selectedItem)">
            <v-icon left>mdi-label</v-icon> Shipping Label
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="addDialog" max-width="800">
      <v-card>
        <v-card-title class="pa-4" style="background:#fff3e0;">
          <v-icon color="orange" class="me-2">mdi-format-list-numbered</v-icon>
          {{ editMode ? 'Edit Order' : 'Create Order' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.orderNumber" label="Order Number" prepend-inner-icon="mdi-pound" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.customerEmail" label="Customer Email" prepend-inner-icon="mdi-email" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="newItem.orderStatus" label="Order Status" :items="statusOptions" prepend-inner-icon="mdi-information" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.totalAmount" label="Total Amount" prepend-inner-icon="mdi-currency-usd" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.currency" label="Currency" prepend-inner-icon="mdi-currency-usd" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.orderDate" label="Order Date" prepend-inner-icon="mdi-calendar" type="date" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.customerNotes" label="Customer Notes" prepend-inner-icon="mdi-note-text" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.adminNotes" label="Admin Notes" prepend-inner-icon="mdi-note-text" />
              </v-col>
              <!-- Expandable section for more fields -->
              <v-col cols="12">
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title>More Details</v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.billingFirstName" label="Billing First Name" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.billingLastName" label="Billing Last Name" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.billingAddressLine1" label="Billing Address Line 1" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.billingCity" label="Billing City" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.billingCountryName" label="Billing Country" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.shippingFirstName" label="Shipping First Name" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.shippingLastName" label="Shipping Last Name" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.shippingAddressLine1" label="Shipping Address Line 1" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.shippingCity" label="Shipping City" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.shippingCountryName" label="Shipping Country" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.subTotal" label="SubTotal" type="number" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.taxAmount" label="Tax Amount" type="number" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.shippingAmount" label="Shipping Amount" type="number" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.discountAmount" label="Discount Amount" type="number" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-switch v-model="newItem.isTouristOrder" label="Tourist Order?" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.touristCountry" label="Tourist Country" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-switch v-model="newItem.requiresPhytosanitaryCertificate" label="Requires Phytosanitary Certificate?" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.customerId" label="Customer ID" type="number" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newItem.customerPhone" label="Customer Phone" />
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateOrder() : createOrder()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-red-lighten-4 text-red-darken-3">
          <v-icon class="me-2">mdi-delete</v-icon>
          Delete Order
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this order?</p>
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
          Export Orders
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-menu v-model="exportStartMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="exportStartDate"
                    label="Start Date"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </template>
                <v-date-picker v-model="exportStartDate" @input="exportStartMenu = false" />
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-menu v-model="exportEndMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="exportEndDate"
                    label="End Date"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </template>
                <v-date-picker v-model="exportEndDate" @input="exportEndMenu = false" />
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="exportDialog = false">Cancel</v-btn>
          <v-btn style="background-color: #FFE0B2; color: #333;" @click="exportCSVWithRange">Export</v-btn>
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
import { useOrderStore } from '@/stores/orderStore'; // FIX: use correct store
import { useSnackbarStore } from '@/stores/snackbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FulfillmentDialog from '@/components/FulfillmentDialog.vue';
import { useOrderItemStore } from '@/stores/orderItem';

const orderStore = useOrderStore();
const snackbar = useSnackbarStore();
const loading = computed(() => orderStore.loading);
const error = computed(() => orderStore.error);
const search = ref('');
const statusFilter = ref('All');
const emailFilter = ref('');
const dateFilter = ref('');
const dateMenu = ref(false);

const headers = [
  { title: 'Order Number', key: 'orderNumber' },
  { title: 'Status', key: 'orderStatus' },
  { title: 'Customer Email', key: 'customerEmail' },
  { title: 'Order Date', key: 'orderDate' },
  { title: 'Total', key: 'totalAmount' },
  { title: 'Currency', key: 'currency' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const statusOptions = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

const dummyOrder = {
  orderNumber: 'DUMMY-ORDER-001',
  orderStatus: 'Pending',
  customerEmail: 'dummy@example.com',
  totalAmount: 123.45,
  currency: 'USD',
  orderDate: new Date().toISOString().slice(0, 10),
  customerNotes: 'This is a dummy order for review.',
  adminNotes: '',
  billingFirstName: 'John',
  billingLastName: 'Doe',
  billingAddressLine1: '123 Main St',
  billingCity: 'New York',
  billingCountryName: 'USA',
  shippingFirstName: 'Jane',
  shippingLastName: 'Doe',
  shippingAddressLine1: '456 Elm St',
  shippingCity: 'New York',
  shippingCountryName: 'USA',
  subTotal: 100,
  taxAmount: 10,
  shippingAmount: 10,
  discountAmount: 0,
  isTouristOrder: false,
  touristCountry: '',
  requiresPhytosanitaryCertificate: false,
  customerId: 1,
  customerPhone: '555-1234',
};

const filteredOrders = computed(() => {
  // Merge dummy order for review; remove this after review
  const allOrders = [dummyOrder, ...orderStore.getOrders];
  return allOrders.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.orderNumber.toLowerCase().includes(s) ||
      item.customerEmail.toLowerCase().includes(s);
    const matchesStatus = statusFilter.value === 'All' || item.orderStatus === statusFilter.value;
    const matchesEmail = !emailFilter.value || item.customerEmail.toLowerCase().includes(emailFilter.value.toLowerCase());
    const matchesDate = !dateFilter.value || (item.orderDate && item.orderDate.startsWith(dateFilter.value));
    return matchesSearch && matchesStatus && matchesEmail && matchesDate;
  });
});

const totalOrders = computed(() => orderStore.getOrders.length);
const totalRevenue = computed(() => {
  const total = orderStore.getOrders.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
});
const deliveredCount = computed(() => orderStore.getOrders.filter(i => i.orderStatus === 'Delivered').length);

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref<any>({
  orderNumber: '', // not required by OrderCreationRequest, but keep for UI
  customerEmail: '',
  orderStatus: '', // not required by OrderCreationRequest, but keep for UI
  totalAmount: '',
  currency: '',
  orderDate: '', // not required by OrderCreationRequest, but keep for UI
  customerNotes: '',
  adminNotes: '',
  billingFirstName: '',
  billingLastName: '',
  billingAddressLine1: '',
  billingCity: '',
  billingCountryCode: '', // ADDED: required by OrderCreationRequest
  billingCountryName: '', // not required by OrderCreationRequest
  shippingFirstName: '',
  shippingLastName: '',
  shippingAddressLine1: '',
  shippingCity: '',
  shippingCountryCode: '', // ADDED: required by OrderCreationRequest
  shippingCountryName: '', // not required by OrderCreationRequest
  subTotal: '',
  taxAmount: '',
  shippingAmount: '',
  discountAmount: '',
  isTouristOrder: false,
  touristCountry: '',
  requiresPhytosanitaryCertificate: false,
  customerId: '',
  customerPhone: '',
  // Remove fields not in OrderCreationRequest
});
const editMode = ref(false);
const detailsDrawer = ref(false);
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
    orderNumber: '',
    customerEmail: '',
    orderStatus: '',
    totalAmount: '',
    currency: '',
    orderDate: '',
    customerNotes: '',
    adminNotes: '',
    billingFirstName: '',
    billingLastName: '',
    billingAddressLine1: '',
    billingCity: '',
    billingCountryName: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddressLine1: '',
    shippingCity: '',
    shippingCountryName: '',
    subTotal: '',
    taxAmount: '',
    shippingAmount: '',
    discountAmount: '',
    isTouristOrder: false,
    touristCountry: '',
    requiresPhytosanitaryCertificate: false,
    customerId: '',
    customerPhone: '',
  });
};
const createOrder = async () => {
  if (!addForm.value?.validate()) return;
  // Only include fields required by OrderCreationRequest
  const payload: any = {
    customerEmail: newItem.value.customerEmail,
    billingFirstName: newItem.value.billingFirstName,
    billingLastName: newItem.value.billingLastName,
    billingAddressLine1: newItem.value.billingAddressLine1,
    billingCity: newItem.value.billingCity,
    billingCountryCode: newItem.value.billingCountryCode,
    shippingFirstName: newItem.value.shippingFirstName,
    shippingLastName: newItem.value.shippingLastName,
    shippingAddressLine1: newItem.value.shippingAddressLine1,
    shippingCity: newItem.value.shippingCity,
    shippingCountryCode: newItem.value.shippingCountryCode,
    subTotal: Number(newItem.value.subTotal),
    totalAmount: Number(newItem.value.totalAmount),
    currency: newItem.value.currency,
    isTouristOrder: !!newItem.value.isTouristOrder,
    touristCountry: newItem.value.touristCountry,
    requiresPhytosanitaryCertificate: !!newItem.value.requiresPhytosanitaryCertificate,
    customerNotes: newItem.value.customerNotes,
    adminNotes: newItem.value.adminNotes,
    taxAmount: Number(newItem.value.taxAmount),
    shippingAmount: Number(newItem.value.shippingAmount),
    discountAmount: Number(newItem.value.discountAmount),
    shippingStateProvince: newItem.value.shippingStateProvince || '',
    shippingPostalCode: newItem.value.shippingPostalCode || '',
    shippingAddressLine2: newItem.value.shippingAddressLine2 || '',
    shippingCompany: newItem.value.shippingCompany || '',
    billingStateProvince: newItem.value.billingStateProvince || '',
    billingPostalCode: newItem.value.billingPostalCode || '',
    billingAddressLine2: newItem.value.billingAddressLine2 || '',
    billingCompany: newItem.value.billingCompany || '',
    customerId: Number(newItem.value.customerId),
    customerPhone: newItem.value.customerPhone,
  };
  if (newItem.value.requiredDate) {
    payload.requiredDate = newItem.value.requiredDate;
  }
  await orderStore.createOrder(payload);
  await orderStore.fetchOrders();
  if (orderStore.error) {
    snackbar.error(orderStore.error);
  } else {
    snackbar.success('Order created successfully');
  }
  addDialog.value = false;
};
const viewItem = (item: any) => {
  selectedItem.value = { ...item };
  detailsDrawer.value = true;
};
const editItem = (item: any) => {
  editMode.value = true;
  addDialog.value = true;
  Object.assign(newItem.value, { ...item });
  newItem.value.orderId = item.orderId;
};
const updateOrder = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    orderNumber: newItem.value.orderNumber,
    customerEmail: newItem.value.customerEmail,
    orderStatus: newItem.value.orderStatus,
    totalAmount: Number(newItem.value.totalAmount),
    currency: newItem.value.currency,
    orderDate: newItem.value.orderDate,
    customerNotes: newItem.value.customerNotes,
    adminNotes: newItem.value.adminNotes,
    billingFirstName: newItem.value.billingFirstName,
    billingLastName: newItem.value.billingLastName,
    billingAddressLine1: newItem.value.billingAddressLine1,
    billingCity: newItem.value.billingCity,
    billingCountryName: newItem.value.billingCountryName,
    shippingFirstName: newItem.value.shippingFirstName,
    shippingLastName: newItem.value.shippingLastName,
    shippingAddressLine1: newItem.value.shippingAddressLine1,
    shippingCity: newItem.value.shippingCity,
    shippingCountryName: newItem.value.shippingCountryName,
    subTotal: Number(newItem.value.subTotal),
    taxAmount: Number(newItem.value.taxAmount),
    shippingAmount: Number(newItem.value.shippingAmount),
    discountAmount: Number(newItem.value.discountAmount),
    isTouristOrder: !!newItem.value.isTouristOrder,
    touristCountry: newItem.value.touristCountry,
    requiresPhytosanitaryCertificate: !!newItem.value.requiresPhytosanitaryCertificate,
    customerId: Number(newItem.value.customerId),
    customerPhone: newItem.value.customerPhone,
  };
  await orderStore.updateOrder(Number(newItem.value.orderId), payload);
  await orderStore.fetchOrders();
  if (orderStore.error) {
    snackbar.error(orderStore.error);
  } else {
    snackbar.success('Order updated successfully');
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
    await orderStore.deleteOrder(itemToDelete.value.orderId);
    await orderStore.fetchOrders();
    if (orderStore.error) {
      snackbar.error(orderStore.error);
    } else {
      snackbar.success('Order deleted successfully');
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};
const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};
function statusColor(status: string) {
  switch (status) {
    case 'Pending': return 'orange';
    case 'Shipped': return 'blue';
    case 'Delivered': return 'green';
    case 'Cancelled': return 'red';
    default: return 'grey';
  }
}
function clearFilters() {
  search.value = '';
  statusFilter.value = 'All';
  emailFilter.value = '';
  dateFilter.value = '';
}
const exportDialog = ref(false);
const exportStartDate = ref('');
const exportEndDate = ref('');
const exportStartMenu = ref(false);
const exportEndMenu = ref(false);

function exportCSVWithRange() {
  let items = filteredOrders.value;
  if (exportStartDate.value) {
    items = items.filter(item => item.orderDate && item.orderDate >= exportStartDate.value);
  }
  if (exportEndDate.value) {
    items = items.filter(item => item.orderDate && item.orderDate <= exportEndDate.value);
  }
  if (!items.length) {
    snackbar.error('No orders to export for the selected date range.');
    return;
  }
  const headers = [
    'Order Number', 'Status', 'Customer Email', 'Order Date', 'Total', 'Currency'
  ];
  const rows = items.map(item => [
    item.orderNumber,
    item.orderStatus,
    item.customerEmail,
    item.orderDate,
    item.totalAmount,
    item.currency
  ]);
  const csvContent = [headers, ...rows].map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'orders.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  exportDialog.value = false;
}

function printOrder(item) {
  const printWindow = window.open('', '', 'width=800,height=600');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Order</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; }
          h2 { color: #E65100; }
          .section { margin-bottom: 24px; }
          .section-title { font-weight: bold; margin-bottom: 8px; color: #333; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          .info-table th, .info-table td { border: 1px solid #ddd; padding: 8px; }
          .info-table th { background: #FFE0B2; color: #333; }
          .info-table td { background: #fff; }
          .business-header { float: right; text-align: right; margin-bottom: 32px; }
          .business-header .biz-name { font-size: 1.2em; font-weight: bold; color: #E65100; }
          .business-header .biz-address { font-size: 0.95em; color: #333; line-height: 1.4; }
          .business-header .biz-contact { font-size: 0.95em; color: #333; }
        </style>
      </head>
      <body>
        <div class="business-header">
          <div class="biz-name">Things From Africa (TFA)</div>
          <div class="biz-address">
            G831A, V&amp;A Waterfront<br/>
            17 Dock Rd<br/>
            Victoria &amp; Alfred Waterfront<br/>
            Cape Town, 8002<br/>
            South Africa.
          </div>
          <div class="biz-contact">Email: info@thingsfromafrica.com<br/>Personal: hendrix@thingsfromafrica.com</div>
        </div>
        <h2>Order Summary</h2>
        <div class="section">
          <div class="section-title">Order Info</div>
          <table class="info-table">
            <tr><th>Order Number</th><td>${item.orderNumber}</td></tr>
            <tr><th>Status</th><td>${item.orderStatus}</td></tr>
            <tr><th>Order Date</th><td>${item.orderDate ? new Date(item.orderDate).toLocaleDateString() : ''}</td></tr>
            <tr><th>Required Date</th><td>${item.requiredDate ? new Date(item.requiredDate).toLocaleDateString() : ''}</td></tr>
            <tr><th>Shipped Date</th><td>${item.shippedDate ? new Date(item.shippedDate).toLocaleDateString() : ''}</td></tr>
            <tr><th>Delivered Date</th><td>${item.deliveredDate ? new Date(item.deliveredDate).toLocaleDateString() : ''}</td></tr>
            <tr><th>Created At</th><td>${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</td></tr>
            <tr><th>Modified At</th><td>${item.modifiedAt ? new Date(item.modifiedAt).toLocaleDateString() : ''}</td></tr>
            <tr><th>Order ID</th><td>${item.orderId}</td></tr>
            <tr><th>Status ID</th><td>${item.statusId}</td></tr>
            <tr><th>Customer Email</th><td>${item.customerEmail}</td></tr>
            <tr><th>Customer ID</th><td>${item.customerId}</td></tr>
            <tr><th>Customer Phone</th><td>${item.customerPhone}</td></tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">Billing Info</div>
          <table class="info-table">
            <tr><th>Name</th><td>${item.billingFirstName || ''} ${item.billingLastName || ''}</td></tr>
            <tr><th>Company</th><td>${item.billingCompany || ''}</td></tr>
            <tr><th>Address 1</th><td>${item.billingAddressLine1 || ''}</td></tr>
            <tr><th>Address 2</th><td>${item.billingAddressLine2 || ''}</td></tr>
            <tr><th>City</th><td>${item.billingCity || ''}</td></tr>
            <tr><th>State/Province</th><td>${item.billingStateProvince || ''}</td></tr>
            <tr><th>Postal Code</th><td>${item.billingPostalCode || ''}</td></tr>
            <tr><th>Country Code</th><td>${item.billingCountryCode || ''}</td></tr>
            <tr><th>Country Name</th><td>${item.billingCountryName || ''}</td></tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">Shipping Info</div>
          <table class="info-table">
            <tr><th>Name</th><td>${item.shippingFirstName || ''} ${item.shippingLastName || ''}</td></tr>
            <tr><th>Company</th><td>${item.shippingCompany || ''}</td></tr>
            <tr><th>Address 1</th><td>${item.shippingAddressLine1 || ''}</td></tr>
            <tr><th>Address 2</th><td>${item.shippingAddressLine2 || ''}</td></tr>
            <tr><th>City</th><td>${item.shippingCity || ''}</td></tr>
            <tr><th>State/Province</th><td>${item.shippingStateProvince || ''}</td></tr>
            <tr><th>Postal Code</th><td>${item.shippingPostalCode || ''}</td></tr>
            <tr><th>Country Code</th><td>${item.shippingCountryCode || ''}</td></tr>
            <tr><th>Country Name</th><td>${item.shippingCountryName || ''}</td></tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">Financials</div>
          <table class="info-table">
            <tr><th>Subtotal</th><td>${item.subTotal}</td></tr>
            <tr><th>Tax Amount</th><td>${item.taxAmount}</td></tr>
            <tr><th>Shipping Amount</th><td>${item.shippingAmount}</td></tr>
            <tr><th>Discount Amount</th><td>${item.discountAmount}</td></tr>
            <tr><th>Total</th><td>${item.totalAmount}</td></tr>
            <tr><th>Currency</th><td>${item.currency}</td></tr>
            <tr><th>Is Tourist Order</th><td>${item.isTouristOrder ? 'Yes' : 'No'}</td></tr>
            <tr><th>Tourist Country</th><td>${item.touristCountry || ''}</td></tr>
            <tr><th>Requires Phytosanitary Certificate</th><td>${item.requiresPhytosanitaryCertificate ? 'Yes' : 'No'}</td></tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">Notes</div>
          <table class="info-table">
            <tr><th>Customer Notes</th><td>${item.customerNotes || ''}</td></tr>
            <tr><th>Admin Notes</th><td>${item.adminNotes || ''}</td></tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">Order Items</div>
          <table class="info-table">
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr><td>Sample Product</td><td>2</td><td>50.00</td><td>100.00</td></tr>
              <!-- Replace with real order items if available -->
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Fulfillment Operation Methods (functional)
const orderItemStore = useOrderItemStore();
const fulfillmentDialog = ref({ open: false, type: '', order: null, items: [] });

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
function generatePickingList(order, items) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Things From Africa (TFA)', 14, 14);
  doc.setFontSize(12);
  doc.text(`Picking List for Order #${order.orderNumber}`, 14, 24);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);
  autoTable(doc, {
    startY: 40,
    head: [['Product', 'Qty', 'SKU', 'Special Instructions']],
    body: items.map(item => [item.productName, item.quantity, item.productSKU, item.specialInstructions || '']),
  });
  doc.save(`PickingList_Order_${order.orderNumber}.pdf`);
}
function generatePackingSlip(order, items) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Things From Africa (TFA)', 14, 14);
  doc.setFontSize(12);
  doc.text(`Packing Slip for Order #${order.orderNumber}`, 14, 24);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);
  doc.text(`Ship To: ${order.shippingFirstName} ${order.shippingLastName}, ${order.shippingAddressLine1}, ${order.shippingCity}, ${order.shippingCountryName}`, 14, 40);
  autoTable(doc, {
    startY: 48,
    head: [['Product', 'Qty', 'Unit Price', 'Total', 'Gift Message']],
    body: items.map(item => [item.productName, item.quantity, item.unitPrice?.toFixed(2) || '', (item.quantity * item.unitPrice).toFixed(2), item.giftMessage || '']),
  });
  doc.save(`PackingSlip_Order_${order.orderNumber}.pdf`);
}
function generateShippingLabel(order, items) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Things From Africa (TFA)', 14, 14);
  doc.setFontSize(12);
  doc.text('Shipping Label', 14, 24);
  doc.text(`Order #: ${order.orderNumber}`, 14, 32);
  doc.text(`Ship To:`, 14, 40);
  doc.text(`${order.shippingFirstName} ${order.shippingLastName}`, 14, 48);
  doc.text(`${order.shippingAddressLine1}`, 14, 56);
  doc.text(`${order.shippingCity}, ${order.shippingCountryName}`, 14, 64);
  doc.text(`Phone: ${order.customerPhone || ''}`, 14, 72);
  doc.save(`ShippingLabel_Order_${order.orderNumber}.pdf`);
}

onMounted(() => {
  orderStore.fetchOrders();
});
</script>

<style scoped>
.orders-view {
  background: #f8f9fa;
}
</style>