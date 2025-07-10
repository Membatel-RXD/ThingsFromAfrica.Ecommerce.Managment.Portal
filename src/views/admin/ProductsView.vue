<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                Products
              </h1>
              <p class="text-subtitle-1 text-grey-darken-2">
                Manage your product catalog, inventory, and pricing
              </p>
            </div>
            <v-btn color="orange-darken-2" variant="elevated" size="large" @click="showAddDialog = true">
              <v-icon start icon="mdi-plus"></v-icon>
              Add Product
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Stat Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="3">
          <v-card color="orange-lighten-3" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="orange-darken-2" icon="mdi-package-variant" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-orange-darken-4">{{ stats.totalProducts }}</h3>
              <p class="mb-0">Total Products</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card color="green-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="green-darken-2" icon="mdi-check-circle" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-green-darken-2">{{ stats.activeProducts }}</h3>
              <p class="mb-0">Active Products</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card color="blue-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="blue-darken-2" icon="mdi-shape" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-blue-darken-2">{{ stats.totalCategories }}</h3>
              <p class="mb-0">Categories</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card color="purple-lighten-4" variant="elevated">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="purple-darken-2" icon="mdi-currency-usd" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-purple-darken-2">${{ stats.avgPrice }}</h3>
              <p class="mb-0">Avg. Price</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-card class="elevation-4 mb-6">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.search"
                label="Search products..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.status"
                label="Status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.category"
                label="Category"
                :items="categoryOptions"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.stock"
                label="Stock"
                :items="stockOptions"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn color="orange-darken-2" variant="outlined" block @click="clearFilters">
                Clear Filters
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Products Table -->
      <v-card class="elevation-4">
        <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
          <v-icon icon="mdi-package-variant" class="me-2"></v-icon>
          Products Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredProducts"
          :search="filters.search"
          item-key="productId"
          class="elevation-0"
          :items-per-page="pagination.itemsPerPage"
          :page.sync="pagination.page"
          show-current-page
          :footer-props="{ 'items-per-page-options': [5, 10, 20, 50], 'items-per-page-text': 'Items per page:' }"
        >
          <template v-slot:item.photo="{ item }">
            <v-avatar size="40">
              <v-img :src="item.mainImageUrl || '/api/placeholder/60/60'" :alt="item.productName"></v-img>
            </v-avatar>
          </template>
          <template v-slot:item.price="{ item }">
            <span>${{ item.price.toFixed(2) }}</span>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Active' ? 'green' : 'grey'" size="small">
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-eye" size="small" variant="text" color="blue"></v-btn>
            <v-btn icon="mdi-pencil" size="small" variant="text" color="orange"></v-btn>
            <v-btn icon="mdi-delete" size="small" variant="text" color="red"></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <!-- Product Add Dialog -->
    <ProductFormDialog v-model="showAddDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ProductFormDialog from './ProductFormDialog.vue';

// Mock data
const products = ref([
  {
    productId: 1,
    productName: 'Handcrafted Oak Table',
    mainImageUrl: '/api/placeholder/300/300',
    price: 599.99,
    category: 'Furniture',
    stock: 15,
    status: 'Active',
  },
  {
    productId: 2,
    productName: 'Mahogany Jewelry Box',
    mainImageUrl: '/api/placeholder/300/300',
    price: 89.99,
    category: 'Accessories',
    stock: 3,
    status: 'Active',
  },
  {
    productId: 3,
    productName: 'Cedar Bookshelf',
    mainImageUrl: '/api/placeholder/300/300',
    price: 299.99,
    category: 'Furniture',
    stock: 0,
    status: 'Inactive',
  },
]);

const categoryOptions = ['All', 'Furniture', 'Accessories', 'Decor', 'Kitchenware'];
const statusOptions = ['All', 'Active', 'Inactive'];
const stockOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

const filters = ref({
  search: '',
  status: 'All',
  category: 'All',
  stock: 'All',
});

const headers = [
  { title: 'Photo', key: 'photo', sortable: false },
  { title: 'Name', key: 'productName' },
  { title: 'Price', key: 'price' },
  { title: 'Category', key: 'category' },
  { title: 'Stock', key: 'stock' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const filteredProducts = computed(() => {
  let filtered = products.value;
  if (filters.value.status !== 'All') {
    filtered = filtered.filter(p => p.status === filters.value.status);
  }
  if (filters.value.category !== 'All') {
    filtered = filtered.filter(p => p.category === filters.value.category);
  }
  // Stock filter (simple demo logic)
  if (filters.value.stock === 'In Stock') {
    filtered = filtered.filter(p => p.stock > 5);
  } else if (filters.value.stock === 'Low Stock') {
    filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
  } else if (filters.value.stock === 'Out of Stock') {
    filtered = filtered.filter(p => p.stock === 0);
  }
  if (filters.value.search) {
    filtered = filtered.filter(p =>
      p.productName.toLowerCase().includes(filters.value.search.toLowerCase())
    );
  }
  return filtered;
});

const pageCount = computed(() =>
  Math.ceil(filteredProducts.value.length / pagination.value.itemsPerPage)
);

const stats = computed(() => {
  const totalProducts = products.value.length;
  const activeProducts = products.value.filter(p => p.status === 'Active').length;
  const totalCategories = new Set(products.value.map(p => p.category)).size;
  const avgPrice = (
    products.value.reduce((sum, p) => sum + p.price, 0) / (products.value.length || 1)
  ).toFixed(2);
  return { totalProducts, activeProducts, totalCategories, avgPrice };
});

const showAddDialog = ref(false);

function clearFilters() {
  filters.value = { search: '', status: 'All', category: 'All', stock: 'All' };
}
</script>

<style scoped>
.stats-card {
  transition: transform 0.2s ease-in-out;
}
.stats-card:hover {
  transform: translateY(-2px);
}
</style>