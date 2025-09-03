<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                Products Management
              </h1>
              <p class="text-subtitle-1 text-grey-darken-2">
                Manage your wood craft products, inventory, and pricing
              </p>
            </div>
            <v-btn
              color="orange-darken-2"
              variant="elevated"
              size="large"
              @click="openAddProductDialog"
            >
              <v-icon start icon="mdi-plus"></v-icon>
              Add New Product
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Quick Stats -->
      <v-row class="mb-6">
        <v-col cols="12" sm="3">
          <v-card color="orange-darken-2" variant="elevated" class="stats-card">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="white" icon="mdi-package-variant" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-white">{{ totalProducts }}</h3>
              <p class="text-orange-lighten-4 mb-0">Total Products</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card color="green-darken-2" variant="elevated" class="stats-card">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="white" icon="mdi-check-circle" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-white">{{ activeProducts }}</h3>
              <p class="text-green-lighten-4 mb-0">Active Products</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card color="red-darken-2" variant="elevated" class="stats-card">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="white" icon="mdi-alert-circle" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-white">{{ lowStockProducts }}</h3>
              <p class="text-red-lighten-4 mb-0">Low Stock</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card color="blue-darken-2" variant="elevated" class="stats-card">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="white" icon="mdi-star" class="mb-2"></v-icon>
              <h3 class="text-h5 font-weight-bold text-white">{{ featuredProducts }}</h3>
              <p class="text-blue-lighten-4 mb-0">Featured</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="elevation-4 mb-6">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="Search products..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filterStatus"
                label="Status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filterStock"
                label="Stock Level"
                :items="stockOptions"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filterCategory"
                label="Category"
                :items="categoryOptions"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn
                color="orange-darken-2"
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

      <!-- Products Table -->
      <v-card class="elevation-4">
        <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
          <v-icon icon="mdi-package-variant" class="me-2"></v-icon>
          Products List
        </v-card-title>
        
        <v-data-table
          :headers="headers"
          :items="filteredProducts"
          :search="searchQuery"
          :loading="loading"
          item-key="productId"
          class="elevation-0"
          :items-per-page="10"
        >
          <template v-slot:[`item.mainImageUrl`]="{ item }">
            <v-avatar size="60" class="my-2">
              <v-img :src="item.mainImageUrl || '/api/placeholder/60/60'" :alt="item.productName"></v-img>
            </v-avatar>
          </template>

          <template v-slot:[`item.productName`]="{ item }">
            <div>
              <div class="font-weight-medium">{{ item.productName }}</div>
              <div class="text-caption text-grey">{{ item.sku }}</div>
            </div>
          </template>
          <template v-slot:[`item.woodTypeId`]="{ item }">
            <div>
              <div class="font-weight-medium">{{ getWoodTypeName(item.woodTypeId) }}</div>
            </div>
          </template>

          <template v-slot:[`item.pricing`]="{ item }">
            <div class="text-center">
              <div class="font-weight-bold">${{ item.touristPrice?.toFixed(2) }}</div>
              <div class="text-caption text-grey">Tourist</div>
              <div class="text-caption">${{ item.localPrice?.toFixed(2) }} Local</div>
            </div>
          </template>

          <template v-slot:[`item.stock`]="{ item }">
            <div class="text-center">
              <v-chip
                :color="getStockColor(item.stockQuantity, item.lowStockThreshold)"
                size="small"
                variant="elevated"
              >
                {{ item.stockQuantity }}
              </v-chip>
              <div class="text-caption text-grey mt-1">{{ item.stockStatus }}</div>
            </div>
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              :color="getStatusColor(item.productStatus)"
              size="small"
              variant="elevated"
            >
              {{ item.productStatus }}
            </v-chip>
          </template>

          <template v-slot:[`item.rating`]="{ item }">
            <div class="d-flex align-center">
              <v-rating
                :model-value="item.averageRating"
                color="amber"
                density="compact"
                half-increments
                readonly
                size="small"
              ></v-rating>
              <span class="text-caption ms-2">({{ item.reviewCount }})</span>
            </div>
          </template>

          <template v-slot:[`item.featured`]="{ item }">
            <v-switch
              v-model="item.isFeatured"
              color="orange-darken-2"
              hide-details
              @change="updateProductFeature(item)"
            ></v-switch>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex ga-2">
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                color="blue"
                @click="viewProduct(item)"
              ></v-btn>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                color="orange"
                @click="editProduct(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="red"
                @click="confirmDelete(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Add/Edit Product Dialog -->
    <v-dialog v-model="productDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold text-orange-darken-4">
          {{ isEditing ? 'Edit Product' : 'Add New Product' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="productForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedProduct.productName"
                  label="Product Name"
                  :rules="[v => !!v || 'Product name is required']"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedProduct.sku"
                  label="SKU"
                  :rules="[v => !!v || 'SKU is required']"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedProduct.productDescription"
                  label="Product Description"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editedProduct.touristPrice"
                  label="Tourist Price"
                  type="number"
                  step="0.01"
                  prefix="$"
                  variant="outlined"
                  :rules="[v => v >= 0 || 'Price must be positive']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editedProduct.localPrice"
                  label="Local Price"
                  type="number"
                  step="0.01"
                  prefix="$"
                  variant="outlined"
                  :rules="[v => v >= 0 || 'Price must be positive']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editedProduct.costPrice"
                  label="Cost Price"
                  type="number"
                  step="0.01"
                  prefix="$"
                  variant="outlined"
                  :rules="[v => v >= 0 || 'Cost must be positive']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editedProduct.stockQuantity"
                  label="Stock Quantity"
                  type="number"
                  variant="outlined"
                  :rules="[v => v >= 0 || 'Stock must be positive']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editedProduct.lowStockThreshold"
                  label="Low Stock Threshold"
                  type="number"
                  variant="outlined"
                  :rules="[v => v >= 0 || 'Threshold must be positive']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editedProduct.productStatus"
                  label="Product Status"
                  :items="['Active', 'Inactive', 'Draft', 'Out of Stock']"
                  variant="outlined"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editedProduct.woodTypeId"
                  label="Wood Type"
                  :items="woodTypeOptions"
                  item-title="woodName"
                  item-value="woodTypeId"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedProduct.mainImageUrl"
                  label="Main Image URL"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="d-flex ga-4">
                  <v-switch
                    v-model="editedProduct.isVisible"
                    label="Visible"
                    color="orange-darken-2"
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="editedProduct.isFeatured"
                    label="Featured"
                    color="orange-darken-2"
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="editedProduct.isAuthentic"
                    label="Authentic"
                    color="orange-darken-2"
                    hide-details
                  ></v-switch>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeProductDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="orange-darken-2"
            variant="elevated"
            :disabled="!formValid"
            :loading="saving"
            @click="saveProduct"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold text-red-darken-2">
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ productToDelete?.productName }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            color="red"
            variant="elevated"
            :loading="deleting"
            @click="deleteProduct"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Product Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="900px">
      <v-card v-if="selectedProduct">
        <v-card-title class="text-h5 font-weight-bold text-orange-darken-4">
          {{ selectedProduct.productName }}
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-img
                :src="selectedProduct.mainImageUrl || '/api/placeholder/300/300'"
                :alt="selectedProduct.productName"
                class="rounded"
                height="300"
              ></v-img>
            </v-col>
            <v-col cols="12" md="8">
              <div class="mb-4">
                <h3 class="text-h6 font-weight-bold mb-2">Product Information</h3>
                <v-row>
                  <v-col cols="6">
                    <strong>SKU:</strong> {{ selectedProduct.sku }}
                  </v-col>
                  <v-col cols="6">
                    <strong>Status:</strong> 
                    <v-chip :color="getStatusColor(selectedProduct.productStatus)" size="small">
                      {{ selectedProduct.productStatus }}
                    </v-chip>
                  </v-col>
                  <v-col cols="6">
                    <strong>Wood Type:</strong> {{ getWoodTypeName(selectedProduct.woodTypeId) }}
                  </v-col>
                  <v-col cols="6">
                    <strong>Stock:</strong> {{ selectedProduct.stockQuantity }}
                  </v-col>
                </v-row>
              </div>

              <div class="mb-4">
                <h3 class="text-h6 font-weight-bold mb-2">Pricing</h3>
                <v-row>
                  <v-col cols="4">
                    <strong>Tourist Price:</strong><br>
                    ${{ selectedProduct.touristPrice?.toFixed(2) }}
                  </v-col>
                  <v-col cols="4">
                    <strong>Local Price:</strong><br>
                    ${{ selectedProduct.localPrice?.toFixed(2) }}
                  </v-col>
                  <v-col cols="4">
                    <strong>Cost Price:</strong><br>
                    ${{ selectedProduct.costPrice?.toFixed(2) }}
                  </v-col>
                </v-row>
              </div>

              <div class="mb-4">
                <h3 class="text-h6 font-weight-bold mb-2">Description</h3>
                <p>{{ selectedProduct.productDescription }}</p>
              </div>

              <div class="mb-4">
                <h3 class="text-h6 font-weight-bold mb-2">Features</h3>
                <v-chip-group>
                  <v-chip v-if="selectedProduct.isFeatured" color="orange" size="small">Featured</v-chip>
                  <v-chip v-if="selectedProduct.isAuthentic" color="green" size="small">Authentic</v-chip>
                  <v-chip v-if="selectedProduct.isCertified" color="blue" size="small">Certified</v-chip>
                  <v-chip v-if="selectedProduct.isUnique" color="purple" size="small">Unique</v-chip>
                </v-chip-group>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="detailsDialog = false">Close</v-btn>
          <v-btn
            color="orange-darken-2"
            variant="elevated"
            @click="editProduct(selectedProduct)"
          >
            Edit Product
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Success/Error Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/product'
import type { Product } from '@/stores/types/member';
import { useWoodTypeStore } from '@/stores/woodStore';
import { ref, computed, onMounted } from 'vue'

const productStore = useProductStore();
const woodStypeStore = useWoodTypeStore();

// Reactive data
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const filterStatus = ref('All')
const filterStock = ref('All')
const filterCategory = ref('All')

// Dialog states
const productDialog = ref(false)
const deleteDialog = ref(false)
const detailsDialog = ref(false)
const isEditing = ref(false)
const formValid = ref(false)

// Snackbar for notifications
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Selected items
const selectedProduct = ref<Product | null>(null)
const productToDelete = ref<Product | null>(null)

const getWoodTypeName = (id: number) => {
  const woodName = woodStypeStore.woodTypes.find(a => a.woodTypeId === id);
  return woodName?.woodName || 'Unknown'
}

// Form data
const editedProduct = ref<Partial<Product>>({
  productName: '',
  sku: '',
  productDescription: '',
  touristPrice: 0,
  localPrice: 0,
  costPrice: 0,
  stockQuantity: 0,
  lowStockThreshold: 5,
  productStatus: 'Active',
  woodTypeId: undefined,
  mainImageUrl: '',
  isVisible: true,
  isFeatured: false,
  isAuthentic: false,
  length:0
});

const products = computed(() => productStore.products);

// Filter options
const statusOptions = ['All', 'Active', 'Inactive', 'Draft', 'Out of Stock']
const stockOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock']
const categoryOptions = ['All', 'Furniture', 'Accessories', 'Decor', 'Kitchenware']
const woodTypeOptions = computed(() => woodStypeStore.woodTypes || [])

// Table headers
const headers = [
  { title: 'Image', key: 'mainImageUrl', sortable: false },
  { title: 'Product', key: 'productName' },
  { title: 'Wood Type', key: 'woodTypeId' },
  { title: 'Pricing', key: 'pricing', sortable: false },
  { title: 'Stock', key: 'stock', sortable: false },
  { title: 'Status', key: 'status' },
  { title: 'Rating', key: 'rating', sortable: false },
  { title: 'Featured', key: 'featured', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value.filter(product => !product.isDeleted)
  
  if (filterStatus.value !== 'All') {
    filtered = filtered.filter(product => product.productStatus === filterStatus.value)
  }
  
  if (filterStock.value !== 'All') {
    filtered = filtered.filter(product => {
      const stockStatus = getStockStatus(product.stockQuantity, product.lowStockThreshold)
      return stockStatus === filterStock.value
    })
  }
  
  return filtered
})

const totalProducts = computed(() => products.value.filter(p => !p.isDeleted).length)
const activeProducts = computed(() => products.value.filter(p => p.productStatus === 'Active' && !p.isDeleted).length)
const lowStockProducts = computed(() => products.value.filter(p => p.stockQuantity <= p.lowStockThreshold && !p.isDeleted).length)
const featuredProducts = computed(() => products.value.filter(p => p.isFeatured && !p.isDeleted).length)

// Helper method to get stock status
const getStockStatus = (stock: number, threshold: number) => {
  if (stock === 0) return 'Out of Stock'
  if (stock <= threshold) return 'Low Stock'
  return 'In Stock'
}

// Methods
const getStockColor = (stock: number, threshold: number) => {
  if (stock === 0) return 'red'
  if (stock <= threshold) return 'orange'
  return 'green'
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'green'
    case 'inactive': return 'grey'
    case 'draft': return 'blue'
    case 'out of stock': return 'red'
    default: return 'grey'
  }
}

