import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { Customer, CustomerProfileContainerDTO } from "./types/member";
export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [] as CustomerProfileContainerDTO[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getCustomers: (state) => state.customers,
    getTotalCustomers: (state) => state.customers.length,
    getTopCustomers: (state) => [...state.customers]
      .sort((a, b) => b.customerProfile.totalOrders - a.customerProfile.totalSpent)
      .slice(0, 10),
  },

  actions: {
    async fetchCustomers() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<CustomerProfileContainerDTO[]>>(`/CustomerProfiles/GetAll`);
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
        const response = await apiService.put<IAPIResponse<Customer>>(`/CustomerProfiles/Update?userid=${id}`, data);
        const index = this.customers.findIndex(c => c.userDetails.userId === id);
       
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
        const response = await apiService.delete<IAPIResponse<object>>(`/customers/${id}`);
        if(response && response.isSuccessful && response.payload){
          this.customers = this.customers.filter(c => c.userDetails.userId !== id);
        }
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
