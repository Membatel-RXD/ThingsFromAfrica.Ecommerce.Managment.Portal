<template>
    <div>
      <!-- Header Section -->
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between mb-6">
              <div>
                <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                  Stock Alerts
                </h1>
                <p class="text-subtitle-1 text-grey-darken-2">
                  Monitor low stock levels and get notified when products need restocking
                </p>
              </div>
              <div class="d-flex ga-2">
                <v-btn
                  color="blue-darken-2"
                  variant="elevated"
                  size="large"
                  @click="openAlertSettingsDialog"
                >
                  <v-icon start icon="mdi-cog"></v-icon>
                  Alert Settings
                </v-btn>
                <v-btn
                  color="orange-darken-2"
                  variant="elevated"
                  size="large"
                  @click="markAllAsRead"
                >
                  <v-icon start icon="mdi-check-all"></v-icon>
                  Mark All Read
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
  
        <!-- Quick Stats -->
        <v-row class="mb-6">
          <v-col cols="12" sm="3">
            <v-card color="red-darken-2" variant="elevated" class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="white" icon="mdi-alert-circle" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">{{ criticalAlerts }}</h3>
                <p class="text-red-lighten-4 mb-0">Critical Alerts</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="orange-darken-2" variant="elevated" class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="white" icon="mdi-alert" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">{{ warningAlerts }}</h3>
                <p class="text-orange-lighten-4 mb-0">Warning Alerts</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="blue-darken-2" variant="elevated" class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="white" icon="mdi-bell" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">{{ unreadAlerts }}</h3>
                <p class="text-blue-lighten-4 mb-0">Unread Alerts</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="green-darken-2" variant="elevated" class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="white" icon="mdi-check-circle" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">{{ resolvedAlerts }}</h3>
                <p class="text-green-lighten-4 mb-0">Resolved Today</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Filters and Search -->
        <v-card class="elevation-4 mb-6">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="Search alerts..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filterSeverity"
                  label="Severity"
                  :items="severityOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filterStatus"
                  label="Status"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filterCategory"
                  label="Category"
                  :items="categoryOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
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
  
        <!-- Alerts Table -->
        <v-card class="elevation-4">
          <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
            <v-icon icon="mdi-alert-circle" class="me-2"></v-icon>
            Stock Alerts
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredAlerts"
            :search="searchQuery"
            :loading="loading"
            item-key="alertId"
            class="elevation-0"
            :items-per-page="15"
          >
            <template v-slot:item.severity="{ item }">
              <v-chip
                :color="getSeverityColor(item.alertType)"
                size="small"
                variant="elevated"
              >
                <v-icon start :icon="getSeverityIcon(item.alertType)" size="small"></v-icon>
                {{ item.alertType }}
              </v-chip>
            </template>
  
            <template v-slot:item.productName="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="40" class="me-3">
                  <v-img :src="item.productImage || '/api/placeholder/40/40'" :alt="item.productName"></v-img>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.productName }}</div>
                  <div class="text-caption text-grey">{{ item.sku }}</div>
                </div>
              </div>
            </template>
  
            <template v-slot:item.currentStock="{ item }">
              <div class="text-center">
                <v-chip
                  :color="getStockColor(item.currentStock, item.thresholdValue)"
                  size="small"
                  variant="elevated"
                >
                  {{ item.currentStock }}
                </v-chip>
                <div class="text-caption text-grey mt-1">of {{ item.thresholdValue }} min</div>
              </div>
            </template>
  
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="elevated"
              >
                {{ item.status }}
              </v-chip>
            </template>
  
            <template v-slot:item.createdAt="{ item }">
              <div>
                <div class="font-weight-medium">{{ formatDate(item.createdAt) }}</div>
                <div class="text-caption text-grey">{{ formatTime(item.createdAt) }}</div>
              </div>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <div class="d-flex ga-2">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  color="blue"
                  @click="viewAlert(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-check"
                  size="small"
                  variant="text"
                  color="green"
                  @click="markAsRead(item)"
                  :disabled="item.status === 'Read'"
                ></v-btn>
                <v-btn
                  icon="mdi-package-variant"
                  size="small"
                  variant="text"
                  color="orange"
                  @click="restockProduct(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  color="red"
                  @click="dismissAlert(item)"
                ></v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
  
      <!-- Alert Details Dialog -->
      <v-dialog v-model="detailsDialog" max-width="700px">
        <v-card v-if="selectedAlert">
          <v-card-title class="text-h5 font-weight-bold text-orange-darken-4">
            <v-icon :icon="getSeverityIcon(selectedAlert.alertType)" class="me-2"></v-icon>
            Alert Details
          </v-card-title>
          
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-img
                  :src="selectedAlert.productImage || '/api/placeholder/200/200'"
                  :alt="selectedAlert.productName"
                  class="rounded"
                  height="200"
                ></v-img>
              </v-col>
              <v-col cols="12" md="8">
                <div class="mb-4">
                  <h3 class="text-h6 font-weight-bold mb-2">Product Information</h3>
                  <v-row>
                    <v-col cols="6">
                      <strong>Product:</strong> {{ selectedAlert.productName }}
                    </v-col>
                    <v-col cols="6">
                      <strong>SKU:</strong> {{ selectedAlert.sku }}
                    </v-col>
                    <v-col cols="6">
                      <strong>Current Stock:</strong> {{ selectedAlert.currentStock }}
                    </v-col>
                    <v-col cols="6">
                      <strong>Minimum Threshold:</strong> {{ selectedAlert.thresholdValue }}
                    </v-col>
                  </v-row>
                </div>
  
                <div class="mb-4">
                  <h3 class="text-h6 font-weight-bold mb-2">Alert Information</h3>
                  <v-row>
                    <v-col cols="6">
                      <strong>Severity:</strong> 
                      <v-chip :color="getSeverityColor(selectedAlert.alertType)" size="small" class="ml-2">
                        {{ selectedAlert.alertType }}
                      </v-chip>
                    </v-col>
                    <v-col cols="6">
                      <strong>Status:</strong> 
                      <v-chip :color="getStatusColor(selectedAlert.status)" size="small" class="ml-2">
                        {{ selectedAlert.status }}
                      </v-chip>
                    </v-col>
                    <v-col cols="6">
                      <strong>Created:</strong> {{ formatDateTime(selectedAlert.createdAt) }}
                    </v-col>
                    <v-col cols="6">
                      <strong>Category:</strong> {{ selectedAlert.category }}
                    </v-col>
                  </v-row>
                </div>
  
                <div class="mb-4">
                  <h3 class="text-h6 font-weight-bold mb-2">Message</h3>
                  <p>{{ selectedAlert.alertMessage }}</p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
  
          <v-card-actions class="pa-6">
            <v-btn
              color="green"
              variant="elevated"
              @click="markAsRead(selectedAlert)"
              :disabled="selectedAlert.status === 'Read'"
            >
              Mark as Read
            </v-btn>
            <v-btn
              color="orange"
              variant="elevated"
              @click="restockProduct(selectedAlert)"
            >
              Restock Product
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="detailsDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Alert Settings Dialog -->
      <v-dialog v-model="settingsDialog" max-width="600px">
        <v-card>
          <v-card-title class="text-h5 font-weight-bold text-orange-darken-4">
            Alert Settings
          </v-card-title>
          
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12">
                  <h3 class="text-h6 mb-3">Notification Preferences</h3>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.emailNotifications"
                    label="Email Notifications"
                    color="orange-darken-2"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.smsNotifications"
                    label="SMS Notifications"
                    color="orange-darken-2"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.browserNotifications"
                    label="Browser Notifications"
                    color="orange-darken-2"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <h3 class="text-h6 mb-3 mt-4">Alert Thresholds</h3>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="settings.criticalThreshold"
                    label="Critical Alert Threshold"
                    type="number"
                    variant="outlined"
                    suffix="units"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="settings.warningThreshold"
                    label="Warning Alert Threshold"
                    type="number"
                    variant="outlined"
                    suffix="units"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
  
          <v-card-actions class="pa-6">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="settingsDialog = false">Cancel</v-btn>
            <v-btn
              color="orange-darken-2"
              variant="elevated"
              @click="saveSettings"
            >
              Save Settings
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { StockAlert } from '@/stores/types/member'
  import { ref, computed, onMounted } from 'vue'
  import { useStockAlertStore } from '@/stores/stockAlertStore'
  import { useProductCategoryStore } from '@/stores/productCategory';
  
  const stockAlertStore = useStockAlertStore();
  const categoryStore = useProductCategoryStore();
  // Reactive data
  const loading = ref(false)
  const searchQuery = ref('')
  const filterSeverity = ref('All')
  const filterStatus = ref('All')
  const filterCategory = ref('All')
  
  // Dialog states
  const detailsDialog = ref(false)
  const settingsDialog = ref(false)
  
  // Selected items
  const selectedAlert = ref<StockAlert | null>(null)
  
  // Settings
  const settings = ref({
    emailNotifications: true,
    smsNotifications: false,
    browserNotifications: true,
    criticalThreshold: 5,
    warningThreshold: 10
  })
  
  // Sample data
  const alerts = computed(()=>stockAlertStore.alerts);
  
  // Filter options
  const severityOptions = ['All', 'LowStock', 'OutOfStock', 'Restocked']
  const statusOptions = ['All', 'Unread', 'Read', 'Dismissed']
  const categoryOptions = ref<string[]>([]);

  // Table headers
  const headers = [
    { title: 'Alert Type', key: 'alertType' },
    { title: 'Product', key: 'productName' },
    { title: 'Current Stock', key: 'currentStock' },
    { title: 'Status', key: 'status' },
    { title: 'Category', key: 'category' },
    { title: 'Created', key: 'createdAt' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Computed properties
  const filteredAlerts = computed(() => {
    let filtered = alerts.value
  
    if (filterSeverity.value !== 'All') {
      filtered = filtered.filter(alert => alert.alertType === filterSeverity.value)
    }
  
    if (filterStatus.value !== 'All') {
      filtered = filtered.filter(alert => alert.status === filterStatus.value)
    }
  
    if (filterCategory.value !== 'All') {
      filtered = filtered.filter(alert => alert.category === filterCategory.value)
    }
  
    return filtered
  })
  
  const criticalAlerts = computed(() => alerts.value.filter(a => a.alertType === 'OutOfStock' && a.status !== 'Dismissed').length)
  const warningAlerts = computed(() => alerts.value.filter(a => a.alertType === 'LowStock' && a.status !== 'Dismissed').length)
  const unreadAlerts = computed(() => alerts.value.filter(a => a.status === 'Unread').length)
  const resolvedAlerts = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return alerts.value.filter(a => a.status === 'Read' && a.createdAt.startsWith(today)).length
  })
  
  // Methods
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'OutOfStock': return 'red'
      case 'LowStock': return 'orange'
      case 'Restocked': return 'blue'
      default: return 'grey'
    }
  }
  
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'OutOfStock': return 'mdi-alert-circle'
      case 'LowStock': return 'mdi-alert'
      case 'Restocked': return 'mdi-information'
      default: return 'mdi-help-circle'
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'unread': return 'blue'
      case 'read': return 'green'
      case 'dismissed': return 'grey'
      default: return 'grey'
    }
  }
  
  const getStockColor = (stock: number, threshold: number) => {
    if (stock === 0) return 'red'
    if (stock <= threshold / 2) return 'red'
    if (stock <= threshold) return 'orange'
    return 'green'
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString()
  }
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }
  
  const viewAlert = (alert: StockAlert) => {
    selectedAlert.value = alert
    detailsDialog.value = true
  }
  
  const markAsRead = (alert: StockAlert) => {
    alert.status = 'Read'
    detailsDialog.value = false
  }
  
  const markAllAsRead = () => {
    alerts.value.forEach(alert => {
      if (alert.status === 'Unread') {
        alert.status = 'Read'
      }
    })
  }
  
  const dismissAlert = (alert: StockAlert) => {
    alert.status = 'Dismissed'
  }
  
  const restockProduct = (alert: StockAlert) => {
    // Navigate to product or open restock dialog
    console.log('Restocking product:', alert.productName)
    detailsDialog.value = false
  }
  
  const openAlertSettingsDialog = () => {
    settingsDialog.value = true
  }
  
  const saveSettings = () => {
    // Save settings logic here
    console.log('Saving settings:', settings.value)
    settingsDialog.value = false
  }
  
  const clearFilters = () => {
    searchQuery.value = ''
    filterSeverity.value = 'All'
    filterStatus.value = 'All'
    filterCategory.value = 'All'
  }
  
  onMounted(async () => {
  loading.value = true;
  await Promise.all([
    categoryStore.fetchCategories(),
    stockAlertStore.fetchAlerts()
  ]);

  // After categories are loaded, now populate categoryOptions
  categoryOptions.value = ['All', ...categoryStore.categories.map(c => c.categoryName)];

  loading.value = false;
});

  </script>
  
  <style scoped>
  .stats-card {
    transition: transform 0.2s;
  }
  
  .stats-card:hover {
    transform: translateY(-2px);
  }
  </style>