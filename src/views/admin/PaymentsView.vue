<template>
    <div class="payments-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-blue-darken-3">Payments</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage and track all payment transactions
            </p>
          </div>
          <v-btn
            color="blue-darken-2"
            variant="elevated"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Add Payment
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-credit-card</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ totalPayments }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Total Payments</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ successfulPayments }}</h3>
                  <p class="text-body-2 text-green-darken-1">Successful</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-clock-outline</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ pendingPayments }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Pending</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-cash</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ totalAmount }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Total Amount</p>
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
                  label="Search payments..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="statusFilter"
                  label="Payment Status"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="gatewayFilter"
                  label="Payment Gateway"
                  :items="gatewayOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  color="blue-darken-2"
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
  
        <!-- Payments Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-blue-lighten-5">
            <v-icon class="me-2" color="blue-darken-3">mdi-credit-card</v-icon>
            Payments Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredPayments"
            :loading="paymentStore.loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'paymentDate', order: 'desc' }]"
          >
            <template v-slot:item.paymentAmount="{ item }">
              <span class="font-weight-medium">{{ formatCurrency(item.paymentAmount, item.currency) }}</span>
            </template>
  
            <template v-slot:item.paymentStatus="{ item }">
              <v-chip
                :color="getStatusColor(item.paymentStatus)"
                size="small"
                variant="flat"
              >
                {{ item.paymentStatus }}
              </v-chip>
            </template>
  
            <template v-slot:item.paymentDate="{ item }">
              {{ formatDate(item.paymentDate) }}
            </template>
  
            <template v-slot:item.processedDate="{ item }">
              {{ item.processedDate ? formatDate(item.processedDate) : 'N/A' }}
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-eye"
                variant="text"
                size="small"
                color="primary"
                @click="viewPayment(item)"
              />
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editPayment(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deletePayment(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-card-title class="pa-6 bg-blue-lighten-5">
              <v-icon class="me-2" color="blue-darken-3">mdi-credit-card</v-icon>
              {{ editMode ? 'Edit Payment' : 'Add Payment' }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.orderId"
                      label="Order ID"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-cart"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.paymentMethodId"
                      label="Payment Method ID"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-credit-card-outline"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.paymentAmount"
                      label="Payment Amount"
                      type="number"
                      step="0.01"
                      :rules="[rules.required, rules.number, rules.positive]"
                      variant="outlined"
                      prepend-inner-icon="mdi-cash"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.currency"
                      label="Currency"
                      :items="currencyOptions"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-currency-usd"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.paymentStatus"
                      label="Payment Status"
                      :items="paymentStatusOptions"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-check-circle"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.transactionId"
                      label="Transaction ID"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-identifier"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.paymentReference"
                      label="Payment Reference"
                      variant="outlined"
                      prepend-inner-icon="mdi-file-document"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.paymentGateway"
                      label="Payment Gateway"
                      :items="gatewayOptions"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-web"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.processorResponse"
                      label="Processor Response"
                      rows="3"
                      variant="outlined"
                      prepend-inner-icon="mdi-message-text"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.paymentDate"
                      label="Payment Date"
                      type="datetime-local"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-calendar"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.processedDate"
                      label="Processed Date"
                      type="datetime-local"
                      variant="outlined"
                      prepend-inner-icon="mdi-calendar-check"
                    />
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
                color="blue-darken-2"
                variant="elevated"
                @click="savePayment"
                :disabled="!valid"
                :loading="saving"
              >
                {{ editMode ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- View Payment Dialog -->
        <v-dialog v-model="viewDialog" max-width="600px">
          <v-card v-if="selectedPayment">
            <v-card-title class="pa-6 bg-blue-lighten-5">
              <v-icon class="me-2" color="blue-darken-3">mdi-eye</v-icon>
              Payment Details
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="selectedPayment.paymentId"
                    label="Payment ID"
                    readonly
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="selectedPayment.orderId"
                    label="Order ID"
                    readonly
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formatCurrency(selectedPayment.paymentAmount, selectedPayment.currency)"
                    label="Amount"
                    readonly
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-chip
                    :color="getStatusColor(selectedPayment.paymentStatus)"
                    size="large"
                    variant="flat"
                  >
                    {{ selectedPayment.paymentStatus }}
                  </v-chip>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :model-value="selectedPayment.transactionId"
                    label="Transaction ID"
                    readonly
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :model-value="selectedPayment.paymentGateway"
                    label="Payment Gateway"
                    readonly
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formatDate(selectedPayment.paymentDate)"
                    label="Payment Date"
                    readonly
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="selectedPayment.processedDate ? formatDate(selectedPayment.processedDate) : 'N/A'"
                    label="Processed Date"
                    readonly
                    variant="outlined"
                  />
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
  import { usePaymentStore } from '@/stores/payment'
  import { ref, computed, onMounted } from 'vue'
  import { useSnackbarStore } from '@/stores/snackbar'
  import type { PaymentDTO, CreatePaymentRequest } from '@/stores/types/member'
import { useUserStore } from '@/stores/user'
  
  const paymentStore = usePaymentStore()
  const snackbar = useSnackbarStore()
  const userStore = useUserStore();
  // Data
  const saving = ref(false)
  const dialog = ref(false)
  const viewDialog = ref(false)
  const editMode = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const gatewayFilter = ref('all')
  const selectedPayment = ref<PaymentDTO | null>(null)
  
  // Form data
  const formData = ref({
    paymentId: null as number | null,
    orderId: 0,
    paymentMethodId: 0,
    paymentAmount: 0,
    currency: 'USD',
    paymentStatus: 'Pending',
    transactionId: '',
    paymentReference: '',
    paymentGateway: 'Stripe',
    processorResponse: '',
    paymentDate: new Date().toISOString().slice(0, 16),
    processedDate: '',
    createdAt: new Date().toISOString(),
    createdBy: userStore.user?.userId
  })
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Pending', value: 'pending' },
    { title: 'Completed', value: 'completed' },
    { title: 'Failed', value: 'failed' },
    { title: 'Cancelled', value: 'cancelled' },
    { title: 'Refunded', value: 'refunded' }
  ]
  
  const gatewayOptions = [
    { title: 'All', value: 'all' },
    { title: 'Stripe', value: 'stripe' },
    { title: 'PayPal', value: 'paypal' },
    { title: 'Square', value: 'square' },
    { title: 'Cash', value: 'cash' },
    { title: 'Bank Transfer', value: 'bank_transfer' }
  ]
  
  const currencyOptions = [
    { title: 'USD', value: 'USD' },
    { title: 'EUR', value: 'EUR' },
    { title: 'GBP', value: 'GBP' },
    { title: 'MWK', value: 'MWK' }
  ]
  
  const paymentStatusOptions = [
    { title: 'Pending', value: 'Pending' },
    { title: 'Completed', value: 'Completed' },
    { title: 'Failed', value: 'Failed' },
    { title: 'Cancelled', value: 'Cancelled' },
    { title: 'Refunded', value: 'Refunded' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Payment ID', key: 'paymentId' },
    { title: 'Order ID', key: 'orderId' },
    { title: 'Amount', key: 'paymentAmount' },
    { title: 'Status', key: 'paymentStatus' },
    { title: 'Transaction ID', key: 'transactionId' },
    { title: 'Gateway', key: 'paymentGateway' },
    { title: 'Payment Date', key: 'paymentDate' },
    { title: 'Processed Date', key: 'processedDate' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: any) => !!value || 'This field is required',
    number: (value: any) => !isNaN(value) || 'Must be a number',
    positive: (value: any) => value > 0 || 'Must be greater than 0'
  }
  
  // Computed properties
  const filteredPayments = computed(() => {
    let filtered = paymentStore.getPayments
  
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(item => 
        item.paymentStatus.toLowerCase() === statusFilter.value.toLowerCase()
      )
    }
  
    if (gatewayFilter.value !== 'all') {
      filtered = filtered.filter(item => 
        item.paymentGateway.toLowerCase() === gatewayFilter.value.toLowerCase()
      )
    }
  
    return filtered
  })
  
  const totalPayments = computed(() => paymentStore.getPayments.length)
  const successfulPayments = computed(() => paymentStore.getPaymentsByStatus('completed').length)
  const pendingPayments = computed(() => paymentStore.getPaymentsByStatus('pending').length)
  const totalAmount = computed(() => {
    const total = paymentStore.getPayments
      .filter(p => p.paymentStatus.toLowerCase() === 'completed')
      .reduce((sum, payment) => sum + payment.paymentAmount, 0)
    return formatCurrency(total, 'USD')
  })
  
  // Methods
  const openCreateDialog = () => {
    editMode.value = false
    formData.value = {
      paymentId: null,
      orderId: 0,
      paymentMethodId: 0,
      paymentAmount: 0,
      currency: 'USD',
      paymentStatus: 'Pending',
      transactionId: '',
      paymentReference: '',
      paymentGateway: 'Stripe',
      processorResponse: '',
      paymentDate: new Date().toISOString().slice(0, 16),
      processedDate: '',
      createdAt: new Date().toISOString(),
      createdBy: 1
    }
    dialog.value = true
  }
  
  const editPayment = (item: PaymentDTO) => {
    editMode.value = true
    formData.value = {
      ...item,
      paymentDate: new Date(item.paymentDate).toISOString().slice(0, 16),
      processedDate: item.processedDate ? new Date(item.processedDate).toISOString().slice(0, 16) : ''
    }
    dialog.value = true
  }
  
  const viewPayment = (item: PaymentDTO) => {
    selectedPayment.value = item
    viewDialog.value = true
  }
  
  const closeDialog = () => {
    dialog.value = false
    formData.value = {
      paymentId: null,
      orderId: 0,
      paymentMethodId: 0,
      paymentAmount: 0,
      currency: 'USD',
      paymentStatus: 'Pending',
      transactionId: '',
      paymentReference: '',
      paymentGateway: 'Stripe',
      processorResponse: '',
      paymentDate: new Date().toISOString().slice(0, 16),
      processedDate: '',
      createdAt: new Date().toISOString(),
      createdBy: userStore.user?.userId
    }
  }
  
  const savePayment = async () => {
    saving.value = true
    
    try {
      // Convert datetime-local format to ISO string
      const paymentData = {
        ...formData.value,
        paymentDate: new Date(formData.value.paymentDate).toISOString(),
        processedDate: formData.value.processedDate ? new Date(formData.value.processedDate).toISOString() : ''
      }
  
      if (editMode.value && formData.value.paymentId) {
        // Update existing payment
        const response = await paymentStore.updatePayment(formData.value.paymentId, paymentData)
        if (response.isSuccessful) {
          snackbar.success('Payment updated successfully')
          closeDialog()
        } else {
          snackbar.error('Error updating payment')
        }
      } else {
        // Create new payment
        const { paymentId, ...createData } = paymentData
        const response = await paymentStore.createPayment(createData as CreatePaymentRequest)
        if (response.isSuccessful) {
          snackbar.success('Payment created successfully')
          closeDialog()
        } else {
          snackbar.error('Error creating payment')
        }
      }
    } catch (error) {
      console.error('Error saving payment:', error)
      snackbar.error('Error saving payment')
    } finally {
      saving.value = false
    }
  }
  
  const deletePayment = async (item: PaymentDTO) => {
    if (confirm(`Are you sure you want to delete payment ${item.transactionId}?`)) {
      try {
        const response = await paymentStore.deletePayment(item.paymentId)
        if (response.isSuccessful) {
          snackbar.success('Payment deleted successfully')
        } else {
          snackbar.error('Error deleting payment')
        }
      } catch (error) {
        console.error('Error deleting payment:', error)
        snackbar.error('Error deleting payment')
      }
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
    gatewayFilter.value = 'all'
  }
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green'
      case 'pending': return 'orange'
      case 'failed': return 'red'
      case 'cancelled': return 'grey'
      case 'refunded': return 'purple'
      default: return 'blue'
    }
  }
  
  onMounted(async () => {
    try {
      await paymentStore.fetchPayments()
    } catch (error) {
      console.error('Error fetching payments:', error)
      snackbar.error('Error loading payments')
    }
  })
  </script>
  
  <style scoped>
  .payments-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>