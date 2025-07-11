<template>
    <div class="orders-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-3">Orders Management</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage customer orders and track deliveries
            </p>
          </div>
          <v-btn
            color="orange-darken-2"
            variant="elevated"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Create Order
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-cart</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ orderStatistics.total }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Total Orders</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-clock-outline</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ orderStatistics.pending }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Pending Orders</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-truck</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ orderStatistics.shipped }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Shipped Orders</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ orderStatistics.delivered }}</h3>
                  <p class="text-body-2 text-green-darken-1">Delivered Orders</p>
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
                  label="Search orders..."
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
                  v-model="touristFilter"
                  label="Tourist Orders"
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
  
        <!-- Orders Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-cart</v-icon>
            Orders Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredOrders"
            :loading="orderStore.loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'orderDate', order: 'desc' }]"
          >
            <template v-slot:item.orderDate="{ item }">
              {{ formatDate(item.orderDate) }}
            </template>
  
            <template v-slot:item.totalAmount="{ item }">
              {{ formatCurrency(item.totalAmount, item.currency) }}
            </template>
  
            <template v-slot:item.orderStatus="{ item }">
              <v-chip
                :color="getStatusColor(item.orderStatus)"
                size="small"
                variant="flat"
              >
                {{ item.orderStatus }}
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
                @click="shipOrder(item)"
                v-if="!item.shippedDate"
              />
              <v-btn
                icon="mdi-check-circle"
                variant="text"
                size="small"
                color="green"
                @click="deliverOrder(item)"
                v-if="item.shippedDate && !item.deliveredDate"
              />
              <v-btn
                icon="mdi-cancel"
                variant="text"
                size="small"
                color="warning"
                @click="cancelOrder(item)"
                v-if="!item.deliveredDate"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deleteOrder(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <v-card-title class="pa-6 bg-orange-lighten-5">
              <v-icon class="me-2" color="orange-darken-3">mdi-cart</v-icon>
              {{ editMode ? 'Edit Order' : 'Create Order' }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                <!-- Customer Selection -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <v-card variant="outlined" class="pa-4">
                      <h3 class="text-h6 mb-3">Customer Selection</h3>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="selectedCustomerId"
                            label="Select Existing Customer"
                            :items="customerOptions"
                            item-title="text"
                            item-value="value"
                            variant="outlined"
                            clearable
                            @update:model-value="onCustomerSelect"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-switch
                            v-model="manualCustomerEntry"
                            label="Enter Customer Details Manually"
                            color="orange-darken-2"
                            @change="onManualEntryToggle"
                          />
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Customer Contact Information -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <v-card variant="outlined" class="pa-4">
                      <h3 class="text-h6 mb-3">Customer Contact</h3>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.customerEmail"
                            label="Customer Email"
                            :rules="[rules.required, rules.email]"
                            variant="outlined"
                            prepend-inner-icon="mdi-email"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.customerPhone"
                            label="Customer Phone"
                            variant="outlined"
                            prepend-inner-icon="mdi-phone"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
  
                <!-- Billing Address -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <v-card variant="outlined" class="pa-4">
                      <h3 class="text-h6 mb-3">Billing Address</h3>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.billingFirstName"
                            label="First Name"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.billingLastName"
                            label="Last Name"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.billingCompany"
                            label="Company (Optional)"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.billingAddressLine1"
                            label="Address Line 1"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.billingAddressLine2"
                            label="Address Line 2 (Optional)"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.billingCity"
                            label="City"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.billingStateProvince"
                            label="State/Province"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.billingPostalCode"
                            label="Postal Code"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.billingCountryCode"
                            label="Country Code"
                            :rules="[
                            rules.required,
                            rules.exactLength(3),
                            rules.uppercaseOnly
                            ]"                            
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
  
                <!-- Shipping Address -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <v-card variant="outlined" class="pa-4">
                      <div class="d-flex justify-space-between align-center mb-3">
                        <h3 class="text-h6">Shipping Address</h3>
                        <v-btn
                          size="small"
                          variant="outlined"
                          color="orange-darken-2"
                          @click="copyBillingToShipping"
                          :disabled="!manualCustomerEntry && selectedCustomerId"
                        >
                          Copy from Billing
                        </v-btn>
                      </div>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.shippingFirstName"
                            label="First Name"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.shippingLastName"
                            label="Last Name"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.shippingCompany"
                            label="Company (Optional)"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.shippingAddressLine1"
                            label="Address Line 1"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.shippingAddressLine2"
                            label="Address Line 2 (Optional)"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.shippingCity"
                            label="City"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.shippingStateProvince"
                            label="State/Province"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.shippingPostalCode"
                            label="Postal Code"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.shippingCountryCode"
                            label="Country Code"
                            :rules="[rules.required]"
                            variant="outlined"
                            :disabled="!manualCustomerEntry && selectedCustomerId"
                          />
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
  
                <!-- Order Details -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <v-card variant="outlined" class="pa-4">
                      <h3 class="text-h6 mb-3">Order Details</h3>
                      <v-row>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model.number="formData.subTotal"
                            label="Subtotal"
                            type="number"
                            step="0.01"
                            :rules="[rules.required, rules.number]"
                            variant="outlined"
                            prefix="$"
                          />
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model.number="formData.taxAmount"
                            label="Tax Amount"
                            type="number"
                            step="0.01"
                            variant="outlined"
                            prefix="$"
                          />
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model.number="formData.shippingAmount"
                            label="Shipping Amount"
                            type="number"
                            step="0.01"
                            variant="outlined"
                            prefix="$"
                          />
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model.number="formData.discountAmount"
                            label="Discount Amount"
                            type="number"
                            step="0.01"
                            variant="outlined"
                            prefix="$"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model.number="formData.totalAmount"
                            label="Total Amount"
                            type="number"
                            step="0.01"
                            :rules="[rules.required, rules.number]"
                            variant="outlined"
                            prefix="$"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.currency"
                            label="Currency"
                            :rules="[rules.required]"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.requiredDate"
                            label="Required Date"
                            type="date"
                            variant="outlined"
                          />
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Additional Information -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <v-card variant="outlined" class="pa-4">
                      <h3 class="text-h6 mb-3">Additional Information</h3>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-switch
                            v-model="formData.isTouristOrder"
                            label="Tourist Order"
                            color="blue"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-switch
                            v-model="formData.requiresPhytosanitaryCertificate"
                            label="Requires Phytosanitary Certificate"
                            color="green"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select
                                v-model="formData.statusId"
                                label="Order Status"
                                :items="orderStatus"
                                item-title="statusName"
                                item-value="statusId"
                                variant="outlined"
                                density="compact"
                                hide-details
                                />
                        </v-col>
                        <v-col cols="12" md="6" v-if="formData.isTouristOrder">
                          <v-text-field
                            v-model="formData.touristCountry"
                            label="Tourist Country"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="formData.customerNotes"
                            label="Customer Notes"
                            rows="3"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="formData.adminNotes"
                            label="Admin Notes"
                            rows="3"
                            variant="outlined"
                          />
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
  
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                text
                @click="closeDialog"
              >
                Cancel
              </v-btn>
              <v-btn
                color="orange-darken-2"
                variant="elevated"
                @click="saveOrder"
                :disabled="!valid"
                :loading="saving"
              >
                {{ editMode ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- View Order Dialog -->
        <v-dialog v-model="viewDialog" max-width="800px">
          <v-card v-if="selectedOrder">
            <v-card-title class="pa-6 bg-orange-lighten-5">
              <v-icon class="me-2" color="orange-darken-3">mdi-eye</v-icon>
              Order Details - {{ selectedOrder.orderNumber }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-title>Customer Information</v-card-title>
                    <v-card-text>
                      <p><strong>Email:</strong> {{ selectedOrder.customerEmail }}</p>
                      <p><strong>Phone:</strong> {{ selectedOrder.customerPhone }}</p>
                      <p><strong>Order Date:</strong> {{ formatDate(selectedOrder.orderDate) }}</p>
                      <p><strong>Status:</strong> {{ selectedOrder.orderStatus }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-title>Order Summary</v-card-title>
                    <v-card-text>
                      <p><strong>Subtotal:</strong> {{ formatCurrency(selectedOrder.subTotal, selectedOrder.currency) }}</p>
                      <p><strong>Tax:</strong> {{ formatCurrency(selectedOrder.taxAmount, selectedOrder.currency) }}</p>
                      <p><strong>Shipping:</strong> {{ formatCurrency(selectedOrder.shippingAmount, selectedOrder.currency) }}</p>
                      <p><strong>Total:</strong> {{ formatCurrency(selectedOrder.totalAmount, selectedOrder.currency) }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
  
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                text
                @click="viewDialog = false"
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
  import { useOrderStore } from '@/stores/orderStore'
  import { OrderDto } from '@/stores/types/member'
  import { useCustomerStore } from '@/stores/customer'
  const orderStore = useOrderStore()
  const snackbar = useSnackbarStore()
  const customerStore = useCustomerStore();
  // Data
  const saving = ref(false)
  const dialog = ref(false)
  const viewDialog = ref(false)
  const editMode = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const touristFilter = ref('all')
  const startDate = ref('')
  const endDate = ref('')
  const selectedOrder = ref<OrderDto|null>(null)
  const selectedCustomerId = ref<number|null>(null)
  const manualCustomerEntry = ref(false)
  
  // Mock customers data - replace with actual customer store
  const customers = computed(()=>customerStore.customers);
  const orderStatus = computed(()=>orderStore.orderStatuses);
  
  // Form data matching OrderCreationRequest interface
  const formData = ref({
    customerEmail: '',
    customerPhone: '',
    billingFirstName: '',
    billingLastName: '',
    billingCompany: '',
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingCity: '',
    billingStateProvince: '',
    billingPostalCode: '',
    billingCountryCode: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingCompany: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingStateProvince: '',
    shippingPostalCode: '',
    shippingCountryCode: '',
    subTotal: 0,
    taxAmount: 0,
    statusId:'',
    shippingAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    currency: 'USD',
    isTouristOrder: false,
    touristCountry: '',
    requiresPhytosanitaryCertificate: false,
    customerNotes: '',
    adminNotes: '',
    requiredDate: '',
    customerId: 1
  })
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Pending', value: 'pending' },
    { title: 'Shipped', value: 'shipped' },
    { title: 'Delivered', value: 'delivered' },
    { title: 'Cancelled', value: 'cancelled' }
  ]
  
  const touristOptions = [
    { title: 'All', value: 'all' },
    { title: 'Tourist Orders', value: 'tourist' },
    { title: 'Local Orders', value: 'local' }
  ]

  // Customer options for select
const customerOptions = computed(() => [
  { text: 'Select a customer...', value: null },
  ...customers.value.map(customer => ({
    text: `${customer.userDetails.firstName} ${customer.userDetails.lastName} - ${customer.userDetails.email}`,
    value: customer.userDetails.userId
  }))
])
  
  // Table headers
  const headers = [
    { title: 'Order #', key: 'orderNumber' },
    { title: 'Customer', key: 'customerEmail' },
    { title: 'Date', key: 'orderDate' },
    { title: 'Status', key: 'orderStatus' },
    { title: 'Type', key: 'isTouristOrder' },
    { title: 'Amount', key: 'totalAmount' },
    { title: 'Certificate', key: 'requiresPhytosanitaryCertificate' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    email: (value: string) => /.+@.+\..+/.test(value) || 'Must be a valid email',
    number: (value: any) => !isNaN(value) || 'Must be a number',
    exactLength: (length: number) => (v: string) =>
    v?.length === length || `Must be exactly ${length} characters`,
  uppercaseOnly: (v: string) =>
    /^[A-Z]+$/.test(v) || 'Only uppercase letters (A-Z) allowed'
  }
  
  // Computed properties
  const filteredOrders = computed(() => {
    let filtered = orderStore.getOrders
  
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(order => 
        order.orderStatus.toLowerCase() === statusFilter.value
      )
    }
  
    if (touristFilter.value === 'tourist') {
      filtered = filtered.filter(order => order.isTouristOrder)
    } else if (touristFilter.value === 'local') {
      filtered = filtered.filter(order => !order.isTouristOrder)
    }
  
    if (startDate.value && endDate.value) {
      filtered = orderStore.getOrdersByDateRange(startDate.value, endDate.value)
    }
  
    return filtered
  })
  
  const orderStatistics = computed(() => orderStore.getOrderStatistics)
  
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
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'orange'
      case 'shipped': return 'purple'
      case 'delivered': return 'green'
      case 'cancelled': return 'red'
      default: return 'grey'
    }
  }
  

  
  const editOrder = (item: any) => {
    editMode.value = true
    formData.value = { ...item }
    dialog.value = true
  }
  
  const viewOrder = (item: any) => {
    selectedOrder.value = item
    viewDialog.value = true
  }

  // Add these functions to your script setup section:

// Customer selection functions
const onCustomerSelect = (customerId: number | null) => {
  if (customerId && !manualCustomerEntry.value) {
    const customer = customers.value.find(c => c.userDetails.userId === customerId)
    if (customer) {
      // Auto-fill customer information
      formData.value.customerEmail = customer.userDetails.email
      formData.value.customerPhone = customer.userDetails.phoneNumber
      formData.value.billingFirstName = customer.userDetails.firstName
      formData.value.billingLastName = customer.userDetails.lastName
      formData.value.customerId = customer.userDetails.userId
      
      // Also copy to shipping by default
      formData.value.shippingFirstName = customer.userDetails.firstName
      formData.value.shippingLastName = customer.userDetails.lastName
    }
  }
}

const onManualEntryToggle = () => {
  if (manualCustomerEntry.value) {
    // Clear selected customer when switching to manual entry
    selectedCustomerId.value = null
    // Clear form data
    formData.value.customerEmail = ''
    formData.value.customerPhone = ''
    formData.value.billingFirstName = ''
    formData.value.billingLastName = ''
    formData.value.billingCompany = ''
    formData.value.billingAddressLine1 = ''
    formData.value.billingAddressLine2 = ''
    formData.value.billingCity = ''
    formData.value.billingStateProvince = ''
    formData.value.billingPostalCode = ''
    formData.value.billingCountryCode = ''
    formData.value.shippingFirstName = ''
    formData.value.shippingLastName = ''
    formData.value.shippingCompany = ''
    formData.value.shippingAddressLine1 = ''
    formData.value.shippingAddressLine2 = ''
    formData.value.shippingCity = ''
    formData.value.shippingStateProvince = ''
    formData.value.shippingPostalCode = ''
    formData.value.shippingCountryCode = ''
  }
}

// Copy billing address to shipping address
const copyBillingToShipping = () => {
  formData.value.shippingFirstName = formData.value.billingFirstName
  formData.value.shippingLastName = formData.value.billingLastName
  formData.value.shippingCompany = formData.value.billingCompany
  formData.value.shippingAddressLine1 = formData.value.billingAddressLine1
  formData.value.shippingAddressLine2 = formData.value.billingAddressLine2
  formData.value.shippingCity = formData.value.billingCity
  formData.value.shippingStateProvince = formData.value.billingStateProvince
  formData.value.shippingPostalCode = formData.value.billingPostalCode
  formData.value.shippingCountryCode = formData.value.billingCountryCode
}

// You'll also need to update your formData initialization to include all missing fields:
const initializeFormData = () => {
  return {
    orderId: null,
    customerEmail: '',
    customerPhone: '',
    billingFirstName: '',
    billingLastName: '',
    billingCompany: '',
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingCity: '',
    billingStateProvince: '',
    billingPostalCode: '',
    billingCountryCode: '',
    shippingFirstName: '',
    statusId:'',
    shippingLastName: '',
    shippingCompany: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingStateProvince: '',
    shippingPostalCode: '',
    shippingCountryCode: '',
    subTotal: 0,
    taxAmount: 0,
    shippingAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    currency: 'USD',
    isTouristOrder: false,
    touristCountry: '',
    requiresPhytosanitaryCertificate: false,
    customerNotes: '',
    adminNotes: '',
    requiredDate: '',
    customerId: 1
  }
}

// Update your openCreateDialog function to use the initialization:
const openCreateDialog = () => {
  editMode.value = false
  selectedCustomerId.value = null
  manualCustomerEntry.value = false
  formData.value = initializeFormData()
  dialog.value = true
}

// Update your closeDialog function to use the initialization:
const closeDialog = () => {
  dialog.value = false
  selectedCustomerId.value = null
  manualCustomerEntry.value = false
  formData.value = initializeFormData()
}
  

  
  const saveOrder = async () => {
    saving.value = true
    try {
      if (editMode.value && formData.value.orderId) {
        // Update existing order
        const response = await orderStore.updateOrder(formData.value.orderId, formData.value)
        if (response.isSuccessful) {
          snackbar.success('Order updated successfully')
          closeDialog()
        } else {
          snackbar.error('Error updating order')
        }
      } else {
        // Create new order

        const response = await orderStore.createOrder(formData.value)
        if (response.isSuccessful) {
          snackbar.success('Order created successfully')
          closeDialog()
        } else {
          snackbar.error('Error creating order')
        }
      }
    } catch (error) {
      console.error('Error saving order:', error)
      snackbar.error('Error saving order')
    } finally {
      saving.value = false
    }
  }
  
  const shipOrder = async (item: any) => {
    try {
      const response = await orderStore.shipOrder(item.orderId)
      if (response.isSuccessful) {
        snackbar.success('Order shipped successfully')
      } else {
        snackbar.error('Error shipping order')
      }
    } catch (error) {
      console.error('Error shipping order:', error)
      snackbar.error('Error shipping order')
    }
  }
  
  const deliverOrder = async (item: any) => {
    try {
      const response = await orderStore.deliverOrder(item.orderId)
      if (response.isSuccessful) {
        snackbar.success('Order delivered successfully')
      } else {
        snackbar.error('Error delivering order')
      }
    } catch (error) {
      console.error('Error delivering order:', error)
      snackbar.error('Error delivering order')
    }
  }
  
  const cancelOrder = async (item: any) => {
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
  
  const deleteOrder = async (item: any) => {
    if (confirm(`Are you sure you want to delete order ${item.orderNumber}?`)) {
      try {
        const response = await orderStore.deleteOrder(item.orderId)
        if (response.isSuccessful) {
          snackbar.success('Order deleted successfully')
        } else {
          snackbar.error('Error deleting order')
        }
      } catch (error) {
        console.error('Error deleting order:', error)
        snackbar.error('Error deleting order')
      }
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
    touristFilter.value = 'all'
    startDate.value = ''
    endDate.value = ''
  }
  
  onMounted(async () => {
    try {
      await orderStore.fetchOrders();
      await orderStore.fetchOrderStatus();
      await customerStore.fetchCustomers();
    } catch (error) {
      console.error('Error fetching orders:', error)
      snackbar.error('Error loading orders')
    }
  })
  </script>
  
  <style scoped>
  .orders-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>