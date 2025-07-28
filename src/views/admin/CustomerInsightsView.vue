<template>
    <div class="customer-insights-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-deep-purple-darken-3">Customer Insights</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Analyze customer behavior and engagement patterns
            </p>
          </div>
          <div class="d-flex gap-2">
            <v-btn
              color="deep-purple-darken-2"
              variant="outlined"
              prepend-icon="mdi-download"
              @click="exportReport"
            >
              Export Report
            </v-btn>
            <v-btn
              color="deep-purple-darken-2"
              variant="elevated"
              prepend-icon="mdi-refresh"
              @click="refreshData"
              :loading="refreshing"
            >
              Refresh Data
            </v-btn>
          </div>
        </div>
  
        <!-- Date Range Filter -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" md="3">
                <v-select
                  v-model="dateRange"
                  label="Time Period"
                  :items="dateRangeOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="onDateRangeChange"
                />
              </v-col>
              <v-col cols="12" md="3" v-if="dateRange === 'custom'">
                <v-text-field
                  v-model="customStartDate"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3" v-if="dateRange === 'custom'">
                <v-text-field
                  v-model="customEndDate"
                  label="End Date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="customerSegment"
                  label="Customer Segment"
                  :items="segmentOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
  
        <!-- Key Metrics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="deep-purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="deep-purple-darken-3" size="40" class="me-3">mdi-account-group</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-deep-purple-darken-3">{{ totalCustomers.toLocaleString() }}</h3>
                  <p class="text-body-2 text-deep-purple-darken-1">Total Customers</p>
                  <div class="d-flex align-center mt-1">
                    <v-icon 
                      :color="customerGrowth >= 0 ? 'green' : 'red'" 
                      size="16" 
                      class="me-1"
                    >
                      {{ customerGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>
                    <span 
                      class="text-caption" 
                      :class="customerGrowth >= 0 ? 'text-green' : 'text-red'"
                    >
                      {{ Math.abs(customerGrowth) }}% vs last period
                    </span>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-account-plus</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ newCustomers.toLocaleString() }}</h3>
                  <p class="text-body-2 text-green-darken-1">New Customers</p>
                  <div class="d-flex align-center mt-1">
                    <v-icon 
                      :color="newCustomerGrowth >= 0 ? 'green' : 'red'" 
                      size="16" 
                      class="me-1"
                    >
                      {{ newCustomerGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>
                    <span 
                      class="text-caption" 
                      :class="newCustomerGrowth >= 0 ? 'text-green' : 'text-red'"
                    >
                      {{ Math.abs(newCustomerGrowth) }}% vs last period
                    </span>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-cash</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">${{ averageOrderValue.toFixed(2) }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Avg Order Value</p>
                  <div class="d-flex align-center mt-1">
                    <v-icon 
                      :color="aovGrowth >= 0 ? 'green' : 'red'" 
                      size="16" 
                      class="me-1"
                    >
                      {{ aovGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>
                    <span 
                      class="text-caption" 
                      :class="aovGrowth >= 0 ? 'text-green' : 'text-red'"
                    >
                      {{ Math.abs(aovGrowth) }}% vs last period
                    </span>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-repeat</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ customerRetentionRate }}%</h3>
                  <p class="text-body-2 text-blue-darken-1">Retention Rate</p>
                  <div class="d-flex align-center mt-1">
                    <v-icon 
                      :color="retentionGrowth >= 0 ? 'green' : 'red'" 
                      size="16" 
                      class="me-1"
                    >
                      {{ retentionGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>
                    <span 
                      class="text-caption" 
                      :class="retentionGrowth >= 0 ? 'text-green' : 'text-red'"
                    >
                      {{ Math.abs(retentionGrowth) }}% vs last period
                    </span>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Charts Row -->
        <v-row class="mb-6">
          <!-- Customer Acquisition Chart -->
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title class="pa-6 bg-deep-purple-lighten-5">
                <v-icon class="me-2" color="deep-purple-darken-3">mdi-chart-line</v-icon>
                Customer Acquisition Trend
              </v-card-title>
              <v-card-text class="pa-6">
                <div style="height: 300px; width: 100%;">
                  <canvas ref="acquisitionChart"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <!-- Customer Segments -->
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="pa-6 bg-green-lighten-5">
                <v-icon class="me-2" color="green-darken-3">mdi-chart-donut</v-icon>
                Customer Segments
              </v-card-title>
              <v-card-text class="pa-6">
                <div style="height: 300px; width: 100%;">
                  <canvas ref="segmentChart"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Customer Lifetime Value and Cohort Analysis -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="pa-6 bg-orange-lighten-5">
                <v-icon class="me-2" color="orange-darken-3">mdi-trending-up</v-icon>
                Customer Lifetime Value Distribution
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="mb-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">High Value ($500+)</span>
                    <span class="font-weight-bold">{{ highValueCustomers }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="highValueCustomers"
                    height="8"
                    color="deep-purple"
                  />
                </div>
                <div class="mb-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">Medium Value ($100-$500)</span>
                    <span class="font-weight-bold">{{ mediumValueCustomers }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="mediumValueCustomers"
                    height="8"
                    color="orange"
                  />
                </div>
                <div>
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">Low Value (<$100)</span>
                    <span class="font-weight-bold">{{ lowValueCustomers }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="lowValueCustomers"
                    height="8"
                    color="blue"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="pa-6 bg-blue-lighten-5">
                <v-icon class="me-2" color="blue-darken-3">mdi-account-heart</v-icon>
                Customer Engagement Metrics
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="6">
                    <div class="text-center">
                      <h3 class="text-h4 font-weight-bold text-deep-purple-darken-3">{{ avgSessionDuration }}</h3>
                      <p class="text-body-2 text-grey-darken-1">Avg Session Duration</p>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-center">
                      <h3 class="text-h4 font-weight-bold text-green-darken-3">{{ avgPageViews }}</h3>
                      <p class="text-body-2 text-grey-darken-1">Avg Page Views</p>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-center">
                      <h3 class="text-h4 font-weight-bold text-orange-darken-3">{{ bounceRate }}%</h3>
                      <p class="text-body-2 text-grey-darken-1">Bounce Rate</p>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-center">
                      <h3 class="text-h4 font-weight-bold text-blue-darken-3">{{ conversionRate }}%</h3>
                      <p class="text-body-2 text-grey-darken-1">Conversion Rate</p>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Geographic Distribution and Top Products -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="pa-6 bg-purple-lighten-5">
                <v-icon class="me-2" color="purple-darken-3">mdi-earth</v-icon>
                Geographic Distribution
              </v-card-title>
              <v-card-text class="pa-6">
                <div v-for="location in topLocations" :key="location.country" class="mb-3">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-body-2">{{ location.country }}</span>
                    <span class="font-weight-bold">{{ location.customers }} ({{ location.percentage }}%)</span>
                  </div>
                  <v-progress-linear
                    :model-value="location.percentage"
                    height="6"
                    color="purple"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="pa-6 bg-teal-lighten-5">
                <v-icon class="me-2" color="teal-darken-3">mdi-star</v-icon>
                Popular Products by Customer Segment
              </v-card-title>
              <v-card-text class="pa-6">
                <v-tabs v-model="activeTab" color="teal">
                  <v-tab value="new">New Customers</v-tab>
                  <v-tab value="returning">Returning</v-tab>
                  <v-tab value="vip">VIP</v-tab>
                </v-tabs>
                <v-tabs-window v-model="activeTab" class="mt-4">
                  <v-tabs-window-item value="new">
                    <div v-for="product in topProductsNew" :key="product.id" class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-2">{{ product.name }}</span>
                      <v-chip size="small" color="teal">{{ product.orders }}</v-chip>
                    </div>
                  </v-tabs-window-item>
                  <v-tabs-window-item value="returning">
                    <div v-for="product in topProductsReturning" :key="product.id" class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-2">{{ product.name }}</span>
                      <v-chip size="small" color="teal">{{ product.orders }}</v-chip>
                    </div>
                  </v-tabs-window-item>
                  <v-tabs-window-item value="vip">
                    <div v-for="product in topProductsVip" :key="product.id" class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-2">{{ product.name }}</span>
                      <v-chip size="small" color="teal">{{ product.orders }}</v-chip>
                    </div>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Customer Behavior Insights -->
        <v-row class="mb-6">
          <v-col cols="12">
            <v-card>
              <v-card-title class="pa-6 bg-indigo-lighten-5">
                <v-icon class="me-2" color="indigo-darken-3">mdi-lightbulb</v-icon>
                Customer Behavior Insights & Recommendations
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-card class="pa-4" color="green-lighten-5" elevation="0">
                      <div class="d-flex align-center mb-2">
                        <v-icon color="green-darken-3" class="me-2">mdi-trending-up</v-icon>
                        <h4 class="text-h6 font-weight-bold text-green-darken-3">Opportunity</h4>
                      </div>
                      <p class="text-body-2 mb-3">{{ insights.opportunity }}</p>
                      <v-chip size="small" color="green" variant="flat">High Impact</v-chip>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card class="pa-4" color="orange-lighten-5" elevation="0">
                      <div class="d-flex align-center mb-2">
                        <v-icon color="orange-darken-3" class="me-2">mdi-alert</v-icon>
                        <h4 class="text-h6 font-weight-bold text-orange-darken-3">Alert</h4>
                      </div>
                      <p class="text-body-2 mb-3">{{ insights.alert }}</p>
                      <v-chip size="small" color="orange" variant="flat">Needs Attention</v-chip>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card class="pa-4" color="blue-lighten-5" elevation="0">
                      <div class="d-flex align-center mb-2">
                        <v-icon color="blue-darken-3" class="me-2">mdi-target</v-icon>
                        <h4 class="text-h6 font-weight-bold text-blue-darken-3">Recommendation</h4>
                      </div>
                      <p class="text-body-2 mb-3">{{ insights.recommendation }}</p>
                      <v-chip size="small" color="blue" variant="flat">Actionable</v-chip>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Customer List -->
        <v-card>
          <v-card-title class="pa-6 bg-deep-purple-lighten-5">
            <v-icon class="me-2" color="deep-purple-darken-3">mdi-account-details</v-icon>
            Customer Details
          </v-card-title>
          <v-card-text class="pa-6">
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="customerSearch"
                  label="Search customers..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="customerTypeFilter"
                  label="Customer Type"
                  :items="customerTypeOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="valueSegmentFilter"
                  label="Value Segment"
                  :items="valueSegmentOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="deep-purple-darken-2"
                  variant="outlined"
                  block
                  @click="clearCustomerFilters"
                >
                  Clear
                </v-btn>
              </v-col>
            </v-row>
  
            <v-data-table
              :headers="customerHeaders"
              :items="filteredCustomers"
              :loading="loading"
              :search="customerSearch"
              class="elevation-1"
              :sort-by="[{ key: 'totalSpent', order: 'desc' }]"
            >
              <template v-slot:item.name="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="32" class="me-3" color="deep-purple-lighten-3">
                    <span class="text-white text-caption">{{ item.name.charAt(0) }}</span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.name }}</div>
                    <div class="text-caption text-grey-darken-1">{{ item.email }}</div>
                  </div>
                </div>
              </template>
  
              <template v-slot:item.customerType="{ item }">
                <v-chip
                  :color="getCustomerTypeColor(item.customerType)"
                  size="small"
                  variant="flat"
                >
                  {{ item.customerType }}
                </v-chip>
              </template>
  
              <template v-slot:item.totalSpent="{ item }">
                <span class="font-weight-bold">${{ item.totalSpent.toFixed(2) }}</span>
              </template>
  
              <template v-slot:item.lastOrderDate="{ item }">
                <span class="text-body-2">{{ formatDate(item.lastOrderDate) }}</span>
              </template>
  
              <template v-slot:item.valueSegment="{ item }">
                <v-chip
                  :color="getValueSegmentColor(item.valueSegment)"
                  size="small"
                  variant="flat"
                >
                  {{ item.valueSegment }}
                </v-chip>
              </template>
  
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  variant="text"
                  size="small"
                  color="primary"
                  @click="viewCustomerDetails(item)"
                />
                <v-btn
                  icon="mdi-email"
                  variant="text"
                  size="small"
                  color="info"
                  @click="sendCustomerEmail(item)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useSnackbarStore } from '@/stores/snackbar'
  import {  CustomerInsight, LocationStats, TopProduct } from '@/stores/types/member'
  
  // Chart.js types and setup would normally be imported here
  declare const Chart: any
  
  const snackbar = useSnackbarStore()
  
  // Data
  const loading = ref(false)
  const refreshing = ref(false)
  const dateRange = ref('30days')
  const customStartDate = ref('')
  const customEndDate = ref('')
  const customerSegment = ref('all')
  const customerSearch = ref('')
  const customerTypeFilter = ref('all')
  const valueSegmentFilter = ref('all')
  const activeTab = ref('new')
  
  // Chart refs
  const acquisitionChart = ref<HTMLCanvasElement>()
  const segmentChart = ref<HTMLCanvasElement>()
  
  // Mock data
  const totalCustomers = ref(15420)
  const newCustomers = ref(892)
  const averageOrderValue = ref(156.75)
  const customerRetentionRate = ref(68)
  const customerGrowth = ref(12.5)
  const newCustomerGrowth = ref(18.3)
  const aovGrowth = ref(7.2)
  const retentionGrowth = ref(-3.1)
  
  const highValueCustomers = ref(15)
  const mediumValueCustomers = ref(45)
  const lowValueCustomers = ref(40)
  
  const avgSessionDuration = ref('4:32')
  const avgPageViews = ref(6.8)
  const bounceRate = ref(32)
  const conversionRate = ref(3.4)
  
  // Options
  const dateRangeOptions = [
    { title: 'Last 7 days', value: '7days' },
    { title: 'Last 30 days', value: '30days' },
    { title: 'Last 90 days', value: '90days' },
    { title: 'Last 6 months', value: '6months' },
    { title: 'Last year', value: '1year' },
    { title: 'Custom', value: 'custom' }
  ]
  
  const segmentOptions = [
    { title: 'All Customers', value: 'all' },
    { title: 'New Customers', value: 'new' },
    { title: 'Returning Customers', value: 'returning' },
    { title: 'VIP Customers', value: 'vip' },
    { title: 'Tourist Customers', value: 'tourist' }
  ]
  
  const customerTypeOptions = [
    { title: 'All Types', value: 'all' },
    { title: 'New', value: 'New' },
    { title: 'Returning', value: 'Returning' },
    { title: 'VIP', value: 'VIP' },
    { title: 'At Risk', value: 'At Risk' }
  ]
  
  const valueSegmentOptions = [
    { title: 'All Segments', value: 'all' },
    { title: 'High Value', value: 'High Value' },
    { title: 'Medium Value', value: 'Medium Value' },
    { title: 'Low Value', value: 'Low Value' }
  ]
  
  // Mock data for locations
  const topLocations = ref<LocationStats[]>([
  { country: 'United States', customers: 8241, percentage: 53.4 },
  { country: 'United Kingdom', customers: 2156, percentage: 14.0 },
  { country: 'Canada', customers: 1543, percentage: 10.0 },
  { country: 'Australia', customers: 1234, percentage: 8.0 },
  { country: 'Germany', customers: 987, percentage: 6.4 },  // fixed typo: users -> customers
  { country: 'Others', customers: 1259, percentage: 8.2 }
])
  
  // Mock data for top products
  const topProductsNew = ref<TopProduct[]>([
    { id: 1, name: 'Beginner Craft Kit', orders: 245 },
    { id: 2, name: 'Basic Yarn Set', orders: 198 },
    { id: 3, name: 'Simple Beading Kit', orders: 167 },
    { id: 4, name: 'Starter Paint Set', orders: 142 },
    { id: 5, name: 'Essential Tools Bundle', orders: 128 }
  ])
  
  const topProductsReturning = ref<TopProduct[]>([
    { id: 1, name: 'Premium Yarn Collection', orders: 189 },
    { id: 2, name: 'Advanced Embroidery Kit', orders: 156 },
    { id: 3, name: 'Professional Brushes', orders: 134 },
    { id: 4, name: 'Specialty Beads', orders: 112 },
    { id: 5, name: 'Fabric Assortment', orders: 98 }
  ])
  
  const topProductsVip = ref<TopProduct[]>([
    { id: 1, name: 'Luxury Craft Set', orders: 87 },
    { id: 2, name: 'Designer Yarn Collection', orders: 76 },
    { id: 3, name: 'Master Artisan Tools', orders: 64 },
    { id: 4, name: 'Premium Paint Collection', orders: 52 },
    { id: 5, name: 'Exclusive Patterns', orders: 41 }
  ])
  
  // Insights
  const insights = ref({
    opportunity: 'Cart abandonment rate is 23% higher on mobile. Optimizing mobile checkout could increase conversions by 15%.',
    alert: 'Customer retention rate has decreased by 3.1% this month. Focus on engagement campaigns for at-risk customers.',
    recommendation: 'Launch personalized email campaigns for medium-value customers to upgrade them to high-value segment.'
  })
  
  // Customer table headers
  const customerHeaders = [
    { title: 'Customer', key: 'name' },
    { title: 'Type', key: 'customerType' },
    { title: 'Total Orders', key: 'totalOrders' },
    { title: 'Total Spent', key: 'totalSpent' },
    { title: 'Last Order', key: 'lastOrderDate' },
    { title: 'Value Segment', key: 'valueSegment' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Mock customer data
  const customers = ref<CustomerInsight[]>([
    {
      id: 1,
      name: 'Emma Johnson',
      email: 'emma.johnson@email.com',
      customerType: 'VIP',
      totalOrders: 24,
      totalSpent: 1250.75,
      lastOrderDate: '2024-01-15',
      valueSegment: 'High Value'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      customerType: 'Returning',
      totalOrders: 12,
      totalSpent: 485.20,
      lastOrderDate: '2024-01-12',
      valueSegment: 'Medium Value'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      customerType: 'New',
      totalOrders: 3,
      totalSpent: 125.50,
      lastOrderDate: '2024-01-14',
      valueSegment: 'Low Value'
    },
    {
      id: 4,
      name: 'David Rodriguez',
      email: 'david.rodriguez@email.com',
      customerType: 'VIP',
      totalOrders: 18,
      totalSpent: 890.25,
      lastOrderDate: '2024-01-13',
      valueSegment: 'High Value'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      customerType: 'At Risk',
      totalOrders: 8,
      totalSpent: 320.00,
      lastOrderDate: '2023-12-01',
      valueSegment: 'Medium Value'
    },
    {
      id: 6,
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      customerType: 'Returning',
      totalOrders: 15,
      totalSpent: 675.30,
      lastOrderDate: '2024-01-11',
      valueSegment: 'Medium Value'
    },
    {
      id: 7,
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      customerType: 'New',
      totalOrders: 2,
      totalSpent: 89.99,
      lastOrderDate: '2024-01-16',
      valueSegment: 'Low Value'
    },
    {
      id: 8,
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      customerType: 'VIP',
      totalOrders: 32,
      totalSpent: 1580.45,
      lastOrderDate: '2024-01-14',
      valueSegment: 'High Value'
    }
  ])
  
  // Computed properties
  const filteredCustomers = computed(() => {
    let filtered = customers.value
  
    if (customerTypeFilter.value !== 'all') {
      filtered = filtered.filter(customer => customer.customerType === customerTypeFilter.value)
    }
  
    if (valueSegmentFilter.value !== 'all') {
      filtered = filtered.filter(customer => customer.valueSegment === valueSegmentFilter.value)
    }
  
    return filtered
  })
  
  // Methods
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'deep-purple'
      case 'Returning': return 'green'
      case 'New': return 'blue'
      case 'At Risk': return 'red'
      default: return 'grey'
    }
  }
  
  const getValueSegmentColor = (segment: string) => {
    switch (segment) {
      case 'High Value': return 'deep-purple'
      case 'Medium Value': return 'orange'
      case 'Low Value': return 'blue'
      default: return 'grey'
    }
  }
  
  const onDateRangeChange = () => {
    // Simulate data refresh based on date range
    refreshData()
  }
  
  const refreshData = async () => {
    refreshing.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update some metrics to show change
      totalCustomers.value = Math.floor(Math.random() * 1000) + 15000
      newCustomers.value = Math.floor(Math.random() * 200) + 800
      averageOrderValue.value = Math.floor(Math.random() * 50) + 150
      customerRetentionRate.value = Math.floor(Math.random() * 20) + 60
      
      snackbar.success('Data refreshed successfully')
    } catch (error) {
      snackbar.error('Error refreshing data')
    } finally {
      refreshing.value = false
    }
  }
  
  const exportReport = () => {
    // Simulate export functionality
    snackbar.success('Customer insights report exported successfully')
  }
  
  const viewCustomerDetails = (customer: any) => {
    snackbar.info(`Opening details for ${customer.name}`)
  }
  
  const sendCustomerEmail = (customer: any) => {
    snackbar.info(`Opening email composer for ${customer.name}`)
  }
  
  const clearCustomerFilters = () => {
    customerSearch.value = ''
    customerTypeFilter.value = 'all'
    valueSegmentFilter.value = 'all'
  }
  
  // Chart initialization
  const initializeCharts = () => {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded')
      return
    }
  
    // Customer Acquisition Chart
    if (acquisitionChart.value) {
      new Chart(acquisitionChart.value, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'New Customers',
              data: [120, 135, 158, 142, 167, 189, 203, 178, 195, 221, 189, 234],
              borderColor: '#7C3AED',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Returning Customers',
              data: [85, 92, 78, 104, 118, 125, 142, 156, 148, 167, 178, 165],
              borderColor: '#059669',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      })
    }
  
    // Customer Segments Chart
    if (segmentChart.value) {
      new Chart(segmentChart.value, {
        type: 'doughnut',
        data: {
          labels: ['New Customers', 'Returning', 'VIP', 'At Risk'],
          datasets: [{
            data: [35, 40, 15, 10],
            backgroundColor: [
              '#3B82F6',
              '#059669',
              '#7C3AED',
              '#DC2626'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }
  }
  
  onMounted(async () => {
    loading.value = true
    try {
      // Simulate initial data loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Initialize charts after DOM is ready
      await nextTick()
      setTimeout(() => {
        initializeCharts()
      }, 100)
      
    } catch (error) {
      console.error('Error loading customer insights:', error)
      snackbar.error('Error loading customer insights')
    } finally {
      loading.value = false
    }
  })
  </script>