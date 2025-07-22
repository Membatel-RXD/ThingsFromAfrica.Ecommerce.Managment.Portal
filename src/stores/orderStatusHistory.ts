import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { OrderStatusHistory } from './types/member';

export const useOrderStatusHistoryStore = defineStore('orderStatusHistory', {
  state: () => ({
    histories: [] as OrderStatusHistory[],
    loading: false,
    error: null as string | null,
    selected: null as OrderStatusHistory | null,
  }),
  getters: {
    getHistories: (state) => state.histories,
  },
  actions: {
    async fetchHistories() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<OrderStatusHistory[]>>('OrderStatusHistory/GetAll');
        this.histories = res.payload || [];
      } catch (e) {
        this.error = 'Failed to fetch order status histories';
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<OrderStatusHistory>>('OrderStatusHistory/GetById', { historyid: id });
        this.selected = res.payload || null;
        return this.selected;
      } catch (e) {
        this.error = 'Failed to fetch order status history';
      } finally {
        this.loading = false;
      }
    },
    async addHistory(data: Omit<OrderStatusHistory, 'historyId'>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.post<IAPIResponse<OrderStatusHistory>>('OrderStatusHistory/Add', data);
        console.log('OrderStatusHistory/Add response:', res);
        if (res.payload && res.payload.historyId) {
          this.histories.push(res.payload);
          return res.payload;
        } else {
          this.error = res.remark || 'Failed to add order status history (no valid payload)';
          return null;
        }
      } catch (e) {
        this.error = 'Failed to add order status history';
      } finally {
        this.loading = false;
      }
    },
    async updateHistory(id: number, data: Partial<OrderStatusHistory>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.put<IAPIResponse<OrderStatusHistory>>(
          `OrderStatusHistory/Update?historyid=${id}`,
          { ...data, historyId: id }
        );
        const idx = this.histories.findIndex(h => h.historyId === id);
        if (idx !== -1 && res.payload) this.histories[idx] = res.payload;
        return res.payload;
      } catch (e) {
        this.error = 'Failed to update order status history';
      } finally {
        this.loading = false;
      }
    },
    async deleteHistory(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.delete<IAPIResponse<object>>(`OrderStatusHistory/Delete?historyid=${id}`);
        if (res.isSuccessful) {
          this.histories = this.histories.filter(h => h.historyId !== id);
        } else {
          this.error = res.message || 'Failed to delete order status history';
        }
      } catch (e) {
        this.error = 'Failed to delete order status history';
      } finally {
        this.loading = false;
      }
    },
  },
}); 