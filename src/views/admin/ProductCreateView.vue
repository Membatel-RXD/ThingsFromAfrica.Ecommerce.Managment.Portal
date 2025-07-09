<template>
  <v-container>
    <v-form v-model="isFormValid" @submit.prevent="handleSubmit">
      <v-row>
        <!-- Basic Info -->
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
        <!-- Pricing -->
        <v-col cols="12" md="4">
          <v-text-field v-model.number="formData.basePrice" label="Base Price" type="number" :rules="[rules.required]" required />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model.number="formData.touristPrice" label="Tourist Price" type="number" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model.number="formData.localPrice" label="Local Price" type="number" />
        </v-col>
        <!-- Stock -->
        <v-col cols="12" md="4">
          <v-text-field v-model.number="formData.stockQuantity" label="Stock Quantity" type="number" />
        </v-col>
        <v-col cols="12" md="4">
          <v-switch v-model="formData.isUnique" label="Is Unique?" />
        </v-col>
        <v-col cols="12" md="4">
          <v-switch v-model="formData.isVisible" label="Is Visible?" />
        </v-col>
        <!-- Description -->
        <v-col cols="12">
          <v-textarea v-model="formData.productDescription" label="Product Description" rows="3" />
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="formData.shortDescription" label="Short Description" rows="2" />
        </v-col>
        <!-- Main Image -->
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.mainImageUrl" label="Main Image URL" />
        </v-col>
        <!-- Gallery Images -->
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.galleryImages" label="Gallery Images (comma-separated URLs)" />
        </v-col>
        <!-- Submit -->
        <v-col cols="12">
          <v-btn color="primary" type="submit" :loading="isSubmitting" :disabled="!isFormValid">Create Product</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArtisanStore } from '@/stores/artisan';
import { useWoodTypeStore } from '@/stores/woodStore';
import { useProductCategoryStore } from '@/stores/productCategory';
import { useCraftTypeStore } from '@/stores/craftStore';

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
});

const isFormValid = ref(false);
const isSubmitting = ref(false);

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

async function handleSubmit() {
  if (!isFormValid.value) return;
  isSubmitting.value = true;
  try {
    // TODO: Call your product store or API to create the product
    // await productStore.createProduct(formData.value);
    alert('Product created! (implement API call)');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.v-container {
  max-width: 1000px;
}
</style>