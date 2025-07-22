import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { OrderItem, CreateOrderItem } from './types/member';

export const useOrderItemStore = defineStore('orderItem', {
  state: () => ({
    items: [] as OrderItem[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
    selected: null as OrderItem | null,
  }),
  getters: {
    getItems: (state) => state.items,
    getByOrder: (state) => (orderId: number) => state.items.filter(i => i.orderId === orderId),
    getByProduct: (state) => (productId: number) => state.items.filter(i => i.productId === productId),
  },
  actions: {
    async fetchItems() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<OrderItem[]>>('OrderItems/GetAll');
        this.items = res.payload || [];
      } catch (e) {
        this.error = 'Failed to fetch order items';
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<OrderItem>>('OrderItems/GetById', { orderitemid: id });
        this.selected = res.payload || null;
        return this.selected;
      } catch (e) {
        this.error = 'Failed to fetch order item';
      } finally {
        this.loading = false;
      }
    },
    async addItem(data: CreateOrderItem) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.post<IAPIResponse<OrderItem>>('OrderItems/Add', data);
        if (res.payload) this.items.push(res.payload);
        this.success = 'Order item added';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to add order item';
      } finally {
        this.loading = false;
      }
    },
    async updateItem(id: number, data: Partial<CreateOrderItem>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.put<IAPIResponse<OrderItem>>('OrderItems/Update', { ...data, orderItemId: id });
        const idx = this.items.findIndex(i => i.orderItemId === id);
        if (idx !== -1 && res.payload) this.items[idx] = res.payload;
        this.success = 'Order item updated';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to update order item';
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.delete<IAPIResponse<object>>(`OrderItems/Delete?orderitemid=${id}`);
        if (res.isSuccessful) {
          this.items = this.items.filter(i => i.orderItemId !== id);
          this.success = 'Order item deleted';
        } else {
          this.error = res.message || 'Failed to delete order item';
        }
      } catch (e) {
        this.error = 'Failed to delete order item';
      } finally {
        this.loading = false;
      }
    },
  },
}); 