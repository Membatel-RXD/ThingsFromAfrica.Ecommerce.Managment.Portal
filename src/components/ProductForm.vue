<template>
  <v-card>
    <!-- Redesigned Stepper Header -->
    <div class="pa-0" style="background: #fff3e0; border-radius: 8px 8px 0 0;">
      <v-row class="pa-4 align-center">
        <v-col cols="12">
          <div class="d-flex align-center">
            <v-icon color="orange-darken-2" size="32">mdi-cube-outline</v-icon>
            <span class="text-h5 font-weight-bold text-orange-darken-4 ml-3">
              {{ isEdit ? 'Edit Product' : 'Add New Product' }}
            </span>
          </div>
        </v-col>
      </v-row>
      <v-stepper v-model="step" class="elevation-0 stepper-modern" vertical>
        <v-stepper-header class="pa-0">
          <v-stepper-step :complete="step > 1" step="1">
            <v-icon left>mdi-information-outline</v-icon> Basic Info
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2">
            <v-icon left>mdi-currency-usd</v-icon> Pricing & Stock
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 3" step="3">
            <v-icon left>mdi-image</v-icon> Images & SEO
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="4">
            <v-icon left>mdi-check-circle-outline</v-icon> Review & Submit
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Product Name" />
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="2">
            <div class="mb-4">
              <div class="text-h6 font-weight-bold text-orange-darken-2 mb-1">Pricing & Stock</div>
              <div class="text-body-2 text-grey-darken-1 mb-4">Set the price and stock details for this product.</div>
            </div>
            <v-form ref="form2" v-model="valid[1]">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field v-model.number="formData.basePrice" label="Base Price" type="number" :rules="[rules.required]" required />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model.number="formData.touristPrice" label="Tourist Price" type="number" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model.number="formData.localPrice" label="Local Price" type="number" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model.number="formData.stockQuantity" label="Stock Quantity" type="number" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-switch v-model="formData.isUnique" label="Is Unique?" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-switch v-model="formData.isVisible" label="Is Visible?" />
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="3">
            <div class="mb-4">
              <div class="text-h6 font-weight-bold text-orange-darken-2 mb-1">Images & SEO</div>
              <div class="text-body-2 text-grey-darken-1 mb-4">Add images and SEO metadata for your product.</div>
            </div>
            <v-form ref="form3" v-model="valid[2]">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.mainImageUrl" label="Main Image URL" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.galleryImages" label="Gallery Images (comma-separated URLs)" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.metaTitle" label="Meta Title" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.metaDescription" label="Meta Description" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.metaKeywords" label="Meta Keywords" />
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="4">
            <div class="mb-4">
              <div class="text-h6 font-weight-bold text-orange-darken-2 mb-1">Review & Submit</div>
              <div class="text-body-2 text-grey-darken-1 mb-4">Review all product details before submitting.</div>
            </div>
            <v-row>
              <v-col cols="12">
                <v-card class="pa-4 elevation-2 mb-2" color="#fff8e1">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="orange-darken-2" class="mr-2">mdi-cube-outline</v-icon>
                    <span class="text-h6 font-weight-bold">{{ formData.productName }}</span>
                    <v-chip class="ml-3" color="orange-darken-2" size="small">{{ formData.sku }}</v-chip>
                  </div>
                  <div class="mb-2 text-grey-darken-2">{{ formData.productDescription }}</div>
                  <div class="d-flex flex-wrap mb-2">
                    <v-chip class="mr-2 mb-2" color="orange-darken-4" size="small">Category: {{ getCategoryName(formData.categoryId) }}</v-chip>
                    <v-chip class="mr-2 mb-2" color="orange-darken-4" size="small">Craft: {{ getCraftTypeName(formData.craftTypeId) }}</v-chip>
                    <v-chip class="mr-2 mb-2" color="orange-darken-4" size="small">Artisan: {{ getArtisanName(formData.artisanId) }}</v-chip>
                  </div>
                  <div class="mb-2">
                    <v-icon color="green-darken-2" class="mr-1">mdi-currency-usd</v-icon>
                    <span class="font-weight-bold">Base Price:</span> {{ formData.basePrice }}
                    <v-icon color="blue-darken-2" class="ml-4 mr-1">mdi-format-list-numbered</v-icon>
                    <span class="font-weight-bold">Stock:</span> {{ formData.stockQuantity }}
                  </div>
                  <div class="mb-2">
                    <v-icon color="grey-darken-2" class="mr-1">mdi-image</v-icon>
                    <span class="font-weight-bold">Main Image:</span> <span class="text-truncate">{{ formData.mainImageUrl }}</span>
                  </div>
                  <div class="mb-2">
                    <v-icon color="grey-darken-2" class="mr-1">mdi-link-variant</v-icon>
                    <span class="font-weight-bold">Slug:</span> {{ formData.productSlug }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card-text>
    <v-card-actions class="pa-4 d-flex justify-space-between align-center">
      <v-btn variant="text" @click="$emit('cancel')" size="large">Cancel</v-btn>
      <div>
        <v-btn v-if="step > 1" @click="prevStep" variant="tonal" color="orange-darken-2" size="large" class="mr-2">
          <v-icon left>mdi-arrow-left</v-icon> Back
        </v-btn>
        <v-btn v-if="step < 4" @click="nextStep" color="orange-darken-2" size="large" class="mr-2">
          Next <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn v-if="step === 4" color="success" size="large" :loading="isSubmitting" @click="handleSubmit">
          <v-icon left>mdi-check-circle-outline</v-icon> Submit
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
  <!-- Add New Dialog -->
  <v-dialog v-model="addDialog.open" persistent max-width="400">
    <v-card>
      <v-card-title>Add New {{ addDialog.type === 'category' ? 'Category' : addDialog.type === 'craftType' ? 'Craft Type' : 'Artisan' }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="addDialog.value" label="Name" autofocus />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="addDialog.open = false">Cancel</v-btn>
        <v-btn color="primary" @click="handleAddNew">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useArtisanStore } from '@/stores/artisan';
import { useWoodTypeStore } from '@/stores/woodStore';
import { useProductCategoryStore } from '@/stores/productCategory';
import { useCraftTypeStore } from '@/stores/craftStore';

const props = defineProps({
  isEdit: Boolean,
  initialData: Object,
});
const emit = defineEmits(['submit', 'cancel']);

const step = ref(1);
const valid = ref([false, false, false]);
const isSubmitting = ref(false);

const formData = ref({
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
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
});

// Dropdown data
const artisanStore = useArtisanStore();
const woodTypeStore = useWoodTypeStore();
const categoryStore = useProductCategoryStore();
const craftTypeStore = useCraftTypeStore();

const artisanOptions = ref([]);
const artisanLoading = ref(false);
const woodTypeOptions = ref([]);
const woodTypeLoading = ref(false);
const categoryOptions = ref([]);
const categoryLoading = ref(false);
const craftTypeOptions = ref([]);
const craftTypeLoading = ref(false);

// Dialog state for add-new
const addDialog = ref({
  open: false,
  type: '', // 'category' | 'craftType' | 'artisan'
  value: '',
});

onMounted(async () => {
  artisanLoading.value = true;
  await artisanStore.fetchArtisans();
  artisanOptions.value = artisanStore.artisans;
  artisanLoading.value = false;

  woodTypeLoading.value = true;
  await woodTypeStore.fetchWoodTypes();
  woodTypeOptions.value = woodTypeStore.woodTypes;
  woodTypeLoading.value = false;

  categoryLoading.value = true;
  await categoryStore.fetchProductCategories();
  categoryOptions.value = categoryStore.productCategories;
  categoryLoading.value = false;

  craftTypeLoading.value = true;
  await craftTypeStore.fetchCraftTypes();
  craftTypeOptions.value = craftTypeStore.craftTypes;
  craftTypeLoading.value = false;

  if (props.isEdit && props.initialData) {
    Object.assign(formData.value, props.initialData);
  }
});

function onArtisanSelected(artisanId: number) {
  const artisan = artisanOptions.value.find(a => a.artisanId === artisanId);
  if (artisan) {
    formData.value.artisanName = artisan.artisanName;
    formData.value.artisanVillage = artisan.village;
  }
}

const rules = {
  required: (v: any) => !!v || 'This field is required',
};

function nextStep() {
  if (step.value < 4) step.value++;
}
function prevStep() {
  if (step.value > 1) step.value--;
}

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    emit('submit', formData.value);
  } finally {
    isSubmitting.value = false;
  }
}

