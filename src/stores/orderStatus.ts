import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { OrderStatus, CreateOrderStatus } from './types/member';

export const useOrderStatusStore = defineStore('orderStatus', {
  state: () => ({
    statuses: [] as OrderStatus[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
    selected: null as OrderStatus | null,
  }),
  getters: {
    getStatuses: (state) => state.statuses,
    getActiveStatuses: (state) => state.statuses.filter(s => s.isActive),
    getInactiveStatuses: (state) => state.statuses.filter(s => !s.isActive),
  },
  actions: {
    async fetchStatuses() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<OrderStatus[]>>('OrderStatus/GetAll');
        this.statuses = res.payload || [];
      } catch (e) {
        this.error = 'Failed to fetch order statuses';
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<OrderStatus>>('OrderStatus/GetById', { statusid: id });
        this.selected = res.payload || null;
        return this.selected;
      } catch (e) {
        this.error = 'Failed to fetch order status';
      } finally {
        this.loading = false;
      }
    },
    async addStatus(data: CreateOrderStatus) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.post<IAPIResponse<OrderStatus>>('OrderStatus/Add', data);
        if (res.payload) this.statuses.push(res.payload);
        this.success = 'Order status added';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to add order status';
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(id: number, data: Partial<CreateOrderStatus>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.put<IAPIResponse<OrderStatus>>(
          `OrderStatus/Update?statusid=${id}`,
          { ...data, statusId: id }
        );
        const idx = this.statuses.findIndex(s => s.statusId === id);
        if (idx !== -1 && res.payload) this.statuses[idx] = res.payload;
        this.success = 'Order status updated';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to update order status';
      } finally {
        this.loading = false;
      }
    },
    async deleteStatus(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.delete<IAPIResponse<object>>(`OrderStatus/Delete?statusid=${id}`);
        if (res.isSuccessful) {
          this.statuses = this.statuses.filter(s => s.statusId !== id);
          this.success = 'Order status deleted';
        } else {
          this.error = res.message || 'Failed to delete order status';
        }
      } catch (e) {
        this.error = 'Failed to delete order status';
      } finally {
        this.loading = false;
      }
    },
  },
}); 