import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { Order } from "./types/member";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [] as Order[],
    recentOrders: [] as Order[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getOrders: (state) => state.orders,
    getRecentOrders: (state) => state.recentOrders,
    getOrdersByStatus: (state) => (status: number) => 
      state.orders.filter(o => o.statusId === status),
    getPendingOrders: (state) => state.orders.filter(o => o.status === 'Pending'),
    getTotalRevenue: (state) => state.orders.reduce((sum, order) => sum + order.totalAmount, 0),
  },

  actions: {
    async fetchOrders() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<Order[]>>("/orders");
        this.orders = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch orders";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchRecentOrders() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<Order[]>>("/orders/recent");
        this.recentOrders = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch recent orders";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAPIResponse<Order>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<Order>>("/orders", data);
        if(response && response.isSuccessful && response.payload){
            this.orders.push(response.payload);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create order";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateOrderStatus(id: number, status: Order['status']): Promise<IAPIResponse<Order>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<Order>>(`/orders/${id}/status`, { status });
        const index = this.orders.findIndex(o => o.orderId === id);
        if (response && response.isSuccessful && response.payload) {
          
          if (index !== -1) {
            this.orders[index] = response.payload;
          }
        }
        return response;
      } catch (error) {
        this.error = "Failed to update order status";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/orders/${id}`);
        this.orders = this.orders.filter(o => o.orderId !== id);
        return response;
      } catch (error) {
        this.error = "Failed to delete order";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});