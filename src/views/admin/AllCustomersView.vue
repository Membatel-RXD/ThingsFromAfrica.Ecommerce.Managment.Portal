<template>
  <div style="padding: 20px;">
    <!-- Header -->
    <div class="d-flex align-center mb-1">
      <div>
        <h1 class="font-weight-bold mb-1" style="color: #ff9800;">Customers</h1>
        <div class="mb-4 text-grey">Manage your customers and their engagement</div>
      </div>
      <v-spacer />
      <v-btn color="orange-darken-2" class="font-weight-bold" style="height: 40px;" elevation="1">+ ADD CUSTOMER</v-btn>
    </div>
    <!-- Summary Cards -->
    <div class="d-flex mb-4" style="gap: 24px;">
      <v-card class="pa-4 flex-grow-1" style="background: #ffe0b2;">
        <div class="d-flex align-center">
          <v-icon size="32" color="orange-darken-2" class="mr-2">mdi-account-group</v-icon>
          <div>
            <div class="text-h5 font-weight-bold">{{ summary.total }}</div>
            <div class="text-caption">Total Customers</div>
          </div>
        </div>
      </v-card>
      <v-card class="pa-4 flex-grow-1" style="background: #c8e6c9;">
        <div class="d-flex align-center">
          <v-icon size="32" color="success" class="mr-2">mdi-check-circle</v-icon>
          <div>
            <div class="text-h5 font-weight-bold">{{ summary.active }}</div>
            <div class="text-caption">Active Customers</div>
          </div>
        </div>
      </v-card>
      <v-card class="pa-4 flex-grow-1" style="background: #bbdefb;">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-2">mdi-star</v-icon>
          <div>
            <div class="text-h5 font-weight-bold">{{ summary.gold }}</div>
            <div class="text-caption">Gold Tier</div>
          </div>
        </div>
      </v-card>
      <v-card class="pa-4 flex-grow-1" style="background: #e1bee7;">
        <div class="d-flex align-center">
          <v-icon size="32" color="purple" class="mr-2">mdi-email-newsletter</v-icon>
          <div>
            <div class="text-h5 font-weight-bold">{{ summary.newsletter }}</div>
            <div class="text-caption">Newsletter Subscribers</div>
          </div>
        </div>
      </v-card>
    </div>
    <!-- Filters -->
    <v-card class="pa-4 mb-4 d-flex align-center" style="gap: 16px;">
      <v-text-field v-model="search" label="Search customers..." prepend-inner-icon="mdi-magnify" hide-details dense style="max-width: 300px;" />
      <v-select v-model="filterType" :items="typeOptions" label="Type" hide-details dense style="max-width: 180px;" />
      <v-select v-model="filterTier" :items="tierOptions" label="Loyalty Tier" hide-details dense style="max-width: 180px;" />
      <v-select v-model="filterStatus" :items="statusOptions" label="Status" hide-details dense style="max-width: 180px;" />
      <v-spacer />
      <v-btn variant="outlined" color="orange-darken-2" @click="clearFilters">CLEAR FILTERS</v-btn>
    </v-card>
    <!-- Table -->
    <v-card class="pa-0">
      <div style="background: #fff3e0;" class="pa-3 text-h6 font-weight-bold d-flex align-center">
        <v-icon color="orange-darken-2" class="mr-2">mdi-account-group</v-icon>
        Customer Management
      </div>
      <v-table>
        <thead>
          <tr>
            <th>Name/Company</th>
            <th>Type</th>
            <th>Total Orders</th>
            <th>Total Spent</th>
            <th>Loyalty Tier</th>
            <th>Last Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pagedCustomers" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.totalOrders }}</td>
            <td>{{ item.totalSpent }}</td>
            <td>{{ item.loyaltyTier }}</td>
            <td>{{ item.lastOrder }}</td>
            <td>
              <v-chip :color="item.status === 'Active' ? 'success' : 'grey'" size="small" class="text-white">
                {{ item.status }}
              </v-chip>
            </td>
            <td class="d-flex align-center justify-center" style="gap: 10px;">
              <v-icon size="16" color="blue" style="cursor:pointer;" @click="openViewDialog(item)">mdi-eye</v-icon>
              <v-icon size="16" color="primary" style="cursor:pointer;" @click="openEditDialog(item, idx)">mdi-pencil</v-icon>
              <v-switch
                v-model="item.status"
                :true-value="'Active'"
                :false-value="'Inactive'"
                color="orange-darken-2"
                hide-details
                density="compact"
                style="margin-bottom: 0;"
                @change="changeStatus(idx, item.status)"
              />
              <v-icon size="16" color="error" style="cursor:pointer;" @click="openDeleteDialog(idx)">mdi-delete</v-icon>
            </td>
          </tr>
          <tr v-if="pagedCustomers.length === 0">
            <td colspan="8" class="text-center text-grey">No customers found.</td>
          </tr>
        </tbody>
      </v-table>
      <!-- Pagination -->
      <div class="d-flex justify-end align-center pa-2">
        <span class="mr-2">Items per page:</span>
        <v-select v-model="itemsPerPage" :items="[5, 10, 20]" dense hide-details style="max-width: 70px;" />
        <span class="mx-2">{{ pageStart + 1 }}-{{ pageEnd }} of {{ filteredCustomers.length }}</span>
        <v-btn icon :disabled="page === 1" @click="page--"><v-icon>mdi-chevron-left</v-icon></v-btn>
        <v-btn icon :disabled="pageEnd >= filteredCustomers.length" @click="page++"><v-icon>mdi-chevron-right</v-icon></v-btn>
      </div>
    </v-card>
    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="700px">
      <v-card>
        <div class="d-flex align-center pa-4" style="background: #fff3e0;">
          <v-icon color="orange-darken-2" class="mr-2">mdi-account-group</v-icon>
          <span class="text-h6 font-weight-bold text-orange-darken-4">{{ selectedCustomer?.name || 'Customer Details' }}</span>
          <v-spacer />
          <v-chip v-if="selectedCustomer" :color="selectedCustomer.status === 'Active' ? 'success' : 'grey'" size="small" class="text-white">
            {{ selectedCustomer.status }}
          </v-chip>
        </div>
        <v-tabs v-model="viewTab">
          <v-tab>Profile</v-tab>
          <v-tab>Addresses</v-tab>
          <v-tab>Wishlist</v-tab>
          <v-tab>Orders</v-tab>
          <v-tab>Promotion Usage</v-tab>
        </v-tabs>
        <v-tabs-items v-model="viewTab">
          <v-tab-item>
            <div class="pa-4">
              <div class="mb-2"><b>Name/Company:</b> {{ selectedCustomer?.name }}</div>
              <div class="mb-2"><b>Type:</b> {{ selectedCustomer?.type }}</div>
              <div class="mb-2"><b>Total Orders:</b> {{ selectedCustomer?.totalOrders }}</div>
              <div class="mb-2"><b>Total Spent:</b> {{ selectedCustomer?.totalSpent }}</div>
              <div class="mb-2"><b>Loyalty Tier:</b> {{ selectedCustomer?.loyaltyTier }}</div>
              <div class="mb-2"><b>Last Order:</b> {{ selectedCustomer?.lastOrder }}</div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="pa-4">
              <div class="mb-2 font-weight-bold">Addresses</div>
              <v-list v-if="selectedCustomer?.addresses && selectedCustomer.addresses.length">
                <v-list-item v-for="(addr, i) in selectedCustomer.addresses" :key="i">
                  <v-list-item-title>{{ addr }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <div v-else class="text-grey">No addresses found.</div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="pa-4">
              <div class="mb-2 font-weight-bold">Wishlist</div>
              <v-list v-if="selectedCustomer?.wishlist && selectedCustomer.wishlist.length">
                <v-list-item v-for="(item, i) in selectedCustomer.wishlist" :key="i">
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <div v-else class="text-grey">No wishlist items found.</div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="pa-4">
              <div class="mb-2 font-weight-bold">Orders</div>
              <v-list v-if="selectedCustomer?.orders && selectedCustomer.orders.length">
                <v-list-item v-for="(order, i) in selectedCustomer.orders" :key="i">
                  <v-list-item-title>Order #{{ order.id }} - {{ order.date }} - {{ order.total }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <div v-else class="text-grey">No orders found.</div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="pa-4">
              <div class="mb-2 font-weight-bold">Promotion Usage</div>
              <v-list v-if="selectedCustomer?.promotionUsage && selectedCustomer.promotionUsage.length">
                <v-list-item v-for="(promo, i) in selectedCustomer.promotionUsage" :key="i">
                  <v-list-item-title>{{ promo }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <div v-else class="text-grey">No promotion usage found.</div>
            </div>
          </v-tab-item>
        </v-tabs-items>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="400px">
      <v-card>
        <v-card-title>Edit Customer</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveEdit">
            <v-text-field v-model="editCustomer.name" label="Name/Company" class="mb-2" />
            <v-select v-model="editCustomer.type" :items="typeOptions.slice(1)" label="Type" class="mb-2" />
            <v-select v-model="editCustomer.loyaltyTier" :items="tierOptions.slice(1)" label="Loyalty Tier" class="mb-2" />
            <v-select v-model="editCustomer.status" :items="statusOptions.slice(1)" label="Status" class="mb-2" />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="350px">
      <v-card>
        <v-card-title>Delete Customer</v-card-title>
        <v-card-text>Are you sure you want to delete this customer?</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const summary = ref({ total: 120, active: 110, gold: 25, newsletter: 80 });
const customers = ref([
  { id: 1, name: 'Alice Smith', type: 'Individual', totalOrders: 12, totalSpent: 'MWK 150,000', loyaltyTier: 'Gold', lastOrder: '2025-07-01', status: 'Active' },
  { id: 2, name: 'Acme Corp.', type: 'Business', totalOrders: 5, totalSpent: 'MWK 500,000', loyaltyTier: 'Silver', lastOrder: '2025-06-15', status: 'Active' },
  { id: 3, name: 'Bob Jones', type: 'Individual', totalOrders: 3, totalSpent: 'MWK 30,000', loyaltyTier: 'Bronze', lastOrder: '2025-05-20', status: 'Inactive' }
]);
const search = ref('');
const filterType = ref('All');
const filterTier = ref('All');
const filterStatus = ref('All');
const typeOptions = ['All', 'Individual', 'Business'];
const tierOptions = ['All', 'Gold', 'Silver', 'Bronze'];
const statusOptions = ['All', 'Active', 'Inactive'];
const itemsPerPage = ref(10);
const page = ref(1);
const filteredCustomers = computed(() => {
  return customers.value.filter(c => {
    return (
      (filterType.value === 'All' || c.type === filterType.value) &&
      (filterTier.value === 'All' || c.loyaltyTier === filterTier.value) &&
      (filterStatus.value === 'All' || c.status === filterStatus.value) &&
      (search.value === '' || c.name.toLowerCase().includes(search.value.toLowerCase()))
    );
  });
});
const pageStart = computed(() => (page.value - 1) * itemsPerPage.value);
const pageEnd = computed(() => Math.min(page.value * itemsPerPage.value, filteredCustomers.value.length));
const pagedCustomers = computed(() => filteredCustomers.value.slice(pageStart.value, pageEnd.value));

// Dialogs and selected customer state
const viewDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedCustomer = ref(null);
const editCustomer = ref({});
let editIndex = null;
let deleteIndex = null;
const viewTab = ref(0);

function clearFilters() {
  search.value = '';
  filterType.value = 'All';
  filterTier.value = 'All';
  filterStatus.value = 'All';
}
function openViewDialog(item) {
  selectedCustomer.value = {
    ...item,
    addresses: [
      '123 Main St, Lilongwe, Malawi',
      '456 Side Ave, Blantyre, Malawi'
    ],
    wishlist: ['Wooden Bowl', 'Handmade Chair'],
    orders: [
      { id: 1001, date: '2025-07-01', total: 'MWK 10,000' },
      { id: 1002, date: '2025-06-15', total: 'MWK 20,000' }
    ],
    promotionUsage: ['SUMMER2025', 'WELCOME']
  };
  viewTab.value = 0;
  viewDialog.value = true;
}
function openEditDialog(item, idx) {
  editCustomer.value = { ...item };
  editIndex = idx;
  editDialog.value = true;
}
function saveEdit() {
  if (editIndex !== null) {
    customers.value[editIndex] = { ...editCustomer.value };
  }
  editDialog.value = false;
}
function openDeleteDialog(idx) {
  deleteIndex = idx;
  deleteDialog.value = true;
}
function confirmDelete() {
  if (deleteIndex !== null) {
    customers.value.splice(deleteIndex, 1);
  }
  deleteDialog.value = false;
}
function viewCustomer(id) {
  router.push({ name: 'CustomerDetail', params: { id } });
}
function changeStatus(idx, newStatus) {
  customers.value[idx].status = newStatus;
}
</script> 