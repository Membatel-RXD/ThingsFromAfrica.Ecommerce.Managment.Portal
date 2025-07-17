import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { ShippingRate, CreateShippingRate } from './types/member';

export const useShippingRateStore = defineStore('shippingRate', {
  state: () => ({
    rates: [] as ShippingRate[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
    selected: null as ShippingRate | null,
  }),
  getters: {
    getRates: (state) => state.rates,
    getActiveRates: (state) => state.rates.filter(r => r.isActive),
    getByCountry: (state) => (countryCode: string) => state.rates.filter(r => r.countryCode === countryCode),
  },
  actions: {
    async fetchRates() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<ShippingRate[]>>('ShippingRates/GetAll');
        this.rates = res.payload || [];
      } catch (e) {
        this.error = 'Failed to fetch shipping rates';
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<ShippingRate>>('ShippingRates/GetById', { id });
        this.selected = res.payload || null;
        return this.selected;
      } catch (e) {
        this.error = 'Failed to fetch shipping rate';
      } finally {
        this.loading = false;
      }
    },
    async addRate(data: CreateShippingRate) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.post<IAPIResponse<ShippingRate>>('ShippingRates/Add', data);
        if (res.payload) this.rates.push(res.payload);
        this.success = 'Shipping rate added';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to add shipping rate';
      } finally {
        this.loading = false;
      }
    },
    async updateRate(id: number, data: Partial<CreateShippingRate>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.put<IAPIResponse<ShippingRate>>('ShippingRates/Update', { ...data, rateId: id });
        const idx = this.rates.findIndex(r => r.rateId === id);
        if (idx !== -1 && res.payload) this.rates[idx] = res.payload;
        this.success = 'Shipping rate updated';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to update shipping rate';
      } finally {
        this.loading = false;
      }
    },
    async deleteRate(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.delete<IAPIResponse<object>>(`ShippingRates/Delete?id=${id}`);
        if (res.isSuccessful) {
          this.rates = this.rates.filter(r => r.rateId !== id);
          this.success = 'Shipping rate deleted';
        } else {
          this.error = res.message || 'Failed to delete shipping rate';
        }
      } catch (e) {
        this.error = 'Failed to delete shipping rate';
      } finally {
        this.loading = false;
      }
    },
  },
}); 