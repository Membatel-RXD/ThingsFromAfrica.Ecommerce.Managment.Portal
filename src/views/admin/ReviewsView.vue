<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Product Reviews Management</h1>
        <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
        <v-progress-linear v-if="loading" indeterminate color="primary" />
        <v-data-table
          :headers="headers"
          :items="reviews"
          :loading="loading"
          class="elevation-1"
          item-key="reviewId"
        >
          <template #item.actions="{ item }">
            <v-btn icon @click="viewReview(item.reviewId)"><v-icon>mdi-eye</v-icon></v-btn>
            <v-btn icon @click="editReview(item.reviewId)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon color="red" @click="deleteReview(item.reviewId)"><v-icon>mdi-delete</v-icon></v-btn>
            <v-switch
              v-model="item.isApproved"
              @change="toggleApprove(item)"
              color="success"
              hide-details
              inset
              :label="item.isApproved ? 'Approved' : 'Not Approved'"
            />
            <v-switch
              v-model="item.isVisible"
              @change="toggleVisible(item)"
              color="info"
              hide-details
              inset
              :label="item.isVisible ? 'Visible' : 'Hidden'"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useReviewStore } from '@/stores/review';
import { useRouter } from 'vue-router';

const reviewStore = useReviewStore();
const router = useRouter();

const headers = [
  { text: 'Rating', value: 'rating' },
  { text: 'Title', value: 'reviewTitle' },
  { text: 'Product ID', value: 'productId' },
  { text: 'Customer ID', value: 'customerId' },
  { text: 'Country', value: 'reviewerCountry' },
  { text: 'Approved', value: 'isApproved' },
  { text: 'Visible', value: 'isVisible' },
  { text: 'Created At', value: 'createdAt' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const { reviews, loading, error } = reviewStore;

onMounted(() => {
  reviewStore.fetchReviews();
});

function viewReview(id: number) {
  router.push({ name: 'ReviewDetail', params: { id } });
}

function editReview(id: number) {
  // Open edit modal or navigate to edit page (to be implemented)
  alert('Edit review ' + id);
}

async function deleteReview(id: number) {
  if (confirm('Are you sure you want to delete this review?')) {
    await reviewStore.deleteReview(id);
  }
}

async function toggleApprove(item: any) {
  await reviewStore.updateReview(item.reviewId, { isApproved: item.isApproved });
}

async function toggleVisible(item: any) {
  await reviewStore.updateReview(item.reviewId, { isVisible: item.isVisible });
}
</script>

<style scoped>
h1 {
  margin-bottom: 24px;
}
</style>
