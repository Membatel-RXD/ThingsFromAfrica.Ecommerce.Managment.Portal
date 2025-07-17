import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { Shipment, CreateShipment } from './types/member';

export const useShipmentStore = defineStore('shipment', {
  state: () => ({
    shipments: [] as Shipment[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
    selected: null as Shipment | null,
  }),
  getters: {
    getShipments: (state) => state.shipments,
    getByStatus: (state) => (status: string) => state.shipments.filter(s => s.shipmentStatus === status),
    getByCarrier: (state) => (carrier: string) => state.shipments.filter(s => s.carrierName === carrier),
  },
  actions: {
    async fetchShipments() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<Shipment[]>>('Shipments/GetAll');
        this.shipments = res.payload || [];
      } catch (e) {
        this.error = 'Failed to fetch shipments';
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.get<IAPIResponse<Shipment>>('Shipments/GetById', { id });
        this.selected = res.payload || null;
        return this.selected;
      } catch (e) {
        this.error = 'Failed to fetch shipment';
      } finally {
        this.loading = false;
      }
    },
    async addShipment(data: CreateShipment) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.post<IAPIResponse<Shipment>>('Shipments/Add', data);
        if (res.payload) this.shipments.push(res.payload);
        this.success = 'Shipment added';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to add shipment';
      } finally {
        this.loading = false;
      }
    },
    async updateShipment(id: number, data: Partial<CreateShipment>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.put<IAPIResponse<Shipment>>('Shipments/Update', { ...data, shipmentId: id });
        const idx = this.shipments.findIndex(s => s.shipmentId === id);
        if (idx !== -1 && res.payload) this.shipments[idx] = res.payload;
        this.success = 'Shipment updated';
        return res.payload;
      } catch (e) {
        this.error = 'Failed to update shipment';
      } finally {
        this.loading = false;
      }
    },
    async deleteShipment(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiService.delete<IAPIResponse<object>>(`Shipments/Delete?id=${id}`);
        if (res.isSuccessful) {
          this.shipments = this.shipments.filter(s => s.shipmentId !== id);
          this.success = 'Shipment deleted';
        } else {
          this.error = res.message || 'Failed to delete shipment';
        }
      } catch (e) {
        this.error = 'Failed to delete shipment';
      } finally {
        this.loading = false;
      }
    },
  },
}); 