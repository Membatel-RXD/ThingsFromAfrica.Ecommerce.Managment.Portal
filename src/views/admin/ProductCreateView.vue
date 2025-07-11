<template>
    <div>
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between mb-6">
              <div>
                <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-2">
                  Create New Wood Craft Product
                </h1>
                <p class="text-subtitle-1 text-grey-darken-2">
                  Add a new handcrafted wood product to your collection
                </p>
              </div>
              <v-chip
                color="orange-darken-2"
                variant="elevated"
                size="large"
                class="font-weight-bold"
              >
                <v-icon start icon="mdi-plus-circle"></v-icon>
                New Product
              </v-chip>
            </div>
          </v-col>
        </v-row>
  
        <!-- Progress Stepper -->
        <v-row class="mb-6">
          <v-col cols="12">
            <v-stepper
              v-model="currentStep"
              :items="stepperItems"
              hide-actions
              color="orange-darken-2"
              class="elevation-4"
            >
              <template v-slot:item.1>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-information" class="me-2"></v-icon>
                    Basic Information
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.productName"
                          label="Product Name"
                          :rules="[rules.required]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-tag"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.productSlug"
                          label="Product Slug"
                          :rules="[rules.required]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-link"
                          hint="URL-friendly version of the product name"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.sku"
                          label="SKU"
                          :rules="[rules.required]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-barcode"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.itemCode"
                          label="Item Code"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-identifier"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="productForm.categoryId"
                          :items="categories"
                          item-title="categoryName"
                          item-value="categoryId"
                          label="Category"
                          :rules="[rules.required]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-folder"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.productDescription"
                          label="Product Description"
                          :rules="[rules.required]"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="4"
                          prepend-inner-icon="mdi-text"
                          required
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="productForm.shortDescription"
                          label="Short Description"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-text-short"
                          hint="Brief description for product listings"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
  
              <template v-slot:item.2>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-tree" class="me-2"></v-icon>
                    Wood & Craft Details
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="productForm.woodTypeId"
                          :items="woodTypes"
                          item-title="woodName"
                          item-value="woodTypeId"
                          label="Wood Type"
                          :rules="[rules.required]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-tree"
                          required
                        ></v-select>
                      </v-col>
                     
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="productForm.craftTypeId"
                          :items="craftTypes"
                          item-title="craftTypeName"
                          item-value="craftTypeId"
                          label="Craft Type"
                          :rules="[rules.required]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-hammer"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.craftingTechnique"
                          label="Crafting Technique"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-tools"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.craftingTime"
                          label="Crafting Time"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-clock"
                          hint="e.g., 2-3 days"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="productForm.difficultyLevel"
                          :items="difficultyLevels"
                          label="Difficulty Level"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-chart-line"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="productForm.handmadeLevel"
                          :items="handmadeLevels"
                          label="Handmade Level"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-hand"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.woodGrain"
                          label="Wood Grain"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-grain"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.woodColor"
                          label="Wood Color"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-palette"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="productForm.woodHardness"
                          :items="hardnessLevels"
                          label="Wood Hardness"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-diamond"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.woodFinish"
                          label="Wood Finish"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-spray"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="productForm.condition"
                          :items="conditionOptions"
                          label="Condition"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-star"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
  
              <template v-slot:item.3>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-account-tie" class="me-2"></v-icon>
                    Artisan Information
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="productForm.artisanId"
                          :items="artisans"
                          item-title="artisanName"
                          item-value="artisanId"
                          label="Artisan"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-account"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.traditionalUse"
                          label="Traditional Use"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-history"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.artisanStory"
                          label="Artisan Story"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-book-open"
                          hint="Tell the story of the artisan who created this piece"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                      
                  
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.culturalSignificance"
                          label="Cultural Significance"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-account-star"
                          hint="Explain the cultural importance of this craft"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.culturalStory"
                          label="Cultural Story"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-book-account"
                          hint="Share the cultural story behind this piece"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
  
              <template v-slot:item.4>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-currency-usd" class="me-2"></v-icon>
                    Pricing & Inventory
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="productForm.basePrice"
                          label="Base Price"
                          type="number"
                          :rules="[rules.required, rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-currency-usd"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="productForm.touristPrice"
                          label="Tourist Price"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-airplane"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="productForm.localPrice"
                          label="Local Price"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-home"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="productForm.costPrice"
                          label="Cost Price"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-calculator"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="productForm.usdPrice"
                          label="USD Price"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-currency-usd"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="productForm.currency"
                          :items="currencies"
                          label="Currency"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-currency-sign"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="productForm.stockQuantity"
                          label="Stock Quantity"
                          type="number"
                          :rules="[rules.required, rules.nonNegative]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-package"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="productForm.lowStockThreshold"
                          label="Low Stock Threshold"
                          type="number"
                          :rules="[rules.nonNegative]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-alert"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="productForm.stockStatus"
                          :items="stockStatuses"
                          label="Stock Status"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-clipboard-list"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="productForm.qualityGrade"
                          :items="qualityGrades"
                          label="Quality Grade"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-medal"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="productForm.yearMade"
                          label="Year Made"
                          type="number"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-calendar"
                          :min="1900"
                          :max="new Date().getFullYear()"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
  
              <template v-slot:item.5>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-ruler" class="me-2"></v-icon>
                    Dimensions & Specifications
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.number="productForm.length"
                          label="Length (cm)"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-ruler"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.number="productForm.width"
                          label="Width (cm)"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-ruler"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.number="productForm.height"
                          label="Height (cm)"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-ruler"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.number="productForm.weight"
                          label="Weight (kg)"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-weight"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="productForm.shippingWeight"
                          label="Shipping Weight (kg)"
                          type="number"
                          :rules="[rules.positive]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-package-variant"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.packagingRequired"
                          label="Packaging Required"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-package"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.customsCode"
                          label="Customs Code"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-card-text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.shippingRestrictions"
                          label="Shipping Restrictions"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="2"
                          prepend-inner-icon="mdi-alert-circle"
                          hint="Any shipping limitations or restrictions"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
  
              <template v-slot:item.6>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-image" class="me-2"></v-icon>
                    Images & Media
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <!-- Main Image Upload -->
                      <v-col cols="12" md="6">
                        <v-card class="pa-4" color="orange-lighten-5" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4 pb-4">
                            Main Product Image
                          </v-card-title>
                          <v-file-input
                            v-model="productForm.mainImageFile"
                            label="Upload Main Image"
                            variant="outlined"
                            color="orange-darken-2"
                            prepend-inner-icon="mdi-camera"
                            accept="image/*"
                            :rules="[rules.imageSize, rules.imageType]"
                            @change="handleMainImageChange"
                            show-size
                            class="text-black"
                            style="color: black !important;"
                          ></v-file-input>
                          
                          <!-- Main Image Preview -->
                          <v-img
                            v-if="mainImagePreview"
                            :src="mainImagePreview"
                            max-height="200"
                            class="mt-4 rounded"
                            contain
                          >
                            <template v-slot:placeholder>
                              <div class="d-flex align-center justify-center fill-height">
                                <v-progress-circular indeterminate></v-progress-circular>
                              </div>
                            </template>
                          </v-img>
                        </v-card>
                      </v-col>

                      <!-- Gallery Images Upload -->
                      <v-col cols="12" md="6">
                        <v-card class="pa-4" color="orange-lighten-5" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4 pb-4">
                            Gallery Images
                          </v-card-title>
                          <v-file-input
                            v-model="productForm.galleryImageFiles"
                            label="Upload Gallery Images"
                            variant="outlined"
                            color="orange-darken-2"
                            prepend-inner-icon="mdi-image-multiple"
                            accept="image/*"
                            multiple
                            :rules="[rules.imageSize, rules.imageType]"
                            @change="handleGalleryImagesChange"
                            show-size
                            class="text-black"
                            style="color: black !important;"
                          ></v-file-input>
                          
                          <!-- Gallery Images Preview -->
                          <div v-if="galleryImagePreviews.length > 0" class="mt-4">
                            <v-row>
                              <v-col 
                                v-for="(preview, index) in galleryImagePreviews" 
                                :key="index"
                                cols="6"
                                sm="4"
                              >
                                <v-card class="position-relative">
                                  <v-img
                                    :src="preview"
                                    height="100"
                                    cover
                                    class="rounded"
                                  ></v-img>
                                  <v-btn
                                    @click="removeGalleryImage(index)"
                                    icon="mdi-close"
                                    size="small"
                                    color="red"
                                    class="position-absolute"
                                    style="top: 4px; right: 4px;"
                                    variant="elevated"
                                  ></v-btn>
                                </v-card>
                              </v-col>
                            </v-row>
                          </div>
                        </v-card>
                      </v-col>

                      <!-- Process Images Upload -->
                      <v-col cols="12" md="6">
                        <v-card class="pa-4" color="orange-lighten-5" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4 pb-4">
                            Process Images
                          </v-card-title>
                          <v-file-input
                            v-model="productForm.processImageFiles"
                            label="Upload Process Images"
                            variant="outlined"
                            color="orange-darken-2"
                            prepend-inner-icon="mdi-camera"
                            accept="image/*"
                            multiple
                            :rules="[rules.imageSize, rules.imageType]"
                            @change="handleProcessImagesChange"
                            show-size
                            class="text-black"
                            style="color: black !important;"
                          ></v-file-input>
                          
                          <!-- Process Images Preview -->
                          <div v-if="processImagePreviews.length > 0" class="mt-4">
                            <v-row>
                              <v-col 
                                v-for="(preview, index) in processImagePreviews" 
                                :key="index"
                                cols="6"
                                sm="4"
                              >
                                <v-card class="position-relative">
                                  <v-img
                                    :src="preview"
                                    height="100"
                                    cover
                                    class="rounded"
                                  ></v-img>
                                  <v-btn
                                    @click="removeProcessImage(index)"
                                    icon="mdi-close"
                                    size="small"
                                    color="red"
                                    class="position-absolute"
                                    style="top: 4px; right: 4px;"
                                    variant="elevated"
                                  ></v-btn>
                                </v-card>
                              </v-col>
                            </v-row>
                          </div>
                        </v-card>
                      </v-col>

                      <!-- Artisan Image Upload -->
                      <v-col cols="12" md="6">
                        <v-card class="pa-4" color="orange-lighten-5" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4 pb-4">
                            Artisan Image
                          </v-card-title>
                          <v-file-input
                            v-model="productForm.artisanImageFile"
                            label="Upload Artisan Image"
                            variant="outlined"
                            color="orange-darken-2"
                            prepend-inner-icon="mdi-account-circle"
                            accept="image/*"
                            :rules="[rules.imageSize, rules.imageType]"
                            @change="handleArtisanImageChange"
                            show-size
                            class="text-black"
                            style="color: black !important;"
                          ></v-file-input>
                          
                          <!-- Artisan Image Preview -->
                          <v-img
                            v-if="artisanImagePreview"
                            :src="artisanImagePreview"
                            max-height="200"
                            class="mt-4 rounded"
                            contain
                          >
                            <template v-slot:placeholder>
                              <div class="d-flex align-center justify-center fill-height">
                                <v-progress-circular indeterminate></v-progress-circular>
                              </div>
                            </template>
                          </v-img>
                        </v-card>
                      </v-col>

                      <!-- Video URL -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="productForm.videoUrl"
                          label="Video URL"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-video"
                          hint="Product demonstration video URL"
                          persistent-hint
                          class="text-black"
                          style="color: black !important;"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
  
              <template v-slot:item.7>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-cog" class="me-2"></v-icon>
                    Settings & Options
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card class="pa-4" color="orange-lighten-4" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4">
                            Product Status
                          </v-card-title>
                          <v-card-text class="pa-0 mt-4">
                            <v-switch
                              v-model="productForm.isVisible"
                              color="orange-darken-2"
                              label="Visible to customers"
                              density="compact"
                              class="text-orange-darken-3"
                            ></v-switch>
                            <v-switch
                              v-model="productForm.isFeatured"
                              color="orange-darken-2"
                              label="Featured product"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.isUnique"
                              color="orange-darken-2"
                              label="Unique piece"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.isAntique"
                              color="orange-darken-2"
                              label="Antique item"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card class="pa-4" color="orange-lighten-5" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4">
                            Authenticity & Quality
                          </v-card-title>
                          <v-card-text class="pa-0 mt-4">
                            <v-switch
                              v-model="productForm.isAuthentic"
                              color="orange-darken-2"
                              label="Authentic craft"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.isCertified"
                              color="orange-darken-2"
                              label="Certified product"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.requiresPhytosanitaryCertificate"
                              color="orange-darken-2"
                              label="Requires phytosanitary certificate"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card class="pa-4" color="orange-lighten-5" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4">
                            Tourist & Souvenir
                          </v-card-title>
                          <v-card-text class="pa-0 mt-4">
                          <v-switch
                              v-model="productForm.isPopularWithTourists"
                              color="orange-darken-2"
                              label="Popular with tourists"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.touristFriendlySize"
                              color="orange-darken-2"
                              label="Tourist-friendly size"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.packingFriendly"
                              color="orange-darken-2"
                              label="Packing friendly"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.isSouvenir"
                              color="orange-darken-2"
                              label="Souvenir item"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card class="pa-4" color="orange-lighten-5" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4">
                            Shipping & Handling
                          </v-card-title>
                          <v-card-text class="pa-0 mt-4">
                            <v-switch
                              v-model="productForm.shippingFragile"
                              color="orange-darken-2"
                              label="Fragile item"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.giftWrappingAvailable"
                              color="orange-darken-2"
                              label="Gift wrapping available"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                            <v-switch
                              v-model="productForm.personalizationAvailable"
                              color="orange-darken-2"
                              label="Personalization available"
                              density="compact"
                              class="text-orange-darken-3"

                            ></v-switch>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.souvenirType"
                          label="Souvenir Type"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-gift"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.ageCategory"
                          label="Age Category"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-calendar-range"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.customAttributes"
                          label="Custom Attributes"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-code-json"
                          hint="JSON format for additional custom attributes"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>

              <template v-slot:item.8>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-information-outline" class="me-2"></v-icon>
                    Care & Instructions
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.careInstructions"
                          label="Care Instructions"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-heart"
                          hint="Instructions for caring for this wood craft"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.cleaningInstructions"
                          label="Cleaning Instructions"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-spray-bottle"
                          hint="How to properly clean this product"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.storageInstructions"
                          label="Storage Instructions"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-package-variant-closed"
                          hint="Best practices for storing this item"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
            </v-stepper>
          </v-col>
        </v-row>

        <!-- Navigation Buttons -->
        <v-row class="mt-6">
          <v-col cols="12" class="d-flex justify-space-between">
            <v-btn
              v-if="currentStep > 1"
              @click="currentStep--"
              color="orange-darken-2"
              variant="outlined"
              size="large"
              prepend-icon="mdi-arrow-left"
            >
              Previous
            </v-btn>
            <v-spacer v-if="currentStep === 1"></v-spacer>
            
            <v-btn
              v-if="currentStep < stepperItems.length"
              @click="currentStep++"
              color="orange-darken-2"
              variant="elevated"
              size="large"
              append-icon="mdi-arrow-right"
            >
              Next
            </v-btn>
            
            <v-btn
              v-if="currentStep === stepperItems.length"
              @click="submitForm"
              color="green-darken-2"
              variant="elevated"
              size="large"
              prepend-icon="mdi-check"
              :loading="isSubmitting"
            >
              Create Product
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useProductCategoryStore } from '@/stores/productCategory'
import { useWoodTypeStore } from '@/stores/woodStore';
import { useCraftTypeStore } from '@/stores/craftStore';
import { useSnackbarStore } from '@/stores/snackbar';
import { useArtisanStore } from '@/stores/artisan';
import { useUserStore } from '@/stores/user';
import { useProductStore } from '@/stores/product';
import { ProductCreationRequestWithImages } from '@/stores/types/member';

