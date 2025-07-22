<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                Return Requests
              </h1>
              <p class="text-subtitle-1 text-grey-darken-2">
                Manage and process customer return requests
              </p>
            </div>
            <v-btn color="orange-darken-2" variant="elevated" size="large" @click="exportCSV">
              <v-icon start icon="mdi-file-delimited"></v-icon>
              Export CSV
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Stat Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="2">
          <v-card color="orange-lighten-3" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="orange-darken-2" icon="mdi-arrow-left-bold-box-outline" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-orange-darken-4">{{ returnStats.total }}</h3>
              <p class="mb-0">Total</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card color="amber-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="amber-darken-2" icon="mdi-clock-alert-outline" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-amber-darken-2">{{ returnStats.pending }}</h3>
              <p class="mb-0">Pending</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card color="green-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="green-darken-2" icon="mdi-check-circle-outline" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-green-darken-2">{{ returnStats.approved }}</h3>
              <p class="mb-0">Approved</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card color="red-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="red-darken-2" icon="mdi-close-circle-outline" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-red-darken-2">{{ returnStats.rejected }}</h3>
              <p class="mb-0">Rejected</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card color="orange-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="orange-darken-2" icon="mdi-cog-outline" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-orange-darken-2">{{ returnStats.processing }}</h3>
              <p class="mb-0">Processing</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card color="blue-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="blue-darken-2" icon="mdi-check-all" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-blue-darken-2">{{ returnStats.completed }}</h3>
              <p class="mb-0">Completed</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-card class="elevation-4 mb-6">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="Search requests..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedStatus"
                label="Status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="dateRange"
                label="Date Range"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="compact"
                hide-details
                placeholder="Select date range"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn color="orange-darken-2" variant="outlined" block @click="clearFilters">
                Clear Filters
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Return Requests Table -->
      <v-card class="elevation-4">
        <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
          <v-icon icon="mdi-arrow-left-bold-box-outline" class="me-2"></v-icon>
          Return Requests Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredReturnRequests"
          :loading="loading"
          item-key="id"
          class="elevation-0"
          loading-text="Loading return requests..."
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small">
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.requestDate="{ item }">
            {{ formatDate(item.requestDate) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-eye" size="small" variant="text" color="blue" @click="viewReturnRequest(item)"></v-btn>
            <v-btn icon="mdi-pencil" size="small" variant="text" color="orange" @click="editReturnRequest(item)"></v-btn>
            <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="deleteReturnRequest(item)"></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useReturnsStore } from '@/stores/returns';
import type { ReturnRequest } from '@/stores/returns';
import moment from 'moment';

// Store
const returnsStore = useReturnsStore();

// Reactive data
const searchQuery = ref('');
const selectedStatus = ref('All');
const dateRange = ref('');

// Table headers
const headers = [
  { title: 'Request ID', key: 'id' },
  { title: 'Order ID', key: 'orderId' },
  { title: 'Customer', key: 'customerName' },
  { title: 'Product', key: 'productName' },
  { title: 'Reason', key: 'reason' },
  { title: 'Status', key: 'status' },
  { title: 'Request Date', key: 'requestDate' },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Computed properties
const returnStats = computed(() => returnsStore.getReturnStats);
const allReturnRequests = computed(() => returnsStore.getReturnRequests);
const loading = computed(() => returnsStore.loading);

// Filtered return requests based on search and status
const filteredReturnRequests = computed(() => {
  let filtered = allReturnRequests.value;
  
  // Filter by status
  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter(request => 
      request.status.toLowerCase() === selectedStatus.value.toLowerCase()
    );
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(request => 
      request.id.toLowerCase().includes(query) ||
      request.orderId.toLowerCase().includes(query) ||
      request.customerName?.toLowerCase().includes(query) ||
      request.productName?.toLowerCase().includes(query) ||
      request.reason.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Status filter options
const statusOptions = ['All', 'Pending', 'Approved', 'Rejected', 'Processing', 'Completed'];

// Methods
function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'approved': return 'green';
    case 'rejected': return 'red';
    case 'processing': return 'orange';
    case 'completed': return 'blue';
    case 'pending': return 'amber';
    default: return 'grey';
  }
}

function formatDate(dateString: string) {
  return moment(dateString).format('MMM DD, YYYY');
}

function clearFilters() {
  searchQuery.value = '';
  selectedStatus.value = 'All';
  dateRange.value = '';
}

function viewReturnRequest(item: ReturnRequest) {
  // TODO: Navigate to return request details
  console.log('View return request:', item.id);
}

function editReturnRequest(item: ReturnRequest) {
  // TODO: Navigate to edit return request
  console.log('Edit return request:', item.id);
}

function deleteReturnRequest(item: ReturnRequest) {
  // TODO: Implement delete functionality
  console.log('Delete return request:', item.id);
}

function exportCSV() {
  // TODO: Implement CSV export
  console.log('Export CSV');
}

// Lifecycle
onMounted(async () => {
  await returnsStore.initializeStore();
});
</script>