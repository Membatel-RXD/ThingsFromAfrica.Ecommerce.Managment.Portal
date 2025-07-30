<template>
    <div class="sales-report-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-3">Sales Report</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Analyze your craft business performance and revenue insights
            </p>
          </div>
          <div class="d-flex gap-2">
            <v-btn
              color="green-darken-2"
              variant="elevated"
              prepend-icon="mdi-download"
              @click="exportReport"
            >
              Export Report
            </v-btn>
            <v-btn
              color="orange-darken-2"
              variant="outlined"
              prepend-icon="mdi-refresh"
              @click="refreshData"
            >
              Refresh
            </v-btn>
          </div>
        </div>
  
        <!-- Date Range and Filters -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedPeriod"
                  label="Time Period"
                  :items="periodOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="updateDateRange"
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
              <v-col cols="12" md="2">
                <v-select
                  v-model="categoryFilter"
                  label="Category"
                  :items="categoryOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="customerTypeFilter"
                  label="Customer Type"
                  :items="customerTypeOptions"
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
  
        <!-- Key Metrics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-currency-usd</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ formatCurrency(salesMetrics.totalRevenue) }}</h3>
                  <p class="text-body-2 text-green-darken-1">Total Revenue</p>
                  <v-chip
                    :color="salesMetrics.revenueGrowth >= 0 ? 'green' : 'red'"
                    size="x-small"
                    class="mt-1"
                  >
                    {{ salesMetrics.revenueGrowth >= 0 ? '+' : '' }}{{ salesMetrics.revenueGrowth.toFixed(1) }}%
                  </v-chip>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-shopping</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ salesMetrics.totalOrders }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Total Orders</p>
                  <v-chip
                    :color="salesMetrics.ordersGrowth >= 0 ? 'green' : 'red'"
                    size="x-small"
                    class="mt-1"
                  >
                    {{ salesMetrics.ordersGrowth >= 0 ? '+' : '' }}{{ salesMetrics.ordersGrowth.toFixed(1) }}%
                  </v-chip>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-chart-line</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ formatCurrency(salesMetrics.averageOrderValue) }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Avg Order Value</p>
                  <v-chip
                    :color="salesMetrics.aovGrowth >= 0 ? 'green' : 'red'"
                    size="x-small"
                    class="mt-1"
                  >
                    {{ salesMetrics.aovGrowth >= 0 ? '+' : '' }}{{ salesMetrics.aovGrowth.toFixed(1) }}%
                  </v-chip>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-account-group</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ salesMetrics.totalCustomers }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Total Customers</p>
                  <v-chip
                    :color="salesMetrics.customersGrowth >= 0 ? 'green' : 'red'"
                    size="x-small"
                    class="mt-1"
                  >
                    {{ salesMetrics.customersGrowth >= 0 ? '+' : '' }}{{ salesMetrics.customersGrowth.toFixed(1) }}%
                  </v-chip>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Charts Row -->
        <v-row class="mb-6">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title class="pa-6 bg-green-lighten-5">
                <v-icon class="me-2" color="green-darken-3">mdi-chart-line</v-icon>
                Revenue Trend
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="chart-container" style="height: 300px;">
                  <canvas ref="revenueChart"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="pa-6 bg-blue-lighten-5">
                <v-icon class="me-2" color="blue-darken-3">mdi-chart-donut</v-icon>
                Sales by Category
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="chart-container" style="height: 300px;">
                  <canvas ref="categoryChart"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Additional Analytics Row -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="pa-6 bg-purple-lighten-5">
                <v-icon class="me-2" color="purple-darken-3">mdi-account-star</v-icon>
                Customer Type Analysis
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="chart-container" style="height: 250px;">
                  <canvas ref="customerTypeChart"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="pa-6 bg-orange-lighten-5">
                <v-icon class="me-2" color="orange-darken-3">mdi-calendar-month</v-icon>
                Monthly Performance
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="chart-container" style="height: 250px;">
                  <canvas ref="monthlyChart"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Top Products and Customers -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="pa-6 bg-green-lighten-5">
                <v-icon class="me-2" color="green-darken-3">mdi-star</v-icon>
                Top Selling Products
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list>
                  <v-list-item
                    v-for="(product, index) in topProducts"
                    :key="product.id"
                    class="px-6 py-3"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="getProductColor(index)" size="32">
                        {{ index + 1 }}
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ product.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ product.quantitySold }} units sold</v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="text-right">
                        <div class="font-weight-bold">{{ formatCurrency(product.revenue) }}</div>
                        <div class="text-caption text-grey">{{ product.category }}</div>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="pa-6 bg-blue-lighten-5">
                <v-icon class="me-2" color="blue-darken-3">mdi-account-heart</v-icon>
                Top Customers
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list>
                  <v-list-item
                    v-for="(customer, index) in topCustomers"
                    :key="customer.id"
                    class="px-6 py-3"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="getCustomerColor(index)" size="32">
                        {{ index + 1 }}
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ customer.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ customer.email }}</v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="text-right">
                        <div class="font-weight-bold">{{ formatCurrency(customer.totalSpent) }}</div>
                        <div class="text-caption text-grey">{{ customer.orderCount }} orders</div>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Detailed Sales Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-table</v-icon>
            Detailed Sales Data
          </v-card-title>
          
          <v-data-table
            :headers="salesHeaders"
            :items="detailedSalesData"
            :loading="loading"
            class="elevation-1"
            :sort-by="[{ key: 'date', order: 'desc' }]"
          >
            <template v-slot:item.date="{ item }">
              {{ formatDate(item.date) }}
            </template>
  
            <template v-slot:item.revenue="{ item }">
              {{ formatCurrency(item.revenue) }}
            </template>
  
            <template v-slot:item.averageOrderValue="{ item }">
              {{ formatCurrency(item.averageOrderValue) }}
            </template>
  
            <template v-slot:item.customerType="{ item }">
              <v-chip
                :color="item.customerType === 'Tourist' ? 'blue' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.customerType }}
              </v-chip>
            </template>
  
            <template v-slot:item.conversionRate="{ item }">
              {{ (item.conversionRate * 100).toFixed(1) }}%
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue'
  import { Chart, registerables } from 'chart.js'