const productCategory = useProductCategoryStore();
const craftType = useCraftTypeStore();
const woodType = useWoodTypeStore();
const snackbar = useSnackbarStore();
const artisanStore = useArtisanStore();
const userStore = useUserStore();
const productStore = useProductStore();
// Reactive State
const currentStep = ref(1)
const isSubmitting = ref(false)

const stepperItems = [
  { title: 'Basic Information', value: 1 },
  { title: 'Wood & Craft Details', value: 2 },
  { title: 'Artisan Information', value: 3 },
  { title: 'Pricing & Inventory', value: 4 },
  { title: 'Dimensions & Specifications', value: 5 },
  { title: 'Images & Media', value: 6 },
  { title: 'Settings & Options', value: 7 },
  { title: 'Care & Instructions', value: 8 }
]

// Validation rules
const rules = {
  required: (value: any) => !!value || 'This field is required',
  positive: (value: number) => value > 0 || 'Must be greater than 0',
  nonNegative: (value: number) => value >= 0 || 'Must be 0 or greater',
  imageSize: (value: File[]) => {
    if (!value || value.length === 0) return true
    const maxSize = 5 * 1024 * 1024 // 5MB
    return value.every(file => file.size <= maxSize) || 'File size must be less than 5MB'
  },
  imageType: (value: File[]) => {
    if (!value || value.length === 0) return true
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    return value.every(file => allowedTypes.includes(file.type)) || 'Only image files are allowed'
  }
}


