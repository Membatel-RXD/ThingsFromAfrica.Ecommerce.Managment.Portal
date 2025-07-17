import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { ShippingRestriction, CreateShippingRestriction } from './types/member';

export const useShippingRestrictionStore = defineStore('shippingRestriction', {
  state: () => ({
    restrictions: [] as ShippingRestriction[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
    selected: null as ShippingRestriction | null,
  }),
  getters: {
    getRestrictions: (state) => state.restrictions,
    getActiveRestrictions: (state) => state.restrictions.filter(r => r.isActive),
    getByCountry: (state) => (countryCode: string) => state.restrictions.filter(r => r.countryCode === countryCode),
  },
  actions: {
    async fetchRestrictions() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<ShippingRestriction[]>>('ShippingRestrictions/GetAll');
        this.restrictions = res.payload || [];
      } catch (e) {
        this.error = 'Failed to fetch shipping restrictions';
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<ShippingRestriction>>('ShippingRestrictions/GetById', { id });
        this.selected = res.payload || null;
        return this.selected;
      } catch (e) {
        this.error = 'Failed to fetch shipping restriction';
      } finally {
        this.loading = false;
      }
    },
    async addRestriction(data: CreateShippingRestriction) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.post<IAPIResponse<ShippingRestriction>>('ShippingRestrictions/Add', data);
        if (res.payload) this.restrictions.push(res.payload);
        this.success = 'Shipping restriction added';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to add shipping restriction';
      } finally {
        this.loading = false;
      }
    },
    async updateRestriction(id: number, data: Partial<CreateShippingRestriction>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.put<IAPIResponse<ShippingRestriction>>('ShippingRestrictions/Update', { ...data, restrictionId: id });
        const idx = this.restrictions.findIndex(r => r.restrictionId === id);
        if (idx !== -1 && res.payload) this.restrictions[idx] = res.payload;
        this.success = 'Shipping restriction updated';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to update shipping restriction';
      } finally {
        this.loading = false;
      }
    },
    async deleteRestriction(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.delete<IAPIResponse<object>>(`ShippingRestrictions/Delete?id=${id}`);
        if (res.isSuccessful) {
          this.restrictions = this.restrictions.filter(r => r.restrictionId !== id);
          this.success = 'Shipping restriction deleted';
        } else {
          this.error = res.message || 'Failed to delete shipping restriction';
        }
      } catch (e) {
        this.error = 'Failed to delete shipping restriction';
      } finally {
        this.loading = false;
      }
    },
  },
}); 