<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                Refund Handling
              </h1>
              <p class="text-subtitle-1 text-grey-darken-2">
                Process and manage refunds for returned items
              </p>
            </div>
            <v-btn color="orange-darken-2" variant="elevated" size="large">
              <v-icon start icon="mdi-file-delimited"></v-icon>
              Export CSV
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Stat Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="4">
          <v-card color="orange-lighten-3" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="orange-darken-2" icon="mdi-cash-refund" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-orange-darken-4">0</h3>
              <p class="mb-0">Total Refunds</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card color="blue-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="blue-darken-2" icon="mdi-progress-wrench" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-blue-darken-2">0</h3>
              <p class="mb-0">Pending</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card color="green-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="green-darken-2" icon="mdi-check-decagram" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-green-darken-2">0</h3>
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
                label="Search refunds..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                label="Status"
                :items="['All', 'Pending', 'Completed']"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                label="Date Range"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn color="orange-darken-2" variant="outlined" block>
                Clear Filters
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Refund Handling Table -->
      <v-card class="elevation-4">
        <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
          <v-icon icon="mdi-cash-refund" class="me-2"></v-icon>
          Refund Handling
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="[]"
          item-key="id"
          class="elevation-0"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small">
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-eye" size="small" variant="text" color="blue"></v-btn>
            <v-btn icon="mdi-pencil" size="small" variant="text" color="orange"></v-btn>
            <v-btn icon="mdi-delete" size="small" variant="text" color="red"></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const headers = [
  { title: 'Refund ID', key: 'id' },
  { title: 'RMA ID', key: 'rmaId' },
  { title: 'Order ID', key: 'orderId' },
  { title: 'Customer', key: 'customer' },
  { title: 'Amount', key: 'amount' },
  { title: 'Status', key: 'status' },
  { title: 'Date', key: 'date' },
  { title: 'Actions', key: 'actions', sortable: false },
];

function getStatusColor(status: string) {
  if (status === 'Completed') return 'green';
  return 'blue';
}
</script>