import { apiService, IAPIResponse } from '@/services/api'
import { useProductCategoryStore } from '@/stores/productCategory';
import { ChartData } from '@/stores/types/member';
  
  const categoryStore = useProductCategoryStore();
  Chart.register(...registerables)
  
  // Data
  const loading = ref(false)
  const selectedPeriod = ref('last30days')
  const startDate = ref('')
  const endDate = ref('')
  const categoryFilter = ref('all')
  const customerTypeFilter = ref('all')
  
  // Chart refs
  const revenueChart = ref<HTMLCanvasElement>()
  const categoryChart = ref<HTMLCanvasElement>()
  const customerTypeChart = ref<HTMLCanvasElement>()
  const monthlyChart = ref<HTMLCanvasElement>()
  
  // Chart instances
  let revenueChartInstance: Chart | null = null
  let categoryChartInstance: Chart | null = null
  let customerTypeChartInstance: Chart | null = null
  let monthlyChartInstance: Chart | null = null
  
  interface SalesReportItem {
    id: number;
    name: string;
    category: string;
    quantitySold: number;
    revenue: number;
 }

 interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  averageOrderValue: number;
  aovGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
}

interface TopCustomers {
    id: number,
    name: string,
    email: string,
    totalSpent: number,
    orderCount: number
}


interface DailySalesMetric {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  customerType: string;
  conversionRate: number;
}
interface CategoryChartData {
  categories: string[];
  values: number[];
}

