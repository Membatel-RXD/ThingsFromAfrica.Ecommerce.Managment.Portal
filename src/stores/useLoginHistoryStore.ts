import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { LoginHistory } from "./types/member";

export const useLoginHistoryStore = defineStore("loginHistory", {
  state: () => ({
    loginHistories: [] as LoginHistory[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getLoginHistories: (state) => state.loginHistories,
    getSuccessfulLogins: (state) => state.loginHistories.filter(h => h.failureReason==null),
    getFailedLogins: (state) => state.loginHistories.filter(h => h.failureReason != null),
    getRecentLogins: (state) => (days: number = 7) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return state.loginHistories.filter(h => new Date(h.loginAt) >= cutoffDate);
    },
    getLoginsByUser: (state) => (userId: number) =>
      state.loginHistories.filter(h => h.userId === userId),
    getLoginsByIpAddress: (state) => (ipAddress: string) =>
      state.loginHistories.filter(h => h.ipAddress === ipAddress),
  },

  actions: {
    async fetchLoginHistories() {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<LoginHistory[]>>("/UserLoginHistory/GetAll");
        this.loginHistories = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch login histories";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserLoginHistory(userId: number) {
      try {
        this.loading = true;
        const response = await apiService.get<IAPIResponse<LoginHistory[]>>(`/UserLoginHistory/GetByUser?userId=${userId}`);
        this.loginHistories = response.payload || [];
      } catch (error) {
        this.error = "Failed to fetch user login history";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateLoginHistory(id: number, data: Partial<LoginHistory>): Promise<IAPIResponse<LoginHistory>> {
      try {
        this.loading = true;
        const response = await apiService.put<IAPIResponse<LoginHistory>>(`/UserLoginHistory/Update?loginHistoryId=${id}`, data);
        const index = this.loginHistories.findIndex(h => h.loginHistoryId === id);
        if (index !== -1 && response && response.isSuccessful && response.payload) {
          this.loginHistories[index] = response.payload;
        }
        return response;
      } catch (error) {
        this.error = "Failed to update login history";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteLoginHistory(id: number): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/UserLoginHistory/Delete?loginHistoryId=${id}`);
        if (response && response.isSuccessful && response.payload) {
          this.loginHistories = this.loginHistories.filter(h => h.loginHistoryId !== id);
        }
        return response;
      } catch (error) {
        this.error = "Failed to delete login history";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async clearOldLoginHistory(days: number = 90): Promise<IAPIResponse<object>> {
      try {
        this.loading = true;
        const response = await apiService.delete<IAPIResponse<object>>(`/UserLoginHistory/ClearOld?days=${days}`);
        if (response && response.isSuccessful) {
          // Refresh the list after clearing old records
          await this.fetchLoginHistories();
        }
        return response;
      } catch (error) {
        this.error = "Failed to clear old login history";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});