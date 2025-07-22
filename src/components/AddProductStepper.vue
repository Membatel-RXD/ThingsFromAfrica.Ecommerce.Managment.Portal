<template>
  <v-dialog v-model="internalOpen" max-width="700px" persistent>
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
            <!-- SEO & Year -->
            <v-col cols="12" md="6">
              <v-text-field v-model="form.metaTitle" label="Meta Title" prepend-inner-icon="mdi-tag-text-outline" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.metaDescription" label="Meta Description" prepend-inner-icon="mdi-text" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.metaKeywords" label="Meta Keywords" prepend-inner-icon="mdi-tag" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="form.yearMade" label="Year Made" type="number" prepend-inner-icon="mdi-calendar" />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch v-model="form.isAntique" label="Antique" color="brown" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="form.ageCategory" :items="ageCategoryOptions" label="Age Category" prepend-inner-icon="mdi-timeline" />
            </v-col>
          </v-row>
          <div class="d-flex justify-space-between mt-6">
            <v-btn variant="tonal" color="orange-darken-2" size="large" class="px-8 py-3" @click="prevStep" :disabled="step === 1">
              <v-icon left>mdi-arrow-left</v-icon> Back
            </v-btn>
            <v-btn v-if="step < 8" color="orange-darken-2" size="large" class="px-8 py-3" @click="nextStep">
              Next <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn v-else color="success" size="large" class="px-8 py-3" type="submit">
              <v-icon left>mdi-check-circle-outline</v-icon> Submit
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useProductStore } from '@/stores/product';
import { useSnackbarStore } from '@/stores/snackbar';

export default {
  name: 'AddProductStepper',
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      internalOpen: false,
      step: 1,
      form: {
        productName: '',
        productSlug: '',
        sku: '',
        itemCode: '',
        categoryId: null,
        craftTypeId: null,
        woodTypeId: null,
        artisanId: null,
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
      },
      categoryOptions: [
        { categoryId: 1, categoryName: 'Woodwork' },
        { categoryId: 2, categoryName: 'Textiles' },
      ],
      craftTypeOptions: [
        { craftTypeId: 1, craftTypeName: 'Carving' },
        { craftTypeId: 2, craftTypeName: 'Weaving' },
      ],
      woodTypeOptions: [
        { woodTypeId: 1, woodName: 'Mahogany' },
        { woodTypeId: 2, woodName: 'Teak' }
      ],
      artisanOptions: [
        { artisanId: 1, artisanName: 'John Doe', village: 'Village A' },
        { artisanId: 2, artisanName: 'Jane Smith', village: 'Village B' },
      ],
    }
  },
  watch: {
    open: {
      immediate: true,
      handler(val) {
        this.internalOpen = val;
        if (!val) this.step = 1;
      }
    },
    internalOpen(val) {
      if (!val) {
        this.$emit('close');
      }
    },
    'form.productName'(val) {
      // Auto-generate slug
      if (!this.form.productSlug || this.form.productSlug === this.slugify(this.form.productName)) {
        this.form.productSlug = this.slugify(val);
      }
    }
  },
  methods: {
    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
    },
    getCategoryName(id) {
      const cat = this.categoryOptions.find(c => c.categoryId === id);
      return cat ? cat.categoryName : '';
    },
    getCraftTypeName(id) {
      const craft = this.craftTypeOptions.find(c => c.craftTypeId === id);
      return craft ? craft.craftTypeName : '';
    },
    getArtisanName(id) {
      const art = this.artisanOptions.find(a => a.artisanId === id);
      return art ? art.artisanName : '';
    },
    async submit() {
      const productStore = useProductStore();
      const snackbar = useSnackbarStore();
      try {
        // Build FormData
        const formData = new FormData();
        for (const key in this.form) {
          if (this.form[key] !== undefined && this.form[key] !== null) {
            formData.append(key, this.form[key]);
          }
        }
        await productStore.addProduct(formData);
        snackbar.success('Product added successfully');
        this.$emit('close');
      } catch (error) {
        snackbar.error('Failed to add product');
      }
    },
  }
}
</script>

<style scoped>
.step-header {
  background: #fff3e0;
  display: flex;
  align-items: center;
  padding: 18px 24px 12px 24px;
  border-radius: 0 0 12px 12px;
  margin-bottom: 18px;
  gap: 12px;
}
.step-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #b45309;
  margin-left: 8px;
}
.review-card {
  background: #fff8e1;
  border-radius: 12px;
}
@media (max-width: 600px) {
  .step-header {
    padding: 12px 8px 8px 8px;
    font-size: 1rem;
  }
  .step-title {
    font-size: 1rem;
  }
}
</style> 