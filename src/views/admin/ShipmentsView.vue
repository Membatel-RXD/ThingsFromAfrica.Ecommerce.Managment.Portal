<template>
  <div class="shipments-view">
    <v-container fluid class="pa-6">
      <!-- Debug Information -->
     
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
                item-value="shippingMethodId"
                item-title="methodName"
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
        
        <!-- Show loading state -->
        <v-progress-linear v-if="orderStore.loading" indeterminate color="purple"></v-progress-linear>
        
        <!-- Show empty state -->
        <div v-if="!orderStore.loading && (!orderStore.shipments || orderStore.shipments.length === 0)" class="pa-6 text-center">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-truck-outline</v-icon>
          <h3 class="text-h6 mb-2">No Shipments Found</h3>
          <p class="text-body-2 text-grey-darken-1">
            No shipment data is available. This could be due to:
          </p>
          <ul class="text-left mt-3 mb-4">
            <li>API endpoint not returning data</li>
            <li>Network connectivity issues</li>
            <li>Store state not properly initialized</li>
            <li>Data structure mismatch</li>
          </ul>
          <v-btn color="purple-darken-2" @click="refreshData">
            <v-icon left>mdi-refresh</v-icon>
            Refresh Data
          </v-btn>
        </div>
        
        <v-data-table
          v-else
          :headers="headers"
          :items="filteredShipments"
          :loading="orderStore.loading"
          :search="search"
          class="elevation-1"
          :sort-by="[{ key: 'shippedDate', order: 'desc' }]"
          :no-data-text="'No shipments match your search criteria'"
        >
          <template v-slot:[`item.shippedDate`]="{ item }">
            {{ item.shippedDate ? formatDate(item.shippedDate) : 'N/A' }}
          </template>

          <template v-slot:[`item.estimatedDeliveryDate`]="{ item }">
            <div>
              {{ item.estimatedDeliveryDate ? formatDate(item.estimatedDeliveryDate) : 'N/A' }}
              <v-chip
                v-if="item.estimatedDeliveryDate && isDelayed(item.estimatedDeliveryDate)"
                color="red"
                size="x-small"
                class="ml-2"
              >
                DELAYED
              </v-chip>
            </div>
          </template>
          <template #[`item.actualDeliveryDate`]="{ item }">
            {{ item.actualDeliveryDate ? formatDate(item.actualDeliveryDate) : 'Pending' }}
          </template>

          <template #[`item.totalAmount`]="{ item }">
            {{ formatCurrency(item.totalAmount || 0, item.currency || 'USD') }}
          </template>

          <template #[`item.shipmentStatus`]="{ item }">
            <v-chip
              :color="getShipmentStatusColor(item.shipmentStatus)"
              size="small"
              variant="flat"
            >
              {{ item.shipmentStatus || 'Unknown' }}
            </v-chip>
          </template>

          <template #[`item.carrierName`]="{ item }">
            <div class="d-flex align-center">
              <v-icon :color="getCarrierColor(item.carrierName)" size="small" class="me-2">
                {{ getCarrierIcon(item.carrierName) }}
              </v-icon>
              {{ item.carrierName || 'Unknown' }}
            </div>
          </template>

          <template #[`item.trackingNumber`]="{ item }">
            <div class="d-flex align-center">
              <span class="font-weight-medium">{{ item.trackingNumber || 'N/A' }}</span>
              <v-btn
                v-if="item.trackingNumber"
                icon="mdi-content-copy"
                variant="text"
                size="x-small"
                @click="copyToClipboard(item.trackingNumber)"
                class="ml-2"
              />
            </div>
          </template>

          <template #[`item.actions`]="{ item }">
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
          </template>

        </v-data-table>
      </v-card>

      <!-- Edit Shipment Dialog -->
      <v-dialog v-model="editShipmentDialog" max-width="800px">
        <v-card>
          <v-card-title class="pa-6 bg-purple-lighten-5">
            <v-icon class="me-2" color="purple-darken-3">mdi-pencil</v-icon>
            Edit Shipment
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form ref="editShipmentForm" v-model="editShipmentValid">
              <v-row>
                <v-col cols="12" md="6">
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
                    v-model="editShipmentData.shippingMethodId"
                    label="Shipping Carrier"
                    :items="carrierOptions"
                    item-value="shippingMethodId"
                    item-title="methodName"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="editShipmentData.carrierName"
                    label="Shipping Carrier"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editShipmentData.shipmentStatus"
                    label="Shipment Status"
                    :items="statusOptions.filter(option => option.value !== 'all')"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editShipmentData.shippingLabelUrl"
                    label="Shipping Label URL"
                    variant="outlined"
                    prepend-inner-icon="mdi-link"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editShipmentData.packageWeight"
                    label="Package Weight (kg)"
                    type="number"
                    variant="outlined"
                    prepend-inner-icon="mdi-weight"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editShipmentData.packageLength"
                    label="Length (cm)"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editShipmentData.packageWidth"
                    label="Width (cm)"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editShipmentData.packageHeight"
                    label="Height (cm)"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editShipmentData.shippedDate"
                    label="Shipped Date"
                    type="date"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editShipmentData.estimatedDeliveryDate"
                    label="Estimated Delivery"
                    type="date"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editShipmentData.actualDeliveryDate"
                    label="Actual Delivery"
                    type="date"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="editShipmentData.requiresPhytosanitaryCertificate"
                    label="Requires Phytosanitary Certificate"
                    color="purple-darken-2"
                  />
                </v-col>
                <v-col cols="12" md="6" v-if="editShipmentData.requiresPhytosanitaryCertificate">
                  <v-text-field
                    v-model="editShipmentData.phytosanitaryCertificateNumber"
                    label="Phytosanitary Certificate Number"
                    variant="outlined"
                    prepend-inner-icon="mdi-certificate"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editShipmentData.customsDeclarationNumber"
                    label="Customs Declaration Number"
                    variant="outlined"
                    prepend-inner-icon="mdi-file-document"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="editShipmentData.packagingNotes"
                    label="Packaging Notes"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-note-text"
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
              :loading="updating"
            >
              Update Shipment
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
import { type ShipmentDTO } from '@/stores/types/member'
import { useShippingMethodStore } from '@/stores/shippingMethod'

