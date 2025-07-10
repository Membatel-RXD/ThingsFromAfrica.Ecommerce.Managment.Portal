// stores/customer.ts
import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { Customer } from "./types/member";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [] as Customer[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getCustomers: (state) => state.customers,
    getTotalCustomers: (state) => state.customers.length,
    getTopCustomers: (state) => [...state.customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10),
  },

  actions: {
    async fetchCustomers() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<Customer[]>>("/CustomerProfiles/GetAll");
        this.customers = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch customers";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCustomer(data: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'createdAt' | 'updatedAt'>): Promise<IAPIResponse<Customer>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<Customer>>("/CustomerProfiles/Add", data);
        if (response.payload) {
          this.customers.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create customer";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCustomer(id: number, data: Partial<Customer>): Promise<IAPIResponse<Customer>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<Customer>>(`/CustomerProfiles/Update`, data);
        const index = this.customers.findIndex(c => c.userId === id);
        if (index !== -1 && response.payload) {
          this.customers[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update customer";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCustomer(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/CustomerProfiles/Delete`);
        this.customers = this.customers.filter(c => c.userId !== id);
        return response;
      } catch (error) {
        this.error = "Failed to delete customer";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
