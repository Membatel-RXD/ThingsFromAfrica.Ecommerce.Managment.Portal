import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { ArtisanDTO, CreateArtisanRequest } from "./types/member";

export const useArtisanStore = defineStore("artisan", {
  state: () => ({
    artisans: [] as ArtisanDTO[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getArtisans: (state) => state.artisans,
    getActiveArtisans: (state) => state.artisans.filter(a => a.isActive),
    getArtisanBySlug: (state) => (slug: string) =>
      state.artisans.find(a => a.artisanSlug === slug),
    getArtisansByName: (state) => (name: string) =>
      state.artisans.filter(a => a.artisanName.toLowerCase().includes(name.toLowerCase())),
    getArtisansByVillage: (state) => (village: string) =>
      state.artisans.filter(a => a.village.toLowerCase().includes(village.toLowerCase())),
    getArtisansByRegion: (state) => (region: string) =>
      state.artisans.filter(a => a.region.toLowerCase().includes(region.toLowerCase())),
    getArtisansBySpecialization: (state) => (specialization: string) =>
      state.artisans.filter(a => a.specialization.toLowerCase().includes(specialization.toLowerCase())),
  },

  actions: {
    async fetchArtisans() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<ArtisanDTO[]>>("/Artisans/GetAll");
        this.artisans = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch artisans";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createArtisan(data: CreateArtisanRequest): Promise<IAPIResponse<ArtisanDTO>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<ArtisanDTO>>("/Artisans/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.artisans.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create artisan";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateArtisan(id: number, data: Partial<ArtisanDTO>): Promise<IAPIResponse<ArtisanDTO>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<ArtisanDTO>>(`/Artisans/Update?artisanid=${id}`, data);
        const index = this.artisans.findIndex(a => a.artisanSlug === data.artisanSlug);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.artisans[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update artisan";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteArtisan(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/Artisans/Delete?artisanid=${id}`);
        if (response && response.isSuccessful && response.payload) {
          this.artisans = this.artisans.filter(a => a.artisanSlug !== id.toString());
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete artisan";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});