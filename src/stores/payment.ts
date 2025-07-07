import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { PaymentDTO, CreatePaymentRequest } from "./types/member";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    payments: [] as PaymentDTO[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getPayments: (state) => state.payments,
    getPaymentsByStatus: (state) => (status: string) =>
      state.payments.filter(p => p.paymentStatus.toLowerCase() === status.toLowerCase()),
    getPaymentsByOrderId: (state) => (orderId: number) =>
      state.payments.filter(p => p.orderId === orderId),
    getPaymentByTransactionId: (state) => (transactionId: string) =>
      state.payments.find(p => p.transactionId === transactionId),
  },

  actions: {
    async fetchPayments() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<PaymentDTO[]>>("/Payments/GetAll");
        this.payments = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch payments";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPayment(data: CreatePaymentRequest): Promise<IAPIResponse<PaymentDTO>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<PaymentDTO>>("/Payments/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.payments.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create payment";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePayment(id: number, data: Partial<PaymentDTO>): Promise<IAPIResponse<PaymentDTO>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<PaymentDTO>>(`/Payments/Update?paymentId=${id}`, data);
        const index = this.payments.findIndex(p => p.paymentId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.payments[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update payment";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePayment(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/Payments/Delete?paymentId=${id}`);
        if (response && response.isSuccessful) {
          this.payments = this.payments.filter(p => p.paymentId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete payment";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
