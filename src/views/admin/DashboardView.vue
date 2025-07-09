<template>
    <div>
      <!-- Loading Overlay -->
      <v-overlay v-model="loading" class="align-center justify-center">
        <v-progress-circular
          size="64"
          color="orange-darken-2"
          indeterminate
        ></v-progress-circular>
        <div class="text-h6 mt-4 text-white">Loading Dashboard Data...</div>
      </v-overlay>

      <!-- Header Section -->
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between mb-6">
              <div>
                <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                  Super Admin Dashboard
                </h1>
                <p class="text-subtitle-1 text-grey-darken-2">
                  Welcome back, {{ username }}! Here's what's happening with your wood craft business.
                </p>
              </div>
              <v-btn
                @click="loadDashboardData"
                color="orange-darken-2"
                variant="outlined"
                :loading="loading"
                :disabled="loading"
              >
                <v-icon start icon="mdi-refresh"></v-icon>
                Refresh
              </v-btn>
              <v-chip
                :color="getBusinessStatusColor()"
                variant="elevated"
                size="large"
                class="font-weight-bold"
              >
                <v-icon start icon="mdi-trending-up"></v-icon>
                {{ getBusinessStatus() }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
  
        <!-- Error Alert -->
        <v-row v-if="error">
          <v-col cols="12">
            <v-alert
              type="error"
              variant="outlined"
              prominent
              closable
              @click:close="error = null"
            >
              <v-alert-title class="font-weight-bold">Error Loading Dashboard</v-alert-title>
              <div>{{ error }}</div>
              <template v-slot:append>
                <v-btn
                  @click="loadDashboardData"
                  color="orange-darken-2"
                  variant="outlined"
                  size="small"
                  :loading="loading"
                >
                  Retry
                </v-btn>
              </template>
            </v-alert>
          </v-col>
        </v-row>

        <!-- Key Metrics Cards -->
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card 
              class="stats-card elevation-4" 
              color="orange-darken-2"
              variant="elevated"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="yellow-lighten-2" icon="mdi-currency-usd" class="mb-3"></v-icon>
                <h3 class="text-h4 font-weight-bold text-white mb-2">
                  ${{ formatCurrency(stats.totalRevenue) }}
                </h3>
                <p class="text-orange-lighten-4 mb-0">Total Revenue</p>
                <v-chip 
                  size="small" 
                  :color="stats.revenueGrowth >= 0 ? 'green-lighten-1' : 'red-lighten-1'"
                  class="mt-2"
                >
                  <v-icon 
                    start 
                    :icon="stats.revenueGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
                  ></v-icon>
                  {{ Math.abs(stats.revenueGrowth) }}%
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" sm="6" md="3">
            <v-card 
              class="stats-card elevation-4" 
              color="orange-darken-3"
              variant="elevated"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="yellow-lighten-2" icon="mdi-shopping" class="mb-3"></v-icon>
                <h3 class="text-h4 font-weight-bold text-white mb-2">
                  {{ stats.totalOrders.toLocaleString() }}
                </h3>
                <p class="text-orange-lighten-4 mb-0">Total Orders</p>
                <v-chip 
                  size="small" 
                  :color="stats.orderGrowth >= 0 ? 'green-lighten-1' : 'red-lighten-1'"
                  class="mt-2"
                >
                  <v-icon 
                    start 
                    :icon="stats.orderGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
                  ></v-icon>
                  {{ Math.abs(stats.orderGrowth) }}%
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" sm="6" md="3">
            <v-card 
              class="stats-card elevation-4" 
              color="orange-darken-4"
              variant="elevated"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="yellow-lighten-2" icon="mdi-account-group" class="mb-3"></v-icon>
                <h3 class="text-h4 font-weight-bold text-white mb-2">
                  {{ stats.totalCustomers.toLocaleString() }}
                </h3>
                <p class="text-orange-lighten-4 mb-0">Total Customers</p>
                <v-chip 
                  size="small" 
                  :color="stats.customerGrowth >= 0 ? 'green-lighten-1' : 'red-lighten-1'"
                  class="mt-2"
                >
                  <v-icon 
                    start 
                    :icon="stats.customerGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
                  ></v-icon>
                  {{ Math.abs(stats.customerGrowth) }}%
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" sm="6" md="3">
            <v-card 
              class="stats-card elevation-4" 
              color="brown-darken-2"
              variant="elevated"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="yellow-lighten-2" icon="mdi-package-variant" class="mb-3"></v-icon>
                <h3 class="text-h4 font-weight-bold text-white mb-2">
                  {{ stats.totalProducts.toLocaleString() }}
                </h3>
                <p class="text-orange-lighten-4 mb-0">Total Products</p>
                <v-chip 
                  size="small" 
                  color="blue-lighten-1"
                  class="mt-2"
                >
                  <v-icon start icon="mdi-package"></v-icon>
                  {{ stats.activeProducts }} Active
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Charts Section -->
        <v-row class="mt-6">
          <v-col cols="12" md="8">
            <v-card class="elevation-4" color="white">
              <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                <v-icon icon="mdi-chart-line" class="me-2"></v-icon>
                Revenue Analytics
              </v-card-title>
              <v-card-text class="pa-6">
                <canvas ref="revenueChart" height="300"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-card class="elevation-4" color="white">
              <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                <v-icon icon="mdi-chart-donut" class="me-2"></v-icon>
                Sales by Category
              </v-card-title>
              <v-card-text class="pa-6">
                <canvas ref="categoryChart" height="300"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Recent Activity & Quick Actions -->
        <v-row class="mt-6">
          <v-col cols="12" md="6">
            <v-card class="elevation-4" color="white">
              <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                <v-icon icon="mdi-clock-outline" class="me-2"></v-icon>
                Recent Orders
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list>
                  <v-list-item
                    v-for="order in recentOrders"
                    :key="order.orderId"
                    class="px-6 py-3"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="getOrderStatusColor(order.status)" size="40">
                        <v-icon :icon="getOrderStatusIcon(order.status)" color="white"></v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium">
                      Order #{{ order.orderId }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ order.customerName }} • ${{ order.total }}
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip
                        :color="getOrderStatusColor(order.status)"
                        size="small"
                        variant="outlined"
                      >
                        {{ order.status }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="6">
            <v-card class="elevation-4" color="white">
              <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                <v-icon icon="mdi-flash" class="me-2"></v-icon>
                Quick Actions
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="6">
                    <v-btn
                      :to="{ name: 'products-create' }"
                      color="orange-darken-2"
                      variant="elevated"
                      block
                      size="large"
                      class="mb-3"
                    >
                      <v-icon start icon="mdi-plus"></v-icon>
                      Add Product
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      :to="{ name: 'orders' }"
                      color="orange-darken-3"
                      variant="elevated"
                      block
                      size="large"
                      class="mb-3"
                    >
                      <v-icon start icon="mdi-shopping"></v-icon>
                      View Orders
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      :to="{ name: 'customers' }"
                      color="brown-darken-2"
                      variant="elevated"
                      block
                      size="large"
                      class="mb-3"
                    >
                      <v-icon start icon="mdi-account-group"></v-icon>
                      Customers
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      :to="{ name: 'inventory-dashboard' }"
                      color="orange-darken-4"
                      variant="elevated"
                      block
                      size="large"
                      class="mb-3"
                    >
                      <v-icon start icon="mdi-warehouse"></v-icon>
                      Inventory
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Alerts & Notifications -->
        <v-row class="mt-6">
          <v-col cols="12">
            <v-card class="elevation-4" color="white">
              <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                <v-icon icon="mdi-alert-circle" class="me-2"></v-icon>
                System Alerts
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-alert
                      type="warning"
                      variant="outlined"
                      prominent
                      class="mb-4"
                    >
                      <v-alert-title class="font-weight-bold">Low Stock Alert</v-alert-title>
                      <div>{{ stats.lowStockCount }} products are running low on inventory</div>
                      <template v-slot:append>
                        <v-btn
                          :to="{ name: 'stock-alerts' }"
                          color="orange-darken-2"
                          variant="outlined"
                          size="small"
                        >
                          View Details
                        </v-btn>
                      </template>
                    </v-alert>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-alert
                      type="info"
                      variant="outlined"
                      prominent
                      class="mb-4"
                    >
                      <v-alert-title class="font-weight-bold">Pending Orders</v-alert-title>
                      <div>{{ stats.pendingOrdersCount }} orders await processing</div>
                      <template v-slot:append>
                        <v-btn
                          :to="{ name: 'orders-pending' }"
                          color="blue-darken-2"
                          variant="outlined"
                          size="small"
                        >
                          Process
                        </v-btn>
                      </template>
                    </v-alert>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-alert
                      type="success"
                      variant="outlined"
                      prominent
                      class="mb-4"
                    >
                      <v-alert-title class="font-weight-bold">New Reviews</v-alert-title>
                      <div>{{ stats.newReviewsCount }} new customer reviews received</div>
                      <template v-slot:append>
                        <v-btn
                          :to="{ name: 'reviews' }"
                          color="green-darken-2"
                          variant="outlined"
                          size="small"
                        >
                          View All
                        </v-btn>
                      </template>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Top Performing Products -->
        <v-row class="mt-6">
          <v-col cols="12">
            <v-card class="elevation-4" color="white">
              <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                <v-icon icon="mdi-star" class="me-2"></v-icon>
                Top Performing Products
              </v-card-title>
              <v-card-text class="pa-0">
                <v-data-table
                  :headers="productHeaders"
                  :items="topProducts"
                  :items-per-page="5"
                  class="elevation-0"
                >
                  <template v-slot:item.image="{ item }">
                    <v-avatar size="60" class="my-2">
                      <v-img :src="item.image" :alt="item.name"></v-img>
                    </v-avatar>
                  </template>
                  <template v-slot:item.sales="{ item }">
                    <div class="text-center">
                      <div class="font-weight-bold">${{ item.sales.toLocaleString() }}</div>
                      <div class="text-caption text-grey">{{ item.unitsSold }} units</div>
                    </div>
                  </template>
                  <template v-slot:item.rating="{ item }">
                    <div class="d-flex align-center">
                      <v-rating
                        :model-value="item.rating"
                        color="amber"
                        density="compact"
                        half-increments
                        readonly
                        size="small"
                      ></v-rating>
                      <span class="text-caption ms-2">({{ item.reviewCount }})</span>
                    </div>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      :to="{ name: 'product-details', params: { id: item.productId } }"
                      color="orange-darken-2"
                      variant="outlined"
                      size="small"
                    >
                      View Details
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useUserStore } from '@/stores/user'
  import Chart from 'chart.js/auto'
  import { dashboardService, type DashboardData, type DashboardStats, type RecentOrder, type TopProduct } from '@/services/dashboard'
  
  // Stores
  const userStore = useUserStore()
  
  // Chart refs
  const revenueChart = ref<HTMLCanvasElement | null>(null)
  const categoryChart = ref<HTMLCanvasElement | null>(null)
  
  // Loading states
  const loading = ref(false)
  
  // Computed properties
  const username = computed(() => userStore.user?.username || 'Admin')
  
  // Dashboard data
  const dashboardData = ref<DashboardData | null>(null)
  const stats = ref<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    activeProducts: 0,
    lowStockCount: 0,
    pendingOrdersCount: 0,
    newReviewsCount: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0
  })
  const error = ref<string | null>(null)
  
  // Recent orders data
  const recentOrders = ref<RecentOrder[]>([])
  
  // Top products data
  const topProducts = ref<TopProduct[]>([])
  
  // Table headers
  const productHeaders = [
    { title: 'Image', key: 'image', sortable: false },
    { title: 'Product Name', key: 'name' },
    { title: 'Category', key: 'category' },
    { title: 'Sales', key: 'sales', align: 'center' },
    { title: 'Rating', key: 'rating', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Methods
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }
  
  const getBusinessStatus = () => {
    if (stats.value.revenueGrowth >= 15) return 'Excellent'
    if (stats.value.revenueGrowth >= 10) return 'Good'
    if (stats.value.revenueGrowth >= 5) return 'Stable'
    return 'Needs Attention'
  }
  
  const getBusinessStatusColor = () => {
    if (stats.value.revenueGrowth >= 15) return 'green'
    if (stats.value.revenueGrowth >= 10) return 'orange'
    if (stats.value.revenueGrowth >= 5) return 'blue'
    return 'red'
  }
  
  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'green'
      case 'shipped': return 'blue'
      case 'processing': return 'orange'
      case 'pending': return 'grey'
      default: return 'grey'
    }
  }
  
  const getOrderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'mdi-check-circle'
      case 'shipped': return 'mdi-truck-delivery'
      case 'processing': return 'mdi-cog'
      case 'pending': return 'mdi-clock-outline'
      default: return 'mdi-help-circle'
    }
  }
  
  const initializeCharts = () => {
    // Revenue Chart
    if (revenueChart.value) {
      new Chart(revenueChart.value, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue',
            data: [15000, 18000, 22000, 19000, 25000, 28000],
            borderColor: '#E65100',
            backgroundColor: 'rgba(230, 81, 0, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString()
                }
              }
            }
          }
        }
      })
    }
  
    // Category Chart
    if (categoryChart.value) {
      new Chart(categoryChart.value, {
        type: 'doughnut',
        data: {
          labels: ['Furniture', 'Accessories', 'Kitchenware', 'Decor', 'Tools'],
          datasets: [{
            data: [35, 25, 15, 20, 5],
            backgroundColor: [
              '#E65100',
              '#F57C00',
              '#FF9800',
              '#FFB74D',
              '#FFCC02'
            ],
            borderWidth: 0
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
  
  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await dashboardService.getDashboardData()
      dashboardData.value = data
      stats.value = data.stats
      recentOrders.value = data.recentOrders
      topProducts.value = data.topProducts
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      error.value = 'Failed to load dashboard data. Please try again.'
    } finally {
      loading.value = false
    }
  }

  // Lifecycle
  onMounted(async () => {
    await loadDashboardData()
    
    // Initialize charts after DOM is ready
    await nextTick()
    initializeCharts()
  })
  </script>
  
  <style scoped>
  .stats-card {
    transition: transform 0.2s ease-in-out;
  }
  
  .stats-card:hover {
    transform: translateY(-2px);
  }
  
  .v-data-table ::v-deep(.v-data-table__wrapper) {
    border-radius: 0;
  }
  
  .v-data-table ::v-deep(.v-data-table-header) {
    background-color: #FFF3E0;
  }
  
  .v-data-table ::v-deep(.v-data-table-header th) {
    color: #E65100 !important;
    font-weight: bold;
  }
  
  .v-alert {
    border-left: 4px solid currentColor;
  }
  
  .v-card {
    border-radius: 12px;
  }
  
  .v-btn {
    border-radius: 8px;
  }
  
  .v-chip {
    border-radius: 6px;
  }
  </style>