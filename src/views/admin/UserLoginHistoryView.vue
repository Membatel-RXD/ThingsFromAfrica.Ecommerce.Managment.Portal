<template>
    <div class="user-login-history-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-3">User Login History</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Track user login attempts and activity
            </p>
          </div>
          <v-btn color="primary" prepend-icon="mdi-export" @click="exportDialog = true">Export</v-btn>
        </div>
  
        <!-- Filters and Search -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  label="Search by User ID, IP, Device..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="statusFilter"
                  label="Login Status"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="orange-darken-2"
                  variant="outlined"
                  block
                  @click="clearFilters"
                >
                  Clear Filters
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
  
        <!-- Login History Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-history</v-icon>
            User Login History
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="filteredHistory"
            :search="search"
            :loading="isLoading"
            class="elevation-1"
            :sort-by="[{ key: 'loginAt', order: 'desc' }]"
          >
            <template v-slot:item.loginStatus="{ item }">
              <v-chip :color="item.loginStatus === 'Success' ? 'green' : 'red'" size="small" variant="flat">
                {{ item.loginStatus }}
              </v-chip>
            </template>
            <template v-slot:item.loginAt="{ item }">
              <span class="text-caption">{{ formatDate(item.loginAt) }}</span>
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Export Dialog -->
        <v-dialog v-model="exportDialog" max-width="400">
          <v-card>
            <v-card-title>Export Login History</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-menu ref="startMenu" v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="exportStart" label="Start Date" readonly v-bind="attrs" v-on="on" />
                    </template>
                    <v-date-picker v-model="exportStart" @input="startMenu = false" />
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-menu ref="endMenu" v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="exportEnd" label="End Date" readonly v-bind="attrs" v-on="on" />
                    </template>
                    <v-date-picker v-model="exportEnd" @input="endMenu = false" />
                  </v-menu>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="exportDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="exportCSV">Export</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useLoginHistoryStore } from '@/stores/useLoginHistoryStore';

  const loginHistoryStore = useLoginHistoryStore();
  
  // Dummy data for demonstration (replace with API call)
  const loginHistory = computed(()=>loginHistoryStore.loginHistories);
  
  const search = ref('');
  const statusFilter = ref('All');
  const statusOptions = ['All', 'Success', 'Failure'];
  
  const headers = [
    { title: 'User ID', key: 'userId', sortable: true },
    { title: 'Login Status', key: 'loginStatus', sortable: true },
    { title: 'IP Address', key: 'ipAddress', sortable: true },
    { title: 'Device', key: 'deviceInfo', sortable: true },
    { title: 'Method', key: 'loginMethod', sortable: true },
    { title: 'Failure Reason', key: 'failureReason', sortable: false },
    { title: 'Login At', key: 'loginAt', sortable: true },
  ];
  
  const filteredHistory = computed(() => {
    let filtered = loginHistory.value;
    if (statusFilter.value !== 'All') {
      filtered = filtered.filter(h => h.loginStatus === statusFilter.value);
    }
    if (search.value) {
      const s = search.value.toLowerCase();
      filtered = filtered.filter(h =>
        h.userId.toString().includes(s) ||
        (h.ipAddress && h.ipAddress.toLowerCase().includes(s)) ||
        (h.deviceInfo && h.deviceInfo.toLowerCase().includes(s)) ||
        (h.userAgent && h.userAgent.toLowerCase().includes(s))
      );
    }
    return filtered;
  });
  
  const exportDialog = ref(false);
  const exportStart = ref('');
  const exportEnd = ref('');
  const startMenu = ref(false);
  const endMenu = ref(false);
  const isLoading = ref(false);
  
  function formatDate(dateStr: string) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }
  
  function clearFilters() {
    search.value = '';
    statusFilter.value = 'All';
  }
  
  function exportCSV() {
    // Filter by date range
    let filtered = loginHistory.value;
    if (exportStart.value) {
      filtered = filtered.filter(h => new Date(h.loginAt) >= new Date(exportStart.value));
    }
    if (exportEnd.value) {
      filtered = filtered.filter(h => new Date(h.loginAt) <= new Date(exportEnd.value));
    }
    // Convert to CSV
    const csvRows = [
      ['User ID', 'Login Status', 'IP Address', 'Device', 'Method', 'Failure Reason', 'Login At'],
      ...filtered.map(h => [h.userId, h.loginStatus, h.ipAddress, h.deviceInfo, h.loginMethod, h.failureReason, h.loginAt])
    ];
    const csvContent = csvRows.map(row => row.map(String).map(v => '"' + v.replace(/"/g, '""') + '"').join(',')).join('\n');
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_login_history.csv';
    a.click();
    URL.revokeObjectURL(url);
    exportDialog.value = false;
  }

  onMounted(()=>{
    isLoading.value =true
    Promise.all([loginHistoryStore.fetchLoginHistories()]);
    isLoading.value = false;
  })
  </script>
  
  <style scoped>
  .user-login-history-view {
    background: #fff;
    min-height: 100vh;
  }
  </style> 