import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { OrderCreationRequest, OrderDto, Ordertatus } from "./types/member";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [] as OrderDto[],
    orderStatuses: [] as Ordertatus[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getOrders: (state) => state.orders,
    
    getOrderById: (state) => (id: number) =>
      state.orders.find(o => o.orderId === id),
    
    getOrderByNumber: (state) => (orderNumber: string) =>
      state.orders.find(o => o.orderNumber === orderNumber),
    
    getOrdersByCustomer: (state) => (customerId: number) =>
      state.orders.filter(o => o.customerId === customerId),
    
    getOrdersByEmail: (state) => (email: string) =>
      state.orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase()),
    
    getOrdersByStatus: (state) => (statusId: number) =>
      state.orders.filter(o => o.statusId === statusId),
    
    getOrdersByStatusName: (state) => (status: string) =>
      state.orders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase()),
    
    getTouristOrders: (state) => 
      state.orders.filter(o => o.isTouristOrder),
    
    getOrdersRequiringPhytosanitaryCertificate: (state) =>
      state.orders.filter(o => o.requiresPhytosanitaryCertificate),
    
    getOrdersByDateRange: (state) => (startDate: string, endDate: string) =>
      state.orders.filter(o => {
        const orderDate = new Date(o.orderDate);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      }),
    
    getPendingOrders: (state) =>
      state.orders.filter(o => !o.deliveredDate && !o.shippedDate),
    
    getShippedOrders: (state) =>
      state.orders.filter(o => o.shippedDate && !o.deliveredDate),
    
    getDeliveredOrders: (state) =>
      state.orders.filter(o => o.deliveredDate),
    
    getOrdersByCountry: (state) => (countryCode: string) =>
      state.orders.filter(o => o.shippingCountryCode === countryCode),
    
    getOrdersByCurrency: (state) => (currency: string) =>
      state.orders.filter(o => o.currency === currency),
    
    getTotalOrderValue: (state) =>
      state.orders.reduce((sum, order) => sum + order.totalAmount, 0),
    
    getOrderStatistics: (state) => {
      const total = state.orders.length;
      const pending = state.orders.filter(o => !o.deliveredDate && !o.shippedDate).length;
      const shipped = state.orders.filter(o => o.shippedDate && !o.deliveredDate).length;
      const delivered = state.orders.filter(o => o.deliveredDate).length;
      const tourist = state.orders.filter(o => o.isTouristOrder).length;
      const totalValue = state.orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      return {
        total,
        pending,
        shipped,
        delivered,
        tourist,
        totalValue
      };
    },
  },

  actions: {
    async fetchOrders() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<OrderDto[]>>("/Orders/GetAll");
        this.orders = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch orders";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchOrderStatus() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<Ordertatus[]>>("/OrderStatus/GetAll");
        this.orderStatuses = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch orders";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrderById(id: number) {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<OrderDto>>(`/Orders/GetById?id=${id}`);
        if (response && response.isSuccessful && response.payload) {
          const existingIndex = this.orders.findIndex(o => o.orderId === id);
          if (existingIndex !== -1) {
            this.orders[existingIndex] = response.payload;
          } else {
            this.orders.push(response.payload);
          }
        }
        return response;
      } catch (error) {
        this.error = "Failed to fetch order";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrdersByCustomer(customerId: number) {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<OrderDto[]>>(`/Orders/GetByCustomer?customerId=${customerId}`);
        if (response && response.isSuccessful && response.payload) {
          // Update or add orders to the store
          response.payload.forEach(order => {
            const existingIndex = this.orders.findIndex(o => o.orderId === order.orderId);
            if (existingIndex !== -1) {
              this.orders[existingIndex] = order;
            } else {
              this.orders.push(order);
            }
          });
        }
        return response;
      } catch (error) {
        this.error = "Failed to fetch customer orders";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createOrder(data: OrderCreationRequest): Promise<IAPIResponse<OrderDto>> {
      try {
        this.loading = true;
        data.billingCountryName = data.billingCountryCode;
        const response = await apiService.post<IAPIResponse<OrderDto>>("/Orders/CreateOrder", data);
        if (response && response.isSuccessful && response.payload) {
          this.orders.push(response.payload);
          this.success = "Order created successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to create order";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(id: number, data: Partial<OrderDto>): Promise<IAPIResponse<OrderDto>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<OrderDto>>(`/Orders/Update?id=${id}`, data);
        const index = this.orders.findIndex(o => o.orderId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.orders[index] = response.payload;
          this.success = "Order updated successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to update order";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateOrderStatus(id: number, statusId: number): Promise<IAPIResponse<OrderDto>> {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<OrderDto>>(`/Orders/UpdateStatus?id=${id}&statusId=${statusId}`);
        const index = this.orders.findIndex(o => o.orderId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.orders[index] = response.payload;
          this.success = "Order status updated successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to update order status";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async shipOrder(id: number, shippedDate?: string): Promise<IAPIResponse<OrderDto>> {
      try {
        this.loading = true;
        const data = {
          shippedDate: shippedDate || new Date().toISOString()
        };
        const response = await apiService.put<IAPIResponse<OrderDto>>(`/Orders/Ship?id=${id}`, data);
        const index = this.orders.findIndex(o => o.orderId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.orders[index] = response.payload;
          this.success = "Order shipped successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to ship order";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deliverOrder(id: number, deliveredDate?: string): Promise<IAPIResponse<OrderDto>> {
      try {
        this.loading = true;
        const data = {
          deliveredDate: deliveredDate || new Date().toISOString()
        };
        const response = await apiService.put<IAPIResponse<OrderDto>>(`/Orders/Deliver?id=${id}`, data);
        const index = this.orders.findIndex(o => o.orderId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.orders[index] = response.payload;
          this.success = "Order delivered successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to deliver order";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cancelOrder(id: number): Promise<IAPIResponse<OrderDto>> {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<OrderDto>>(`/Orders/Cancel?id=${id}`);
        const index = this.orders.findIndex(o => o.orderId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.orders[index] = response.payload;
          this.success = "Order cancelled successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to cancel order";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/Orders/Delete?id=${id}`);
        if (response && response.isSuccessful) {
          this.orders = this.orders.filter(o => o.orderId !== id);
          this.success = "Order deleted successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete order";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addOrderNotes(id: number, customerNotes?: string, adminNotes?: string): Promise<IAPIResponse<OrderDto>> {
      try {
        this.loading = true;
        const data = {
          customerNotes,
          adminNotes
        };
        const response = await apiService.put<IAPIResponse<OrderDto>>(`/Orders/UpdateNotes?id=${id}`, data);
        const index = this.orders.findIndex(o => o.orderId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.orders[index] = response.payload;
          this.success = "Order notes updated successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to update order notes";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Utility actions
    clearError() {
      this.error = null;
    },

    clearSuccess() {
      this.success = null;
    },

    clearMessages() {
      this.error = null;
      this.success = null;
    },

    // Search and filter actions
    searchOrders(query: string) {
      const lowerQuery = query.toLowerCase();
      return this.orders.filter(order =>
        order.orderNumber.toLowerCase().includes(lowerQuery) ||
        order.customerEmail.toLowerCase().includes(lowerQuery) ||
        order.billingFirstName.toLowerCase().includes(lowerQuery) ||
        order.billingLastName.toLowerCase().includes(lowerQuery) ||
        order.shippingFirstName.toLowerCase().includes(lowerQuery) ||
        order.shippingLastName.toLowerCase().includes(lowerQuery) ||
        order.orderStatus.toLowerCase().includes(lowerQuery)
      );
    },

    // Bulk operations
    async bulkUpdateOrderStatus(orderIds: number[], statusId: number): Promise<void> {
      try {
        this.loading = true;
        const promises = orderIds.map(id => this.updateOrderStatus(id, statusId));
        await Promise.all(promises);
        this.success = `${orderIds.length} orders updated successfully`;
      } catch (error) {
        this.error = "Failed to bulk update orders";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async bulkShipOrders(orderIds: number[], shippedDate?: string): Promise<void> {
      try {
        this.loading = true;
        const promises = orderIds.map(id => this.shipOrder(id, shippedDate));
        await Promise.all(promises);
        this.success = `${orderIds.length} orders shipped successfully`;
      } catch (error) {
        this.error = "Failed to bulk ship orders";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});