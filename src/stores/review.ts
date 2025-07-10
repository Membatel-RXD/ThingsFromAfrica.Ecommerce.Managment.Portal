import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { Review, ReviewCreateOrUpdate } from "./types/member";


export const useReviewStore = defineStore("review", {
  state: () => ({
    reviews: [] as Review[],
    currentReview: null as Review | null,
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getReviews: (state) => state.reviews,
    getReviewById: (state) => (id: number) => state.reviews.find(r => r.reviewId === id),
  },

  actions: {
    async fetchReviews() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<Review[]>>("/ProductReviews/GetAll");
        this.reviews = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch reviews";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchReviewById(id: number) {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<Review>>(`/ProductReviews/GetById?reviewId=${id}`);
        this.currentReview = response.payload || null;
      } catch (error) {
        this.error = "Failed to fetch review details";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createReview(data: ReviewCreateOrUpdate) {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<Review>>("/ProductReviews/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.reviews.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create review";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateReview(id: number, data: Partial<ReviewCreateOrUpdate>) {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<Review>>(`/ProductReviews/Update?reviewId=${id}`, data);
        const index = this.reviews.findIndex(r => r.reviewId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.reviews[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update review";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteReview(id: number) {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/ProductReviews/Delete?reviewId=${id}`);
        if (response && response.isSuccessful) {
          this.reviews = this.reviews.filter(r => r.reviewId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete review";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
}); 