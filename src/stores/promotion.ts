import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { PromotionDTO, CreatePromotionRequest } from "./types/member";

export const usePromotionStore = defineStore("promotion", {
  state: () => ({
    promotions: [] as PromotionDTO[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getPromotions: (state) => state.promotions,
    getActivePromotions: (state) => state.promotions.filter(p => p.isActive),
    getPromotionById: (state) => (id: number) =>
      state.promotions.find(p => p.promotionId === id),
    getPromotionByCode: (state) => (code: string) =>
      state.promotions.find(p => p.promotionCode.toLowerCase() === code.toLowerCase()),
    getPromotionsByName: (state) => (name: string) =>
      state.promotions.filter(p => p.promotionName.toLowerCase().includes(name.toLowerCase())),
    getValidPromotions: (state) => {
      const now = new Date();
      return state.promotions.filter(p => {
        const startDate = new Date(p.startDate);
        const endDate = new Date(p.endDate);
        return p.isActive && startDate <= now && endDate >= now;
      });
    },
    getPromotionsByDiscountType: (state) => (discountTypeId: number) =>
      state.promotions.filter(p => p.discountTypeId === discountTypeId),
    getPercentagePromotions: (state) => state.promotions.filter(p => p.isPercentage),
    getFixedAmountPromotions: (state) => state.promotions.filter(p => !p.isPercentage),
    getTouristOnlyPromotions: (state) => state.promotions.filter(p => p.isTouristOnly),
    getPromotionsByCountry: (state) => (country: string) =>
      state.promotions.filter(p => 
        p.applicableCountries.toLowerCase().includes(country.toLowerCase())
      ),
  },

  actions: {
    async fetchPromotions() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<PromotionDTO[]>>("/Promotions/GetAll");
        this.promotions = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch promotions";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPromotion(data: CreatePromotionRequest): Promise<IAPIResponse<PromotionDTO>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<PromotionDTO>>("/Promotions/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.promotions.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create promotion";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePromotion(id: number, data: Partial<PromotionDTO>): Promise<IAPIResponse<PromotionDTO>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<PromotionDTO>>(`/Promotions/Update?promotionid=${id}`, data);
        const index = this.promotions.findIndex(p => p.promotionId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.promotions[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update promotion";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePromotion(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/Promotions/Delete?promotionid=${id}`);
        if (response && response.isSuccessful && response.payload) {
          this.promotions = this.promotions.filter(p => p.promotionId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete promotion";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async validatePromotionCode(code: string, orderAmount: number, customerId?: number): Promise<IAPIResponse<PromotionDTO>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<PromotionDTO>>("/Promotions/Validate", {
          promotionCode: code,
          orderAmount,
          customerId
        });
        return response;
      } catch (error) {
        this.error = "Failed to validate promotion code";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async applyPromotion(promotionId: number, customerId?: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<object>>("/Promotions/Apply", {
          promotionId,
          customerId
        });
        
        // Update usage count locally
        const promotion = this.promotions.find(p => p.promotionId === promotionId);
        if (promotion && response && response.isSuccessful) {
          promotion.currentUsageCount += 1;
        }
        
        return response;
      } catch (error) {
        this.error = "Failed to apply promotion";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Utility methods
    isPromotionValid(promotion: PromotionDTO): boolean {
      const now = new Date();
      const startDate = new Date(promotion.startDate);
      const endDate = new Date(promotion.endDate);
      
      return (
        promotion.isActive &&
        startDate <= now &&
        endDate >= now &&
        promotion.currentUsageCount < promotion.maxUsageCount
      );
    },

    canCustomerUsePromotion(promotion: PromotionDTO, customerUsageCount: number): boolean {
      return customerUsageCount < promotion.maxUsagePerCustomer;
    },

    calculateDiscount(promotion: PromotionDTO, orderAmount: number): number {
      if (orderAmount < promotion.minimumOrderAmount) {
        return 0;
      }

      let discount = 0;
      if (promotion.isPercentage) {
        discount = (orderAmount * promotion.discountValue) / 100;
      } else {
        discount = promotion.discountValue;
      }

      // Apply maximum discount limit
      if (promotion.maximumDiscountAmount > 0 && discount > promotion.maximumDiscountAmount) {
        discount = promotion.maximumDiscountAmount;
      }

      return discount;
    },
  },
});