const categories  =  computed(()=>productCategory.categories);

const woodTypes = computed(()=>woodType.woodTypes);

const craftTypes = computed(()=>craftType.craftTypes);

const artisans = computed(()=>artisanStore.artisans);
  const  difficultyLevels = ref([
          'Beginner',
          'Intermediate',
          'Advanced',
          'Expert',
          'Master'
        ]);
        const  handmadeLevels =ref( [
          'Fully Handmade',
          'Mostly Handmade',
          'Partially Handmade',
          'Machine Assisted'
        ]);
        const hardnessLevels=[
          'Soft',
          'Medium',
          'Hard',
          'Very Hard'
        ];
        const conditionOptions= [
          'New',
          'Excellent',
          'Good',
          'Fair',
          'Antique'
        ];
       const  currencies=[
          'USD',
          'EUR',
          'GBP',
          'MWK'
        ];
        const stockStatuses=[
          'In Stock',
          'Low Stock',
          'Out of Stock',
          'Pre-Order'
        ];
       const  qualityGrades=[
          'Premium',
          'Standard',
          'Economy',
          'Collector'
        ];

        // Modified productForm reactive object to include image files
const productForm = reactive<ProductCreationRequestWithImages>({
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  basePrice: 0,
  productName: '',
  productSlug: '',
  sku: '',
  itemCode: '',
  categoryId: null,
  craftTypeId: null,
  woodTypeId: null,
  productDescription: '',
  shortDescription: '',
  touristPrice: 0,
  localPrice: 0,
  costPrice: 0,
  currency: 'USD',
  usdPrice: 0,
  woodType: '',
  woodOrigin: '',
  craftingTechnique: '',
  craftingTime: '',
  difficultyLevel: '',
  artisanId: null,
  artisanName: '',
  artisanVillage: '',
  artisanStory: '',
  culturalSignificance: '',
  tribalOrigin: '',
  culturalStory: '',
  traditionalUse: '',
  woodGrain: '',
  woodColor: '',
  woodHardness: '',
  woodFinish: '',
  condition: '',
  qualityGrade: '',
  handmadeLevel: '',
  stockQuantity: 0,
  isUnique: false,
  lowStockThreshold: 0,
  stockStatus: '',
  productStatus: 'Active',
  isVisible: true,
  isFeatured: false,
  isAuthentic: true,
  isCertified: false,
  videoUrl: '',
  isPopularWithTourists: false,
  touristFriendlySize: false,
  packingFriendly: false,
  shippingFragile: false,
  isSouvenir: false,
  souvenirType: '',
  giftWrappingAvailable: false,
  personalizationAvailable: false,
  careInstructions: '',
  cleaningInstructions: '',
  storageInstructions: '',
  shippingWeight: 0,
  packagingRequired: '',
  shippingRestrictions: '',
  customsCode: '',
  requiresPhytosanitaryCertificate: false,
  averageRating: 0,
  reviewCount: 0,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  yearMade: new Date().getFullYear(),
  isAntique: false,
  ageCategory: '',
  customAttributes: '',
  createdBy: userStore.user?.userId!,
  isDeleted: false,
  
  // Image files
  mainImageFile: null,
  galleryImageFiles: [],
  processImageFiles: [],
  artisanImageFile: null
});