const showSnackbar = (message: string, color: string = 'success') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

const openAddProductDialog = () => {
  isEditing.value = false
  editedProduct.value = {
    productName: '',
    sku: '',
    productDescription: '',
    touristPrice: 0,
    localPrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    lowStockThreshold: 5,
    productStatus: 'Active',
    woodTypeId: undefined,
    mainImageUrl: '',
    isVisible: true,
    isFeatured: false,
    isAuthentic: false
  }
  productDialog.value = true
}

const editProduct = (product: Product) => {
  isEditing.value = true
  editedProduct.value = { ...product }
  productDialog.value = true
  detailsDialog.value = false
}

const viewProduct = (product: Product) => {
  selectedProduct.value = product
  detailsDialog.value = true
}

const closeProductDialog = () => {
  productDialog.value = false
  editedProduct.value = {}
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  deleteDialog.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return
  
  try {
    deleting.value = true
    await productStore.deleteProduct(productToDelete.value.productId)
    showSnackbar('Product deleted successfully', 'success')
    deleteDialog.value = false
    productToDelete.value = null
  } catch (error) {
    console.error('Error deleting product:', error)
    showSnackbar('Error deleting product', 'error')
  } finally {
    deleting.value = false
  }
}

const saveProduct = async () => {
  if (!formValid.value) return
  
  try {
    saving.value = true
    
    if (isEditing.value && editedProduct.value.productId) {
      await productStore.updateProduct(editedProduct.value.productId, editedProduct.value)
      showSnackbar('Product updated successfully', 'success')
    } else {
      await productStore.createProduct(editedProduct.value)
      showSnackbar('Product created successfully', 'success')
    }
    
    closeProductDialog()
  } catch (error) {
    console.error('Error saving product:', error)
    showSnackbar('Error saving product', 'error')
  } finally {
    saving.value = false
  }
}

