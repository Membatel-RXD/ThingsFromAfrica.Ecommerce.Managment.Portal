<template>
    <div class="pending-orders-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-3">Pending Orders</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage orders awaiting processing and shipment
            </p>
          </div>
          <v-btn
            color="orange-darken-2"
            variant="elevated"
            prepend-icon="mdi-truck"
            @click="bulkShipSelected"
            :disabled="selectedOrders.length === 0"
          >
            Ship Selected ({{ selectedOrders.length }})
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-clock-outline</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ pendingStatistics.total }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Total Pending</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-airplane</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ pendingStatistics.tourist }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Tourist Orders</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-certificate</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ pendingStatistics.certificates }}</h3>
                  <p class="text-body-2 text-green-darken-1">Need Certificates</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="red-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="red-darken-3" size="40" class="me-3">mdi-alert-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-red-darken-3">{{ pendingStatistics.overdue }}</h3>
                  <p class="text-body-2 text-red-darken-1">Overdue Orders</p>
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
                  label="Search pending orders..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="priorityFilter"
                  label="Priority"
                  :items="priorityOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="touristFilter"
                  label="Order Type"
                  :items="touristOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="startDate"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="endDate"
                  label="End Date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
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
  
        <!-- Pending Orders Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-clock-outline</v-icon>
            Pending Orders Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredOrders"
            :loading="orderStore.loading"
            :search="search"
            v-model="selectedOrders"
            show-select
            class="elevation-1"
            :sort-by="[{ key: 'orderDate', order: 'asc' }]"
          >
            <template v-slot:item.orderDate="{ item }">
              <div>
                {{ formatDate(item.orderDate) }}
                <v-chip
                  v-if="isOrderOverdue(item.orderDate)"
                  color="red"
                  size="x-small"
                  class="ml-2"
                >
                  OVERDUE
                </v-chip>
              </div>
            </template>
  
            <template v-slot:item.totalAmount="{ item }">
              {{ formatCurrency(item.totalAmount, item.currency) }}
            </template>
  
            <template v-slot:item.priority="{ item }">
              <v-chip
                :color="getPriorityColor(item)"
                size="small"
                variant="flat"
              >
                {{ getPriorityText(item) }}
              </v-chip>
            </template>
  
            <template v-slot:item.isTouristOrder="{ item }">
              <v-chip
                :color="item.isTouristOrder ? 'blue' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.isTouristOrder ? 'Tourist' : 'Local' }}
              </v-chip>
            </template>
  
            <template v-slot:item.requiresPhytosanitaryCertificate="{ item }">
              <v-icon
                :color="item.requiresPhytosanitaryCertificate ? 'green' : 'grey'"
                size="small"
              >
                {{ item.requiresPhytosanitaryCertificate ? 'mdi-certificate' : 'mdi-minus' }}
              </v-icon>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-eye"
                variant="text"
                size="small"
                color="primary"
                @click="viewOrder(item)"
              />
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editOrder(item)"
              />
              <v-btn
                icon="mdi-truck"
                variant="text"
                size="small"
                color="purple"
                @click="shipSingleOrder(item)"
              />
              <v-btn
                icon="mdi-cancel"
                variant="text"
                size="small"
                color="warning"
                @click="cancelOrder(item)"
              />
              <v-btn
                icon="mdi-flag"
                variant="text"
                size="small"
                color="orange"
                @click="setPriority(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Ship Orders Dialog -->
        <v-dialog v-model="shipDialog" max-width="600px">
          <v-card>
            <v-card-title class="pa-6 bg-purple-lighten-5">
              <v-icon class="me-2" color="purple-darken-3">mdi-truck</v-icon>
              Ship Orders
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="shipForm" v-model="shipValid">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="shipmentData.trackingNumber"
                      label="Tracking Number"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-barcode"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="shipmentData.carrier"
                      label="Shipping Carrier"
                      :items="carrierOptions"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="shipmentData.estimatedDelivery"
                      label="Estimated Delivery"
                      type="date"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="shipmentData.notes"
                      label="Shipping Notes"
                      rows="3"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
  
                <v-divider class="my-4" />
                <h3 class="text-h6 mb-3">Orders to Ship ({{ ordersToShip.length }})</h3>
                <v-list>
                  <v-list-item
                    v-for="order in ordersToShip"
                    :key="order.orderId"
                    class="px-0"
                  >
                    <v-list-item-title>{{ order.orderNumber }}</v-list-item-title>
                    <v-list-item-subtitle>{{ order.customerEmail }}</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip size="small">{{ formatCurrency(order.totalAmount, order.currency) }}</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-form>
            </v-card-text>
  
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                text
                @click="shipDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="purple-darken-2"
                variant="elevated"
                @click="confirmShipOrders"
                :disabled="!shipValid"
                :loading="shipping"
              >
                Ship Orders
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Priority Dialog -->
        <v-dialog v-model="priorityDialog" max-width="400px">
          <v-card>
            <v-card-title class="pa-6 bg-orange-lighten-5">
              <v-icon class="me-2" color="orange-darken-3">mdi-flag</v-icon>
              Set Priority
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-select
                v-model="selectedPriority"
                label="Priority Level"
                :items="priorityLevels"
                variant="outlined"
              />
            </v-card-text>
  
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                text
                @click="priorityDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="orange-darken-2"
                variant="elevated"
                @click="confirmSetPriority"
              >
                Set Priority
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useSnackbarStore } from '@/stores/snackbar'
  import { useOrderStore } from '@/stores/orderStore'
  import { OrderDto } from '@/stores/types/member'
  
  const orderStore = useOrderStore()
  const snackbar = useSnackbarStore()
  
  // Data
  const search = ref('')
  const priorityFilter = ref('all')
  const touristFilter = ref('all')
  const startDate = ref('')
  const endDate = ref('')
  const selectedOrders = ref<OrderDto[]>([])
  const shipDialog = ref(false)
  const priorityDialog = ref(false)
  const shipValid = ref(false)
  const shipping = ref(false)
  const ordersToShip = ref<OrderDto[]>([])
  const currentOrderForPriority = ref<OrderDto | null>(null)
  const selectedPriority = ref('')
  
  // Shipment data
  const shipmentData = ref({
    trackingNumber: '',
    carrier: '',
    estimatedDelivery: '',
    notes: ''
  })
  
  // Options
  const priorityOptions = [
    { title: 'All', value: 'all' },
    { title: 'High Priority', value: 'high' },
    { title: 'Normal Priority', value: 'normal' },
    { title: 'Low Priority', value: 'low' }
  ]
  
  const touristOptions = [
    { title: 'All', value: 'all' },
    { title: 'Tourist Orders', value: 'tourist' },
    { title: 'Local Orders', value: 'local' }
  ]
  
  const carrierOptions = [
    'DHL Express',
    'FedEx',
    'UPS',
    'USPS',
    'Local Courier',
    'Air Mail'
  ]
  
  const priorityLevels = [
    { title: 'High Priority', value: 'high' },
    { title: 'Normal Priority', value: 'normal' },
    { title: 'Low Priority', value: 'low' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Order #', key: 'orderNumber' },
    { title: 'Customer', key: 'customerEmail' },
    { title: 'Date', key: 'orderDate' },
    { title: 'Priority', key: 'priority' },
    { title: 'Type', key: 'isTouristOrder' },
    { title: 'Amount', key: 'totalAmount' },
    { title: 'Certificate', key: 'requiresPhytosanitaryCertificate' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required'
  }
  
  // Computed properties
  const filteredOrders = computed(() => {
    let filtered = orderStore.getOrders.filter(order => 
      order.orderStatus.toLowerCase() === 'pending'
    )
  
    if (priorityFilter.value !== 'all') {
      filtered = filtered.filter(order => 
        getPriorityLevel(order) === priorityFilter.value
      )
    }
  
    if (touristFilter.value === 'tourist') {
      filtered = filtered.filter(order => order.isTouristOrder)
    } else if (touristFilter.value === 'local') {
      filtered = filtered.filter(order => !order.isTouristOrder)
    }
  
    if (startDate.value && endDate.value) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate)
        return orderDate >= new Date(startDate.value) && orderDate <= new Date(endDate.value)
      })
    }
  
    return filtered
  })
  
  const pendingStatistics = computed(() => {
    const pending = filteredOrders.value
    return {
      total: pending.length,
      tourist: pending.filter(order => order.isTouristOrder).length,
      certificates: pending.filter(order => order.requiresPhytosanitaryCertificate).length,
      overdue: pending.filter(order => isOrderOverdue(order.orderDate)).length
    }
  })
  
  // Methods
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  const isOrderOverdue = (orderDate: string) => {
    const orderDateTime = new Date(orderDate)
    const currentTime = new Date()
    const daysDifference = Math.floor((currentTime.getTime() - orderDateTime.getTime()) / (1000 * 60 * 60 * 24))
    return daysDifference > 3 // Orders older than 3 days are considered overdue
  }
  
  const getPriorityLevel = (order: OrderDto) => {
    if (order.isTouristOrder && order.requiresPhytosanitaryCertificate) return 'high'
    if (isOrderOverdue(order.orderDate)) return 'high'
    if (order.isTouristOrder) return 'normal'
    return 'low'
  }
  
  const getPriorityColor = (order: OrderDto) => {
    const priority = getPriorityLevel(order)
    switch (priority) {
      case 'high': return 'red'
      case 'normal': return 'orange'
      case 'low': return 'green'
      default: return 'grey'
    }
  }
  
  const getPriorityText = (order: OrderDto) => {
    const priority = getPriorityLevel(order)
    switch (priority) {
      case 'high': return 'High'
      case 'normal': return 'Normal'
      case 'low': return 'Low'
      default: return 'Normal'
    }
  }
  
  const viewOrder = (item: OrderDto) => {
    // Implementation for viewing order details
    console.log('View order:', item)
  }
  
  const editOrder = (item: OrderDto) => {
    // Implementation for editing order
    console.log('Edit order:', item)
  }
  
  const bulkShipSelected = () => {
    if (selectedOrders.value.length === 0) {
      snackbar.info('Please select orders to ship')
      return
    }
    
    ordersToShip.value = [...selectedOrders.value]
    shipDialog.value = true
  }
  
  const shipSingleOrder = (item: OrderDto) => {
    ordersToShip.value = [item]
    shipDialog.value = true
  }
  
  const confirmShipOrders = async () => {
    shipping.value = true
    
    try {
      for (const order of ordersToShip.value) {
        await orderStore.shipOrder(order.orderId)
      }
      
      snackbar.success(`Successfully shipped ${ordersToShip.value.length} orders`)
      shipDialog.value = false
      selectedOrders.value = []
      
      // Reset shipment data
      shipmentData.value = {
        trackingNumber: '',
        carrier: '',
        estimatedDelivery: '',
        notes: ''
      }
    } catch (error) {
      console.error('Error shipping orders:', error)
      snackbar.error('Error shipping orders')
    } finally {
      shipping.value = false
    }
  }
  
  const setPriority = (item: OrderDto) => {
    currentOrderForPriority.value = item
    selectedPriority.value = getPriorityLevel(item)
    priorityDialog.value = true
  }
  
  const confirmSetPriority = () => {
    if (currentOrderForPriority.value) {
      snackbar.success('Priority updated successfully')
      priorityDialog.value = false
      currentOrderForPriority.value = null
      selectedPriority.value = ''
    }
  }
  
  const cancelOrder = async (item: OrderDto) => {
    if (confirm(`Are you sure you want to cancel order ${item.orderNumber}?`)) {
      try {
        const response = await orderStore.cancelOrder(item.orderId)
        if (response.isSuccessful) {
          snackbar.success('Order cancelled successfully')
        } else {
          snackbar.error('Error cancelling order')
        }
      } catch (error) {
        console.error('Error cancelling order:', error)
        snackbar.error('Error cancelling order')
      }
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    priorityFilter.value = 'all'
    touristFilter.value = 'all'
    startDate.value = ''
    endDate.value = ''
  }
  
  onMounted(async () => {
    try {
      await orderStore.fetchOrders()
    } catch (error) {
      console.error('Error fetching orders:', error)
      snackbar.error('Error loading orders')
    }
  })
  </script>
  
  <style scoped>
  .pending-orders-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>