const orderStore = useShipmentStore()
const snackbar = useSnackbarStore()

// Data
const search = ref('')
const statusFilter = ref('all')
const carrierFilter = ref()
const startDate = ref('')
const endDate = ref('')
const createShipmentDialog = ref(false)
const editShipmentDialog = ref(false)
const editShipmentValid = ref(true)
const updating = ref(false)
const selectedShipment = ref<ShipmentDTO>()
const shipmentMethod = useShippingMethodStore()

// Edit shipment data with all fields and default values
const editShipmentData = ref<{
  trackingNumber: string
  shippingMethodId: number | null 
  carrierName: string
  shippingLabelUrl: string
  shipmentStatus: string
  packageWeight: number | null
  packageLength: number | null
  packageWidth: number | null
  packageHeight: number | null
  packagingNotes: string
  requiresPhytosanitaryCertificate: boolean
  phytosanitaryCertificateNumber: string
  customsDeclarationNumber: string
  shippedDate: string
  estimatedDeliveryDate: string
  actualDeliveryDate: string
  createdAt: string
  createdBy: number | null
  orderIds: number[]
}>({
  trackingNumber: '',
  shippingMethodId: null,
  carrierName: '',
  shippingLabelUrl: '',
  shipmentStatus: 'shipped',
  packageWeight: null,
  packageLength: null,
  packageWidth: null,
  packageHeight: null,
  packagingNotes: '',
  requiresPhytosanitaryCertificate: false,
  phytosanitaryCertificateNumber: '',
  customsDeclarationNumber: '',
  shippedDate: new Date().toISOString().split('T')[0],
  estimatedDeliveryDate: '',
  actualDeliveryDate: '',
  createdAt: new Date().toISOString(),
  createdBy: null,   // ✅ use null as the initial value
  orderIds: []
})


// Options
const statusOptions = [
  { title: 'All', value: 'all' },
  { title: 'Shipped', value: 'shipped' },
  { title: 'In Transit', value: 'in_transit' },
  { title: 'Delivered', value: 'delivered' },
  { title: 'Delayed', value: 'delayed' }
]

const carrierOptions = computed(() => shipmentMethod.shippingMethods || [])

// Table headers
const headers = [
  { title: 'Order #', key: 'orderNumber' },
  { title: 'Customer', key: 'customerEmail' },
  { title: 'Tracking #', key: 'trackingNumber' },
  { title: 'Carrier', key: 'carrierName' },
  { title: 'Shipped Date', key: 'shippedDate' },
  { title: 'Est. Delivery', key: 'estimatedDeliveryDate' },
  { title: 'Actual Delivery', key: 'actualDeliveryDate' },
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
  if (!orderStore.shipments || !Array.isArray(orderStore.shipments)) {
    console.warn('Shipments data is not an array:', orderStore.shipments)
    return []
  }

  let filtered = [...orderStore.shipments]
  
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter((order: any) => 
      order.shipmentStatus?.toLowerCase() === statusFilter.value
    )
  }

  if (carrierFilter.value && carrierFilter.value !== 'all') {
    filtered = filtered.filter((order: any) => 
      order.shippingMethodId === carrierFilter.value
    )
  }

  if (startDate.value && endDate.value) {
    filtered = filtered.filter((order: any) => {
      if (!order.shippedDate) return false
      const shippedDate = new Date(order.shippedDate)
      return shippedDate >= new Date(startDate.value) && shippedDate <= new Date(endDate.value)
    })
  }

  return filtered
})