const updateProductFeature = async (product: Product) => {
  try {
    await productStore.updateProduct(product.productId, {
      isFeatured: product.isFeatured
    })
    showSnackbar(`Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`, 'success')
  } catch (error) {
    console.error('Error updating product feature:', error)
    // Revert the change on error
    product.isFeatured = !product.isFeatured
    showSnackbar('Error updating product feature', 'error')
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'All'
  filterStock.value = 'All'
  filterCategory.value = 'All'
}

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      productStore.fetchProducts(),
      woodStypeStore.fetchWoodTypes()
    ]);
  } catch (error) {
    console.error('Error loading data:', error)
    showSnackbar('Error loading data', 'error')
  } finally {
    loading.value = false
  }
});
</script>

<style scoped>
.stats-card {
transition: transform 0.2s ease-in-out;
}

.stats-card:hover {
transform: translateY(-2px);
}

.v-data-table {
border-radius: 8px;
}

.v-data-table th {
background-color: #f5f5f5;
font-weight: 600;
}

.v-dialog .v-card {
border-radius: 12px;
}

.v-chip {
font-weight: 500;
}

.text-orange-darken-4 {
color: #e65100 !important;
}

.text-grey-darken-2 {
color: #616161 !important;
}

/* Custom scrollbar for dialogs */
.v-dialog .v-card-text {
max-height: 70vh;
overflow-y: auto;
}

