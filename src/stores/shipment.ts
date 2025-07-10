import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { ShipmentDTO, CreateShipment } from "./types/member";

export const useShipmentStore = defineStore("shipment", {
  state: () => ({
    shipments: [] as ShipmentDTO[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getShipments: (state) => state.shipments,
    getShipmentById: (state) => (id: number) =>
      state.shipments.find(s => s.shipmentId === id),
    getShipmentsByStatus: (state) => (status: string) =>
      state.shipments.filter(s => s.shipmentStatus.toLowerCase() === status.toLowerCase()),
  },

  actions: {
    async fetchShipments() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<ShipmentDTO[]>>("/Shipments/GetAll");
        this.shipments = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch shipments";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createShipment(data: CreateShipment): Promise<IAPIResponse<ShipmentDTO>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<ShipmentDTO>>("/Shipments/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.shipments.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create shipment";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateShipment(id: number, data: Partial<ShipmentDTO>): Promise<IAPIResponse<ShipmentDTO>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<ShipmentDTO>>(`/Shipments/Update?shipmentid=${id}`, data);
        const index = this.shipments.findIndex(s => s.shipmentId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.shipments[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update shipment";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteShipment(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/Shipments/Delete?shipmentid=${id}`);
        if (response && response.isSuccessful) {
          this.shipments = this.shipments.filter(s => s.shipmentId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete shipment";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
