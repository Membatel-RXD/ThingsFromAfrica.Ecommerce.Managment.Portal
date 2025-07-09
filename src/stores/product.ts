import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { Product } from "./types/member";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    topProducts: [] as Product[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getProducts: (state) => state.products,
    getTopProducts: (state) => state.topProducts,
    getActiveProducts: (state) => state.products.filter(p => p.isVisible),
    getProductsByCategory: (state) => (category: number) => 
      state.products.filter(p => p.categoryId === category),
  },

  actions: {
    async fetchProducts() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<Product[]>>("/Products/GetAll");
        this.products = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch products";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTopProducts() {
      try {
        this.loading = true;
        // For now, we'll get all products and filter by rating/sales
        const response = await apiService.get<IAPIResponse<Product[]>>("/Products/GetAll");
        this.topProducts = (response.payload || []).slice(0, 5); // Get top 5 for now
      } catch (error) {
        this.error = "Failed to fetch top products";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAPIResponse<Product>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<Product>>("/Products/Add", data);
        if (response.payload) {
          this.products.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create product";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id: number, data: Partial<Product>): Promise<IAPIResponse<Product>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<Product>>(`/Products/Update`, data);
        const index = this.products.findIndex(p => p.productId === id);
        if (index !== -1 && response.payload) {
          this.products[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update product";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/Products/Delete`);
        this.products = this.products.filter(p => p.productId !== id);
        return response;
      } catch (error) {
        this.error = "Failed to delete product";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