.v-dialog .v-card-text::-webkit-scrollbar {
width: 6px;
}

.v-dialog .v-card-text::-webkit-scrollbar-track {
background: #f1f1f1;
border-radius: 3px;
}

.v-dialog .v-card-text::-webkit-scrollbar-thumb {
background: #c1c1c1;
border-radius: 3px;
}

.v-dialog .v-card-text::-webkit-scrollbar-thumb:hover {
background: #a8a8a8;
}

/* Animation for table rows */
.v-data-table tbody tr {
transition: background-color 0.2s ease-in-out;
}

.v-data-table tbody tr:hover {
background-color: rgba(0, 0, 0, 0.04);
}

/* Form styling improvements */
.v-text-field .v-field {
border-radius: 8px;
}

.v-select .v-field {
border-radius: 8px;
}

.v-textarea .v-field {
border-radius: 8px;
}

/* Button styling */
.v-btn {
border-radius: 8px;
text-transform: none;
font-weight: 500;
}

/* Card elevation effects */
.elevation-4 {
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08) !important;
}

/* Loading state overlay */
.v-data-table--loading {
position: relative;
}

.v-data-table--loading::after {
content: '';
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(255, 255, 255, 0.8);
z-index: 1;
}

/* Rating stars styling */
.v-rating .v-icon {
margin: 0 1px;
}

/* Image avatar styling */
.v-avatar .v-img {
border-radius: 8px;
}

/* Switch styling */
.v-switch .v-selection-control__wrapper {
height: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
.d-flex.align-center.justify-space-between {
  flex-direction: column;
  align-items: flex-start !important;
  gap: 16px;
}

.stats-card .v-card-text {
  padding: 16px !important;
}

.v-dialog {
  margin: 16px;
}

.v-dialog .v-card {
  max-height: calc(100vh - 32px);
}
}

/* Print styles */
@media print {
.v-btn,
.v-dialog,
.v-overlay {
  display: none !important;
}

.v-data-table {
  box-shadow: none !important;
}
}
</style>