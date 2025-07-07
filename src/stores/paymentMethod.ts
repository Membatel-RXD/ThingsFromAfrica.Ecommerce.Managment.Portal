import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { PaymentMethodDTO, CreatePaymentMethodRequest } from "./types/member";

export const usePaymentMethodStore = defineStore("paymentMethod", {
  state: () => ({
    paymentMethods: [] as PaymentMethodDTO[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getPaymentMethods: (state) => state.paymentMethods,
    getActivePaymentMethods: (state) => state.paymentMethods.filter(pm => pm.isActive),
    getOnlinePaymentMethods: (state) => state.paymentMethods.filter(pm => pm.isOnline),
    getPaymentMethodByCode: (state) => (code: string) =>
      state.paymentMethods.find(pm => pm.methodCode === code),
    getPaymentMethodsByName: (state) => (name: string) =>
      state.paymentMethods.filter(pm => pm.methodName.toLowerCase().includes(name.toLowerCase())),
  },

  actions: {
    async fetchPaymentMethods() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<PaymentMethodDTO[]>>("/PaymentMethods/GetAll");
        this.paymentMethods = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch payment methods";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPaymentMethod(data: CreatePaymentMethodRequest): Promise<IAPIResponse<PaymentMethodDTO>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<PaymentMethodDTO>>("/PaymentMethods/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.paymentMethods.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create payment method";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePaymentMethod(id: number, data: Partial<PaymentMethodDTO>): Promise<IAPIResponse<PaymentMethodDTO>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<PaymentMethodDTO>>(`/PaymentMethods/Update?paymentMethodId=${id}`, data);
        const index = this.paymentMethods.findIndex(pm => pm.paymentMethodId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.paymentMethods[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update payment method";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePaymentMethod(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/PaymentMethods/Delete?paymentMethodId=${id}`);
        if (response && response.isSuccessful) {
          this.paymentMethods = this.paymentMethods.filter(pm => pm.paymentMethodId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete payment method";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
