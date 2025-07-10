<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    max-width="700px"
    persistent
  >
    <v-card>
      <!-- Header with icon and title -->
      <div class="d-flex align-center pa-4" style="background: #fff3e0;">
        <v-icon color="orange-darken-2" class="mr-2">mdi-cube-outline</v-icon>
        <span class="text-h6 font-weight-bold text-orange-darken-4">Add Product</span>
      </div>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <div class="mb-4">
            <v-chip color="primary" class="mr-2">Step {{ step }} of 8</v-chip>
            <span class="font-weight-bold">{{ sectionTitles[step - 1] }}</span>
          </div>
          <v-row v-if="step === 1">
            <!-- Basic Product Info -->
            <v-col cols="12" md="6">
              <v-text-field v-model="form.productName" label="Product Name" prepend-inner-icon="mdi-cube" required @input="autoSlug" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.sku" label="SKU" prepend-inner-icon="mdi-barcode" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.itemCode" label="Item Code" prepend-inner-icon="mdi-identifier" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="form.categoryId" :items="categoryOptions" label="Category" prepend-inner-icon="mdi-shape" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="form.craftTypeId" :items="craftTypeOptions" label="Craft Type" prepend-inner-icon="mdi-hammer-wrench" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="form.woodTypeId" :items="woodTypeOptions" label="Wood Type" prepend-inner-icon="mdi-tree" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="form.basePrice" label="Base Price" prepend-inner-icon="mdi-currency-usd" type="number" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="form.localPrice" label="Local Price" prepend-inner-icon="mdi-currency-usd" type="number" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="form.touristPrice" label="Tourist Price" prepend-inner-icon="mdi-currency-usd" type="number" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="form.usdPrice" label="USD Price" prepend-inner-icon="mdi-currency-usd" type="number" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="form.currency" :items="currencyOptions" label="Currency" prepend-inner-icon="mdi-currency-usd" />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input v-model="form.mainImageFile" label="Main Image Upload" prepend-inner-icon="mdi-upload" show-size accept="image/*" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.mainImageUrl" label="Main Image URL" prepend-inner-icon="mdi-image" />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input v-model="form.galleryImages" label="Gallery Images" prepend-inner-icon="mdi-image-multiple" show-size multiple accept="image/*" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.productDescription" label="Product Description" prepend-inner-icon="mdi-text" rows="2" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.shortDescription" label="Short Description" prepend-inner-icon="mdi-text-short" rows="2" />
            </v-col>
          </v-row>
          <v-row v-else-if="step === 2">
            <!-- Artisan Info -->
            <v-col cols="12" md="6">
              <v-select v-model="form.artisanId" :items="artisanOptions" label="Artisan" prepend-inner-icon="mdi-account" @change="fillArtisanInfo" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.artisanName" label="Artisan Name" prepend-inner-icon="mdi-account" readonly />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.artisanVillage" label="Artisan Village" prepend-inner-icon="mdi-home-group" readonly />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.artisanStory" label="Artisan Story" prepend-inner-icon="mdi-book-open-page-variant" readonly rows="2" />
            </v-col>
          </v-row>
          <v-row v-else-if="step === 3">
            <!-- Physical Specs -->
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.weight" label="Weight (kg)" type="number" prepend-inner-icon="mdi-weight-kilogram" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.length" label="Length (cm)" type="number" prepend-inner-icon="mdi-ruler" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.width" label="Width (cm)" type="number" prepend-inner-icon="mdi-ruler" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.height" label="Height (cm)" type="number" prepend-inner-icon="mdi-ruler" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.shippingWeight" label="Shipping Weight (kg)" type="number" prepend-inner-icon="mdi-weight-kilogram" />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.packingFriendly" label="Packing Friendly" color="success" />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.shippingFragile" label="Fragile" color="error" />
            </v-col>
          </v-row>
          <v-row v-else-if="step === 4">
            <!-- Wood & Craft Details -->
            <v-col cols="12" md="6">
              <v-text-field v-model="form.woodType" label="Wood Type (text)" prepend-inner-icon="mdi-tree" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.woodOrigin" label="Wood Origin" prepend-inner-icon="mdi-map-marker" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.woodColor" label="Wood Color" prepend-inner-icon="mdi-palette" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.woodGrain" label="Wood Grain" prepend-inner-icon="mdi-texture-box" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.woodHardness" label="Wood Hardness" prepend-inner-icon="mdi-hammer" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.woodFinish" label="Wood Finish" prepend-inner-icon="mdi-brush" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.craftingTechnique" label="Crafting Technique" prepend-inner-icon="mdi-tools" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.craftingTime" label="Crafting Time" prepend-inner-icon="mdi-timer" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.difficultyLevel" label="Difficulty Level" prepend-inner-icon="mdi-chart-bar" />
            </v-col>
          </v-row>
          <v-row v-else-if="step === 5">
            <!-- Cultural & Storytelling -->
            <v-col cols="12">
              <v-textarea v-model="form.culturalSignificance" label="Cultural Significance" prepend-inner-icon="mdi-book-open-variant" rows="2" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.tribalOrigin" label="Tribal Origin" prepend-inner-icon="mdi-account-group" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.culturalStory" label="Cultural Story" prepend-inner-icon="mdi-book-open-page-variant" rows="2" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.traditionalUse" label="Traditional Use" prepend-inner-icon="mdi-flash" />
            </v-col>
          </v-row>
          <v-row v-else-if="step === 6">
            <!-- Inventory & Stock -->
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.stockQuantity" label="Stock Quantity" type="number" prepend-inner-icon="mdi-format-list-numbered" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.lowStockThreshold" label="Low Stock Threshold" type="number" prepend-inner-icon="mdi-alert" />
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="form.stockStatus" :items="stockStatusOptions" label="Stock Status" prepend-inner-icon="mdi-warehouse" />
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="form.productStatus" :items="productStatusOptions" label="Product Status" prepend-inner-icon="mdi-check-circle" />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.isUnique" label="Unique" color="deep-purple" />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.isVisible" label="Visible" color="success" />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.isFeatured" label="Featured" color="primary" />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.isAuthentic" label="Authentic" color="teal" />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.isCertified" label="Certified" color="amber" />
            </v-col>
          </v-row>
          <v-row v-else-if="step === 7">
            <!-- Extra Options -->
            <v-col cols="12" md="6">
              <v-switch v-model="form.giftWrappingAvailable" label="Gift Wrapping Available" color="pink" />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch v-model="form.personalizationAvailable" label="Personalization Available" color="indigo" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.careInstructions" label="Care Instructions" prepend-inner-icon="mdi-information-outline" rows="2" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.cleaningInstructions" label="Cleaning Instructions" prepend-inner-icon="mdi-broom" rows="2" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.storageInstructions" label="Storage Instructions" prepend-inner-icon="mdi-archive" rows="2" />
            </v-col>
          </v-row>
          <v-row v-else-if="step === 8">
            <!-- Metadata -->
            <v-col cols="12" md="4">
              <v-text-field v-model="form.metaTitle" label="Meta Title" prepend-inner-icon="mdi-tag" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.metaDescription" label="Meta Description" prepend-inner-icon="mdi-text" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.metaKeywords" label="Meta Keywords" prepend-inner-icon="mdi-key" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.yearMade" label="Year Made" type="number" prepend-inner-icon="mdi-calendar" />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.isAntique" label="Is Antique" color="brown" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.ageCategory" label="Age Category" prepend-inner-icon="mdi-timer-sand" />
            </v-col>
          </v-row>
          <div class="d-flex justify-space-between mt-6">
            <v-btn variant="text" color="error" @click="$emit('update:modelValue', false)">Cancel</v-btn>
            <div>
              <v-btn v-if="step > 1" variant="text" @click="step--">Back</v-btn>
              <v-btn
                v-if="step < 8"
                :color="'orange-darken-2'"
                :disabled="!isSectionValid(step)"
                :style="!isSectionValid(step) ? 'opacity: 0.5;' : ''"
                @click="step++"
              >
                Next
              </v-btn>
              <v-btn v-if="step === 8" color="success" type="submit">Submit</v-btn>
            </div>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(['update:modelValue']);
const step = ref(1);
const sectionTitles = [
  'Basic Product Info',
  'Artisan Info',
  'Physical Specs',
  'Wood & Craft Details',
  'Cultural & Storytelling',
  'Inventory & Stock',
  'Extra Options',
  'Metadata'
];

// Mock options for selects
const categoryOptions = [
  { title: 'Furniture', value: 1 },
  { title: 'Accessories', value: 2 },
  { title: 'Decor', value: 3 }
];
const craftTypeOptions = [
  { title: 'Carving', value: 1 },
  { title: 'Weaving', value: 2 }
];
const woodTypeOptions = [
  { title: 'Oak', value: 1 },
  { title: 'Mahogany', value: 2 }
];
const artisanOptions = [
  { title: 'John Doe', value: 1, name: 'John Doe', village: 'Village A', story: 'A skilled artisan.' },
  { title: 'Jane Smith', value: 2, name: 'Jane Smith', village: 'Village B', story: 'Expert in weaving.' }
];
const currencyOptions = ['MWK', 'USD'];
const stockStatusOptions = ['In Stock', 'Low Stock', 'Out of Stock'];
const productStatusOptions = ['Active', 'Inactive', 'Archived'];

const form = ref({
  // Section 1
  productName: '',
  productSlug: '',
  sku: '',
  itemCode: '',
  productDescription: '',
  shortDescription: '',
  basePrice: 0,
  localPrice: 0,
  touristPrice: 0,
  usdPrice: 0,
  currency: '',
  categoryId: null,
  craftTypeId: null,
  woodTypeId: null,
  mainImageFile: null as File | null,
  mainImageUrl: '',
  galleryImages: [] as File[],
  // Section 2
  artisanId: null,
  artisanName: '',
  artisanVillage: '',
  artisanStory: '',
  // Section 3
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  shippingWeight: 0,
  packingFriendly: false,
  shippingFragile: false,
  // Section 4
  woodType: '',
  woodOrigin: '',
  woodColor: '',
  woodGrain: '',
  woodHardness: '',
  woodFinish: '',
  craftingTechnique: '',
  craftingTime: '',
  difficultyLevel: '',
  // Section 5
  culturalSignificance: '',
  tribalOrigin: '',
  culturalStory: '',
  traditionalUse: '',
  // Section 6
  stockQuantity: 0,
  lowStockThreshold: 0,
  stockStatus: '',
  productStatus: '',
  isUnique: false,
  isVisible: true,
  isFeatured: false,
  isAuthentic: false,
  isCertified: false,
  // Section 7
  giftWrappingAvailable: false,
  personalizationAvailable: false,
  careInstructions: '',
  cleaningInstructions: '',
  storageInstructions: '',
  // Section 8
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  yearMade: 0,
  isAntique: false,
  ageCategory: ''
});

watch(() => props.modelValue, (val) => {
  if (!val) {
    // Reset form when dialog closes
    step.value = 1;
    form.value = {
      productName: '', sku: '', itemCode: '', productDescription: '', shortDescription: '', basePrice: 0, localPrice: 0, touristPrice: 0, usdPrice: 0, currency: '', categoryId: null, craftTypeId: null, woodTypeId: null, mainImageFile: null, mainImageUrl: '', galleryImages: [], artisanId: null, artisanName: '', artisanVillage: '', artisanStory: '', weight: 0, length: 0, width: 0, height: 0, shippingWeight: 0, packingFriendly: false, shippingFragile: false, woodType: '', woodOrigin: '', woodColor: '', woodGrain: '', woodHardness: '', woodFinish: '', craftingTechnique: '', craftingTime: '', difficultyLevel: '', culturalSignificance: '', tribalOrigin: '', culturalStory: '', traditionalUse: '', stockQuantity: 0, lowStockThreshold: 0, stockStatus: '', productStatus: '', isUnique: false, isVisible: true, isFeatured: false, isAuthentic: false, isCertified: false, giftWrappingAvailable: false, personalizationAvailable: false, careInstructions: '', cleaningInstructions: '', storageInstructions: '', metaTitle: '', metaDescription: '', metaKeywords: '', yearMade: 0, isAntique: false, ageCategory: ''
    };
  }
});

function autoSlug() {
  form.value.productSlug = form.value.productName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fillArtisanInfo() {
  const selected = artisanOptions.find(a => a.value === form.value.artisanId);
  if (selected) {
    form.value.artisanName = selected.name;
    form.value.artisanVillage = selected.village;
    form.value.artisanStory = selected.story;
  } else {
    form.value.artisanName = '';
    form.value.artisanVillage = '';
    form.value.artisanStory = '';
  }
}

function submit() {
  // For now, just log the form data
  console.log('Submitting product:', form.value);
  emit('update:modelValue', false);
}

// Validation for each section
function isSectionValid(currentStep: number) {
  const f = form.value;
  switch (currentStep) {
    case 1:
      return !!(f.productName && f.sku && f.basePrice && f.categoryId && f.craftTypeId && f.woodTypeId && f.currency);
    case 2:
      return !!f.artisanId;
    case 3:
      return f.weight > 0 && f.length > 0 && f.width > 0 && f.height > 0;
    case 4:
      return true; // Optional fields
    case 5:
      return true; // Optional fields
    case 6:
      return f.stockQuantity >= 0 && f.stockStatus && f.productStatus;
    case 7:
      return true; // Optional fields
    case 8:
      return true; // Optional fields
    default:
      return false;
  }
}
</script> 