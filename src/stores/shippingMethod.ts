import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { ShippingMethod } from "./types/member";

export const useShippingMethodStore = defineStore("shippingMethod", {
  state: () => ({
    shippingMethods: [] as ShippingMethod[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getAllMethods: (state) => state.shippingMethods,
    getActiveMethods: (state) => state.shippingMethods.filter(m => m.isActive),
    getInternationalMethods: (state) => state.shippingMethods.filter(m => m.isInternational),
    getMethodById: (state) => (id: number) =>
      state.shippingMethods.find(m => m.shippingMethodId === id),
    getMethodByCode: (state) => (code: string) =>
      state.shippingMethods.find(m => m.methodCode.toLowerCase() === code.toLowerCase()),
  },

  actions: {
    async fetchShippingMethods() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<ShippingMethod[]>>("/ShippingMethods/GetAll");
        this.shippingMethods = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch shipping methods";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createShippingMethod(data: Omit<ShippingMethod, "shippingMethodId" | "createdAt">): Promise<IAPIResponse<ShippingMethod>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<ShippingMethod>>("/ShippingMethods/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.shippingMethods.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create shipping method";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateShippingMethod(id: number, data: Partial<ShippingMethod>): Promise<IAPIResponse<ShippingMethod>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<ShippingMethod>>(`/ShippingMethods/Update?methodId=${id}`, data);
        const index = this.shippingMethods.findIndex(m => m.shippingMethodId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.shippingMethods[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update shipping method";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteShippingMethod(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/ShippingMethods/Delete?methodId=${id}`);
        if (response && response.isSuccessful) {
          this.shippingMethods = this.shippingMethods.filter(m => m.shippingMethodId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete shipping method";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
