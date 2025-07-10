<template>
  <v-container>
    <v-form v-model="isFormValid" @submit.prevent="handleSubmit">
      <v-row>
        <!-- Basic Info -->
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="formData.productName" 
            label="Product Name" 
            :rules="[rules.required]" 
            required 
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="formData.productSlug" 
            label="Product Slug" 
            :rules="[rules.required]" 
            required 
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="formData.sku" 
            label="SKU" 
            :rules="[rules.required]" 
            required 
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="formData.itemCode" 
            label="Item Code" 
          />
        </v-col>
        
        <!-- Category -->
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="formData.categoryId"
            :items="categoryOptions"
            item-title="categoryName"
            item-value="categoryId"
            label="Category"
            :loading="categoryLoading"
            :rules="[rules.required]"
            clearable
            required
          />
        </v-col>
        
        <!-- Craft Type -->
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="formData.craftTypeId"
            :items="craftTypeOptions"
            item-title="craftTypeName"
            item-value="craftTypeId"
            label="Craft Type"
            :loading="craftTypeLoading"
            clearable
          />
        </v-col>
        
        <!-- Wood Type -->
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="formData.woodTypeId"
            :items="woodTypeOptions"
            item-title="woodName"
            item-value="woodTypeId"
            label="Wood Type"
            :loading="woodTypeLoading"
            clearable
          />
        </v-col>
        
        <!-- Artisan -->
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="formData.artisanId"
            :items="artisanOptions"
            item-title="artisanName"
            item-value="artisanId"
            label="Artisan"
            :loading="artisanLoading"
            clearable
            @update:model-value="onArtisanSelected"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.artisanName }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.village }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        
        <!-- Pricing -->
        <v-col cols="12" md="4">
          <v-text-field 
            v-model.number="formData.basePrice" 
            label="Base Price" 
            type="number" 
            :rules="[rules.required, rules.positiveNumber]" 
            required 
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field 
            v-model.number="formData.touristPrice" 
            label="Tourist Price" 
            type="number" 
            :rules="[rules.positiveNumber]"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field 
            v-model.number="formData.localPrice" 
            label="Local Price" 
            type="number" 
            :rules="[rules.positiveNumber]"
          />
        </v-col>
        
        <!-- Stock -->
        <v-col cols="12" md="4">
          <v-text-field 
            v-model.number="formData.stockQuantity" 
            label="Stock Quantity" 
            type="number" 
            :rules="[rules.nonNegativeNumber]"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-switch 
            v-model="formData.isUnique" 
            label="Is Unique?" 
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-switch 
            v-model="formData.isVisible" 
            label="Is Visible?" 
            color="primary"
          />
        </v-col>
        
        <!-- Description -->
        <v-col cols="12">
          <v-textarea 
            v-model="formData.productDescription" 
            label="Product Description" 
            rows="3" 
            :rules="[rules.maxLength(500)]"
            counter="500"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea 
            v-model="formData.shortDescription" 
            label="Short Description" 
            rows="2" 
            :rules="[rules.maxLength(150)]"
            counter="150"
          />
        </v-col>
        
        <!-- Main Image -->
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="formData.mainImageUrl" 
            label="Main Image URL" 
            :rules="[rules.url]"
          />
        </v-col>
        
        <!-- Gallery Images -->
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="formData.galleryImages" 
            label="Gallery Images (comma-separated URLs)" 
            :rules="[rules.urlList]"
          />
        </v-col>
        
        <!-- Submit -->
        <v-col cols="12">
          <v-btn 
            color="primary" 
            type="submit" 
            :loading="isSubmitting" 
            :disabled="!isFormValid"
            size="large"
          >
            Create Product
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useArtisanStore } from '@/stores/artisan';
import { useWoodTypeStore } from '@/stores/woodStore';
import { useProductCategoryStore } from '@/stores/productCategory';
import { useCraftTypeStore } from '@/stores/craftStore';
import type { ArtisanDTO } from '@/stores/types/member';

// Form data with proper typing
const formData = ref({
  productName: '',
  productSlug: '',
  sku: '',
  itemCode: '',
  categoryId: null as number | null,
  craftTypeId: null as number | null,
  woodTypeId: null as number | null,
  artisanId: null as number | null,
  artisanName: '',
  artisanVillage: '',
  basePrice: 0,
  touristPrice: 0,
  localPrice: 0,
  stockQuantity: 0,
  isUnique: false,
  isVisible: true,
  productDescription: '',
  shortDescription: '',
  mainImageUrl: '',
  galleryImages: '',
});

