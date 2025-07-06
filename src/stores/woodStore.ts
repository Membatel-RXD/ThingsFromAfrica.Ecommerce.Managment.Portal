import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { WoodCreatetionRequest, WoodType } from "./types/member";



export const useWoodTypeStore = defineStore("woodType", {
  state: () => ({
    woodTypes: [] as WoodType[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getWoodTypes: (state) => state.woodTypes,
    getActiveWoodTypes: (state) => state.woodTypes.filter(w => w.isActive),
    getNativeWoodTypes: (state) => state.woodTypes.filter(w => w.isNative),
    getRareWoodTypes: (state) => state.woodTypes.filter(w => w.isRare),
    getWoodTypesByHardness: (state) => (hardness: string) =>
      state.woodTypes.filter(w => w.woodHardness === hardness),
    getWoodTypesByOrigin: (state) => (origin: string) =>
      state.woodTypes.filter(w => w.woodOrigin === origin),
  },

  actions: {
    async fetchWoodTypes() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<WoodType[]>>("/WoodTypes/GetAll");
        this.woodTypes = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch wood types";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createWoodType(data: WoodCreatetionRequest): Promise<IAPIResponse<WoodType>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<WoodType>>("/WoodTypes/Add", data);
        if (response && response.isSuccessful && response.payload) {
            this.woodTypes.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create wood type";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateWoodType(id: number, data: Partial<WoodType>): Promise<IAPIResponse<WoodType>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<WoodType>>(`/WoodTypes/Update?woodtypeid=${id}`, data);
        const index = this.woodTypes.findIndex(w => w.woodTypeId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.woodTypes[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update wood type";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteWoodType(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/WoodTypes/Delete?woodtypeid=${id}`);
        if (response && response.isSuccessful && response.payload) {
          this.woodTypes = this.woodTypes.filter(w => w.woodTypeId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete wood type";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});