<template>
    <div class="customers-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-teal-darken-3">Customer Management</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage customer accounts and their information
            </p>
          </div>
          <v-btn
            color="teal-darken-2"
            variant="elevated"
            prepend-icon="mdi-account-plus"
            @click="openCreateDialog"
          >
            Add Customer
          </v-btn>
        </div>
  
        <!-- Error Alert -->
        <v-alert v-if="error" type="error" dismissible class="mb-6">
          {{ error }}
        </v-alert>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="teal-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="teal-darken-3" size="40" class="me-3">mdi-account-group</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-teal-darken-3">{{ totalCustomers }}</h3>
                  <p class="text-body-2 text-teal-darken-1">Total Customers</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-account-check</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activeCustomers }}</h3>
                  <p class="text-body-2 text-green-darken-1">Active Customers</p>
                </div>
              </div>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-calendar-today</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ newCustomersThisMonth }}</h3>
                  <p class="text-body-2 text-purple-darken-1">New This Month</p>
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
                  label="Search customers..."
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
                  v-model="countryFilter"
                  label="Country"
                  :items="countryOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="verificationFilter"
                  label="Verification"
                  :items="verificationOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="teal-darken-2"
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
  
        <!-- Customers Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-teal-lighten-5">
            <v-icon class="me-2" color="teal-darken-3">mdi-account-group</v-icon>
            Customer Management
          </v-card-title>
          
          <v-progress-linear v-if="loading" indeterminate color="primary" />
          
          <v-data-table
            :headers="headers"
            :items="filteredCustomers"
            :loading="loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'dateJoined', order: 'desc' }]"
            item-key="customerId"
          >
            <template v-slot:item.profilePicture="{ item }">
              <v-avatar
                size="40"
                class="ma-2"
              >
              
                <v-icon  color="grey">mdi-account</v-icon>
              </v-avatar>
            </template>
  
            <template v-slot:item.customerName="{ item }">
              <div>
                <div class="font-weight-bold">{{ item.userDetails.firstName }} {{ item.userDetails.lastName }}</div>
                <div class="text-caption text-grey-darken-1">{{ item.userDetails.email }}</div>
              </div>
            </template>
  
            <template v-slot:item.contactInfo="{ item }">
              <div class="d-flex flex-column">
                <span class="text-caption">{{ item.userDetails.phoneNumber }}</span>
                <span class="text-caption text-grey-darken-1">{{ item.userAddresses[0].country }}</span>
              </div>
            </template>
  
            <template v-slot:item.userStatus="{ item }">
              <v-chip
                :color="item.userDetails.userStatus ==='active' ? 'green' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.userDetails.userStatus ==='active' ? 'Active' : 'Inactive' }}
              </v-chip>
            </template>
  
            <template v-slot:item.emailVerified="{ item }">
              <v-chip
                :color="item.userDetails.emailVerified ? 'blue' : 'orange'"
                size="small"
                variant="flat"
              >
                <v-icon start :icon="item.userDetails.emailVerified ? 'mdi-check-circle' : 'mdi-clock-outline'"></v-icon>
                {{ item.userDetails.emailVerified ? 'Verified' : 'Pending' }}
              </v-chip>
            </template>
  
            <template v-slot:item.totalOrders="{ item }">
              <div class="text-center">
                <div class="font-weight-bold">{{ item.customerProfile.totalOrders }}</div>
                <div class="text-caption text-grey-darken-1">${{ item.customerProfile.totalSpent?.toFixed(2) || '0.00' }}</div>
              </div>
            </template>
  
            <template v-slot:item.dateJoined="{ item }">
              <span class="text-body-2">
                {{ formatDate(item.userDetails.createdAt) }}
              </span>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-eye"
                variant="text"
                size="small"
                color="blue"
                @click="viewCustomer(item)"
              />
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editCustomer(item)"
              />
              <v-btn
                :icon="item.userDetails.userStatus ==='active' ? 'mdi-account-off' : 'mdi-account-check'"
                variant="text"
                size="small"
                :color="item.userDetails.userStatus ? 'orange' : 'green'"
                @click="toggleStatus(item)"
              />
              <v-btn
                icon="mdi-email"
                variant="text"
                size="small"
                color="info"
                @click="sendEmail(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deleteCustomer(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="900px">
          <v-card>
            <v-card-title class="pa-6 bg-teal-lighten-5">
              <v-icon class="me-2" color="teal-darken-3">mdi-account</v-icon>
              {{ editMode ? 'Edit Customer' : 'Add New Customer' }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.firstName"
                      label="First Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.lastName"
                      label="Last Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.email"
                      label="Email"
                      :rules="[rules.required, rules.email]"
                      variant="outlined"
                      prepend-inner-icon="mdi-email"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.phoneNumber"
                      label="Phone Number"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-phone"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.country"
                      label="Country"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-flag"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.profilePicture"
                      label="Profile Picture URL"
                      variant="outlined"
                      prepend-inner-icon="mdi-camera"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="formData.isActive"
                      label="Active Status"
                      color="green"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="formData.isEmailVerified"
                      label="Email Verified"
                      color="blue"
                      hide-details
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
                color="teal-darken-2"
                variant="elevated"
                @click="saveCustomer"
                :disabled="!valid"
                :loading="saving"
              >
                {{ editMode ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- View Customer Dialog -->
        <v-dialog v-model="viewDialog" max-width="600px">
          <v-card v-if="selectedCustomer">
            <v-card-title class="pa-6 bg-teal-lighten-5">
              <v-icon class="me-2" color="teal-darken-3">mdi-account</v-icon>
              {{ selectedCustomer.userDetails.firstName }} {{ selectedCustomer.userDetails.lastName }}
            </v-card-title>
            
            <v-card-text class="pa-6">
              <div class="d-flex flex-column align-center mb-4">
                <v-avatar size="120" class="mb-3">
                  <v-icon size="80" color="grey">mdi-account</v-icon>
                </v-avatar>
                <h3 class="text-h5 font-weight-bold">{{ selectedCustomer.userDetails.firstName }} {{ selectedCustomer.userDetails.lastName }}</h3>
                <p class="text-body-2 text-grey-darken-1">{{ selectedCustomer.userDetails.email }}</p>
              </div>
              
              <v-divider class="mb-4" />
              
              <v-row>
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="teal-darken-3" class="me-2">mdi-phone</v-icon>
                    <span>{{ selectedCustomer.userDetails.phoneNumber }}</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="teal-darken-3" class="me-2">mdi-flag</v-icon>
                    <span>{{ selectedCustomer.userAddresses[0].country }}</span>
                  </div>
                </v-col>
               
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="teal-darken-3" class="me-2">mdi-calendar</v-icon>
                    <span>{{ formatDate(selectedCustomer.userDetails.createdAt) }}</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="teal-darken-3" class="me-2">mdi-shopping</v-icon>
                    <span>{{ selectedCustomer.customerProfile.totalOrders }} orders</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="teal-darken-3" class="me-2">mdi-currency-usd</v-icon>
                    <span>${{ selectedCustomer.customerProfile.totalSpent?.toFixed(2) || '0.00' }}</span>
                  </div>
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
  import { ref, computed, onMounted } from 'vue';
  import { useSnackbarStore } from '@/stores/snackbar';
  import { CustomerProfileContainerDTO, User } from '@/stores/types/member';
  import { useCustomerStore } from '@/stores/customer';
  
  // Mock store - replace with actual customer store
  const snackbar = useSnackbarStore();
  const customerStore = useCustomerStore();
  // Data
  const loading = ref(false);
  const error = ref('');
  const saving = ref(false);
  const dialog = ref(false);
  const viewDialog = ref(false);
  const editMode = ref(false);
  const valid = ref(false);
  const search = ref('');
  const statusFilter = ref('all');
  const tierFilter = ref('all');
  const countryFilter = ref('all');
  const verificationFilter = ref('all');
  const selectedCustomer = ref<CustomerProfileContainerDTO | null>(null);
  
  // Mock customers data - replace with actual store data
  const customers = computed(()=>customerStore.customers)
  // Form data
  const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    profilePicture: '',
    isActive: true,
    isEmailVerified: false
  });
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' }
  ];
  
  const tierOptions = [
    { title: 'All Tiers', value: 'all' },
    { title: 'Premium', value: 'Premium' },
    { title: 'Gold', value: 'Gold' },
    { title: 'Silver', value: 'Silver' },
    { title: 'Bronze', value: 'Bronze' }
  ];
  
  const tierSelectOptions = [
    { title: 'Premium', value: 'Premium' },
    { title: 'Gold', value: 'Gold' },
    { title: 'Silver', value: 'Silver' },
    { title: 'Bronze', value: 'Bronze' }
  ];
  
  const verificationOptions = [
    { title: 'All', value: 'all' },
    { title: 'Verified', value: 'verified' },
    { title: 'Pending', value: 'pending' }
  ];
  
  const countryOptions = computed(() => [
    { title: 'All Countries', value: 'all' },
    ...Array.from(new Set(customers.value.map(c => c.userAddresses[0].country)))
      .map(country => ({ title: country, value: country }))
  ]);
  
  // Table headers
  const headers = [
    { title: 'Photo', key: 'profilePicture', sortable: false },
    { title: 'Customer', key: 'customerName' },
    { title: 'Contact', key: 'contactInfo', sortable: false },
    { title: 'Tier', key: 'customerTier' },
    { title: 'Status', key: 'isActive' },
    { title: 'Email Status', key: 'isEmailVerified' },
    { title: 'Orders/Spent', key: 'totalOrders' },
    { title: 'Joined', key: 'dateJoined' },
    { title: 'Actions', key: 'actions', sortable: false }
  ];
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    email: (value: string) => /.+@.+\..+/.test(value) || 'Must be a valid email'
  };
  
  // Computed properties
  const filteredCustomers = computed(() => {
    let filtered = customers.value;
  
    if (statusFilter.value === 'active') {
      filtered = filtered.filter(item => item.userDetails.userStatus);
    } else if (statusFilter.value === 'inactive') {
      filtered = filtered.filter(item => !item.userDetails.userStatus);
    }
  
    if (countryFilter.value !== 'all') {
      filtered = filtered.filter(item => item.userAddresses[0].country === countryFilter.value);
    }
  
    if (verificationFilter.value === 'verified') {
      filtered = filtered.filter(item => item.userDetails.emailVerified);
    } else if (verificationFilter.value === 'pending') {
      filtered = filtered.filter(item => !item.userDetails.emailVerified);
    }
  
    return filtered;
  });
  
  const totalCustomers = computed(() => customers.value.length);
  const activeCustomers = computed(() => customers.value.filter(c => c.userDetails.userStatus==='active').length);
  const newCustomersThisMonth = computed(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return customers.value.filter(c => {
      const joinDate = new Date(c.userDetails.createdAt);
      return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
    }).length;
  });
  

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const openCreateDialog = () => {
    editMode.value = false;
    formData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      country: '',
      profilePicture: '',
      isActive: true,
      isEmailVerified: false
    };
    dialog.value = true;
  };
  
  const editCustomer = (item: any) => {
    editMode.value = true;
    selectedCustomer.value = item;
    formData.value = { ...item };
    dialog.value = true;
  };
  
  const viewCustomer = (item: any) => {
    selectedCustomer.value = item;
    viewDialog.value = true;
  };
  
  const closeDialog = () => {
    dialog.value = false;
    formData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      country: '',
      profilePicture: '',
      isActive: true,
      isEmailVerified: false
    };
  };
  
  const saveCustomer = async () => {
    saving.value = true;
    
    try {
      if (editMode.value) {
        // Update existing customer
        const index = customers.value.findIndex(c => c.userDetails.userId === selectedCustomer.value?.userDetails.userId);
        if (index !== -1) {
          customers.value[index] = { ...customers.value[index], ...formData.value };
        }
        snackbar.success('Customer updated successfully');
      } else {
        // Create new customer
        const newCustomer = {
          ...formData.value,
          customerId: customers.value.length + 1,
          totalOrders: 0,
          totalSpent: 0,
          dateJoined: new Date().toISOString().split('T')[0]
        };
        customers.value.push(newCustomer);
        snackbar.success('Customer created successfully');
      }
      closeDialog();
    } catch (error) {
      console.error('Error saving customer:', error);
      snackbar.error('Error saving customer');
    } finally {
      saving.value = false;
    }
  };
  
  const deleteCustomer = async (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.firstName} ${item.lastName}?`)) {
      try {
        const index = customers.value.findIndex(c => c.userDetails.userId === item.customerId);
        if (index !== -1) {
          customers.value.splice(index, 1);
        }
        snackbar.success('Customer deleted successfully');
      } catch (error) {
        console.error('Error deleting customer:', error);
        snackbar.error('Error deleting customer');
      }
    }
  };
  
  const toggleStatus = async (item: any) => {
  try {
    const index = customers.value.findIndex(c => c.userDetails.userId === item.customerId);
    if (index !== -1) {
      const currentStatus = customers.value[index].userDetails.userStatus;

      customers.value[index].userDetails.userStatus =
        currentStatus === 'Active' ? 'Inactive' : 'Active';

      snackbar.success(
        `Customer ${currentStatus === 'Active' ? 'deactivated' : 'activated'} successfully`
      );
    }
  } catch (error) {
    console.error('Error toggling status:', error);
    snackbar.error('Error updating customer status');
  }
};

  
  const sendEmail = (item: any) => {
    // Implement email functionality
    alert(`Send email to ${item.email}`);
  };
  
  const clearFilters = () => {
    search.value = '';
    statusFilter.value = 'all';
    tierFilter.value = 'all';
    countryFilter.value = 'all';
    verificationFilter.value = 'all';
  };
  
  onMounted(() => {
    // Load customers data
    loading.value = false;
  });
  </script>
  
  <style scoped>
  .customers-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>