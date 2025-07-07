import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { CraftTypeCreationRequest, CraftType } from "./types/member";

export const useCraftTypeStore = defineStore("craftType", {
  state: () => ({
    craftTypes: [] as CraftType[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getCraftTypes: (state) => state.craftTypes,
    getActiveCraftTypes: (state) => state.craftTypes.filter(c => c.isActive),
    getCraftTypeById: (state) => (id: number) =>
      state.craftTypes.find(c => c.craftTypeId === id),
    getCraftTypesByName: (state) => (name: string) =>
      state.craftTypes.filter(c => c.craftTypeName.toLowerCase().includes(name.toLowerCase())),
  },

  actions: {
    async fetchCraftTypes() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<CraftType[]>>("/CraftTypes/GetAll");
        this.craftTypes = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch craft types";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCraftType(data: CraftTypeCreationRequest): Promise<IAPIResponse<CraftType>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<CraftType>>("/CraftTypes/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.craftTypes.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create craft type";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCraftType(id: number, data: Partial<CraftType>): Promise<IAPIResponse<CraftType>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<CraftType>>(`/CraftTypes/Update?crafttypeid=${id}`, data);
        const index = this.craftTypes.findIndex(c => c.craftTypeId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.craftTypes[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update craft type";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCraftType(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/CraftTypes/Delete?crafttypeid=${id}`);
        if (response && response.isSuccessful && response.payload) {
          this.craftTypes = this.craftTypes.filter(c => c.craftTypeId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete craft type";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});