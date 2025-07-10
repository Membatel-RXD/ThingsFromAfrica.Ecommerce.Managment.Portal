<template>
  <v-card>
    <v-card-title class="text-h5 font-weight-bold text-orange-darken-4">
      {{ isEdit ? 'Edit Product' : 'Add New Product' }}
    </v-card-title>
    <v-card-text>
      <v-stepper v-model="step">
        <!-- Step 1: Basic Info -->
        <v-stepper-header>
          <v-stepper-item :complete="step > 1" step="1" title="Basic Info" />
          <v-divider></v-divider>
          <v-stepper-item :complete="step > 2" step="2" title="Pricing & Stock" />
          <v-divider></v-divider>
          <v-stepper-item :complete="step > 3" step="3" title="Images & SEO" />
          <v-divider></v-divider>
          <v-stepper-item step="4" title="Review & Submit" />
        </v-stepper-header>
        <v-stepper-window>
          <!-- Step 1: Basic Info -->
          <v-stepper-window-item :value="1">
            <v-form ref="form1" v-model="valid[0]">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.productName" label="Product Name" :rules="[rules.required]" required />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.productSlug" label="Product Slug" :rules="[rules.required]" required />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.sku" label="SKU" :rules="[rules.required]" required />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.itemCode" label="Item Code" />
                </v-col>
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
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="formData.artisanId"
                    :items="artisanOptions"
                    item-title="artisanName"
                    item-value="artisanId"
                    label="Artisan"
                    :loading="artisanLoading"
                    clearable
                    @update:modelValue="onArtisanSelected"
                  >
                    <template #item="{ item }">
                      <div>
                        <strong>{{ item.artisanName }}</strong>
                        <span class="text-grey ms-2">{{ item.village }}</span>
                      </div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="formData.productDescription" label="Product Description" rows="3" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="formData.shortDescription" label="Short Description" rows="2" />
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-window-item>
          <!-- Step 2: Pricing & Stock -->
          <v-stepper-window-item :value="2">
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
          </v-stepper-window-item>
          <!-- Step 3: Images & SEO -->
          <v-stepper-window-item :value="3">
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
          </v-stepper-window-item>
          <!-- Step 4: Review & Submit -->
          <v-stepper-window-item :value="4">
            <v-row>
              <v-col cols="12">
                <h3>Review Product Details</h3>
                <pre>{{ formData }}</pre>
              </v-col>
            </v-row>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="step > 1" @click="prevStep" variant="text">Back</v-btn>
      <v-btn v-if="step < 4" @click="nextStep" color="primary">Next</v-btn>
      <v-btn v-if="step === 4" color="primary" :loading="isSubmitting" @click="handleSubmit">Submit</v-btn>
      <v-btn variant="text" @click="$emit('cancel')">Cancel</v-btn>
    </v-card-actions>
  </v-card>
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
</script> 