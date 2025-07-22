<template>
  <v-container fluid class="pa-6 products-main-container">
    <v-card elevation="4" class="pa-0">
      <div class="pa-6 d-flex align-center stepper-header-bg">
        <v-icon color="orange-darken-2" class="mr-2">mdi-cube-outline</v-icon>
        <span class="text-h5 font-weight-bold text-orange-darken-4">Add Product</span>
      </div>
      <v-card-text class="pa-8">
        <div class="mb-6">
          <v-chip color="primary" class="mr-2">Step {{ step }} of 6</v-chip>
          <span class="font-weight-bold step-title">{{ stepTitles[step - 1] }}</span>
        </div>
        <v-form>
          <template v-if="step === 1">
            <div class="section-title mb-4">Basic Information</div>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.productName" label="Product Name*" variant="outlined" prepend-inner-icon="mdi-cube" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.productSlug" label="Product Slug*" variant="outlined" prepend-inner-icon="mdi-link-variant" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.sku" label="SKU*" variant="outlined" prepend-inner-icon="mdi-barcode" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.itemCode" label="Item Code" variant="outlined" prepend-inner-icon="mdi-identifier" />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="formData.categoryName"
                  :items="[...categoryOptions.map(c => c.categoryName), 'Other']"
                  label="Category"
                  variant="outlined"
                  prepend-inner-icon="mdi-shape"
                  :loading="categoryLoading"
                  clearable
                  required
                  @change="onCategoryChange"
                />
                <v-text-field
                  v-if="formData.categoryName === 'Other'"
                  v-model="formData.categoryOther"
                  label="Enter new category"
                  variant="outlined"
                  class="mt-2"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="formData.craftTypeName"
                  :items="[...craftTypeOptions.map(c => c.craftTypeName), 'Other']"
                  label="Craft Type"
                  variant="outlined"
                  prepend-inner-icon="mdi-hammer-wrench"
                  :loading="craftTypeLoading"
                  clearable
                  @change="onCraftTypeChange"
                />
                <v-text-field
                  v-if="formData.craftTypeName === 'Other'"
                  v-model="formData.craftTypeOther"
                  label="Enter new craft type"
                  variant="outlined"
                  class="mt-2"
                  required
                />
              </v-col>
            </v-row>
          </template>
          <template v-else-if="step === 2">
            <div class="section-title mb-4">Description & Media</div>
            <v-row dense>
              <v-col cols="12">
                <v-textarea v-model="formData.productDescription" label="Product Description" variant="outlined" rows="3" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formData.shortDescription" label="Short Description" variant="outlined" rows="2" />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input v-model="formData.mainImageFile" label="Main Image File" variant="outlined" prepend-inner-icon="mdi-upload" show-size accept="image/*" />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input v-model="formData.galleryImageFiles" label="Gallery Image Files" variant="outlined" prepend-inner-icon="mdi-image-multiple" show-size multiple accept="image/*" />
              </v-col>
            </v-row>
          </template>
          <template v-else-if="step === 3">
            <div class="section-title mb-4">Pricing & Inventory</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.basePrice" label="Base Price" variant="outlined" prepend-inner-icon="mdi-currency-usd" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.touristPrice" label="Tourist Price" variant="outlined" prepend-inner-icon="mdi-currency-usd" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.localPrice" label="Local Price" variant="outlined" prepend-inner-icon="mdi-currency-usd" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.costPrice" label="Cost Price" variant="outlined" prepend-inner-icon="mdi-currency-usd" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.currency" label="Currency" variant="outlined" prepend-inner-icon="mdi-currency-usd" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.usdPrice" label="USD Price" variant="outlined" prepend-inner-icon="mdi-currency-usd" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.stockQuantity" label="Stock Quantity" variant="outlined" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.lowStockThreshold" label="Low Stock Threshold" variant="outlined" type="number" />
              </v-col>
              <!-- All switches in one row -->
              <v-col cols="12">
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-switch v-model="formData.isVisible" label="Is Visible?" color="orange-darken-2" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch v-model="formData.isUnique" label="Is Unique?" color="orange-darken-2" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch v-model="formData.isFeatured" label="Is Featured?" color="orange-darken-2" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
          <template v-else-if="step === 4">
            <div class="section-title mb-4">Physical & Material Details</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.weight" label="Weight" variant="outlined" prepend-inner-icon="mdi-weight-kilogram" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.length" label="Length" variant="outlined" prepend-inner-icon="mdi-ruler" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.width" label="Width" variant="outlined" prepend-inner-icon="mdi-ruler" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="formData.height" label="Height" variant="outlined" prepend-inner-icon="mdi-ruler" type="number" />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="formData.woodTypeName"
                  :items="[...woodTypeOptions.map(w => w.woodName), 'Other']"
                  label="Wood Type"
                  variant="outlined"
                  prepend-inner-icon="mdi-tree"
                  :loading="woodTypeLoading"
                  clearable
                  @change="onWoodTypeChange"
                />
                <v-text-field
                  v-if="formData.woodTypeName === 'Other'"
                  v-model="formData.woodTypeOther"
                  label="Enter new wood type"
                  variant="outlined"
                  class="mt-2"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.woodOrigin" label="Wood Origin" variant="outlined" prepend-inner-icon="mdi-map-marker" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.woodColor" label="Wood Color" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.woodHardness" label="Wood Hardness" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4" v-if="formData.woodTypeName !== 'Other'">
                <v-text-field v-model="formData.woodGrain" label="Wood Grain" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4" v-if="formData.woodTypeName !== 'Other'">
                <v-text-field v-model="formData.woodFinish" label="Wood Finish" variant="outlined" />
              </v-col>
            </v-row>
          </template>
          <template v-else-if="step === 5">
            <div class="section-title mb-4">Artisan & Cultural</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="formData.artisanName"
                  :items="[...artisanOptions.map(a => a.artisanName), 'Other']"
                  label="Artisan"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  :loading="artisanLoading"
                  clearable
                />
                <v-text-field
                  v-if="formData.artisanName === 'Other'"
                  v-model="formData.artisanOther"
                  label="Enter new artisan name"
                  variant="outlined"
                  class="mt-2"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.artisanVillage" label="Artisan Village" variant="outlined" prepend-inner-icon="mdi-home-group" />
              </v-col>
              <v-col cols="12" md="4">
                <v-textarea v-model="formData.artisanStory" label="Artisan Story" variant="outlined" prepend-inner-icon="mdi-book-open-page-variant" rows="2" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formData.culturalSignificance" label="Cultural Significance" variant="outlined" prepend-inner-icon="mdi-book-open-variant" rows="2" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.tribalOrigin" label="Tribal Origin" variant="outlined" prepend-inner-icon="mdi-account-group" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formData.culturalStory" label="Cultural Story" variant="outlined" prepend-inner-icon="mdi-book-open-page-variant" rows="2" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.traditionalUse" label="Traditional Use" variant="outlined" prepend-inner-icon="mdi-flash" />
              </v-col>
            </v-row>
          </template>
          <template v-else-if="step === 6">
            <div class="section-title mb-4">Advanced / Optional</div>
            <v-alert v-if="validationErrors.length" type="error" class="mb-4">
              <div v-for="err in validationErrors" :key="err">{{ err }}</div>
            </v-alert>
            <v-row dense>
              <!-- Care, Cleaning, Storage Instructions row -->
              <v-col cols="12">
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="formData.careInstructions"
                      :items="careInstructionOptions"
                      label="Care Instructions"
                      variant="outlined"
                      :loading="careInstructionLoading"
                      clearable
                    />
                    <v-text-field
                      v-if="formData.careInstructions === 'Other'"
                      v-model="formData.careInstructionsOther"
                      label="Enter new care instruction"
                      variant="outlined"
                      class="mt-2"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="formData.cleaningInstructions"
                      :items="careInstructionOptions"
                      label="Cleaning Instructions"
                      variant="outlined"
                      :loading="careInstructionLoading"
                      clearable
                    />
                    <v-text-field
                      v-if="formData.cleaningInstructions === 'Other'"
                      v-model="formData.cleaningInstructionsOther"
                      label="Enter new cleaning instruction"
                      variant="outlined"
                      class="mt-2"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="formData.storageInstructions"
                      :items="careInstructionOptions"
                      label="Storage Instructions"
                      variant="outlined"
                      :loading="careInstructionLoading"
                      clearable
                    />
                    <v-text-field
                      v-if="formData.storageInstructions === 'Other'"
                      v-model="formData.storageInstructionsOther"
                      label="Enter new storage instruction"
                      variant="outlined"
                      class="mt-2"
                      required
                    />
                  </v-col>
                </v-row>
              </v-col>
              <!-- Crafting, Stock, Video fields row -->
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.craftingTechnique" label="Crafting Technique" variant="outlined" prepend-inner-icon="mdi-tools" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.craftingTime" label="Crafting Time" variant="outlined" prepend-inner-icon="mdi-timer" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.difficultyLevel"
                  :items="['Beginner', 'Intermediate', 'Advanced', 'Expert']"
                  label="Difficulty Level"
                  variant="outlined"
                  prepend-inner-icon="mdi-chart-bar"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.stockStatus" label="Stock Status" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.productStatus" label="Product Status" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.videoUrl" label="Video URL" variant="outlined" prepend-inner-icon="mdi-video" />
              </v-col>
              <!-- All switches in one row -->
              <v-col cols="12">
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-switch v-model="formData.isCertified" label="Is Certified?" color="orange-darken-2" />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-switch v-model="formData.isAuthentic" label="Is Authentic?" color="orange-darken-2" />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-switch v-model="formData.giftWrappingAvailable" label="Gift Wrapping Available?" color="orange-darken-2" />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-switch v-model="formData.personalizationAvailable" label="Personalization Available?" color="orange-darken-2" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.metaTitle" label="Meta Title" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.metaDescription" label="Meta Description" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.metaKeywords" label="Meta Keywords" variant="outlined" />
              </v-col>
            </v-row>
          </template>
        </v-form>
        <div class="d-flex justify-space-between mt-10">
          <v-btn variant="text" color="grey" size="large" class="px-8 py-3" @click="cancel">
            Cancel
          </v-btn>
          <div>
            <v-btn v-if="step > 1" variant="tonal" color="orange-darken-2" size="large" class="px-8 py-3 mr-2" @click="prevStep">
              <v-icon left>mdi-arrow-left</v-icon> Back
            </v-btn>
            <v-btn v-if="step < 6" color="orange-darken-2" size="large" class="px-8 py-3" @click="nextStep" :disabled="!isStepValid">
              Next <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn v-if="step === 6" color="success" size="large" class="px-8 py-3" @click="handleSubmit" :loading="isSubmitting" :disabled="validationErrors.length > 0">
              <v-icon left>mdi-check-circle-outline</v-icon> Submit
            </v-btn>
          </div>
        </div>
        <v-alert v-if="step === 5 && validationErrors.length" type="error" class="mt-4">
          <div v-for="err in validationErrors" :key="err">{{ err }}</div>
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useProductStore } from '@/stores/product';
import { useProductCategoryStore } from '@/stores/productCategory';
import { useCraftTypeStore } from '@/stores/craftStore';
import { useWoodTypeStore } from '@/stores/woodStore';
import { useSnackbarStore } from '@/stores/snackbar';
import { useArtisanStore } from '@/stores/artisan';
import { apiService } from '@/services/api';

const productStore = useProductStore();
const categoryStore = useProductCategoryStore();
const craftTypeStore = useCraftTypeStore();
const woodTypeStore = useWoodTypeStore();
const artisanStore = useArtisanStore();
const snackbar = useSnackbarStore();

const step = ref(1);
const isSubmitting = ref(false);
const stepTitles = [
  'Basic Info',
  'Description & Media',
  'Pricing & Inventory',
  'Physical & Material Details',
  'Artisan & Cultural',
  'Advanced / Optional',
];

const formData = ref<{ [key: string]: any }>({
  // Step 1
  productName: '',
  productSlug: '',
  sku: '',
  itemCode: '',
  categoryName: '',
  categoryOther: '',
  craftTypeName: '',
  craftTypeOther: '',
  woodTypeName: '',
  woodTypeOther: '',
  // Step 2
  productDescription: '',
  shortDescription: '',
  mainImageFile: null,
  galleryImageFiles: [],
  // Step 3
  basePrice: null,
  touristPrice: null,
  localPrice: null,
  costPrice: null,
  currency: '',
  usdPrice: null,
  stockQuantity: null,
  isUnique: false,
  lowStockThreshold: null,
  isVisible: true,
  isFeatured: false,
  // Step 4
  weight: null,
  length: null,
  width: null,
  height: null,
  woodType: '',
  woodOrigin: '',
  woodGrain: '',
  woodColor: '',
  woodHardness: '',
  woodFinish: '',
  // Step 5
  artisanId: null,
  artisanName: '',
  artisanVillage: '',
  artisanStory: '',
  culturalSignificance: '',
  tribalOrigin: '',
  culturalStory: '',
  traditionalUse: '',
  artisanOther: '',
  // Step 6
  craftingTechnique: '',
  craftingTime: '',
  difficultyLevel: '',
  stockStatus: '',
  productStatus: '',
  isAuthentic: false,
  isCertified: false,
  videoUrl: '',
  giftWrappingAvailable: false,
  personalizationAvailable: false,
  careInstructions: '',
  careInstructionsOther: '',
  cleaningInstructions: '',
  cleaningInstructionsOther: '',
  storageInstructions: '',
  storageInstructionsOther: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
});

const categoryOptions = ref([]);
const craftTypeOptions = ref([]);
const woodTypeOptions = ref([]);
const artisanOptions = ref([]);
const careInstructionOptions = ref([]);
const careInstructionLoading = ref(false);

const userEditedSlug = ref(false);

watch(() => formData.value.productSlug, (val) => {
  // If the user types in the slug field, mark as manually edited
  if (val && val !== slugify(formData.value.productName)) {
    userEditedSlug.value = true;
  } else if (!val) {
    userEditedSlug.value = false;
  }
});

watch(() => formData.value.productName, (val) => {
  if (!userEditedSlug.value) {
    formData.value.productSlug = slugify(val);
  }
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

const categorySearch = ref('');
const craftTypeSearch = ref('');
const woodTypeSearch = ref('');
const artisanSearch = ref('');
const categoryLoading = ref(false);
const craftTypeLoading = ref(false);
const woodTypeLoading = ref(false);
const artisanLoading = ref(false);

const validationErrors = ref<string[]>([]);

function validateProductData(product: { [key: string]: any }) {
  const errors = [];
  if (!product.productName) errors.push('Product name is required.');
  if (!product.basePrice || product.basePrice <= 0) errors.push('Base price must be greater than 0.');
  if (!product.categoryId) errors.push('Category is required.');
  if (!product.craftTypeId) errors.push('Craft type is required.');
  if (!product.woodTypeId) errors.push('Wood type is required.');
  if (!product.sku) errors.push('SKU is required.');
  if (!product.currency) errors.push('Currency is required.');
  if (product.stockQuantity === undefined || product.stockQuantity === null || product.stockQuantity < 0) errors.push('Stock quantity must be 0 or more.');
  // ...add more checks as needed
  return errors;
}

const displayProductSummary = computed(() => {
  // Show a readable summary for review
  const summary: { [key: string]: any } = {};
  const keys = [
    'productName', 'productSlug', 'sku', 'itemCode', 'basePrice', 'touristPrice', 'localPrice', 'costPrice', 'currency',
    'categoryId', 'craftTypeId', 'woodTypeId', 'productDescription', 'shortDescription', 'stockQuantity', 'isUnique',
    'isVisible', 'isFeatured', 'isAuthentic', 'isCertified', 'mainImageUrl', 'galleryImages', 'artisanName', 'artisanVillage',
    'artisanStory', 'culturalSignificance', 'tribalOrigin', 'culturalStory', 'traditionalUse', 'woodGrain', 'woodColor',
    'woodHardness', 'woodFinish', 'condition', 'qualityGrade', 'handmadeLevel', 'lowStockThreshold', 'stockStatus',
    'productStatus', 'giftWrappingAvailable', 'personalizationAvailable', 'careInstructions', 'cleaningInstructions',
    'storageInstructions', 'shippingWeight', 'packagingRequired', 'shippingRestrictions', 'customsCode',
    'requiresPhytosanitaryCertificate', 'averageRating', 'reviewCount', 'metaTitle', 'metaDescription', 'metaKeywords',
    'yearMade', 'isAntique', 'ageCategory', 'customAttributes', 'videoUrl', 'processImages', 'artisanImage', 'isPopularWithTourists',
    'touristFriendlySize', 'packingFriendly', 'shippingFragile', 'isSouvenir', 'souvenirType'
  ];
  for (const key of keys) {
    if (formData.value[key] !== undefined && formData.value[key] !== null && formData.value[key] !== '') {
      summary[key] = formData.value[key];
    }
  }
  return summary;
});

onMounted(async () => {
  await categoryStore.fetchCategories();
  categoryOptions.value = categoryStore.getCategories.map(cat => ({
    categoryName: cat.categoryName,
    categoryId: cat.categoryId,
  }));
  await craftTypeStore.fetchCraftTypes();
  craftTypeOptions.value = craftTypeStore.craftTypes.map(c => ({
    craftTypeName: c.craftTypeName,
    craftTypeId: c.craftTypeId,
  }));
  await woodTypeStore.fetchWoodTypes();
  woodTypeOptions.value = woodTypeStore.woodTypes.map(w => ({
    woodName: w.woodName,
    woodTypeId: w.woodTypeId,
  }));
  await artisanStore.fetchArtisans();
  artisanOptions.value = artisanStore.artisans.map(a => ({
    artisanName: a.artisanName,
    artisanId: a.artisanId,
  }));
  // Fetch care instructions
  careInstructionLoading.value = true;
  try {
    const response = await apiService.get('ProductCareInstructions/GetAll');
    careInstructionOptions.value = (response.payload || []).map((ci: any) => ci.instructionText || ci.careInstruction || ci.instruction || '');
  } catch (e) {
    careInstructionOptions.value = [];
  } finally {
    careInstructionLoading.value = false;
  }
});

watch(() => formData.value.woodTypeName, async (val) => {
  if (!val || val === 'Other') {
    formData.value.woodOrigin = '';
    formData.value.woodGrain = '';
    formData.value.woodColor = '';
    formData.value.woodHardness = '';
    formData.value.woodFinish = '';
    return;
  }
  const selected = woodTypeOptions.value.find(w => w.woodName && w.woodName.toLowerCase() === val.toLowerCase());
  if (selected && selected.woodTypeId) {
    try {
      const response = await apiService.get(`/WoodTypes/GetById?woodtypeid=${selected.woodTypeId}`);
      const details = response.payload || {};
      formData.value.woodOrigin = details.woodOrigin || '';
      formData.value.woodGrain = details.woodGrain || '';
      formData.value.woodColor = details.woodColor || '';
      formData.value.woodHardness = details.woodHardness || '';
      formData.value.woodFinish = details.woodFinish || '';
    } catch (e) {
      formData.value.woodOrigin = '';
      formData.value.woodGrain = '';
      formData.value.woodColor = '';
      formData.value.woodHardness = '';
      formData.value.woodFinish = '';
    }
  }
});

watch(() => formData.value.artisanName, async (val) => {
  if (!val || val === 'Other') {
    formData.value.artisanVillage = '';
    formData.value.artisanStory = '';
    return;
  }
  const selected = artisanOptions.value.find(a => a.artisanName && a.artisanName.toLowerCase() === val.toLowerCase());
  if (selected && selected.artisanId) {
    try {
      const response = await apiService.get(`/Artisans/GetById?artisanid=${selected.artisanId}`);
      const details = response.payload || {};
      formData.value.artisanVillage = details.village || '';
      formData.value.artisanStory = details.biography || '';
    } catch (e) {
      formData.value.artisanVillage = '';
      formData.value.artisanStory = '';
    }
  }
});

async function addCategory(name: string) {
  if (!name) return;
  categoryLoading.value = true;
  try {
    await categoryStore.createProductCategory({ categoryName: name });
    await categoryStore.fetchProductCategories();
    categoryOptions.value = categoryStore.getCategories.map(cat => ({
      categoryName: cat.categoryName,
      categoryId: cat.categoryId,
    }));
    const newCat = categoryOptions.value.find(c => c.categoryName === name);
    if (newCat) formData.value.categoryId = newCat.categoryId;
    snackbar.success('Category added!');
  } catch (e) {
    snackbar.error('Failed to add category');
  } finally {
    categoryLoading.value = false;
  }
}
function onCategorySearch(val: string) { categorySearch.value = val; }
function onCategoryChange(val: string) {
  const selected = categoryOptions.value.find(c => c.categoryName === val);
  formData.value.categoryId = selected ? selected.categoryId : null;
}

async function addCraftType(name: string) {
  if (!name) return;
  craftTypeLoading.value = true;
  try {
    await craftTypeStore.createCraftType({ craftTypeName: name });
    await craftTypeStore.fetchCraftTypes();
    craftTypeOptions.value = craftTypeStore.craftTypes.map(c => ({
      craftTypeName: c.craftTypeName,
      craftTypeId: c.craftTypeId,
    }));
    const newType = craftTypeOptions.value.find(c => c.craftTypeName === name);
    if (newType) formData.value.craftTypeId = newType.craftTypeId;
    snackbar.success('Craft type added!');
  } catch (e) {
    snackbar.error('Failed to add craft type');
  } finally {
    craftTypeLoading.value = false;
  }
}
function onCraftTypeSearch(val: string) { craftTypeSearch.value = val; }
function onCraftTypeChange(val: string) {
  const selected = craftTypeOptions.value.find(c => c.craftTypeName === val);
  formData.value.craftTypeId = selected ? selected.craftTypeId : null;
}

async function addWoodType(name: string) {
  if (!name) return;
  woodTypeLoading.value = true;
  try {
    await woodTypeStore.createWoodType({ woodName: name });
    await woodTypeStore.fetchWoodTypes();
    woodTypeOptions.value = woodTypeStore.woodTypes.map(w => ({
      woodName: w.woodName,
      woodTypeId: w.woodTypeId,
    }));
    const newType = woodTypeOptions.value.find(w => w.woodName === name);
    if (newType) formData.value.woodTypeId = newType.woodTypeId;
    snackbar.success('Wood type added!');
  } catch (e) {
    snackbar.error('Failed to add wood type');
  } finally {
    woodTypeLoading.value = false;
  }
}
function onWoodTypeSearch(val: string) { woodTypeSearch.value = val; }
function onWoodTypeChange(val: string) {
  const selected = woodTypeOptions.value.find(w => w.woodName === val);
  formData.value.woodTypeId = selected ? selected.woodTypeId : null;
}

async function addArtisan(name: string) {
  if (!name) return;
  artisanLoading.value = true;
  try {
    await artisanStore.createArtisan({ artisanName: name });
    await artisanStore.fetchArtisans();
    artisanOptions.value = artisanStore.artisans.map(a => ({
      artisanName: a.artisanName,
      artisanId: a.artisanId,
    }));
    const newArtisan = artisanOptions.value.find(a => a.artisanName === name);
    if (newArtisan) formData.value.artisanId = newArtisan.artisanId;
    snackbar.success('Artisan added!');
  } catch (e) {
    snackbar.error('Failed to add artisan');
  } finally {
    artisanLoading.value = false;
  }
}
function onArtisanSearch(val: string) { artisanSearch.value = val; }
function onArtisanChange(val: any) { /* Optionally handle */ }