const shipmentStatistics = computed(() => {
  const shipments = filteredShipments.value
  return {
    shipped: shipments.filter(s => s.shipmentStatus?.toLowerCase() === 'shipped').length,
    inTransit: shipments.filter(s => s.shipmentStatus?.toLowerCase() === 'in transit').length,
    delivered: shipments.filter(s => s.shipmentStatus?.toLowerCase() === 'delivered').length,
    delayed: shipments.filter(s => s.estimatedDeliveryDate && isDelayed(s.estimatedDeliveryDate)).length
  }
})

// Helper function to format date for input fields
const formatDateForInput = (dateString: string | null | undefined) => {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'Invalid Date'
  }
}

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount || 0)
  } catch (error) {
    console.error('Error formatting currency:', amount, currency, error)
    return `${currency || 'USD'} ${amount || 0}`
  }
}

const isDelayed = (estimatedDelivery: string) => {
  if (!estimatedDelivery) return false
  try {
    const deliveryDate = new Date(estimatedDelivery)
    const currentDate = new Date()
    return deliveryDate < currentDate
  } catch (error) {
    console.error('Error checking if delayed:', estimatedDelivery, error)
    return false
  }
}

const getShipmentStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'shipped': return 'purple'
    case 'in transit': 
    case 'in transit': return 'blue'
    case 'delivered': return 'green'
    case 'delayed': return 'red'
    default: return 'grey'
  }
}

const getCarrierColor = (carrier: string) => {
  if (!carrier) return 'grey'
  switch (carrier.toLowerCase()) {
    case 'dhl express': return 'yellow-darken-2'
    case 'fedex': return 'purple-darken-2'
    case 'ups': return 'brown'
    case 'usps': return 'blue-darken-2'
    default: return 'grey'
  }
}

const getCarrierIcon = (carrier: string) => {
  if (!carrier) return 'mdi-package'
  switch (carrier.toLowerCase()) {
    case 'dhl express':
    case 'fedex':
    case 'ups': return 'mdi-airplane'
    case 'usps': return 'mdi-email'
    case 'local courier': return 'mdi-truck'
    default: return 'mdi-package'
  }
}

const openCreateShipmentDialog = () => {
  createShipmentDialog.value = true
}

const editShipment = (item: ShipmentDTO) => {
  selectedShipment.value = item
  // Populate all fields with existing data or defaults
  editShipmentData.value = {
    trackingNumber: item.trackingNumber || '',
    shippingMethodId: item.shippingMethodId || null,
    carrierName: item.carrierName || '',
    shippingLabelUrl: item.shippingLabelUrl || '',
    shipmentStatus: item.shipmentStatus || 'shipped',
    packageWeight: item.packageWeight || null,
    packageLength: item.packageLength || null,
    packageWidth: item.packageWidth || null,
    packageHeight: item.packageHeight || null,
    packagingNotes: item.packagingNotes || '',
    requiresPhytosanitaryCertificate: item.requiresPhytosanitaryCertificate || false,
    phytosanitaryCertificateNumber: item.phytosanitaryCertificateNumber || '',
    customsDeclarationNumber: item.customsDeclarationNumber || '',
    shippedDate: formatDateForInput(item.shippedDate) || new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: formatDateForInput(item.estimatedDeliveryDate) || '',
    actualDeliveryDate: formatDateForInput(item.actualDeliveryDate) || '',
    createdAt: item.createdAt || new Date().toISOString(),
    orderIds: [item.orderId],
    createdBy: item.createdBy || 0,
  }
  editShipmentDialog.value = true
}

const confirmEditShipment = async () => {
  if (!selectedShipment.value) return
  
  updating.value = true
  
  try {
    const response = await orderStore.updateShipment(selectedShipment.value.shipmentId, editShipmentData.value)
    if (response?.isSuccessful) {
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
    // const response = await orderStore.markAsDelivered(item.orderId)
    // if (response?.isSuccessful) {
      snackbar.success('Shipment marked as delivered')
      await orderStore.fetchShipments()
  
  } catch (error) {
    console.error('Error marking as delivered:', error)
    snackbar.error('Error marking shipment as delivered')
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
  carrierFilter.value = undefined
  startDate.value = ''
  endDate.value = ''
}

const refreshData = async () => {
  try {
    console.log('Refreshing shipment data...')
    await orderStore.fetchShipments()
    await shipmentMethod.fetchShippingMethods()
  } catch (error) {
    console.error('Error refreshing data:', error)
    snackbar.error('Error refreshing data')
  }
}

onMounted(async () => {
  console.log('Component mounted, fetching data...')
  try {
    await orderStore.fetchShipments()
    await shipmentMethod.fetchShippingMethods()
    console.log('Data fetched successfully')
  } catch (error) {
    console.error('Error fetching data on mount:', error)
    snackbar.error('Error loading data')
  }
})
</script>

<style scoped>
.shipments-view {
  background-color: #fafafa;
  min-height: 100vh;
}

details summary {
  cursor: pointer;
  padding: 4px;
  background: #f5f5f5;
  border-radius: 4px;
}

details pre {
  background: #f8f8f8;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}
</style>