import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { CreateProductCategory, ProductCategory } from "./types/member";

export const useProductCategoryStore = defineStore("productCategory", {
  state: () => ({
    categories: [] as ProductCategory[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getCategories: (state) => state.categories,
    getActiveCategories: (state) => state.categories.filter(c => c.isActive),
    getTouristFavoriteCategories: (state) => state.categories.filter(c => c.isTouristFavorite),
    getActiveTouristFavorites: (state) => state.categories.filter(c => c.isActive && c.isTouristFavorite),
    getCategoriesSortedByOrder: (state) => [...state.categories].sort((a, b) => a.sortOrder - b.sortOrder),
    getCategoryBySlug: (state) => (slug: string) => 
      state.categories.find(c => c.categorySlug === slug),
    getCategoryById: (state) => (id: number) => 
      state.categories.find(c => c.categoryId === id),
  },

  actions: {
    async fetchCategories() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<ProductCategory[]>>("/ProductCategories/GetAll");
        this.categories = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch product categories";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(data: CreateProductCategory): Promise<IAPIResponse<ProductCategory>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<ProductCategory>>("/ProductCategories/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.categories.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create product category";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(id: number, data: Partial<ProductCategory>): Promise<IAPIResponse<ProductCategory>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<ProductCategory>>(`/ProductCategories/Update?categoryid=${id}`, data);
        const index = this.categories.findIndex(c => c.categoryId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.categories[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update product category";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/ProductCategories/Delete?categoryid=${id}`);
        if (response && response.isSuccessful) {
          this.categories = this.categories.filter(c => c.categoryId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete product category";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleCategoryStatus(id: number): Promise<IAPIResponse<ProductCategory>> {
      const category = this.categories.find(c => c.categoryId === id);
      if (!category) {
        throw new Error("Category not found");
      }
      return this.updateCategory(id, { isActive: !category.isActive });
    },

    async toggleTouristFavorite(id: number): Promise<IAPIResponse<ProductCategory>> {
      const category = this.categories.find(c => c.categoryId === id);
      if (!category) {
        throw new Error("Category not found");
      }
      return this.updateCategory(id, { isTouristFavorite: !category.isTouristFavorite });
    },

    async reorderCategories(categoryId: number, newSortOrder: number): Promise<IAPIResponse<ProductCategory>> {
      return this.updateCategory(categoryId, { sortOrder: newSortOrder });
    },

    clearError() {
      this.error = null;
    },

    clearSuccess() {
      this.success = null;
    },
  },
});