const isFormValid = ref(false);
const isSubmitting = ref(false);

// Store instances
const artisanStore = useArtisanStore();
const woodTypeStore = useWoodTypeStore();
const categoryStore = useProductCategoryStore();
const craftTypeStore = useCraftTypeStore();

// Reactive data for dropdowns
const artisanOptions = ref<ArtisanDTO[]>([]);
const artisanLoading = ref(false);
const woodTypeOptions = ref<any[]>([]);
const woodTypeLoading = ref(false);
const categoryOptions = ref<any[]>([]);
const categoryLoading = ref(false);
const craftTypeOptions = ref<any[]>([]);
const craftTypeLoading = ref(false);

// Validation rules
const rules = {
  required: (v: any) => !!v || 'This field is required',
  positiveNumber: (v: number) => v > 0 || 'Value must be greater than 0',
  nonNegativeNumber: (v: number) => v >= 0 || 'Value must be 0 or greater',
  maxLength: (max: number) => (v: string) => !v || v.length <= max || `Maximum ${max} characters`,
  url: (v: string) => {
    if (!v) return true;
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(v) || 'Please enter a valid URL';
  },
  urlList: (v: string) => {
    if (!v) return true;
    const urls = v.split(',').map(url => url.trim());
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urls.every(url => urlPattern.test(url)) || 'Please enter valid URLs separated by commas';
  }
};

onMounted(async () => {
  try {
    // Load artisans
    artisanLoading.value = true;
    await artisanStore.fetchArtisans();
    artisanOptions.value = artisanStore.artisans;
  } catch (error) {
    console.error('Error loading artisans:', error);
  } finally {
    artisanLoading.value = false;
  }

  try {
    // Load wood types
    woodTypeLoading.value = true;
    await woodTypeStore.fetchWoodTypes();
    woodTypeOptions.value = woodTypeStore.woodTypes;
  } catch (error) {
    console.error('Error loading wood types:', error);
  } finally {
    woodTypeLoading.value = false;
  }

  try {
    // Load categories
    categoryLoading.value = true;
    await categoryStore.fetchCategories();
    categoryOptions.value = categoryStore.categories;
  } catch (error) {
    console.error('Error loading categories:', error);
  } finally {
    categoryLoading.value = false;
  }

  try {
    // Load craft types
    craftTypeLoading.value = true;
    await craftTypeStore.fetchCraftTypes();
    craftTypeOptions.value = craftTypeStore.craftTypes;
  } catch (error) {
    console.error('Error loading craft types:', error);
  } finally {
    craftTypeLoading.value = false;
  }
});

// Handle artisan selection
function onArtisanSelected(artisanId: number | null) {
  if (artisanId) {
    const artisan = artisanOptions.value.find(a => a.artisanId === artisanId);
    if (artisan) {
      formData.value.artisanName = artisan.artisanName;
      formData.value.artisanVillage = artisan.village;
    }
  } else {
    formData.value.artisanName = '';
    formData.value.artisanVillage = '';
  }
}

// Handle form submission
async function handleSubmit() {
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  try {
    // Process gallery images
    const galleryImagesArray = formData.value.galleryImages
      ? formData.value.galleryImages.split(',').map(url => url.trim()).filter(url => url)
      : [];

    const productData = {
      ...formData.value,
      galleryImages: galleryImagesArray
    };

    // TODO: Replace with actual API call
    console.log('Product data to submit:', productData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Product created successfully!');
    
    // Reset form after successful submission
    resetForm();
    
  } catch (error) {
    console.error('Error creating product:', error);
    alert('Error creating product. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
}

// Reset form function
function resetForm() {
  formData.value = {
    productName: '',
    productSlug: '',
    sku: '',
    itemCode: '',
    categoryId: null,
    craftTypeId: null,
    woodTypeId: null,
    artisanId: null,
    artisanName: '',
    artisanVillage: '',
    basePrice: 0,
    touristPrice: 0,
    localPrice: 0,
    stockQuantity: 0,
    isUnique: false,
    isVisible: true,
    productDescription: '',
    shortDescription: '',
    mainImageUrl: '',
    galleryImages: '',
  };
}
</script>

<style scoped>
.v-container {
  max-width: 1000px;
}

/* Add some spacing between form sections */
.v-col:first-child {
  margin-top: 0;
}

/* Style for form validation errors */
:deep(.v-messages--error) {
  color: rgb(var(--v-theme-error));
}

/* Improve switch styling */
:deep(.v-switch .v-selection-control__input) {
  margin-right: 8px;
}
</style>