function nextStep() {
  if (step.value === 5) {
    validationErrors.value = validateProductData(formData.value);
    if (validationErrors.value.length) {
      console.log('Validation errors:', validationErrors.value);
      return;
    }
  }
  if (step.value < 6) step.value++;
}
function prevStep() {
  if (step.value > 1) step.value--;
}
function cancel() {
  window.history.back();
}

async function handleSubmit() {
  validationErrors.value = validateProductData(formData.value);
  if (validationErrors.value.length) {
    return;
  }
  isSubmitting.value = true;
  try {
    // CATEGORY: ensure we have an ID
    let categoryId = null;
    let categoryNameToUse = formData.value.categoryName === 'Other' ? formData.value.categoryOther : formData.value.categoryName;
    const cat = categoryOptions.value.find(c => c.categoryName.toLowerCase() === (categoryNameToUse || '').toLowerCase());
    if (cat) {
      categoryId = cat.categoryId;
    } else if (categoryNameToUse) {
      categoryLoading.value = true;
      const resp = await categoryStore.createCategory({ categoryName: categoryNameToUse });
      await categoryStore.fetchCategories();
      categoryOptions.value = categoryStore.getCategories.map(cat => ({
        categoryName: cat.categoryName,
        categoryId: cat.categoryId,
      }));
      const newCat = categoryOptions.value.find(c => c.categoryName.toLowerCase() === categoryNameToUse.toLowerCase());
      if (newCat) categoryId = newCat.categoryId;
      categoryLoading.value = false;
    }
    // CRAFT TYPE: ensure we have an ID
    let craftTypeId = null;
    let craftTypeNameToUse = formData.value.craftTypeName === 'Other' ? formData.value.craftTypeOther : formData.value.craftTypeName;
    const craft = craftTypeOptions.value.find(c => c.craftTypeName.toLowerCase() === (craftTypeNameToUse || '').toLowerCase());
    if (craft) {
      craftTypeId = craft.craftTypeId;
    } else if (craftTypeNameToUse) {
      craftTypeLoading.value = true;
      await craftTypeStore.createCraftType({ craftTypeName: craftTypeNameToUse });
      await craftTypeStore.fetchCraftTypes();
      craftTypeOptions.value = craftTypeStore.craftTypes.map(c => ({
        craftTypeName: c.craftTypeName,
        craftTypeId: c.craftTypeId,
      }));
      const newType = craftTypeOptions.value.find(c => c.craftTypeName.toLowerCase() === craftTypeNameToUse.toLowerCase());
      if (newType) craftTypeId = newType.craftTypeId;
      craftTypeLoading.value = false;
    }
    // WOOD TYPE: ensure we have an ID
    let woodTypeId = null;
    let woodTypeNameToUse = formData.value.woodTypeName === 'Other' ? formData.value.woodTypeOther : formData.value.woodTypeName;
    const wood = woodTypeOptions.value.find(w => w.woodName.toLowerCase() === (woodTypeNameToUse || '').toLowerCase());
    if (wood) {
      woodTypeId = wood.woodTypeId;
    } else if (woodTypeNameToUse) {
      woodTypeLoading.value = true;
      await woodTypeStore.createWoodType({ woodName: woodTypeNameToUse });
      await woodTypeStore.fetchWoodTypes();
      woodTypeOptions.value = woodTypeStore.woodTypes.map(w => ({
        woodName: w.woodName,
        woodTypeId: w.woodTypeId,
      }));
      const newType = woodTypeOptions.value.find(w => w.woodName.toLowerCase() === woodTypeNameToUse.toLowerCase());
      if (newType) woodTypeId = newType.woodTypeId;
      woodTypeLoading.value = false;
    }
    // ARTISAN: ensure we have an ID
    let artisanId = null;
    let artisanNameToUse = formData.value.artisanName === 'Other' ? formData.value.artisanOther : formData.value.artisanName;
    const artisan = artisanOptions.value.find(a => a.artisanName.toLowerCase() === (artisanNameToUse || '').toLowerCase());
    if (artisan) {
      artisanId = artisan.artisanId;
    } else if (artisanNameToUse) {
      artisanLoading.value = true;
      await artisanStore.createArtisan({ artisanName: artisanNameToUse });
      await artisanStore.fetchArtisans();
      artisanOptions.value = artisanStore.artisans.map(a => ({
        artisanName: a.artisanName,
        artisanId: a.artisanId,
      }));
      const newArtisan = artisanOptions.value.find(a => a.artisanName.toLowerCase() === artisanNameToUse.toLowerCase());
      if (newArtisan) artisanId = newArtisan.artisanId;
      artisanLoading.value = false;
    }
    // CARE INSTRUCTION: ensure we have a value
    let careInstructionToUse = formData.value.careInstructions === 'Other' ? formData.value.careInstructionsOther : formData.value.careInstructions;
    if (formData.value.careInstructions === 'Other' && formData.value.careInstructionsOther) {
      careInstructionLoading.value = true;
      await apiService.post('/ProductCareInstructions/Add', { instructionText: formData.value.careInstructionsOther });
      // Optionally refresh options
      const response = await apiService.get('/ProductCareInstructions/GetAll');
      careInstructionOptions.value = (response.payload || []).map((ci: any) => ci.instructionText || ci.careInstruction || ci.instruction || '');
      careInstructionLoading.value = false;
    }
    // Cleaning Instructions: ensure we have a value
    let cleaningInstructionToUse = formData.value.cleaningInstructions === 'Other' ? formData.value.cleaningInstructionsOther : formData.value.cleaningInstructions;
    if (formData.value.cleaningInstructions === 'Other' && formData.value.cleaningInstructionsOther) {
      careInstructionLoading.value = true;
      await apiService.post('/ProductCareInstructions/Add', { instructionText: formData.value.cleaningInstructionsOther });
      // Optionally refresh options
      const response = await apiService.get('/ProductCareInstructions/GetAll');
      careInstructionOptions.value = (response.payload || []).map((ci: any) => ci.instructionText || ci.careInstruction || ci.instruction || '');
      careInstructionLoading.value = false;
    }
    // Storage Instructions: ensure we have a value
    let storageInstructionToUse = formData.value.storageInstructions === 'Other' ? formData.value.storageInstructionsOther : formData.value.storageInstructions;
    if (formData.value.storageInstructions === 'Other' && formData.value.storageInstructionsOther) {
      careInstructionLoading.value = true;
      await apiService.post('/ProductCareInstructions/Add', { instructionText: formData.value.storageInstructionsOther });
      // Optionally refresh options
      const response = await apiService.get('/ProductCareInstructions/GetAll');
      careInstructionOptions.value = (response.payload || []).map((ci: any) => ci.instructionText || ci.careInstruction || ci.instruction || '');
      careInstructionLoading.value = false;
    }
    // Build FormData for product creation
    const fd = new FormData();
    for (const [key, value] of Object.entries(formData.value)) {
      if (["mainImageFile", "galleryImageFiles", "categoryName", "categoryOther", "craftTypeName", "craftTypeOther", "woodTypeName", "woodTypeOther", "artisanName", "artisanOther", "careInstructions", "careInstructionsOther", "cleaningInstructions", "cleaningInstructionsOther", "storageInstructions", "storageInstructionsOther"].includes(key)) continue;
      if (value !== null && value !== undefined) {
        fd.append(key, value as any);
      }
    }
    if (formData.value.mainImageFile) {
      fd.append('MainImageFile', formData.value.mainImageFile);
    }
    if (formData.value.galleryImageFiles && Array.isArray(formData.value.galleryImageFiles)) {
      for (const file of formData.value.galleryImageFiles) {
        fd.append('GalleryImageFiles', file);
      }
    }
    // Add the resolved IDs
    if (categoryId) fd.append('categoryId', categoryId);
    if (craftTypeId) fd.append('craftTypeId', craftTypeId);
    if (woodTypeId) fd.append('woodTypeId', woodTypeId);
    if (artisanId) fd.append('artisanId', artisanId);
    await productStore.addProduct(fd);
    snackbar.success('Product added successfully!');
    step.value = 1;
    Object.keys(formData.value).forEach(k => (formData.value as any)[k] = Array.isArray((formData.value as any)[k]) ? [] : '');
  } catch (e) {
    snackbar.error('Failed to add product');
  } finally {
    isSubmitting.value = false;
  }
}