interface CustomerTypeChartData {
  tourist: number;
  local: number;
}




  // Options
  const periodOptions = [
    { title: 'Last 7 Days', value: 'last7days' },
    { title: 'Last 30 Days', value: 'last30days' },
    { title: 'Last 3 Months', value: 'last3months' },
    { title: 'Last 6 Months', value: 'last6months' },
    { title: 'Last Year', value: 'lastyear' },
    { title: 'Custom Range', value: 'custom' }
  ]
  
  const categoryOptions = ref<string[]>([]);

  const customerTypeOptions = [
    { title: 'All Customers', value: 'all' },
    { title: 'Tourist Orders', value: 'tourist' },
    { title: 'Local Orders', value: 'local' }
  ]
  const salesMetrics = ref<DashboardMetrics>({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    averageOrderValue: 0,
    aovGrowth: 0,
    totalCustomers: 0,
    customersGrowth: 0
  })
  async function GetSalesMetricsData() {
    try {
        const response = await apiService.get<IAPIResponse<DashboardMetrics>>('Dashboard/metrics');
        if (response.isSuccessful && response.payload) {
            salesMetrics.value = response.payload;
        }
    } catch (error) {
        console.log("Failed to retirve sales data metrics")
    }
  }
    // Top products (sample data)
  const topProducts = ref<SalesReportItem[]>([]);
  async function GetTopSoldProducts() {
    try {
        const response = await apiService.get<IAPIResponse<SalesReportItem[]>>('Dashboard/top-performing-products');
        if (response.isSuccessful && response.payload) {
            topProducts.value = response.payload;
        }
    } catch (error) {
        console.log("Failed to retirve sales data metrics")
    }
  }
const revenueChartData = ref<ChartData>({ labels: [], data: [] });

async function GetRevenueChartData() {
  try {
    const response = await apiService.get<IAPIResponse<ChartData>>('Dashboard/revenue-trend');
    if (response.isSuccessful && response.payload) {
      revenueChartData.value = response.payload;
    }
  } catch (error) {
    console.error('Failed to retrieve revenue chart data', error);
  }
}
const monthlyPerformanceChartData = ref<ChartData>({ labels: [], data: [] });

async function GetMonthlyPerfomanceData() {
  try {
    const response = await apiService.get<IAPIResponse<ChartData>>('Dashboard/monthly-performance');
    if (response.isSuccessful && response.payload) {
        monthlyPerformanceChartData.value = response.payload;
    }
  } catch (error) {
    console.error('Failed to retrieve revenue chart data', error);
  }
}
const categoryChartData = ref<CategoryChartData>({ categories: [], values: [] });

