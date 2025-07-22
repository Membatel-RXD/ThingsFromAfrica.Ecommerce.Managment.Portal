<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                RMA Management
              </h1>
              <p class="text-subtitle-1 text-grey-darken-2">
                Manage Return Merchandise Authorizations (RMAs)
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
              <v-icon size="32" color="orange-darken-2" icon="mdi-receipt" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-orange-darken-4">0</h3>
              <p class="mb-0">Total RMAs</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card color="blue-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="blue-darken-2" icon="mdi-truck-delivery-outline" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-blue-darken-2">0</h3>
              <p class="mb-0">Awaiting Arrival</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card color="green-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="green-darken-2" icon="mdi-package-variant-closed" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-green-darken-2">0</h3>
              <p class="mb-0">Processed</p>
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
                label="Search RMAs..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                label="Status"
                :items="['All', 'Awaiting Arrival', 'Processing', 'Processed']"
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

      <!-- RMA Management Table -->
      <v-card class="elevation-4">
        <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
          <v-icon icon="mdi-receipt" class="me-2"></v-icon>
          RMA Management
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
  { title: 'RMA ID', key: 'id' },
  { title: 'Return Request ID', key: 'returnRequestId' },
  { title: 'Customer', key: 'customer' },
  { title: 'Status', key: 'status' },
  { title: 'Date Issued', key: 'dateIssued' },
  { title: 'Actions', key: 'actions', sortable: false },
];

function getStatusColor(status: string) {
  if (status === 'Processed') return 'green';
  if (status === 'Awaiting Arrival') return 'blue';
  return 'orange';
}
</script>