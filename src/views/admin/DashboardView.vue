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
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas ref="revenueChart"></canvas>
              </div>
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
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas ref="categoryChart"></canvas>
              </div>
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
                    {{ order.customerName}} • ${{ order.total }}
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
                    :to="{ name: 'admin-customers' }"
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
                    :to="{ name: 'stock-alerts' }"
                    color="orange-darken-4"
                    variant="elevated"
                    block
                    size="large"
                    class="mb-3"
                  >
                    <v-icon start icon="mdi-warehouse"></v-icon>
                    Stock Alerts
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
                <template v-slot:item.categoryId="{ item }">
                  <div class="text-center">
                    <div class="font-weight-bold">{{ getCategoryName(item.categoryId) }}</div>
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
import { apiService, type IAPIResponse } from '@/services/api'
import { ChartData, MostSoldProduct, ProductCategory } from '@/stores/types/member'

// Stores
const userStore = useUserStore()
interface SalesSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  monthlyOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

// Chart refs
const revenueChart = ref<HTMLCanvasElement | null>(null)
const categoryChart = ref<HTMLCanvasElement | null>(null)

// Chart instances
let revenueChartInstance: Chart | null = null
let categoryChartInstance: Chart | null = null

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
const topProducts = ref<MostSoldProduct[]>([])
const productCategories = ref<ProductCategory[]>([])

function getCategoryName(catId: number): string {
  return productCategories.value.find(a => a.categoryId === catId)?.categoryName ?? 'Unknown';
}


// Table headers
const productHeaders = [
  { title: 'Product Name', key: 'productName' },
  { title: 'SKU', key: 'productSku' },
  { title: 'Category', key: 'categoryId' }, // Or 'categoryName' if you map it
  { title: 'Wood Type', key: 'woodType' },
  { title: 'Artisan', key: 'artisanName' },
  { title: 'Total Sold', key: 'totalQuantitySold', align: 'center' },
  { title: 'Revenue', key: 'totalRevenue', align: 'center' },
  { title: 'Orders', key: 'orderCount', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false }
];


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

// API Functions
const fetchRevenueData = async () => {
  try {
    const response = await apiService.get<IAPIResponse<ChartData>>(`/dashboard/revenue-chart`)
  
    return response.payload || {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [15000, 18000, 22000, 19000, 25000, 28000]
    }
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    // Return fallback data
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [15000, 18000, 22000, 19000, 25000, 28000]
    }
  }
}

const fetchCategoryData = async () => {
  try {
    const response = await apiService.get<IAPIResponse<any>>(`/dashboard/category-chart`)
    if (!response.isSuccessful) throw new Error('Failed to fetch category data')
    return response.payload
  } catch (error) {
    console.error('Error fetching category data:', error)
    // Return fallback data
    return {
      labels: ['Furniture', 'Accessories', 'Kitchenware', 'Decor', 'Tools'],
      data: [35, 25, 15, 20, 5]
    }
  }
}

const initializeCharts = async () => {
  try {
    // Ensure canvas elements are available
    if (!revenueChart.value || !categoryChart.value) {
      console.error('Chart canvases not available')
      return
    }

    // Destroy existing charts if they exist
    if (revenueChartInstance) {
      revenueChartInstance.destroy()
    }
    if (categoryChartInstance) {
      categoryChartInstance.destroy()
    }

    // Revenue Chart
    const revenueData = await fetchRevenueData()
    revenueChartInstance = new Chart(revenueChart.value, {
      type: 'line',
      data: {
        labels: revenueData!.labels,
        datasets: [{
          label: 'Revenue',
          data: revenueData!.data,
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
              callback: function(value: any) {
                return '$' + value.toLocaleString()
              }
            }
          }
        }
      }
    })

    // Category Chart
    const categoryData = await fetchCategoryData()
    categoryChartInstance = new Chart(categoryChart.value, {
      type: 'doughnut',
      data: {
        labels: categoryData.labels,
        datasets: [{
          data: categoryData.data,
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
            position: 'bottom' as const
          }
        }
      }
    })

    // Load additional dashboard data
    await loadMostSoldProduct()
    await loadDashboardSummary()
    await loadTopProducts()
    
  } catch (error) {
    console.error('Error initializing charts:', error)
  }
}

const loadMostSoldProduct = async () => {
  try {
    const response = await apiService.get<IAPIResponse<any>>(`/dashboard/most-sold-product`)
    if (!response.isSuccessful) throw new Error('Failed to fetch most sold product')
    const product = response.payload
    
    // Handle most sold product data as needed
    console.log('Most sold product:', product)
  } catch (error) {
    console.error('Error fetching most sold product:', error)
  }
}

const loadDashboardSummary = async () => {
  try {
    const response = await apiService.get<IAPIResponse<SalesSummary>>(`/dashboard/dashboard-summary`)
    if (!response.isSuccessful) throw new Error('Failed to fetch dashboard summary')
    const summary = response.payload
    
    // Update stats with summary data
    stats.value = { ...stats.value, ...summary }
  } catch (error) {
    console.error('Error fetching dashboard summary:', error)
  }
}

const loadTopProducts = async (count = 10) => {
  try {
    const response = await apiService.get<IAPIResponse<MostSoldProduct[]>>(`/dashboard/top-products?count=${count}`)
    if (!response.isSuccessful) throw new Error('Failed to fetch top products')
    const products = response.payload
    
    topProducts.value = products || []
  } catch (error) {
    console.error('Error fetching top products:', error)
  }
}

// Load dashboard data
const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Load main dashboard data
    const data = await dashboardService.getDashboardData()
    dashboardData.value = data
    stats.value = data.stats
    recentOrders.value = data.recentOrders
    productCategories.value = data.categories

    // Initialize charts after data is loaded
    await nextTick()
    await initializeCharts()
    
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

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>