// Watchers
watch(() => productForm.productName, (newVal) => {
  if (newVal) {
    productForm.productSlug = newVal.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})


// Add reactive refs for image previews
const mainImagePreview = ref('');
const galleryImagePreviews = ref([]);
const processImagePreviews = ref([]);
const artisanImagePreview = ref('');

// Image preview handlers (without upload logic)
const handleMainImageChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    productForm.mainImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      mainImagePreview.value = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleGalleryImagesChange = (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length > 0) {
    productForm.galleryImageFiles = files;
    galleryImagePreviews.value = [];
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        galleryImagePreviews.value.push(e.target?.result);
      };
      reader.readAsDataURL(file);
    });
  }
};

const handleProcessImagesChange = (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length > 0) {
    productForm.processImageFiles = files;
    processImagePreviews.value = [];
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        processImagePreviews.value.push(e.target?.result);
      };
      reader.readAsDataURL(file);
    });
  }
};

const handleArtisanImageChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    productForm.artisanImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      artisanImagePreview.value = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
};

// Remove image functions
const removeGalleryImage = (index) => {
  galleryImagePreviews.value.splice(index, 1);
  const dt = new DataTransfer();
  const files = Array.from(productForm.galleryImageFiles);
  files.splice(index, 1);
  files.forEach(file => dt.items.add(file));
  productForm.galleryImageFiles = dt.files;
};

