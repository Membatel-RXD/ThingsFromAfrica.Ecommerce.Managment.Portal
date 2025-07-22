<template>
  <div class="order-items-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Order Items</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage all items in customer orders
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
            Add Order Item
          </v-btn>
        </div>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-format-list-numbered</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalItems }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Items</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-currency-usd</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ totalValue }}</h3>
                <p class="text-body-2 text-green-darken-1">Total Value</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-cube-outline</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ uniqueProducts }}</h3>
                <p class="text-body-2 text-blue-darken-1">Unique Products</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="purple-darken-3" size="40" class="me-3">mdi-account-hard-hat</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ uniqueArtisans }}</h3>
                <p class="text-body-2 text-purple-darken-1">Unique Artisans</p>
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
                label="Search by Product, Artisan, SKU..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="orderIdFilter"
                label="Order ID"
                variant="outlined"
                density="compact"
                hide-details
                type="number"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="productFilter"
                label="Product"
                :items="productOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="artisanFilter"
                label="Artisan"
                :items="artisanOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="currencyFilter"
                label="Currency"
                :items="currencyOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="1" class="d-flex align-end">
              <v-btn color="orange-darken-2" variant="outlined" block @click="clearFilters">Clear</v-btn>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="12" md="3">
              <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="dateFilter"
                    label="Created Date"
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
            <v-col cols="12" md="2">
              <v-select
                v-model="giftWrapFilter"
                label="Gift Wrap"
                :items="['All', 'Yes', 'No']"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Order Items Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-format-list-numbered</v-icon>
          Order Items Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.giftWrapRequired="{ item }">
            <v-chip :color="item.giftWrapRequired ? 'green' : 'grey'" size="small">
              {{ item.giftWrapRequired ? 'Yes' : 'No' }}
            </v-chip>
          </template>
          <template v-slot:item.createdAt="{ item }">
            <span>{{ formatDate(item.createdAt || '') }}</span>
          </template>
          <template v-slot:item.lineTotal="{ item }">
            <span>{{ item.currency }} {{ item.lineTotal.toFixed(2) }}</span>
          </template>
          <template v-slot:item.unitPrice="{ item }">
            <span>{{ item.currency }} {{ item.unitPrice.toFixed(2) }}</span>
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
          {{ editMode ? 'Edit Order Item' : 'Add Order Item' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.orderId" label="Order ID" prepend-inner-icon="mdi-pound" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.productId" label="Product ID" prepend-inner-icon="mdi-cube-outline" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.productName" label="Product Name" prepend-inner-icon="mdi-cube" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.productSKU" label="Product SKU" prepend-inner-icon="mdi-barcode" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.woodType" label="Wood Type" prepend-inner-icon="mdi-tree" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.artisanName" label="Artisan Name" prepend-inner-icon="mdi-account-hard-hat" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.quantity" label="Quantity" prepend-inner-icon="mdi-counter" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.unitPrice" label="Unit Price" prepend-inner-icon="mdi-currency-usd" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.lineTotal" label="Line Total" prepend-inner-icon="mdi-currency-usd" type="number" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.currency" label="Currency" prepend-inner-icon="mdi-currency-usd" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.specialInstructions" label="Special Instructions" prepend-inner-icon="mdi-note-text" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.giftMessage" label="Gift Message" prepend-inner-icon="mdi-gift" />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.giftWrapRequired" label="Gift Wrap Required?" />
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
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateOrderItem() : createOrderItem()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="700">
      <v-card>
        <v-card-title class="pa-4 bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          View Order Item
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
          Delete Order Item
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this order item?</p>
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
          Export Order Items
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
                <v-date-picker v-model="exportEndDate" @input="exportEndMenu = false" :min="exportStartDate || undefined" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOrderItemStore } from '@/stores/orderItem';
import { useSnackbarStore } from '@/stores/snackbar';

const orderItemStore = useOrderItemStore();
const snackbar = useSnackbarStore();
const loading = computed(() => orderItemStore.loading);
const error = computed(() => orderItemStore.error);
const search = ref('');
const orderIdFilter = ref('');
const productFilter = ref('All');
const artisanFilter = ref('All');
const currencyFilter = ref('All');
const dateFilter = ref('');
const dateMenu = ref(false);
const giftWrapFilter = ref('All');

const headers = [
  { title: 'Order Item ID', key: 'orderItemId' },
  { title: 'Order ID', key: 'orderId' },
  { title: 'Product', key: 'productName' },
  { title: 'SKU', key: 'productSKU' },
  { title: 'Wood Type', key: 'woodType' },
  { title: 'Artisan', key: 'artisanName' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Unit Price', key: 'unitPrice' },
  { title: 'Line Total', key: 'lineTotal' },
  { title: 'Gift Wrap', key: 'giftWrapRequired' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const productOptions = computed(() => ['All', ...Array.from(new Set(orderItemStore.getItems.map(i => i.productName)))].filter(Boolean));
const artisanOptions = computed(() => ['All', ...Array.from(new Set(orderItemStore.getItems.map(i => i.artisanName)))].filter(Boolean));
const currencyOptions = computed(() => ['All', ...Array.from(new Set(orderItemStore.getItems.map(i => i.currency)))].filter(Boolean));

const filteredItems = computed(() => {
  return orderItemStore.getItems.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.productName.toLowerCase().includes(s) ||
      item.productSKU.toLowerCase().includes(s) ||
      item.artisanName.toLowerCase().includes(s);
    const matchesOrderId = !orderIdFilter.value || item.orderId.toString() === orderIdFilter.value;
    const matchesProduct = productFilter.value === 'All' || item.productName === productFilter.value;
    const matchesArtisan = artisanFilter.value === 'All' || item.artisanName === artisanFilter.value;
    const matchesCurrency = currencyFilter.value === 'All' || item.currency === currencyFilter.value;
    const matchesGiftWrap = giftWrapFilter.value === 'All' || (giftWrapFilter.value === 'Yes' && item.giftWrapRequired) || (giftWrapFilter.value === 'No' && !item.giftWrapRequired);
    const matchesDate = !dateFilter.value || (item.createdAt && item.createdAt.startsWith(dateFilter.value));
    return matchesSearch && matchesOrderId && matchesProduct && matchesArtisan && matchesCurrency && matchesGiftWrap && matchesDate;
  });
});

// Stats
const totalItems = computed(() => orderItemStore.getItems.reduce((sum, item) => sum + item.quantity, 0));
const totalValue = computed(() => {
  const total = orderItemStore.getItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
});
const uniqueProducts = computed(() => new Set(orderItemStore.getItems.map(i => i.productId)).size);
const uniqueArtisans = computed(() => new Set(orderItemStore.getItems.map(i => i.artisanName)).size);

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref<any>({
  orderId: '',
  productId: '',
  productName: '',
  productSKU: '',
  woodType: '',
  artisanName: '',
  quantity: '',
  unitPrice: '',
  lineTotal: '',
  currency: '',
  specialInstructions: '',
  giftMessage: '',
  giftWrapRequired: false,
  createdAt: '',
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
    productId: '',
    productName: '',
    productSKU: '',
    woodType: '',
    artisanName: '',
    quantity: '',
    unitPrice: '',
    lineTotal: '',
    currency: '',
    specialInstructions: '',
    giftMessage: '',
    giftWrapRequired: false,
    createdAt: '',
  });
};
const createOrderItem = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    orderId: Number(newItem.value.orderId),
    productId: Number(newItem.value.productId),
    productName: newItem.value.productName,
    productSKU: newItem.value.productSKU,
    woodType: newItem.value.woodType,
    artisanName: newItem.value.artisanName,
    quantity: Number(newItem.value.quantity),
    unitPrice: Number(newItem.value.unitPrice),
    lineTotal: Number(newItem.value.lineTotal),
    currency: newItem.value.currency,
    specialInstructions: newItem.value.specialInstructions,
    giftMessage: newItem.value.giftMessage,
    giftWrapRequired: !!newItem.value.giftWrapRequired,
  };
  await orderItemStore.addItem(payload);
  await orderItemStore.fetchItems();
  if (orderItemStore.error) {
    snackbar.error(orderItemStore.error);
  } else {
    snackbar.success('Order item added successfully');
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
  newItem.value.orderItemId = item.orderItemId;
};
const updateOrderItem = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    orderId: Number(newItem.value.orderId),
    productId: Number(newItem.value.productId),
    productName: newItem.value.productName,
    productSKU: newItem.value.productSKU,
    woodType: newItem.value.woodType,
    artisanName: newItem.value.artisanName,
    quantity: Number(newItem.value.quantity),
    unitPrice: Number(newItem.value.unitPrice),
    lineTotal: Number(newItem.value.lineTotal),
    currency: newItem.value.currency,
    specialInstructions: newItem.value.specialInstructions,
    giftMessage: newItem.value.giftMessage,
    giftWrapRequired: !!newItem.value.giftWrapRequired,
  };
  await orderItemStore.updateItem(Number(newItem.value.orderItemId), payload);
  await orderItemStore.fetchItems();
  if (orderItemStore.error) {
    snackbar.error(orderItemStore.error);
  } else {
    snackbar.success('Order item updated successfully');
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
    await orderItemStore.deleteItem(itemToDelete.value.orderItemId);
    await orderItemStore.fetchItems();
    if (orderItemStore.error) {
      snackbar.error(orderItemStore.error);
    } else {
      snackbar.success('Order item deleted successfully');
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};
const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

function clearFilters() {
  search.value = '';
  orderIdFilter.value = '';
  productFilter.value = 'All';
  artisanFilter.value = 'All';
  currencyFilter.value = 'All';
  dateFilter.value = '';
  giftWrapFilter.value = 'All';
}

function exportCSV() {
  const items = filteredItems.value;
  if (!items.length) return;
  const headers = [
    'Order Item ID', 'Order ID', 'Product', 'SKU', 'Wood Type', 'Artisan', 'Quantity', 'Unit Price', 'Line Total', 'Currency', 'Gift Wrap', 'Created At', 'Special Instructions', 'Gift Message'
  ];
  const rows = items.map(item => [
    item.orderItemId,
    item.orderId,
    item.productName,
    item.productSKU,
    item.woodType,
    item.artisanName,
    item.quantity,
    item.unitPrice,
    item.lineTotal,
    item.currency,
    item.giftWrapRequired ? 'Yes' : 'No',
    item.createdAt,
    item.specialInstructions,
    item.giftMessage
  ]);
  const csvContent = [headers, ...rows].map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'order_items.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const exportDialog = ref(false);
const exportStartDate = ref('');
const exportEndDate = ref('');
const exportStartMenu = ref(false);
const exportEndMenu = ref(false);

function exportCSVWithRange() {
  let items = filteredItems.value;
  if (exportStartDate.value) {
    items = items.filter(item => item.createdAt && item.createdAt >= exportStartDate.value);
  }
  if (exportEndDate.value) {
    items = items.filter(item => item.createdAt && item.createdAt <= exportEndDate.value);
  }
  if (!items.length) {
    snackbar.error('No items to export for the selected date range.');
    return;
  }
  const headers = [
    'Order Item ID', 'Order ID', 'Product', 'SKU', 'Wood Type', 'Artisan', 'Quantity', 'Unit Price', 'Line Total', 'Currency', 'Gift Wrap', 'Created At', 'Special Instructions', 'Gift Message'
  ];
  const rows = items.map(item => [
    item.orderItemId,
    item.orderId,
    item.productName,
    item.productSKU,
    item.woodType,
    item.artisanName,
    item.quantity,
    item.unitPrice,
    item.lineTotal,
    item.currency,
    item.giftWrapRequired ? 'Yes' : 'No',
    item.createdAt,
    item.specialInstructions,
    item.giftMessage
  ]);
  const csvContent = [headers, ...rows].map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'order_items.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  exportDialog.value = false;
}

onMounted(() => {
  orderItemStore.fetchItems();
});
</script>

<style scoped>
.order-items-view {
  background: #f8f9fa;
}
</style> 