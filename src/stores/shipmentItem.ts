import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { ShipmentItem, CreateShipmentItem } from './types/member';

export const useShipmentItemStore = defineStore('shipmentItem', {
  state: () => ({
    items: [] as ShipmentItem[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
    selected: null as ShipmentItem | null,
  }),
  getters: {
    getItems: (state) => state.items,
    getByShipment: (state) => (shipmentId: number) => state.items.filter(i => i.shipmentId === shipmentId),
  },
  actions: {
    async fetchItems() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<ShipmentItem[]>>('ShipmentItems/GetAll');
        this.items = res.payload || [];
      } catch (e) {
        this.error = 'Failed to fetch shipment items';
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<ShipmentItem>>('ShipmentItems/GetById', { id });
        this.selected = res.payload || null;
        return this.selected;
      } catch (e) {
        this.error = 'Failed to fetch shipment item';
      } finally {
        this.loading = false;
      }
    },
    async addItem(data: CreateShipmentItem) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.post<IAPIResponse<ShipmentItem>>('ShipmentItems/Add', data);
        if (res.payload) this.items.push(res.payload);
        this.success = 'Shipment item added';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to add shipment item';
      } finally {
        this.loading = false;
      }
    },
    async updateItem(id: number, data: Partial<CreateShipmentItem>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.put<IAPIResponse<ShipmentItem>>(`ShipmentItems/Update?shipmentitemid=${id}`, data);
        const idx = this.items.findIndex(i => i.shipmentItemId === id);
        if (idx !== -1 && res.payload) this.items[idx] = res.payload;
        this.success = 'Shipment item updated';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to update shipment item';
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.delete<IAPIResponse<object>>(`ShipmentItems/Delete?shipmentitemid=${id}`);
        if (res.isSuccessful) {
          this.items = this.items.filter(i => i.shipmentItemId !== id);
          this.success = 'Shipment item deleted';
        } else {
          this.error = res.message || 'Failed to delete shipment item';
        }
      } catch (e) {
        this.error = 'Failed to delete shipment item';
      } finally {
        this.loading = false;
      }
    },
  },
}); 