<template>
    <div class="reviews-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-blue-darken-3">Product Reviews Management</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage customer reviews and feedback
            </p>
          </div>
          <v-btn
            color="blue-darken-2"
            variant="elevated"
            prepend-icon="mdi-star-plus"
            @click="exportReviews"
          >
            Export Reviews
          </v-btn>
        </div>
  
        <!-- Error Alert -->
        <v-alert v-if="error" type="error" dismissible class="mb-6">
          {{ error }}
        </v-alert>
  
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="blue-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="blue-darken-3" size="40" class="me-3">mdi-star-outline</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ totalReviews }}</h3>
                  <p class="text-body-2 text-blue-darken-1">Total Reviews</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="green-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ approvedReviews }}</h3>
                  <p class="text-body-2 text-green-darken-1">Approved Reviews</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="orange-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="orange-darken-3" size="40" class="me-3">mdi-clock-outline</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ pendingReviews }}</h3>
                  <p class="text-body-2 text-orange-darken-1">Pending Reviews</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="purple-lighten-4" class="pa-4">
              <div class="d-flex align-center">
                <v-icon color="purple-darken-3" size="40" class="me-3">mdi-star</v-icon>
                <div>
                  <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ averageRating }}</h3>
                  <p class="text-body-2 text-purple-darken-1">Average Rating</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Filters and Search -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="search"
                  label="Search reviews..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="approvalFilter"
                  label="Approval Status"
                  :items="approvalOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="visibilityFilter"
                  label="Visibility"
                  :items="visibilityOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="ratingFilter"
                  label="Rating"
                  :items="ratingOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="countryFilter"
                  label="Country"
                  :items="countryOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="1">
                <v-btn
                  color="blue-darken-2"
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
  
        <!-- Reviews Data Table -->
        <v-card>
          <v-card-title class="pa-6 bg-blue-lighten-5">
            <v-icon class="me-2" color="blue-darken-3">mdi-star-outline</v-icon>
            Product Reviews Management
          </v-card-title>
          
          <v-progress-linear v-if="loading" indeterminate color="primary" />
          
          <v-data-table
            :headers="headers"
            :items="filteredReviews"
            :loading="loading"
            :search="search"
            class="elevation-1"
            :sort-by="[{ key: 'createdAt', order: 'desc' }]"
            item-key="reviewId"
          >
            <template v-slot:item.rating="{ item }">
              <div class="d-flex align-center">
                <v-rating
                  :model-value="item.rating"
                  readonly
                  size="small"
                  color="amber"
                  half-increments
                />
                <span class="ms-2 text-body-2">{{ item.rating }}</span>
              </div>
            </template>
  
            <template v-slot:item.reviewTitle="{ item }">
              <div>
                <div class="font-weight-bold">{{ item.reviewTitle }}</div>
                <div class="text-caption text-grey-darken-1">
                  {{ item.reviewText ? item.reviewText.substring(0, 50) + '...' : 'No review text' }}
                </div>
              </div>
            </template>
  
            <template v-slot:item.productId="{ item }">
              <v-chip
                size="small"
                variant="outlined"
                color="blue"
              >
                #{{ item.productId }}
              </v-chip>
            </template>
  
            <template v-slot:item.customerId="{ item }">
              <v-chip
                size="small"
                variant="outlined"
                color="green"
              >
                #{{ item.customerId }}
              </v-chip>
            </template>
  
            <template v-slot:item.reviewerCountry="{ item }">
              <v-chip
                size="small"
                variant="flat"
                color="grey"
              >
                {{ item.reviewerCountry }}
              </v-chip>
            </template>
  
            <template v-slot:item.isApproved="{ item }">
              <v-chip
                :color="item.isApproved ? 'green' : 'orange'"
                size="small"
                variant="flat"
              >
                {{ item.isApproved ? 'Approved' : 'Pending' }}
              </v-chip>
            </template>
  
            <template v-slot:item.isVisible="{ item }">
              <v-chip
                :color="item.isVisible ? 'blue' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ item.isVisible ? 'Visible' : 'Hidden' }}
              </v-chip>
            </template>
  
            <template v-slot:item.createdAt="{ item }">
              <span class="text-body-2">
                {{ formatDate(item.createdAt) }}
              </span>
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-eye"
                variant="text"
                size="small"
                color="blue"
                @click="viewReview(item.reviewId)"
              />
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editReview(item.reviewId)"
              />
              <v-btn
                :icon="item.isApproved ? 'mdi-check-circle' : 'mdi-clock-outline'"
                variant="text"
                size="small"
                :color="item.isApproved ? 'green' : 'orange'"
                @click="toggleApprove(item)"
              />
              <v-btn
                :icon="item.isVisible ? 'mdi-eye' : 'mdi-eye-off'"
                variant="text"
                size="small"
                :color="item.isVisible ? 'blue' : 'grey'"
                @click="toggleVisible(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deleteReview(item.reviewId)"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useReviewStore } from '@/stores/review';
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const reviewStore = useReviewStore();
  const router = useRouter();
  
  // Data
  const search = ref('');
  const approvalFilter = ref('all');
  const visibilityFilter = ref('all');
  const ratingFilter = ref('all');
  const countryFilter = ref('all');
  
  // Options
  const approvalOptions = [
    { title: 'All', value: 'all' },
    { title: 'Approved', value: 'approved' },
    { title: 'Pending', value: 'pending' }
  ];
  
  const visibilityOptions = [
    { title: 'All', value: 'all' },
    { title: 'Visible', value: 'visible' },
    { title: 'Hidden', value: 'hidden' }
  ];
  
  const ratingOptions = [
    { title: 'All Ratings', value: 'all' },
    { title: '5 Stars', value: '5' },
    { title: '4 Stars', value: '4' },
    { title: '3 Stars', value: '3' },
    { title: '2 Stars', value: '2' },
    { title: '1 Star', value: '1' }
  ];
  
  const countryOptions = computed(() => [
    { title: 'All Countries', value: 'all' },
    ...Array.from(new Set(reviews.map((r: { reviewerCountry: any; }) => r.reviewerCountry)))
      .map(country => ({ title: country, value: country }))
  ]);
  
  // Table headers
  const headers = [
    { title: 'Rating', key: 'rating' },
    { title: 'Review', key: 'reviewTitle' },
    { title: 'Product ID', key: 'productId' },
    { title: 'Customer ID', key: 'customerId' },
    { title: 'Country', key: 'reviewerCountry' },
    { title: 'Approved', key: 'isApproved' },
    { title: 'Visible', key: 'isVisible' },
    { title: 'Created At', key: 'createdAt' },
    { title: 'Actions', key: 'actions', sortable: false }
  ];
  
  // Store data
  const { reviews, loading, error } = reviewStore;
  
  // Computed properties
  const filteredReviews = computed(() => {
    let filtered = reviews;
  
    if (approvalFilter.value === 'approved') {
      filtered = filtered.filter((item: { isApproved: any; }) => item.isApproved);
    } else if (approvalFilter.value === 'pending') {
      filtered = filtered.filter((item: { isApproved: any; }) => !item.isApproved);
    }
  
    if (visibilityFilter.value === 'visible') {
      filtered = filtered.filter((item: { isVisible: any; }) => item.isVisible);
    } else if (visibilityFilter.value === 'hidden') {
      filtered = filtered.filter((item: { isVisible: any; }) => !item.isVisible);
    }
  
    if (ratingFilter.value !== 'all') {
      filtered = filtered.filter(item => Math.floor(item.rating) === parseInt(ratingFilter.value));
    }
  
    if (countryFilter.value !== 'all') {
      filtered = filtered.filter(item => item.reviewerCountry === countryFilter.value);
    }
  
    return filtered;
  });
  
  const totalReviews = computed(() => reviews.length);
  const approvedReviews = computed(() => reviews.filter(r => r.isApproved).length);
  const pendingReviews = computed(() => reviews.filter(r => !r.isApproved).length);
  const averageRating = computed(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  });
  
  // Methods
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const viewReview = (id: number) => {
    router.push({ name: 'ReviewDetail', params: { id } });
  };
  
  const editReview = (id: number) => {
    // Open edit modal or navigate to edit page (to be implemented)
    alert('Edit review ' + id);
  };
  
  const deleteReview = async (id: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      await reviewStore.deleteReview(id);
    }
  };
  
  const toggleApprove = async (item: any) => {
    const newStatus = !item.isApproved;
    await reviewStore.updateReview(item.reviewId, { isApproved: newStatus });
  };
  
  const toggleVisible = async (item: any) => {
    const newStatus = !item.isVisible;
    await reviewStore.updateReview(item.reviewId, { isVisible: newStatus });
  };
  
  const clearFilters = () => {
    search.value = '';
    approvalFilter.value = 'all';
    visibilityFilter.value = 'all';
    ratingFilter.value = 'all';
    countryFilter.value = 'all';
  };
  
  const exportReviews = () => {
    // Implement export functionality
    alert('Export reviews functionality to be implemented');
  };
  
  onMounted(() => {
    reviewStore.fetchReviews();
  });
  </script>
  
  <style scoped>
  .reviews-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  </style>