const removeProcessImage = (index) => {
  processImagePreviews.value.splice(index, 1);
  const dt = new DataTransfer();
  const files = Array.from(productForm.processImageFiles);
  files.splice(index, 1);
  files.forEach(file => dt.items.add(file));
  productForm.processImageFiles = dt.files;
};

// Modified submitForm function
const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const now = new Date().toISOString();
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(productForm).forEach(key => {
      if (key !== 'mainImageFile' && key !== 'galleryImageFiles' && 
          key !== 'processImageFiles' && key !== 'artisanImageFile') {
        const value = productForm[key as keyof typeof productForm];
        formData.append(key, value as string | Blob);
      }
    });
    
    // Add image files
    if (productForm.mainImageFile) {
      formData.append('mainImageFile', productForm.mainImageFile);
    }
    
    if (productForm.galleryImageFiles.length > 0) {
      (productForm.galleryImageFiles as File[]).forEach((file, index) => {
        formData.append(`galleryImageFiles[${index}]`, file);
      });
    }
    if (productForm.processImageFiles.length > 0) {
      (productForm.processImageFiles as File[]).forEach((file, index) => {
        formData.append(`processImageFiles[${index}]`, file);
      });
    }
    if (productForm.artisanImageFile) {
      formData.append('artisanImageFile', productForm.artisanImageFile);
    }
    const response = await productStore.createProductWithImages(formData);
    if(response && response.isSuccessful){
      snackbar.success("Successfully created a product");
    }
    resetForm();
  } catch (error) {
    console.error('Error creating product:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form function
const resetForm = () => {
  Object.keys(productForm).forEach(key => {
    const typedKey = key as keyof typeof productForm;
    if (key === 'mainImageFile' || key === 'artisanImageFile') {
      (productForm as any)[key] = null;
    } else if (key === 'galleryImageFiles' || key === 'processImageFiles') {
      (productForm as any)[key] = [];
    } else if (typeof productForm[typedKey] === 'string') {
      (productForm as any)[key] = '';
    } else if (typeof productForm[typedKey] === 'number') {
      (productForm as any)[key] = 0;
    } else if (typeof productForm[typedKey] === 'boolean') {
      (productForm as any)[key] = false;
    }
  });
  
  // Reset previews
  mainImagePreview.value = '';
  galleryImagePreviews.value = [];
  processImagePreviews.value = [];
  artisanImagePreview.value = '';
};

  onMounted(async () => {
    try {
    Promise.all( [
      await productCategory.fetchCategories(),
      await craftType.fetchCraftTypes(),
      await woodType.fetchWoodTypes(),
      await artisanStore.fetchArtisans(),

    ]
    )
    } catch (error) {
      console.error('Error fetching payments:', error)
      snackbar.error('Error loading product categories')
    }
  })

</script>


  <style scoped>

  .v-stepper {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .v-card {
    transition: all 0.3s ease;
  }
  
  .v-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  }
  
  .v-text-field, .v-textarea, .v-select {
    margin-bottom: 8px;
  }
  
  .v-switch {
    margin-bottom: 4px;
  }
  </style>