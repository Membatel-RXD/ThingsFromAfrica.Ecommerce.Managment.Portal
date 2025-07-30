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
          v-model="selectedOrders"
          return-object
          show-select
          class="elevation-1"
          :sort-by="[{ key: 'orderDate', order: 'asc' }]"
          item-value="orderId"
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
              @click="openCancelDialog(item)"
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

      <!-- Order View Dialog -->
      <v-dialog v-model="viewDialog" max-width="900px">
        <v-card v-if="viewingOrder">
          <v-card-title class="pa-6 bg-primary-lighten-5 d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-eye-outline</v-icon>
            Order Details - {{ viewingOrder.orderNumber }}
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Order Information</h3>
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Order Number</v-list-item-title>
                    <v-list-item-subtitle>{{ viewingOrder.orderNumber }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Order Date</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(viewingOrder.orderDate) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Status</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip color="orange" size="small">{{ viewingOrder.orderStatus }}</v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Total Amount</v-list-item-title>
                    <v-list-item-subtitle>{{ formatCurrency(viewingOrder.totalAmount, viewingOrder.currency) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Customer Information</h3>
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ viewingOrder.customerEmail }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Order Type</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip :color="viewingOrder.isTouristOrder ? 'blue' : 'grey'" size="small">
                        {{ viewingOrder.isTouristOrder ? 'Tourist' : 'Local' }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Priority</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip :color="getPriorityColor(viewingOrder)" size="small">
                        {{ getPriorityText(viewingOrder) }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Requires Certificate</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon :color="viewingOrder.requiresPhytosanitaryCertificate ? 'green' : 'grey'">
                        {{ viewingOrder.requiresPhytosanitaryCertificate ? 'mdi-check' : 'mdi-close' }}
                      </v-icon>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

            
            </v-row>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn text @click="viewDialog = false">Close</v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Ship Orders Dialog -->
      <v-dialog v-model="shipDialog" max-width="800px">
        <v-card>
          <v-card-title class="pa-6 bg-purple-lighten-5">
            <v-icon class="me-2" color="purple-darken-3">mdi-truck</v-icon>
            Ship Orders
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form ref="shipForm" v-model="shipValid">
              <v-row dense>
                <v-col cols="12" md="6">
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
                    v-model="shipmentData.shippingMethodId"
                    label="Shipping Carrier"
                    :items="carrierOptions"
                    item-title="methodName"
                    item-value="shippingMethodId"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shipmentData.carrierName"
                    label="Carrier Name"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shipmentData.shippingLabelUrl"
                    label="Shipping Label URL"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="shipmentData.shipmentStatus"
                    label="Shipment Status"
                    :items="['Pending', 'Shipped', 'In Transit', 'Delivered']"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="shipmentData.packageWeight"
                    label="Weight (kg)"
                    type="number"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="shipmentData.packageLength"
                    label="Length (cm)"
                    type="number"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="shipmentData.packageWidth"
                    label="Width (cm)"
                    type="number"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="shipmentData.packageHeight"
                    label="Height (cm)"
                    type="number"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="shipmentData.packagingNotes"
                    label="Packaging Notes"
                    rows="2"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-checkbox
                    v-model="shipmentData.requiresPhytosanitaryCertificate"
                    label="Requires Phytosanitary Certificate"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shipmentData.phytosanitaryCertificateNumber"
                    label="Phytosanitary Certificate No."
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shipmentData.customsDeclarationNumber"
                    label="Customs Declaration No."
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shipmentData.shippedDate"
                    label="Shipped Date"
                    type="date"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shipmentData.estimatedDeliveryDate"
                    label="Estimated Delivery"
                    type="date"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shipmentData.actualDeliveryDate"
                    label="Actual Delivery Date"
                    type="date"
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
                    <v-chip size="small">
                      {{ formatCurrency(order.totalAmount, order.currency) }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn text @click="shipDialog = false">Cancel</v-btn>
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

      <!-- Cancel Order Confirmation Dialog -->
      <v-dialog v-model="cancelDialog" max-width="500px">
        <v-card>
          <v-card-title class="pa-6 bg-warning-lighten-5 d-flex align-center">
            <v-icon class="me-2" color="warning">mdi-alert-circle</v-icon>
            Cancel Order
          </v-card-title>

          <v-card-text class="pa-6">
            <p class="text-body-1 mb-4">
              Are you sure you want to cancel the following order?
            </p>
            
            <v-card v-if="orderToCancel" variant="outlined" class="pa-4">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <h4 class="text-h6">{{ orderToCancel.orderNumber }}</h4>
                  <p class="text-body-2 text-grey-darken-1">{{ orderToCancel.customerEmail }}</p>
                </div>
                <v-chip color="primary" size="small">
                  {{ formatCurrency(orderToCancel.totalAmount, orderToCancel.currency) }}
                </v-chip>
              </div>
            </v-card>

            <v-alert type="warning" variant="tonal" class="mt-4">
              This action cannot be undone. The customer will be notified of the cancellation.
            </v-alert>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn text @click="cancelDialog = false">Keep Order</v-btn>
            <v-btn
              color="warning"
              variant="elevated"
              @click="confirmCancelOrder"
              :loading="cancelling"
            >
              Cancel Order
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
import { useShippingMethodStore } from '@/stores/shippingMethod'
import { useShipmentStore } from '@/stores/shipment'

const orderStore = useOrderStore()
const shipmentStore = useShipmentStore()
const snackbar = useSnackbarStore()
const shipmentMethod = useShippingMethodStore()

// Data
const search = ref('')
const priorityFilter = ref('all')
const touristFilter = ref('all')
const startDate = ref('')
const endDate = ref('')
const selectedOrders = ref<OrderDto[]>([])
const shipDialog = ref(false)
const viewDialog = ref(false)
const priorityDialog = ref(false)
const cancelDialog = ref(false)
const shipValid = ref(false)
const shipping = ref(false)
const cancelling = ref(false)
const ordersToShip = ref<OrderDto[]>([])
const viewingOrder = ref<OrderDto | null>(null)
const orderToCancel = ref<OrderDto | null>(null)
const currentOrderForPriority = ref<OrderDto | null>(null)
const selectedPriority = ref('')

// Shipment data
const shipmentData = ref({
  trackingNumber: '',
  shippingMethodId: null,
  carrierName: '',
  shippingLabelUrl: '',
  shipmentStatus: 'Pending',
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
  createdBy: null,
  orderIds: [] as number[]
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

const carrierOptions = computed(()=>shipmentMethod.shippingMethods)

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
  viewingOrder.value = item
  viewDialog.value = true
}

const editOrder = (item: OrderDto) => {
  // Implementation for editing order - close view dialog if open
  viewDialog.value = false
  // Navigate to edit page or open edit dialog
  console.log('Edit order:', item)
  snackbar.info('Edit functionality to be implemented')
}

const bulkShipSelected = () => {
  if (selectedOrders.value.length === 0) {
    snackbar.info('Please select orders to ship')
    return
  }
  
  ordersToShip.value = [...selectedOrders.value]
  resetShipmentData()
  shipDialog.value = true
}

const shipSingleOrder = (item: OrderDto) => {
  ordersToShip.value = [item]
  resetShipmentData()
  shipDialog.value = true
}

const resetShipmentData = () => {
  shipmentData.value = {
    trackingNumber: '',
    shippingMethodId: null,
    carrierName: '',
    shippingLabelUrl: '',
    shipmentStatus: 'Pending',
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
    createdBy: null,
    orderIds: ordersToShip.value.map(order => order.orderId)
  }
}

const confirmShipOrders = async () => {
  if (!shipValid.value) {
    snackbar.error('Please fill in all required fields')
    return
  }

  shipping.value = true
  
  try {
    // Prepare shipment data with order IDs
    const shipmentPayload = {
      ...shipmentData.value,
      orderIds: ordersToShip.value.map(order => order.orderId)
    }

    // Create shipment using the shipment store
    const response = await shipmentStore.createShipment(shipmentPayload)
    
    if (response && response.isSuccessful) {
      // Update order statuses to shipped
      // for (const order of ordersToShip.value) {
      //   await orderStore.shipOrder(order.orderId)
      // }
      
      snackbar.success(`Successfully shipped ${ordersToShip.value.length} orders`)
      shipDialog.value = false
      selectedOrders.value = []
      ordersToShip.value = []
      
      // Refresh orders
      await orderStore.fetchOrders()
    } else {
      snackbar.error('Error creating shipment')
    }

  } catch (error) {
    console.error('Error shipping orders:', error)
    snackbar.error('Error shipping orders')
  } finally {
    shipping.value = false
  }
}

const openCancelDialog = (item: OrderDto) => {
  orderToCancel.value = item
  cancelDialog.value = true
}

const confirmCancelOrder = async () => {
  if (!orderToCancel.value) return

  cancelling.value = true
  
  try {
    const response = await orderStore.cancelOrder(orderToCancel.value.orderId)
    if (response.isSuccessful) {
      snackbar.success('Order cancelled successfully')
      cancelDialog.value = false
      orderToCancel.value = null
      
      // Refresh orders
      await orderStore.fetchOrders()
    } else {
      snackbar.error('Error cancelling order')
    }
  } catch (error) {
    console.error('Error cancelling order:', error)
    snackbar.error('Error cancelling order')
  } finally {
    cancelling.value = false
  }
}

const setPriority = (item: OrderDto) => {
  currentOrderForPriority.value = item
  selectedPriority.value = getPriorityLevel(item)
  priorityDialog.value = true
}

const confirmSetPriority = () => {
  if (currentOrderForPriority.value) {
    // Here you would typically call an API to update the priority
    // For now, we'll just show a success message
    snackbar.success('Priority updated successfully')
    priorityDialog.value = false
    currentOrderForPriority.value = null
    selectedPriority.value = ''
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
    await shipmentMethod.fetchShippingMethods()
  } catch (error) {
    console.error('Error fetching data:', error)
    snackbar.error('Error loading data')
  }
})
</script>

<style scoped>
.pending-orders-view {
  background-color: #fafafa;
  min-height: 100vh;
}
</style>