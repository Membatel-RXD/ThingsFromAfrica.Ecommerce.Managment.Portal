import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { ShippingMethod, CreateShippingMethod } from './types/member';

export const useShippingMethodStore = defineStore('shippingMethod', {
  state: () => ({
    methods: [] as ShippingMethod[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
    selected: null as ShippingMethod | null,
  }),
  getters: {
    getMethods: (state) => state.methods,
    getActiveMethods: (state) => state.methods.filter(m => m.isActive),
    getInternationalMethods: (state) => state.methods.filter(m => m.isInternational),
  },
  actions: {
    async fetchMethods() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<ShippingMethod[]>>("ShippingMethods/GetAll");
        this.methods = res.payload || [];
      } catch (e) {
        this.error = 'Failed to fetch shipping methods';
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<ShippingMethod>>("ShippingMethods/GetById", { id });
        this.selected = res.payload || null;
        return this.selected;
      } catch (e) {
        this.error = 'Failed to fetch shipping method';
      } finally {
        this.loading = false;
      }
    },
    async addMethod(data: CreateShippingMethod) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.post<IAPIResponse<ShippingMethod>>("ShippingMethods/Add", data);
        if (res.payload) this.methods.push(res.payload);
        this.success = 'Shipping method added';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to add shipping method';
      } finally {
        this.loading = false;
      }
    },
    async updateMethod(id: number, data: Partial<CreateShippingMethod>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.put<IAPIResponse<ShippingMethod>>("ShippingMethods/Update", { ...data, shippingMethodId: id });
        const idx = this.methods.findIndex(m => m.shippingMethodId === id);
        if (idx !== -1 && res.payload) this.methods[idx] = res.payload;
        this.success = 'Shipping method updated';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to update shipping method';
      } finally {
        this.loading = false;
      }
    },
    async deleteMethod(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.delete<IAPIResponse<object>>(`ShippingMethods/Delete?id=${id}`);
        if (res.isSuccessful) {
          this.methods = this.methods.filter(m => m.shippingMethodId !== id);
          this.success = 'Shipping method deleted';
        } else {
          this.error = res.message || 'Failed to delete shipping method';
        }
      } catch (e) {
        this.error = 'Failed to delete shipping method';
      } finally {
        this.loading = false;
      }
    },
  },
}); 