import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { StockAlert, CreateStockAlert, StockAlertSettings } from "./types/member";

export const useStockAlertStore = defineStore("stockAlert", {
  state: () => ({
    alerts: [] as StockAlert[],
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      browserNotifications: true,
      criticalThreshold: 5,
      warningThreshold: 10,
      autoResolve: false,
      notificationFrequency: 'immediate' as 'immediate' | 'hourly' | 'daily'
    } as StockAlertSettings,
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getAlerts: (state) => state.alerts,
    
    getAlertById: (state) => (id: number) =>
      state.alerts.find(a => a.alertId === id),
    
    getAlertsBySeverity: (state) => (severity: string) =>
      state.alerts.filter(a => a.alertType.toLowerCase() === severity.toLowerCase()),
    
    getAlertsByStatus: (state) => (status: string) =>
      state.alerts.filter(a => a.status.toLowerCase() === status.toLowerCase()),
    
    getAlertsByProduct: (state) => (productId: number) =>
      state.alerts.filter(a => a.productId === productId),
    
    getUnreadAlerts: (state) => 
      state.alerts.filter(a => a.status === 'Unread'),
    
    getCriticalAlerts: (state) => 
      state.alerts.filter(a => a.alertType === 'OutOfStock' && a.status !== 'Dismissed'),
    
    getWarningAlerts: (state) => 
      state.alerts.filter(a => a.alertType === 'LowStock' && a.status !== 'Dismissed'),
    
    getResolvedAlertsToday: (state) => {
      const today = new Date().toISOString().split('T')[0];
      return state.alerts.filter(a => 
        a.status === 'Read' && 
        a.resolvedAt && 
        a.resolvedAt.startsWith(today)
      );
    },
    
    getAlertsByDateRange: (state) => (startDate: string, endDate: string) =>
      state.alerts.filter(a => {
        const alertDate = new Date(a.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return alertDate >= start && alertDate <= end;
      }),
  },

  actions: {
    async fetchAlerts() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<StockAlert[]>>("/StockAlerts/GetAllAll");
        this.alerts = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch stock alerts";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAlertsByProduct(productId: number) {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<StockAlert[]>>(`/StockAlerts/GetByProduct?productId=${productId}`);
        return response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch product alerts";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createAlert(data: CreateStockAlert): Promise<IAPIResponse<StockAlert>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<StockAlert>>("/StockAlerts/Add", data);
        if (response && response.isSuccessful && response.payload) {
          this.alerts.unshift(response.payload); // Add to beginning for latest first
          this.success = "Stock alert created successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to create stock alert";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAlert(id: number, data: Partial<StockAlert>): Promise<IAPIResponse<StockAlert>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<StockAlert>>(`/StockAlerts/Update?alertId=${id}`, data);
        const index = this.alerts.findIndex(a => a.alertId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.alerts[index] = response.payload;
          this.success = "Stock alert updated successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to update stock alert";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(id: number): Promise<IAPIResponse<StockAlert>> {
      try {
        const response = await apiService.put<IAPIResponse<StockAlert>>(`/StockAlerts/MarkAsRead?alertId=${id}`, {});
        const index = this.alerts.findIndex(a => a.alertId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.alerts[index] = {
            ...this.alerts[index],
            status: 'Read',
            resolvedAt: new Date().toISOString(),
          };
          this.success = "Alert marked as read";
        }
        return response;
      } catch (error) {
        this.error = "Failed to mark alert as read";
        throw error;
      }
    },

    async markAllAsRead(): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<object>>("/StockAlerts/MarkAllAsRead", {});
        if (response && response.isSuccessful) {
          this.alerts.forEach(alert => {
            if (alert.status === 'Unread') {
              alert.status = 'Read';
              alert.resolvedAt = new Date().toISOString();
            }
          });
          this.success = "All alerts marked as read";
        }
        return response;
      } catch (error) {
        this.error = "Failed to mark all alerts as read";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async dismissAlert(id: number): Promise<IAPIResponse<StockAlert>> {
      try {
        const response = await apiService.put<IAPIResponse<StockAlert>>(`/StockAlerts/Dismiss?alertId=${id}`, {});
        const index = this.alerts.findIndex(a => a.alertId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.alerts[index] = {
            ...this.alerts[index],
            status: 'Dismissed',
            resolvedAt: new Date().toISOString(),
          };
          this.success = "Alert dismissed";
        }
        return response;
      } catch (error) {
        this.error = "Failed to dismiss alert";
        throw error;
      }
    },

    async deleteAlert(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/StockAlerts/Delete?alertId=${id}`);
        if (response && response.isSuccessful) {
          this.alerts = this.alerts.filter(a => a.alertId !== id);
          this.success = "Stock alert deleted successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete stock alert";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAlertSettings() {
      try {
        const response = await apiService.get<IAPIResponse<StockAlertSettings>>("/StockAlerts/GetSettings");
        if (response && response.isSuccessful && response.payload) {
          this.settings = response.payload;
        }
      } catch (error) {
        this.error = "Failed to fetch alert settings";
        throw error;
      }
    },

    async updateAlertSettings(settings: Partial<StockAlertSettings>): Promise<IAPIResponse<StockAlertSettings>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<StockAlertSettings>>("/StockAlerts/UpdateSettings", settings);
        if (response && response.isSuccessful && response.payload) {
          this.settings = response.payload;
          this.success = "Alert settings updated successfully";
        }
        return response;
      } catch (error) {
        this.error = "Failed to update alert settings";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async checkLowStockProducts(): Promise<IAPIResponse<StockAlert[]>> {
      try {
        this.loading = true;
        const response = await apiService.post<IAPIResponse<StockAlert[]>>("/StockAlerts/CheckLowStock", {});
        if (response && response.isSuccessful && response.payload) {
          // Add new alerts to the beginning of the array
          const newAlerts = response.payload.filter(newAlert => 
            !this.alerts.some(existingAlert => 
              existingAlert.productId === newAlert.productId && 
              existingAlert.status === 'Unread'
            )
          );
          this.alerts.unshift(...newAlerts);
        }
        return response;
      } catch (error) {
        this.error = "Failed to check low stock products";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async testNotification(type: 'email' | 'sms' | 'browser'): Promise<IAPIResponse<object>> {
      try {
        const response = await apiService.post<IAPIResponse<object>>(`/StockAlerts/TestNotification?type=${type}`, {});
        if (response && response.isSuccessful) {
          this.success = `Test ${type} notification sent successfully`;
        }
        return response;
      } catch (error) {
        this.error = `Failed to send test ${type} notification`;
        throw error;
      }
    },

    // Local state management actions
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

    // Filter helpers for computed getters
    filterAlerts(filters: {
      severity?: string;
      status?: string;
      category?: string;
      startDate?: string;
      endDate?: string;
      productId?: number;
    }) {
      let filtered = [...this.alerts];

      if (filters.severity && filters.severity !== 'All') {
        filtered = filtered.filter(a => a.alertType === filters.severity);
      }

      if (filters.status && filters.status !== 'All') {
        filtered = filtered.filter(a => a.status === filters.status);
      }

      if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(a => a.category === filters.category);
      }

      if (filters.startDate) {
        filtered = filtered.filter(a => a.createdAt >= filters.startDate!);
      }

      if (filters.endDate) {
        filtered = filtered.filter(a => a.createdAt <= filters.endDate! + 'T23:59:59Z');
      }

      if (filters.productId) {
        filtered = filtered.filter(a => a.productId === filters.productId);
      }

      return filtered;
    },

    // Utility actions
    sortAlertsByDate(ascending: boolean = false) {
      this.alerts.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
    },

    getAlertStatistics() {
      return {
        total: this.alerts.length,
        unread: this.getUnreadAlerts.length,
        critical: this.getCriticalAlerts.length,
        warning: this.getWarningAlerts.length,
        resolvedToday: this.getResolvedAlertsToday.length,
        byStatus: {
          unread: this.alerts.filter(a => a.status === 'Unread').length,
          read: this.alerts.filter(a => a.status === 'Read').length,
          dismissed: this.alerts.filter(a => a.status === 'Dismissed').length,
        },
        bySeverity: {
          critical: this.alerts.filter(a => a.alertType === 'OutOfStock').length,
          warning: this.alerts.filter(a => a.alertType === 'LowStock').length,
          info: this.alerts.filter(a => a.alertType === 'Restocked').length,
        }
      };
    }
  },
});