// Watcher for auto-generating slug
let userEditedSlug = false;
watch(() => formData.value.productSlug, (val, oldVal) => {
  if (val !== '' && val !== slugify(formData.value.productName)) {
    userEditedSlug = true;
  }
});
watch(() => formData.value.productName, (val) => {
  if (!userEditedSlug) {
    formData.value.productSlug = slugify(val);
  }
});
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

// Add new entry logic
async function handleAddNew() {
  if (!addDialog.value.value.trim()) return;
  if (addDialog.value.type === 'category') {
    await categoryStore.createProductCategory({ categoryName: addDialog.value.value });
    await categoryStore.fetchProductCategories();
    categoryOptions.value = categoryStore.productCategories;
    const newCat = categoryOptions.value.find(c => c.categoryName === addDialog.value.value);
    if (newCat) formData.value.categoryId = newCat.categoryId;
  } else if (addDialog.value.type === 'craftType') {
    await craftTypeStore.createCraftType({ craftTypeName: addDialog.value.value });
    await craftTypeStore.fetchCraftTypes();
    craftTypeOptions.value = craftTypeStore.craftTypes;
    const newCraft = craftTypeOptions.value.find(c => c.craftTypeName === addDialog.value.value);
    if (newCraft) formData.value.craftTypeId = newCraft.craftTypeId;
  } else if (addDialog.value.type === 'artisan') {
    await artisanStore.createArtisan({ artisanName: addDialog.value.value });
    await artisanStore.fetchArtisans();
    artisanOptions.value = artisanStore.artisans;
    const newArtisan = artisanOptions.value.find(a => a.artisanName === addDialog.value.value);
    if (newArtisan) formData.value.artisanId = newArtisan.artisanId;
  }
  addDialog.value.open = false;
  addDialog.value.value = '';
  addDialog.value.type = '';
}

function getCategoryName(id) {
  const cat = categoryOptions.value.find(c => c.categoryId === id);
  return cat ? cat.categoryName : '';
}
function getCraftTypeName(id) {
  const craft = craftTypeOptions.value.find(c => c.craftTypeId === id);
  return craft ? craft.craftTypeName : '';
}
function getArtisanName(id) {
  const art = artisanOptions.value.find(a => a.artisanId === id);
  return art ? art.artisanName : '';
}
</script>

<style scoped>
.stepper-modern .v-stepper-header {
  background: #fff3e0;
  border-radius: 8px 8px 0 0;
  padding-bottom: 0;
}
.stepper-modern .v-stepper-item--active .v-stepper-item__avatar {
  background: #ff9800 !important;
  color: #fff !important;
  box-shadow: 0 2px 8px #ff980033;
}
.stepper-modern .v-stepper-item__avatar {
  border: 2px solid #ff9800;
}
</style> 