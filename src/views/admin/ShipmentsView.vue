<template>
    <div class="shipments-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-purple-darken-3">Shipments Management</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Track and manage shipped orders and deliveries
            </p>
          </div>
          <v-btn
            color="purple-darken-2"
            variant="elevated"
            prepend-icon="mdi-truck-plus"
            @click="openCreateShipmentDialog"
          >
            Create Shipment
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-truck</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ shipmentStatistics.shipped }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Shipped Orders</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-airplane</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ shipmentStatistics.inTransit }}</h3>
                  <p class="text-body-2 text-blue-darken-1">In Transit</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ shipmentStatistics.delivered }}</h3>
                  <p class="text-body-2 text-green-darken-1">Delivered</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-clock-alert</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ shipmentStatistics.delayed }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Delayed</p>
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
                  label="Search shipments..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="statusFilter"
                  label="Status"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="carrierFilter"
                  label="Carrier"
                  :items="carrierOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="startDate"
                  label="Ship Date From"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="endDate"
                  label="Ship Date To"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="1">
                <v-btn
                  color="purple-darken-2"
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
  
        <!-- Shipments Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-purple-lighten-5">
            <v-icon class="me-2" color="purple-darken-3">mdi-truck</v-icon>
            Shipments Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredShipments"
            :loading="orderStore.loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'shippedDate', order: 'desc' }]"
          >
            <template v-slot:item.shippedDate="{ item }">
              {{ formatDate(item.shippedDate) }}
            </template>
  
            <template v-slot:item.estimatedDeliveryDate="{ item }">
              <div>
                {{ formatDate(item.estimatedDeliveryDate) }}
                <v-chip
                  v-if="isDelayed(item.estimatedDeliveryDate)"
                  color="red"
                  size="x-small"
                  class="ml-2"
                >
                  DELAYED
                </v-chip>
              </div>
            </template>
  
            <template v-slot:item.actualDeliveryDate="{ item }">
              {{ item.actualDeliveryDate ? formatDate(item.actualDeliveryDate) : 'Pending' }}
            </template>
  
            <template v-slot:item.totalAmount="{ item }">
              {{ formatCurrency(item.totalAmount, item.currency) }}
            </template>
  
            <template v-slot:item.shipmentStatus="{ item }">
              <v-chip
                :color="getShipmentStatusColor(item.shipmentStatus)"
                size="small"
                variant="flat"
              >
                {{ item.shipmentStatus }}
              </v-chip>
            </template>
  
            <template v-slot:item.carrierName="{ item }">
              <div class="d-flex align-center">
                <v-icon :color="getCarrierColor(item.carrierName)" size="small" class="me-2">
                  {{ getCarrierIcon(item.carrierName) }}
                </v-icon>
                {{ item.carrierName }}
              </div>
            </template>
  
            <template v-slot:item.trackingNumber="{ item }">
              <div class="d-flex align-center">
                <span class="font-weight-medium">{{ item.trackingNumber }}</span>
                <v-btn
                  icon="mdi-content-copy"
                  variant="text"
                  size="x-small"
                  @click="copyToClipboard(item.trackingNumber)"
                  class="ml-2"
                />
              </div>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-eye"
                variant="text"
                size="small"
                color="primary"
                @click="viewShipment(item)"
              />
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editShipment(item)"
              />
              <v-btn
                icon="mdi-truck-check"
                variant="text"
                size="small"
                color="green"
                @click="markAsDelivered(item)"
                v-if="item.shipmentStatus !== 'delivered'"
              />
              <v-btn
                icon="mdi-email"
                variant="text"
                size="small"
                color="blue"
                @click="sendTrackingEmail(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create Shipment Dialog -->
        <v-dialog v-model="createShipmentDialog" max-width="600px">
          <v-card>
            <v-card-title class="pa-6 bg-purple-lighten-5">
              <v-icon class="me-2" color="purple-darken-3">mdi-truck-plus</v-icon>
              Create New Shipment
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="createShipmentForm" v-model="createShipmentValid">
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="newShipmentData.orderId"
                      label="Select Order to Ship"
                      :items="availableOrders"
                      item-title="orderNumber"
                      item-value="orderId"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newShipmentData.trackingNumber"
                      label="Tracking Number"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-barcode"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="newShipmentData.carrier"
                      label="Shipping Carrier"
                      :items="carrierOptions"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="newShipmentData.estimatedDelivery"
                      label="Estimated Delivery"
                      type="date"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="newShipmentData.notes"
                      label="Shipping Notes"
                      rows="3"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
  
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                text
                @click="createShipmentDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="purple-darken-2"
                variant="elevated"
                @click="confirmCreateShipment"
                :disabled="!createShipmentValid"
                :loading="creating"
              >
                Create Shipment
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Edit Shipment Dialog -->
        <v-dialog v-model="editShipmentDialog" max-width="600px">
          <v-card>
            <v-card-title class="pa-6 bg-purple-lighten-5">
              <v-icon class="me-2" color="purple-darken-3">mdi-pencil</v-icon>
              Edit Shipment
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="editShipmentForm" v-model="editShipmentValid">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editShipmentData.trackingNumber"
                      label="Tracking Number"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-barcode"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="editShipmentData.carrier"
                      label="Shipping Carrier"
                      :items="carrierOptions"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="editShipmentData.shipmentStatus"
                      label="Shipment Status"
                      :items="statusOptions"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editShipmentData.estimatedDelivery"
                      label="Estimated Delivery"
                      type="date"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editShipmentData.actualDelivery"
                      label="Actual Delivery"
                      type="date"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editShipmentData.notes"
                      label="Shipping Notes"
                      rows="3"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
  
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                text
                @click="editShipmentDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="purple-darken-2"
                variant="elevated"
                @click="confirmEditShipment"
                :disabled="!editShipmentValid"
                :loading="updating"
              >
                Update Shipment
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Shipment Details Dialog -->
        <v-dialog v-model="shipmentDetailsDialog" max-width="800px">
          <v-card v-if="selectedShipment">
            <v-card-title class="pa-6 bg-purple-lighten-5">
              <v-icon class="me-2" color="purple-darken-3">mdi-truck</v-icon>
              Shipment Details - {{ selectedShipment.trackingNumber }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card class="pa-4 mb-4">
                    <h3 class="text-h6 mb-3">Shipment Information</h3>
                    <div class="mb-2">
                      <strong>Tracking Number:</strong> {{ selectedShipment.trackingNumber }}
                    </div>
                    <div class="mb-2">
                      <strong>Carrier:</strong> {{ selectedShipment.carrier }}
                    </div>
                    <div class="mb-2">
                      <strong>Status:</strong>
                      <v-chip
                        :color="getShipmentStatusColor(selectedShipment.shipmentStatus)"
                        size="small"
                        class="ml-2"
                      >
                        {{ selectedShipment.shipmentStatus }}
                      </v-chip>
                    </div>
                    <div class="mb-2">
                      <strong>Shipped Date:</strong> {{ formatDate(selectedShipment.shippedDate) }}
                    </div>
                    <div class="mb-2">
                      <strong>Estimated Delivery:</strong> {{ formatDate(selectedShipment.estimatedDelivery) }}
                    </div>
                    <div class="mb-2">
                      <strong>Actual Delivery:</strong> 
                      {{ selectedShipment.actualDelivery ? formatDate(selectedShipment.actualDelivery) : 'Pending' }}
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card class="pa-4 mb-4">
                    <h3 class="text-h6 mb-3">Order Information</h3>
                    <div class="mb-2">
                      <strong>Order Number:</strong> {{ selectedShipment.orderNumber }}
                    </div>
                    <div class="mb-2">
                      <strong>Customer:</strong> {{ selectedShipment.customerEmail }}
                    </div>
                    <div class="mb-2">
                      <strong>Total Amount:</strong> {{ formatCurrency(selectedShipment.totalAmount, selectedShipment.currency) }}
                    </div>
                    <div class="mb-2">
                      <strong>Shipping Address:</strong><br>
                      {{ selectedShipment.shippingAddress }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>
              <v-card class="pa-4" v-if="selectedShipment.notes">
                <h3 class="text-h6 mb-3">Notes</h3>
                <p>{{ selectedShipment.notes }}</p>
              </v-card>
            </v-card-text>
  
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                text
                @click="shipmentDetailsDialog = false"
              >
                Close
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
  import { useShipmentStore } from '@/stores/shipment'
  const orderStore = useShipmentStore()
  const snackbar = useSnackbarStore()
  
  // Data
  const search = ref('')
  const statusFilter = ref('all')
  const carrierFilter = ref('all')
  const startDate = ref('')
  const endDate = ref('')
  const createShipmentDialog = ref(false)
  const editShipmentDialog = ref(false)
  const shipmentDetailsDialog = ref(false)
  const createShipmentValid = ref(false)
  const editShipmentValid = ref(false)
  const creating = ref(false)
  const updating = ref(false)
  const selectedShipment = ref<any>(null)
  
  // New shipment data
  const newShipmentData = ref({
    orderId: '',
    trackingNumber: '',
    carrier: '',
    estimatedDelivery: '',
    notes: ''
  })
  
  // Edit shipment data
  const editShipmentData = ref({
    trackingNumber: '',
    carrier: '',
    shipmentStatus: '',
    estimatedDelivery: '',
    actualDelivery: '',
    notes: ''
  })
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Shipped', value: 'shipped' },
    { title: 'In Transit', value: 'in_transit' },
    { title: 'Delivered', value: 'delivered' },
    { title: 'Delayed', value: 'delayed' }
  ]
  
  const carrierOptions = [
    { title: 'All', value: 'all' },
    { title: 'DHL Express', value: 'DHL Express' },
    { title: 'FedEx', value: 'FedEx' },
    { title: 'UPS', value: 'UPS' },
    { title: 'USPS', value: 'USPS' },
    { title: 'Local Courier', value: 'Local Courier' },
    { title: 'Air Mail', value: 'Air Mail' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Order #', key: 'orderNumber' },
    { title: 'Customer', key: 'customerEmail' },
    { title: 'Tracking #', key: 'trackingNumber' },
    { title: 'Carrier', key: 'carrier' },
    { title: 'Shipped Date', key: 'shippedDate' },
    { title: 'Est. Delivery', key: 'estimatedDelivery' },
    { title: 'Actual Delivery', key: 'actualDelivery' },
    { title: 'Status', key: 'shipmentStatus' },
    { title: 'Amount', key: 'totalAmount' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required'
  }
  
  // Computed properties
  const filteredShipments = computed(() => {
    let filtered = orderStore.getShipments.filter(order => 
      order.shipmentStatus.toLowerCase() === 'shipped' || 
      order.shipmentStatus.toLowerCase() === 'delivered'
    )
  
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter((order: { shipmentStatus: string }) => 
        order.shipmentStatus?.toLowerCase() === statusFilter.value
      )
    }
  
    if (carrierFilter.value !== 'all') {
      filtered = filtered.filter((order) => 
        order.carrierName === carrierFilter.value
      )
    }
  
    if (startDate.value && endDate.value) {
      filtered = filtered.filter((order: { shippedDate: string | number | Date }) => {
        const shippedDate = new Date(order.shippedDate)
        return shippedDate >= new Date(startDate.value) && shippedDate <= new Date(endDate.value)
      })
    }
  
    return filtered
  })
  
  const availableOrders = computed(() => {
    return orderStore.shipments.filter(order => 
      order.shipmentStatus.toLowerCase() === 'pending'
    )
  })
  
  const shipmentStatistics = computed(() => {
    const shipments = filteredShipments.value
    return {
      shipped: shipments.filter(s => s.shipmentStatus === 'shipped').length,
      inTransit: shipments.filter(s => s.shipmentStatus === 'in_transit').length,
      delivered: shipments.filter(s => s.shipmentStatus === 'delivered').length,
      delayed: shipments.filter(s => isDelayed(s.estimatedDeliveryDate)).length
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
  
  const isDelayed = (estimatedDelivery: string) => {
    const deliveryDate = new Date(estimatedDelivery)
    const currentDate = new Date()
    return deliveryDate < currentDate
  }
  
  const getShipmentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'shipped': return 'purple'
      case 'in_transit': return 'blue'
      case 'delivered': return 'green'
      case 'delayed': return 'red'
      default: return 'grey'
    }
  }
  
  const getCarrierColor = (carrier: string) => {
    switch (carrier) {
      case 'DHL Express': return 'yellow-darken-2'
      case 'FedEx': return 'purple-darken-2'
      case 'UPS': return 'brown'
      case 'USPS': return 'blue-darken-2'
      default: return 'grey'
    }
  }
  
  const getCarrierIcon = (carrier: string) => {
    switch (carrier) {
      case 'DHL Express':
      case 'FedEx':
      case 'UPS': return 'mdi-airplane'
      case 'USPS': return 'mdi-email'
      case 'Local Courier': return 'mdi-truck'
      default: return 'mdi-package'
    }
  }
  
  const openCreateShipmentDialog = () => {
    createShipmentDialog.value = true
  }
  
  const viewShipment = (item: any) => {
    selectedShipment.value = item
    shipmentDetailsDialog.value = true
  }
  
  const editShipment = (item: any) => {
    selectedShipment.value = item
    editShipmentData.value = {
      trackingNumber: item.trackingNumber,
      carrier: item.carrier,
      shipmentStatus: item.shipmentStatus,
      estimatedDelivery: item.estimatedDelivery?.split('T')[0] || '',
      actualDelivery: item.actualDelivery?.split('T')[0] || '',
      notes: item.notes || ''
    }
    editShipmentDialog.value = true
  }
  
  const confirmCreateShipment = async () => {
    creating.value = true
    
    try {
      const response = await orderStore.createShipment(newShipmentData.value)
      if (response.isSuccessful) {
        snackbar.success('Shipment created successfully')
        createShipmentDialog.value = false
        
        // Reset form
        newShipmentData.value = {
          orderId: '',
          trackingNumber: '',
          carrier: '',
          estimatedDelivery: '',
          notes: ''
        }
        
        await orderStore.fetchShipments()
      } else {
        snackbar.error('Error creating shipment')
      }
    } catch (error) {
      console.error('Error creating shipment:', error)
      snackbar.error('Error creating shipment')
    } finally {
      creating.value = false
    }
  }
  
  const confirmEditShipment = async () => {
    updating.value = true
    
    try {
      const response = await orderStore.updateShipment(selectedShipment.value.orderId, editShipmentData.value)
      if (response.isSuccessful) {
        snackbar.success('Shipment updated successfully')
        editShipmentDialog.value = false
        await orderStore.fetchShipments()
      } else {
        snackbar.error('Error updating shipment')
      }
    } catch (error) {
      console.error('Error updating shipment:', error)
      snackbar.error('Error updating shipment')
    } finally {
      updating.value = false
    }
  }
  
  const markAsDelivered = async (item: any) => {
    try {
      const response = await orderStore.markAsDelivered(item.orderId)
      if (response.isSuccessful) {
        snackbar.success('Shipment marked as delivered')
        await orderStore.fetchShipments()
      } else {
        snackbar.error('Error marking shipment as delivered')
      }
    } catch (error) {
      console.error('Error marking as delivered:', error)
      snackbar.error('Error marking shipment as delivered')
    }
  }
  
  const sendTrackingEmail = async (item: any) => {
    try {
      const response = await orderStore.sendTrackingEmail(item.orderId)
      if (response.isSuccessful) {
        snackbar.success('Tracking email sent successfully')
      } else {
        snackbar.error('Error sending tracking email')
      }
    } catch (error) {
      console.error('Error sending tracking email:', error)
      snackbar.error('Error sending tracking email')
    }
  }
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      snackbar.success('Tracking number copied to clipboard')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      snackbar.error('Error copying to clipboard')
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
    carrierFilter.value = 'all'
    startDate.value = ''
    endDate.value = ''
  }
  
  onMounted(async () => {
    try {
      await orderStore.fetchShipments()
    } catch (error) {
      console.error('Error fetching orders:', error)
      snackbar.error('Error loading orders')
    }
  })
  </script>
  
  <style scoped>
  .shipments-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>