// Validation for required fields per step
const isStepValid = computed(() => {
  if (step.value === 1) {
    return !!(
      formData.value.productName &&
      formData.value.productSlug &&
      formData.value.sku &&
      formData.value.categoryName
    );
  }
  if (step.value === 3) {
    return !!(
      formData.value.basePrice &&
      formData.value.currency &&
      formData.value.stockQuantity
    );
  }
  // For other steps, always allow next (or add more rules as needed)
  return true;
});

function getCategoryByName(name: string) {
  return categoryOptions.value.find(c => c.categoryName.toLowerCase() === name.toLowerCase());
}
function getCraftTypeByName(name: string) {
  return craftTypeOptions.value.find(c => c.craftTypeName.toLowerCase() === name.toLowerCase());
}
function getWoodTypeByName(name: string) {
  return woodTypeOptions.value.find(w => w.woodName.toLowerCase() === name.toLowerCase());
}
function getArtisanByName(name: string) {
  return artisanOptions.value.find(a => a.artisanName.toLowerCase() === name.toLowerCase());
}

async function onCategoryBlur() {
  if (!categorySearch.value) return;
  const existing = getCategoryByName(categorySearch.value);
  if (!existing) {
    await addCategory(categorySearch.value);
  } else {
    formData.value.categoryId = existing.categoryId;
  }
}
async function onCraftTypeBlur() {
  if (!craftTypeSearch.value) return;
  const existing = getCraftTypeByName(craftTypeSearch.value);
  if (!existing) {
    await addCraftType(craftTypeSearch.value);
  } else {
    formData.value.craftTypeId = existing.craftTypeId;
  }
}
async function onWoodTypeBlur() {
  if (!woodTypeSearch.value) return;
  const existing = getWoodTypeByName(woodTypeSearch.value);
  if (!existing) {
    await addWoodType(woodTypeSearch.value);
  } else {
    formData.value.woodTypeId = existing.woodTypeId;
  }
}
async function onArtisanBlur() {
  if (!artisanSearch.value) return;
  const existing = getArtisanByName(artisanSearch.value);
  if (!existing) {
    await addArtisan(artisanSearch.value);
  } else {
    formData.value.artisanId = existing.artisanId;
  }
}
</script>

<style scoped>
.stepper-header-bg {
  background: #fff3e0;
  border-radius: 8px 8px 0 0;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #b45309;
  letter-spacing: 0.5px;
}
.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #b45309;
  margin-left: 6px;
}
</style>