<template>
    <div>
      <!-- Header Section -->
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between mb-6">
              <div>
                <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                  Stock Movement
                </h1>
                <p class="text-subtitle-1 text-grey-darken-2">
                  Track inventory movements, adjustments, and stock transfers
                </p>
              </div>
              <div class="d-flex ga-2">
                <v-btn
                  color="blue-darken-2"
                  variant="elevated"
                  size="large"
                  @click="openAdjustmentDialog"
                >
                  <v-icon start icon="mdi-plus-minus"></v-icon>
                  Stock Adjustment
                </v-btn>
                <v-btn
                  color="orange-darken-2"
                  variant="elevated"
                  size="large"
                  @click="exportMovements"
                >
                  <v-icon start icon="mdi-download"></v-icon>
                  Export Report
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
  
        <!-- Quick Stats -->
        <v-row class="mb-6">
          <v-col cols="12" sm="3">
            <v-card color="green-darken-2" variant="elevated" class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="white" icon="mdi-arrow-up-bold" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">{{ totalStockIn }}</h3>
                <p class="text-green-lighten-4 mb-0">Stock In (Today)</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="red-darken-2" variant="elevated" class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="white" icon="mdi-arrow-down-bold" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">{{ totalStockOut }}</h3>
                <p class="text-red-lighten-4 mb-0">Stock Out (Today)</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="blue-darken-2" variant="elevated" class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="white" icon="mdi-swap-horizontal" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">{{ totalAdjustments }}</h3>
                <p class="text-blue-lighten-4 mb-0">Adjustments (Today)</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card color="orange-darken-2" variant="elevated" class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="white" icon="mdi-chart-line" class="mb-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">{{ netMovement }}</h3>
                <p class="text-orange-lighten-4 mb-0">Net Movement</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Filters and Search -->
        <v-card class="elevation-4 mb-6">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="searchQuery"
                  label="Search movements..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filterMovementType"
                  label="Movement Type"
                  :items="movementTypeOptions"
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
                <v-text-field
                  v-model="filterDateFrom"
                  label="Date From"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filterDateTo"
                  label="Date To"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn
                  color="orange-darken-2"
                  variant="outlined"
                  block
                  @click="clearFilters"
                >
                  Clear
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
  
        <!-- Movement Chart -->
        <v-card class="elevation-4 mb-6">
          <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
            <v-icon icon="mdi-chart-line" class="me-2"></v-icon>
            Stock Movement Trends (Last 7 Days)
          </v-card-title>
          <v-card-text>
            <div class="chart-container" style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 8px;">
              <div class="text-center">
                <v-icon size="48" color="grey" icon="mdi-chart-line"></v-icon>
                <p class="text-grey text-h6 mt-2">Stock Movement Chart</p>
                <p class="text-caption text-grey">Chart visualization would be implemented here</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
  
        <!-- Stock Movements Table -->
        <v-card class="elevation-4">
          <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
            <v-icon icon="mdi-swap-horizontal" class="me-2"></v-icon>
            Stock Movement History
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredMovements"
            :search="searchQuery"
            :loading="loading"
            item-key="movementId"
            class="elevation-0"
            :items-per-page="15"
          >
            <template v-slot:item.movementType="{ item }">
              <v-chip
                :color="getMovementTypeColor(item.movementType)"
                size="small"
                variant="elevated"
              >
                <v-icon start :icon="getMovementTypeIcon(item.movementType)" size="small"></v-icon>
                {{ item.movementType }}
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
  
            <template v-slot:item.quantity="{ item }">
              <div class="text-center">
                <v-chip
                  :color="item.quantity > 0 ? 'green' : 'red'"
                  size="small"
                  variant="elevated"
                >
                  {{ item.quantity > 0 ? '+' : '' }}{{ item.quantity }}
                </v-chip>
              </div>
            </template>
  
            <template v-slot:item.stockBefore="{ item }">
              <div class="text-center">
                <span class="font-weight-medium">{{ item.stockBefore }}</span>
              </div>
            </template>
  
            <template v-slot:item.stockAfter="{ item }">
              <div class="text-center">
                <span class="font-weight-medium">{{ item.stockAfter }}</span>
              </div>
            </template>
  
            <template v-slot:item.createdAt="{ item }">
              <div>
                <div class="font-weight-medium">{{ formatDate(item.createdAt) }}</div>
                <div class="text-caption text-grey">{{ formatTime(item.createdAt) }}</div>
              </div>
            </template>
  
            <template v-slot:item.createdBy="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="24" class="me-2">
                  <v-img :src="item.userAvatar || '/api/placeholder/24/24'" :alt="item.createdBy"></v-img>
                </v-avatar>
                <span class="text-caption">{{ item.createdBy }}</span>
              </div>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <div class="d-flex ga-2">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  color="blue"
                  @click="viewMovement(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-undo"
                  size="small"
                  variant="text"
                  color="orange"
                  @click="revertMovement(item)"
                  :disabled="!canRevert(item)"
                ></v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
  
      <!-- Movement Details Dialog -->
      <v-dialog v-model="detailsDialog" max-width="700px">
        <v-card v-if="selectedMovement">
          <v-card-title class="text-h5 font-weight-bold text-orange-darken-4">
            <v-icon :icon="getMovementTypeIcon(selectedMovement.movementType)" class="me-2"></v-icon>
            Movement Details
          </v-card-title>
          
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-img
                  :src="selectedMovement.productImage || '/api/placeholder/200/200'"
                  :alt="selectedMovement.productName"
                  class="rounded"
                  height="200"
                ></v-img>
              </v-col>
              <v-col cols="12" md="8">
                <div class="mb-4">
                  <h3 class="text-h6 font-weight-bold mb-2">Product Information</h3>
                  <v-row>
                    <v-col cols="6">
                      <strong>Product:</strong> {{ selectedMovement.productName }}
                    </v-col>
                    <v-col cols="6">
                      <strong>SKU:</strong> {{ selectedMovement.sku }}
                    </v-col>
                    <v-col cols="6">
                      <strong>Category:</strong> {{ selectedMovement.category }}
                    </v-col>
                    <v-col cols="6">
                      <strong>Location:</strong> {{ selectedMovement.location }}
                    </v-col>
                  </v-row>
                </div>
  
                <div class="mb-4">
                  <h3 class="text-h6 font-weight-bold mb-2">Movement Information</h3>
                  <v-row>
                    <v-col cols="6">
                      <strong>Type:</strong> 
                      <v-chip :color="getMovementTypeColor(selectedMovement.movementType)" size="small" class="ml-2">
                        {{ selectedMovement.movementType }}
                      </v-chip>
                    </v-col>
                    <v-col cols="6">
                      <strong>Quantity:</strong> 
                      <v-chip :color="selectedMovement.quantity > 0 ? 'green' : 'red'" size="small" class="ml-2">
                        {{ selectedMovement.quantity > 0 ? '+' : '' }}{{ selectedMovement.quantity }}
                      </v-chip>
                    </v-col>
                    <v-col cols="6">
                      <strong>Stock Before:</strong> {{ selectedMovement.stockBefore }}
                    </v-col>
                    <v-col cols="6">
                      <strong>Stock After:</strong> {{ selectedMovement.stockAfter }}
                    </v-col>
                    <v-col cols="6">
                      <strong>Date:</strong> {{ formatDateTime(selectedMovement.createdAt) }}
                    </v-col>
                    <v-col cols="6">
                      <strong>User:</strong> {{ selectedMovement.createdBy }}
                    </v-col>
                  </v-row>
                </div>
  
                <div class="mb-4" v-if="selectedMovement.reason">
                  <h3 class="text-h6 font-weight-bold mb-2">Reason</h3>
                  <p>{{ selectedMovement.reason }}</p>
                </div>
  
                <div class="mb-4" v-if="selectedMovement.notes">
                  <h3 class="text-h6 font-weight-bold mb-2">Notes</h3>
                  <p>{{ selectedMovement.notes }}</p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
  
          <v-card-actions class="pa-6">
            <v-btn
              color="orange"
              variant="elevated"
              @click="revertMovement(selectedMovement)"
              :disabled="!canRevert(selectedMovement)"
            >
              Revert Movement
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="detailsDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Stock Adjustment Dialog -->
      <v-dialog v-model="adjustmentDialog" max-width="600px" persistent>
        <v-card>
          <v-card-title class="text-h5 font-weight-bold text-orange-darken-4">
            Stock Adjustment
          </v-card-title>
          
          <v-card-text>
            <v-form ref="adjustmentForm" v-model="formValid">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="adjustmentData.productId"
                    label="Select Product"
                    :items="productOptions"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    :rules="[v => !!v || 'Product is required']"
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="adjustmentData.movementType"
                    label="Movement Type"
                    :items="adjustmentTypes"
                    variant="outlined"
                    :rules="[v => !!v || 'Movement type is required']"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="adjustmentData.quantity"
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    :rules="[v => v !== 0 || 'Quantity cannot be zero', v => v !== null || 'Quantity is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="adjustmentData.reason"
                    label="Reason"
                    variant="outlined"
                    :rules="[v => !!v || 'Reason is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="adjustmentData.notes"
                    label="Additional Notes"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
  
          <v-card-actions class="pa-6">
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="closeAdjustmentDialog"
            >
              Cancel
            </v-btn>
            <v-btn
              color="orange-darken-2"
              variant="elevated"
              :disabled="!formValid"
              :loading="saving"
              @click="saveAdjustment"
            >
              Save Adjustment
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  
  interface StockMovement {
    movementId: number
    productName: string
    sku: string
    productImage: string
    movementType: 'Stock In' | 'Stock Out' | 'Adjustment' | 'Transfer' | 'Return' | 'Sale' | 'Purchase'
    quantity: number
    stockBefore: number
    stockAfter: number
    reason: string
    notes: string
    category: string
    location: string
    createdAt: string
    createdBy: string
    userAvatar: string
    canRevert: boolean
  }
  
  // Reactive data
  const loading = ref(false)
  const saving = ref(false)
  const searchQuery = ref('')
  const filterMovementType = ref('All')
  const filterCategory = ref('All')
  const filterDateFrom = ref('')
  const filterDateTo = ref('')
  
  // Dialog states
  const detailsDialog = ref(false)
  const adjustmentDialog = ref(false)
  const formValid = ref(false)
  
  // Selected items
  const selectedMovement = ref<StockMovement | null>(null)
  
  // Adjustment form data
  const adjustmentData = ref({
    productId: null,
    movementType: '',
    quantity: 0,
    reason: '',
    notes: ''
  })
  
  // Sample data
  const movements = ref<StockMovement[]>([
    {
      movementId: 1,
      productName: 'Mahogany Coffee Table',
      sku: 'MCT-001',
      productImage: '/api/placeholder/40/40',
      movementType: 'Stock In',
      quantity: 10,
      stockBefore: 5,
      stockAfter: 15,
      reason: 'New shipment received',
      notes: 'Quality checked and approved',
      category: 'Furniture',
      location: 'Warehouse A',
      createdAt: '2025-01-27T08:30:00Z',
      createdBy: 'John Doe',
      userAvatar: '/api/placeholder/24/24',
      canRevert: true
    },
    {
      movementId: 2,
      productName: 'Teak Wood Bowl',
      sku: 'TWB-003',
      productImage: '/api/placeholder/40/40',
      movementType: 'Sale',
      quantity: -3,
      stockBefore: 12,
      stockAfter: 9,
      reason: 'Order #ORD-2025-001',
      notes: 'Sold to customer via online store',
      category: 'Kitchenware',
      location: 'Main Store',
      createdAt: '2025-01-27T07:15:00Z',
      createdBy: 'Jane Smith',
      userAvatar: '/api/placeholder/24/24',
      canRevert: false
    },
    {
      movementId: 3,
      productName: 'Cedar Jewelry Box',
      sku: 'CJB-005',
      productImage: '/api/placeholder/40/40',
      movementType: 'Adjustment',
      quantity: -2,
      stockBefore: 8,
      stockAfter: 6,
      reason: 'Damaged items found during inspection',
      notes: 'Items had water damage, removed from inventory',
      category: 'Accessories',
      location: 'Warehouse B',
      createdAt: '2025-01-26T14:20:00Z',
      createdBy: 'Admin User',
      userAvatar: '/api/placeholder/24/24',
      canRevert: true
    },
    {
      movementId: 4,
      productName: 'Oak Dining Chair',
      sku: 'ODC-007',
      productImage: '/api/placeholder/40/40',
      movementType: 'Return',
      quantity: 1,
      stockBefore: 20,
      stockAfter: 21,
      reason: 'Customer return - defective item',
      notes: 'Customer reported loose screws, item needs repair',
      category: 'Furniture',
      location: 'Returns Area',
      createdAt: '2025-01-26T11:45:00Z',
      createdBy: 'Customer Service',
      userAvatar: '/api/placeholder/24/24',
      canRevert: false
    }
  ])
  
  // Options
  const movementTypeOptions = ['All', 'Stock In', 'Stock Out', 'Adjustment', 'Transfer', 'Return', 'Sale', 'Purchase']
  const categoryOptions = ['All', 'Furniture', 'Accessories', 'Decor', 'Kitchenware']
  const adjustmentTypes = ['Stock In', 'Stock Out', 'Adjustment', 'Transfer']
  
  const productOptions = [
    { id: 1, name: 'Mahogany Coffee Table - MCT-001' },
    { id: 2, name: 'Teak Wood Bowl - TWB-003' },
    { id: 3, name: 'Cedar Jewelry Box - CJB-005' },
    { id: 4, name: 'Oak Dining Chair - ODC-007' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Type', key: 'movementType' },
    { title: 'Product', key: 'productName' },
    { title: 'Quantity', key: 'quantity' },
    { title: 'Before', key: 'stockBefore' },
    { title: 'After', key: 'stockAfter' },
    { title: 'Date', key: 'createdAt' },
    { title: 'User', key: 'createdBy' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Computed properties
  const filteredMovements = computed(() => {
    let filtered = movements.value
  
    if (filterMovementType.value !== 'All') {
      filtered = filtered.filter(movement => movement.movementType === filterMovementType.value)
    }
  
    if (filterCategory.value !== 'All') {
      filtered = filtered.filter(movement => movement.category === filterCategory.value)
    }
  
    if (filterDateFrom.value) {
      filtered = filtered.filter(movement => movement.createdAt >= filterDateFrom.value)
    }
  
    if (filterDateTo.value) {
      filtered = filtered.filter(movement => movement.createdAt <= filterDateTo.value + 'T23:59:59Z')
    }
  
    return filtered
  })
  
  const today = new Date().toISOString().split('T')[0]
  
  const totalStockIn = computed(() => {
    return movements.value
      .filter(m => m.createdAt.startsWith(today) && m.quantity > 0)
      .reduce((sum, m) => sum + m.quantity, 0)
  })
  
  const totalStockOut = computed(() => {
    return Math.abs(movements.value
      .filter(m => m.createdAt.startsWith(today) && m.quantity < 0)
      .reduce((sum, m) => sum + m.quantity, 0))
  })
  
  const totalAdjustments = computed(() => {
    return movements.value
      .filter(m => m.createdAt.startsWith(today) && m.movementType === 'Adjustment')
      .length
  })
  
  const netMovement = computed(() => {
    return movements.value
      .filter(m => m.createdAt.startsWith(today))
      .reduce((sum, m) => sum + m.quantity, 0)
  })
  
  // Methods
  const getMovementTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stock in':
      case 'purchase':
      case 'return': return 'green'
      case 'stock out':
      case 'sale': return 'red'
      case 'adjustment': return 'blue'
      case 'transfer': return 'orange'
      default: return 'grey'
    }
  }
  
  const getMovementTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stock in':
      case 'purchase': return 'mdi-arrow-up-bold'
      case 'stock out':
      case 'sale': return 'mdi-arrow-down-bold'
      case 'adjustment': return 'mdi-plus-minus'
      case 'transfer': return 'mdi-swap-horizontal'
      case 'return': return 'mdi-undo'
      default: return 'mdi-help-circle'
    }
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
  
  const viewMovement = (movement: StockMovement) => {
    selectedMovement.value = movement
    detailsDialog.value = true
  }
  
  const canRevert = (movement: StockMovement) => {
    return movement.canRevert && movement.movementType !== 'Sale'
  }
  
  const revertMovement = (movement: StockMovement) => {
    if (canRevert(movement)) {
      // Logic to revert movement
      console.log('Reverting movement:', movement.movementId)
      detailsDialog.value = false
    }
  }
  
  const openAdjustmentDialog = () => {
    adjustmentData.value = {
      productId: null,
      movementType: '',
      quantity: 0,
      reason: '',
      notes: ''
    }
    adjustmentDialog.value = true
  }
  
  const closeAdjustmentDialog = () => {
    adjustmentDialog.value = false
  }
  
  const saveAdjustment = async () => {
    saving.value = true
    try {
      // Save adjustment logic here
      console.log('Saving adjustment:', adjustmentData.value)
      adjustmentDialog.value = false
    } finally {
      saving.value = false
    }
  }
  
  const exportMovements = () => {
    // Export logic here
    console.log('Exporting movements report')
  }
  
  const clearFilters = () => {
    searchQuery.value = ''
    filterMovementType.value = 'All'
    filterCategory.value = 'All'
    filterDateFrom.value = ''
    filterDateTo.value = ''
  }
  
  onMounted(() => {
    // Load movements data
    loading.value = false
  })
  </script>
  
  <style scoped>
  .stats-card {
    transition: transform 0.2s;
  }
  
  .stats-card:hover {
    transform: translateY(-2px);
  }
  </style>