async function GetCategoryChartData() {
  try {
    const response = await apiService.get<IAPIResponse<CategoryChartData>>('Dashboard/category-distribution');
    if (response.isSuccessful && response.payload) {
      categoryChartData.value = response.payload;
    }
  } catch (error) {
    console.error('Failed to retrieve category chart data', error);
  }
}

  
  // Top customers (sample data)
  const topCustomers = ref<TopCustomers[]>([])

  async function GetTopCustomers() {
    try {
        const response = await apiService.get<IAPIResponse<TopCustomers[]>>('Dashboard/top-customers');
        if (response.isSuccessful && response.payload) {
            topCustomers.value = response.payload;
        }
    } catch (error) {
        console.log("Failed to retirve sales data metrics")
    }
  }
  
  const detailedSalesData = ref<DailySalesMetric[]>();

  async function GetSalesData() {
    try {
        const response = await apiService.get<IAPIResponse<DailySalesMetric[]>>('Dashboard/sales-data');
        if (response.isSuccessful && response.payload) {
            detailedSalesData.value = response.payload;
        }
    } catch (error) {
        console.log("Failed to retirve sales data metrics")
    }
  }
  const customerTypeChartData = ref<CustomerTypeChartData>({ tourist: 0, local: 0 });

  async function GetCustomerTypeDistributionata() {
    try {
        const response = await apiService.get<IAPIResponse<CustomerTypeChartData>>('Dashboard/customer-type-distribution');
        if (response.isSuccessful && response.payload) {
            customerTypeChartData.value = response.payload;
        }
    } catch (error) {
        console.log("Failed to retirve sales data metrics")
    }
  }
  
  // Table headers
  const salesHeaders = [
    { title: 'Date', key: 'date' },
    { title: 'Revenue', key: 'revenue' },
    { title: 'Orders', key: 'orders' },
    { title: 'Avg Order Value', key: 'averageOrderValue' },
    { title: 'Customer Type', key: 'customerType' },
    { title: 'Conversion Rate', key: 'conversionRate' }
  ]
  
  // Methods
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  const getProductColor = (index: number) => {
    const colors = ['green', 'blue', 'orange', 'purple', 'red']
    return colors[index] || 'grey'
  }
  
  const getCustomerColor = (index: number) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red']
    return colors[index] || 'grey'
  }
  
  const updateDateRange = () => {
    const today = new Date()
    const endDateObj = new Date(today)
    let startDateObj = new Date(today)
  
    switch (selectedPeriod.value) {
      case 'last7days':
        startDateObj.setDate(today.getDate() - 7)
        break
      case 'last30days':
        startDateObj.setDate(today.getDate() - 30)
        break
      case 'last3months':
        startDateObj.setMonth(today.getMonth() - 3)
        break
      case 'last6months':
        startDateObj.setMonth(today.getMonth() - 6)
        break
      case 'lastyear':
        startDateObj.setFullYear(today.getFullYear() - 1)
        break
    }
  
    if (selectedPeriod.value !== 'custom') {
      startDate.value = startDateObj.toISOString().split('T')[0]
      endDate.value = endDateObj.toISOString().split('T')[0]
    }
  }
  
  const clearFilters = () => {
    selectedPeriod.value = 'last30days'
    categoryFilter.value = 'all'
    customerTypeFilter.value = 'all'
    updateDateRange()
  }
  
  const exportReport = () => {
    // Implementation for exporting report
    console.log('Exporting sales report...')
  }
  
  const refreshData = () => {
    // Implementation for refreshing data
    console.log('Refreshing sales data...')
  }
  
  const initializeCharts = async () => {
    await nextTick()
  
    // Revenue Trend Chart
    if (revenueChart.value) {
      const ctx = revenueChart.value.getContext('2d')
      if (ctx) {
        revenueChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: revenueChartData.value.labels,
            datasets: [{
              label: 'Revenue',
              data: revenueChartData.value.data,
              borderColor: '#2E7D32',
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              tension: 0.4,
              fill: true
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
    }
  
    // Category Distribution Chart
    if (categoryChart.value) {
      const ctx = categoryChart.value.getContext('2d')
      if (ctx) {
        categoryChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: categoryChartData.value.categories,
            datasets: [{
                data: categoryChartData.value.values,
                backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800',
                '#9C27B0',
                '#F44336'
              ]
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
  
    // Customer Type Chart
    if (customerTypeChart.value) {
      const ctx = customerTypeChart.value.getContext('2d')
      if (ctx) {
        const labels = ['Tourist', 'Local'];
        const data = [
        customerTypeChartData.value.tourist || 0,
        customerTypeChartData.value.local || 0
        ];

        customerTypeChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Orders',
              data: data,
              backgroundColor: ['#2196F3', '#757575']
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
                beginAtZero: true
              }
            }
          }
        })
      }
    }
  
    // Monthly Performance Chart
    if (monthlyChart.value) {
      const ctx = monthlyChart.value.getContext('2d')
      if (ctx) {
        monthlyChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels:  monthlyPerformanceChartData.value.labels,
            datasets: [{
              label: 'Revenue',
              data: monthlyPerformanceChartData.value.data,
              backgroundColor: '#FF9800'
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
                    return '$' + (value / 1000) + 'K'
                  }
                }
              }
            }
          }
        })
      }
    }
  }
  
  const destroyCharts = () => {
    if (revenueChartInstance) {
      revenueChartInstance.destroy()
      revenueChartInstance = null
    }
    if (categoryChartInstance) {
      categoryChartInstance.destroy()
      categoryChartInstance = null
    }
    if (customerTypeChartInstance) {
      customerTypeChartInstance.destroy()
      customerTypeChartInstance = null
    }
    if (monthlyChartInstance) {
      monthlyChartInstance.destroy()
      monthlyChartInstance = null
    }
  }
  onMounted(async () => {
  updateDateRange();

  await Promise.all([
    GetSalesMetricsData(),
    GetTopSoldProducts(),
    GetTopCustomers(),
    categoryStore.fetchCategories(),

    GetSalesData(),
    GetRevenueChartData(),
    GetCategoryChartData(),
    GetMonthlyPerfomanceData(),
    GetCustomerTypeDistributionata()
  ]);
  initializeCharts();
  categoryOptions.value = ['all', ...categoryStore.categories.map(c => c.categoryName)];

});

  </script>
  
  <style scoped>
  .sales-report-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  
  .chart-container {
    position: relative;
  }
  </style>