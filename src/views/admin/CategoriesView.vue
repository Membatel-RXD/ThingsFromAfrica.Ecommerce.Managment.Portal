<template>
    <div class="categories-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-3">Product Categories</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage product categories for your crafts
            </p>
          </div>
          <v-btn
            color="orange-darken-2"
            variant="elevated"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Add Category
          </v-btn>
        </div>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-folder-multiple</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalCategories }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Total Categories</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activeCategories }}</h3>
                  <p class="text-body-2 text-green-darken-1">Active Categories</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-star</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ touristFavoriteCategories }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Tourist Favorites</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-heart</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ activeTouristFavorites }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Active Favorites</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Filters and Search -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  label="Search categories..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="statusFilter"
                  label="Status"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="favoriteFilter"
                  label="Tourist Favorite"
                  :items="favoriteOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
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
  
        <!-- Categories Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-folder-multiple</v-icon>
            Product Categories Management
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredCategories"
            :loading="categoryStore.loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'sortOrder', order: 'asc' }]"
          >
            <template v-slot:item.isActive="{ item }">
              <v-chip
                :color="item.isActive ? 'green' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.isActive ? 'Active' : 'Inactive' }}
              </v-chip>
            </template>
  
            <template v-slot:item.isTouristFavorite="{ item }">
              <v-chip
                :color="item.isTouristFavorite ? 'star' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.isTouristFavorite ? 'Favorite' : 'Standard' }}
              </v-chip>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editCategory(item)"
              />
              <v-btn
                icon="mdi-toggle-switch"
                variant="text"
                size="small"
                color="warning"
                @click="toggleStatus(item)"
              />
              <v-btn
                icon="mdi-star"
                variant="text"
                size="small"
                :color="item.isTouristFavorite ? 'star' : 'grey'"
                @click="toggleTouristFavorite(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deleteCategory(item)"
              />
              <v-btn
                icon="mdi-eye"
                variant="text"
                size="small"
                color="blue"
                @click="viewCategory(item)"
              />
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="pa-6 bg-orange-lighten-5">
              <v-icon class="me-2" color="orange-darken-3">mdi-folder-multiple</v-icon>
              {{ editMode ? 'Edit Category' : 'Add Category' }}
            </v-card-title>
  
            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.categoryName"
                      label="Category Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-folder"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.categorySlug"
                      label="Category Slug"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-link"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.categoryDescription"
                      label="Description"
                      :rules="[rules.required]"
                      rows="3"
                      variant="outlined"
                      prepend-inner-icon="mdi-text"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="formData.sortOrder"
                      label="Sort Order"
                      type="number"
                      :rules="[rules.required, rules.number]"
                      variant="outlined"
                      prepend-inner-icon="mdi-sort"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.categoryImageUrl"
                      label="Category Image URL"
                      variant="outlined"
                      prepend-inner-icon="mdi-image"
                      hint="Paste image URL or upload below"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input
                      label="Upload Image"
                      accept="image/*"
                      variant="outlined"
                      prepend-inner-icon="mdi-upload"
                      @change="onImageUpload"
                      hide-details
                    />
                    <div v-if="formData.categoryImageUrl" class="mt-2 d-flex align-center">
                      <v-avatar size="60">
                        <v-img :src="formData.categoryImageUrl" alt="Category Image" />
                      </v-avatar>
                      <span class="ms-3">Preview</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="formData.isActive"
                      label="Active"
                      color="green"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="formData.isTouristFavorite"
                      label="Tourist Favorite"
                      color="star"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="formData.isShowOnHomePage"
                      label="Show on Home Page"
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
                color="orange-darken-2"
                variant="elevated"
                @click="saveCategory"
                :disabled="!valid"
                :loading="saving"
              >
                {{ editMode ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="600px">
          <v-card v-if="selectedCategory">
            <v-card-title class="text-h5 font-weight-bold text-orange-darken-4">
              <v-icon class="me-2" color="orange-darken-3">mdi-folder-multiple</v-icon>
              {{ selectedCategory.categoryName }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-img :src="selectedCategory.categoryImageUrl" alt="Category Image" class="rounded" height="120" />
                </v-col>
                <v-col cols="12" md="8">
                  <div class="mb-2"><strong>Slug:</strong> {{ selectedCategory.categorySlug }}</div>
                  <div class="mb-2"><strong>Description:</strong> {{ selectedCategory.categoryDescription }}</div>
                  <div class="mb-2"><strong>Sort Order:</strong> {{ selectedCategory.sortOrder }}</div>
                  <div class="mb-2"><strong>Created At:</strong> {{ selectedCategory.createdAt }}</div>
                  <v-chip :color="selectedCategory.isActive ? 'green' : 'grey'" class="me-2" size="small">
                    {{ selectedCategory.isActive ? 'Active' : 'Inactive' }}
                  </v-chip>
                  <v-chip :color="selectedCategory.isTouristFavorite ? 'star' : 'grey'" size="small">
                    {{ selectedCategory.isTouristFavorite ? 'Tourist Favorite' : 'Standard' }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="detailsDialog = false">Close</v-btn>
              <v-btn color="orange-darken-2" variant="elevated" @click="editCategory(selectedCategory)">Edit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useProductCategoryStore } from '@/stores/productCategory'
import { ref, computed, onMounted } from 'vue'
  import { useSnackbarStore } from '@/stores/snackbar'
  const categoryStore = useProductCategoryStore()
  const snackbar = useSnackbarStore();
  // Data
  const saving = ref(false)
  const dialog = ref(false)
  const editMode = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const favoriteFilter = ref('all')
  const detailsDialog = ref(false)
  const selectedCategory = ref(null)
  

  // Form data
  const formData = ref({
    categoryId: null as number | null,
    categoryName: '',
    categoryDescription: '',
    categorySlug: '',
    categoryImageUrl: '',
    sortOrder: 0,
    isActive: true,
    isTouristFavorite: false,
    isShowOnHomePage: false
  })
  
  // Options
  const statusOptions = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' }
  ]
  
  const favoriteOptions = [
    { title: 'All', value: 'all' },
    { title: 'Tourist Favorites', value: 'favorite' },
    { title: 'Standard', value: 'standard' }
  ]
  
  // Table headers
  const headers = [
    { title: 'Sort Order', key: 'sortOrder' },
    { title: 'Name', key: 'categoryName' },
    { title: 'Slug', key: 'categorySlug' },
    { title: 'Description', key: 'categoryDescription' },
    { title: 'Icon', key: 'categoryImageUrl' },
    { title: 'Status', key: 'isActive' },
    { title: 'Tourist Favorite', key: 'isTouristFavorite' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
  
  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    number: (value: any) => !isNaN(value) || 'Must be a number'
  }
  
  // Computed properties
  const filteredCategories = computed(() => {
    let filtered = categoryStore.getCategories
  
    if (statusFilter.value === 'active') {
      filtered = filtered.filter(item => item.isActive)
    } else if (statusFilter.value === 'inactive') {
      filtered = filtered.filter(item => !item.isActive)
    }
  
    if (favoriteFilter.value === 'favorite') {
      filtered = filtered.filter(item => item.isTouristFavorite)
    } else if (favoriteFilter.value === 'standard') {
      filtered = filtered.filter(item => !item.isTouristFavorite)
    }
  
    return filtered
  })
  
  const totalCategories = computed(() => categoryStore.getCategories.length)
  const activeCategories = computed(() => categoryStore.getActiveCategories.length)
  const touristFavoriteCategories = computed(() => categoryStore.getTouristFavoriteCategories.length)
  const activeTouristFavorites = computed(() => categoryStore.getActiveTouristFavorites.length)
  

  
  const openCreateDialog = () => {
    editMode.value = false
    formData.value = {
      categoryId: null,
      categoryName: '',
      categoryDescription: '',
      categorySlug: '',
      categoryImageUrl: '',
      sortOrder: categoryStore.getCategories.length + 1,
      isActive: true,
      isTouristFavorite: false,
      isShowOnHomePage: false
    }
    dialog.value = true
  }
  
  const editCategory = (item: any) => {
    editMode.value = true
    formData.value = { ...item }
    dialog.value = true
  }
  
  const closeDialog = () => {
    dialog.value = false
    formData.value = {
      categoryId: null,
      categoryName: '',
      categoryDescription: '',
      categorySlug: '',
      categoryImageUrl: '',
      sortOrder: 0,
      isActive: true,
      isTouristFavorite: false,
      isShowOnHomePage: false
    }
  }
  
  const onImageUpload = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.categoryImageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  
  const saveCategory = async () => {
    saving.value = true
    try {
      const now = new Date().toISOString();
      if (editMode.value && formData.value.categoryId) {
        // Update existing category
        const response = await categoryStore.updateCategory(formData.value.categoryId, { ...formData.value, createdAt: now })
        if (response.isSuccessful) {
          snackbar.success('Category updated successfully')
          closeDialog()
        } else {
          snackbar.error('Error updating category')
        }
      } else {
        // Create new category
        const response = await categoryStore.createCategory({ ...formData.value, createdAt: now })
        if (response.isSuccessful) {
          snackbar.success('Category created successfully')
          closeDialog()
        } else {
          snackbar.error('Error creating category')
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
      snackbar.error('Error saving category')
    } finally {
      saving.value = false
    }
  }
  
  const deleteCategory = async (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.categoryName}?`)) {
      try {
        const response = await categoryStore.deleteCategory(item.categoryId)
        if (response.isSuccessful) {
            snackbar.success('Category deleted successfully')
        } else {
            snackbar.error('Error deleting category')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        snackbar.error('Error deleting category')
      }
    }
  }
  
  const toggleStatus = async (item: any) => {
    try {
      const response = await categoryStore.toggleCategoryStatus(item.categoryId)
      if (response.isSuccessful) {
        snackbar.success(`Category ${item.isActive ? 'deactivated' : 'activated'} successfully`)
      } else {
        snackbar.error('Error updating category status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      snackbar.error('Error updating category status')
    }
  }
  
  const toggleTouristFavorite = async (item: any) => {
    try {
      const response = await categoryStore.toggleTouristFavorite(item.categoryId)
      if (response.isSuccessful) {
        snackbar.success(`Category ${item.isTouristFavorite ? 'removed from' : 'added to'} tourist favorites`)
      } else {
        snackbar.error('Error updating tourist favorite status')
      }
    } catch (error) {
      console.error('Error toggling tourist favorite:', error)
      snackbar.error('Error updating tourist favorite status')
    }
  }
  
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
    favoriteFilter.value = 'all'
  }
  
  const viewCategory = (item: any) => {
    selectedCategory.value = item
    detailsDialog.value = true
  }
  
  onMounted(async () => {
    try {
      await categoryStore.fetchCategories()
    } catch (error) {
      console.error('Error fetching categories:', error)
      snackbar.error('Error loading categories')
    }
  })
  </script>
  
  <style scoped>
  .categories-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>