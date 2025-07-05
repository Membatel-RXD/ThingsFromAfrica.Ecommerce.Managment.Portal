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
                          item-title="name"
                          item-value="id"
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
                          item-title="name"
                          item-value="id"
                          label="Wood Type"
                          :rules="[rules.required]"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-tree"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.woodOrigin"
                          label="Wood Origin"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-map-marker"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="productForm.craftTypeId"
                          :items="craftTypes"
                          item-title="name"
                          item-value="id"
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
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="productForm.artisanId"
                          :items="artisans"
                          item-title="name"
                          item-value="id"
                          label="Artisan"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-account"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.artisanName"
                          label="Artisan Name"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-account-box"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="productForm.artisanVillage"
                          label="Artisan Village"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-home-group"
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
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.tribalOrigin"
                          label="Tribal Origin"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-account-group"
                        ></v-text-field>
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
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.mainImageUrl"
                          label="Main Image URL"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-image"
                          hint="Primary product image URL"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.videoUrl"
                          label="Video URL"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-video"
                          hint="Product demonstration video URL"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.galleryImages"
                          label="Gallery Images"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-image-multiple"
                          hint="Comma-separated URLs of additional product images"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.processImages"
                          label="Process Images"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-camera"
                          hint="Comma-separated URLs showing the crafting process"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="productForm.artisanImage"
                          label="Artisan Image URL"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-account-circle"
                          hint="Photo of the artisan who created this piece"
                          persistent-hint
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
                        <v-card class="pa-4" color="orange-lighten-5" variant="outlined">
                          <v-card-title class="text-subtitle-1 font-weight-bold text-orange-darken-4">
                            Product Status
                          </v-card-title>
                          <v-card-text class="pa-0 mt-4">
                            <v-switch
                              v-model="productForm.isVisible"
                              color="orange-darken-2"
                              label="Visible to customers"
                              density="compact"
                            ></v-switch>
                            <v-switch
                              v-model="productForm.isFeatured"
                              color="orange-darken-2"
                              label="Featured product"
                              density="compact"
                            ></v-switch>
                            <v-switch
                              v-model="productForm.isUnique"
                              color="orange-darken-2"
                              label="Unique piece"
                              density="compact"
                            ></v-switch>
                            <v-switch
                              v-model="productForm.isAntique"
                              color="orange-darken-2"
                              label="Antique item"
                              density="compact"
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
                            ></v-switch>
                            <v-switch
                              v-model="productForm.isCertified"
                              color="orange-darken-2"
                              label="Certified product"
                              density="compact"
                            ></v-switch>
                            <v-switch
                              v-model="productForm.requiresPhytosanitaryCertificate"
                              color="orange-darken-2"
                              label="Requires phytosanitary certificate"
                              density="compact"
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
                            ></v-switch>
                            <v-switch
                              v-model="productForm.touristFriendlySize"
                              color="orange-darken-2"
                              label="Tourist-friendly size"
                              density="compact"
                            ></v-switch>
                            <v-switch
                              v-model="productForm.packingFriendly"
                              color="orange-darken-2"
                              label="Packing friendly"
                              density="compact"
                            ></v-switch>
                            <v-switch
                              v-model="productForm.isSouvenir"
                              color="orange-darken-2"
                              label="Souvenir item"
                              density="compact"
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
                            ></v-switch>
                            <v-switch
                              v-model="productForm.giftWrappingAvailable"
                              color="orange-darken-2"
                              label="Gift wrapping available"
                              density="compact"
                            ></v-switch>
                            <v-switch
                              v-model="productForm.personalizationAvailable"
                              color="orange-darken-2"
                              label="Personalization available"
                              density="compact"
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

              <template v-slot:item.9>
                <v-card flat>
                  <v-card-title class="text-h6 font-weight-bold text-orange-darken-4 pa-6">
                    <v-icon icon="mdi-web" class="me-2"></v-icon>
                    SEO & Marketing
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.metaTitle"
                          label="Meta Title"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-format-title"
                          hint="SEO title for search engines"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="productForm.metaKeywords"
                          label="Meta Keywords"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-tag-multiple"
                          hint="Comma-separated keywords for SEO"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="productForm.metaDescription"
                          label="Meta Description"
                          variant="outlined"
                          color="orange-darken-2"
                          rows="3"
                          prepend-inner-icon="mdi-text-box"
                          hint="SEO description for search engines (150-160 characters)"
                          persistent-hint
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="productForm.averageRating"
                          label="Average Rating"
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-star"
                          hint="Average customer rating (0-5)"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="productForm.reviewCount"
                          label="Review Count"
                          type="number"
                          min="0"
                          variant="outlined"
                          color="orange-darken-2"
                          prepend-inner-icon="mdi-comment-text"
                          hint="Total number of reviews"
                          persistent-hint
                        ></v-text-field>
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

  <script>
  export default {
    name: 'CreateWoodCraftProduct',
    data() {
      return {
        currentStep: 1,
        isSubmitting: false,
        stepperItems: [
          { title: 'Basic Information', value: 1 },
          { title: 'Wood & Craft Details', value: 2 },
          { title: 'Artisan Information', value: 3 },
          { title: 'Pricing & Inventory', value: 4 },
          { title: 'Dimensions & Specifications', value: 5 },
          { title: 'Images & Media', value: 6 },
          { title: 'Settings & Options', value: 7 },
          { title: 'Care & Instructions', value: 8 },
          { title: 'SEO & Marketing', value: 9 }
        ],
        productForm: {
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
          productStatus: 'draft',
          isVisible: true,
          isFeatured: false,
          isAuthentic: true,
          isCertified: false,
          mainImageUrl: '',
          galleryImages: '',
          processImages: '',
          artisanImage: '',
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
          createdBy: 1,
          modifiedBy: 1,
          isDeleted: false
        },
        rules: {
          required: value => !!value || 'This field is required',
          positive: value => value > 0 || 'Must be greater than 0',
          nonNegative: value => value >= 0 || 'Must be 0 or greater'
        },
        // Mock data - replace with actual API calls
        categories: [
          { id: 1, name: 'Sculptures' },
          { id: 2, name: 'Furniture' },
          { id: 3, name: 'Decorative Items' },
          { id: 4, name: 'Utensils' },
          { id: 5, name: 'Masks' }
        ],
        woodTypes: [
          { id: 1, name: 'Mahogany' },
          { id: 2, name: 'Teak' },
          { id: 3, name: 'Ebony' },
          { id: 4, name: 'Rosewood' },
          { id: 5, name: 'Baobab' }
        ],
        craftTypes: [
          { id: 1, name: 'Hand Carving' },
          { id: 2, name: 'Turning' },
          { id: 3, name: 'Burning' },
          { id: 4, name: 'Inlay Work' },
          { id: 5, name: 'Assembly' }
        ],
        artisans: [
          { id: 1, name: 'John Banda' },
          { id: 2, name: 'Mary Mwanza' },
          { id: 3, name: 'Peter Chisala' },
          { id: 4, name: 'Grace Tembo' },
          { id: 5, name: 'Joseph Mulenga' }
        ],
        difficultyLevels: [
          'Beginner',
          'Intermediate',
          'Advanced',
          'Expert',
          'Master'
        ],
        handmadeLevels: [
          'Fully Handmade',
          'Mostly Handmade',
          'Partially Handmade',
          'Machine Assisted'
        ],
        hardnessLevels: [
          'Soft',
          'Medium',
          'Hard',
          'Very Hard'
        ],
        conditionOptions: [
          'New',
          'Excellent',
          'Good',
          'Fair',
          'Antique'
        ],
        currencies: [
          'USD',
          'EUR',
          'GBP',
          'MWK'
        ],
        stockStatuses: [
          'In Stock',
          'Low Stock',
          'Out of Stock',
          'Pre-Order'
        ],
        qualityGrades: [
          'Premium',
          'Standard',
          'Economy',
          'Collector'
        ]
      }
    },
    watch: {
      'productForm.productName'(newVal) {
        if (newVal) {
          this.productForm.productSlug = newVal.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      }
    },
    methods: {
      async submitForm() {
        this.isSubmitting = true;
        try {
          // Add timestamps
          const now = new Date().toISOString();
          this.productForm.createdAt = now;
          this.productForm.modifiedAt = now;
          
          // Here you would make your API call
          console.log('Submitting product:', this.productForm);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          this.$emit('product-created', this.productForm);
          this.resetForm();
        } catch (error) {
          console.error('Error creating product:', error);
        } finally {
          this.isSubmitting = false;
        }
      },
      resetForm() {
        this.currentStep = 1;
        // Reset form to initial state
        Object.keys(this.productForm).forEach(key => {
          if (typeof this.productForm[key] === 'string') {
            this.productForm[key] = '';
          } else if (typeof this.productForm[key] === 'number') {
            this.productForm[key] = 0;
          } else if (typeof this.productForm[key] === 'boolean') {
            this.productForm[key] = false;
          }
        });
        // Set defaults
        this.productForm.currency = 'USD';
        this.productForm.productStatus = 'draft';
        this.productForm.isVisible = true;
        this.productForm.isAuthentic = true;
        this.productForm.yearMade = new Date().getFullYear();
        this.productForm.createdBy = 1;
        this.productForm.modifiedBy = 1;
        this.productForm.isDeleted = false;
      }
    }
  }
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