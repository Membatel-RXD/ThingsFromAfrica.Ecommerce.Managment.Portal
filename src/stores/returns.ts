import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { useSnackbarStore } from "@/stores/snackbar";

// Types for Return Request Table
export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string;
  orderItemId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  requestDate: string;
  approvedDate?: string;
  rejectedDate?: string;
  rmaNumber?: string;
  refundAmount?: number;
  restockable: boolean;
  images?: string[];
  customerName?: string;
  productName?: string;
  orderNumber?: string;
}

export const useReturnsStore = defineStore("returns", {
  state: () => ({
    returnRequests: [] as ReturnRequest[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
  }),

  getters: {
    getReturnRequests: (state) => state.returnRequests,
    
    // Filtered getters for table display
    getPendingReturns: (state) => state.returnRequests.filter((r: ReturnRequest) => r.status === 'pending'),
    getApprovedReturns: (state) => state.returnRequests.filter((r: ReturnRequest) => r.status === 'approved'),
    getRejectedReturns: (state) => state.returnRequests.filter((r: ReturnRequest) => r.status === 'rejected'),
    getProcessingReturns: (state) => state.returnRequests.filter((r: ReturnRequest) => r.status === 'processing'),
    getCompletedReturns: (state) => state.returnRequests.filter((r: ReturnRequest) => r.status === 'completed'),
    
    // Statistics for dashboard
    getReturnStats: (state) => {
      const total = state.returnRequests.length;
      const pending = state.returnRequests.filter((r: ReturnRequest) => r.status === 'pending').length;
      const approved = state.returnRequests.filter((r: ReturnRequest) => r.status === 'approved').length;
      const rejected = state.returnRequests.filter((r: ReturnRequest) => r.status === 'rejected').length;
      const processing = state.returnRequests.filter((r: ReturnRequest) => r.status === 'processing').length;
      const completed = state.returnRequests.filter((r: ReturnRequest) => r.status === 'completed').length;
      
      return { total, pending, approved, rejected, processing, completed };
    },
  },

  actions: {
    // Utility methods
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setError(error: string | null) {
      this.error = error;
      if (error) {
        const snackbar = useSnackbarStore();
        snackbar.error(error);
      }
    },

    setSuccess(message: string | null) {
      this.success = message;
      if (message) {
        const snackbar = useSnackbarStore();
        snackbar.success(message);
      }
    },

    // Fetch all return requests for table display
    async fetchAllReturnRequests() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response: IAPIResponse<ReturnRequest[]> = await apiService.get(API_ENDPOINTS.GET_ALL_RETURN_REQUESTS);
        if (response.isSuccessful) {
          this.returnRequests = response.payload || [];
        } else {
          this.setError(response.message || 'Failed to fetch return requests');
        }
      } catch (error: any) {
        this.setError(error.message || 'Error fetching return requests');
      } finally {
        this.setLoading(false);
      }
    },

    // Fetch return request by ID
    async fetchReturnRequestById(id: string) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response: IAPIResponse<ReturnRequest> = await apiService.get(`${API_ENDPOINTS.GET_RETURN_REQUEST_BY_ID}/${id}`);
        if (response.isSuccessful) {
          return response.payload;
        } else {
          this.setError(response.message || 'Failed to fetch return request');
          return null;
        }
      } catch (error: any) {
        this.setError(error.message || 'Error fetching return request');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    // Fetch returns by order ID
    async fetchReturnsByOrder(orderId: string) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response: IAPIResponse<ReturnRequest[]> = await apiService.get(`${API_ENDPOINTS.GET_RETURNS_BY_ORDER}/${orderId}`);
        if (response.isSuccessful) {
          return response.payload || [];
        } else {
          this.setError(response.message || 'Failed to fetch returns by order');
          return [];
        }
      } catch (error: any) {
        this.setError(error.message || 'Error fetching returns by order');
        return [];
      } finally {
        this.setLoading(false);
      }
    },

    // Fetch returns by customer ID
    async fetchReturnsByCustomer(customerId: string) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response: IAPIResponse<ReturnRequest[]> = await apiService.get(`${API_ENDPOINTS.GET_RETURNS_BY_CUSTOMER}/${customerId}`);
        if (response.isSuccessful) {
          return response.payload || [];
        } else {
          this.setError(response.message || 'Failed to fetch returns by customer');
          return [];
        }
      } catch (error: any) {
        this.setError(error.message || 'Error fetching returns by customer');
        return [];
      } finally {
        this.setLoading(false);
      }
    },

    // Initialize store - fetch all data
    async initializeStore() {
      await this.fetchAllReturnRequests();
    },

    // Clear store data
    clearStore() {
      this.returnRequests = [];
      this.error = null;
      this.success = null;
      this.loading = false;
    },
  },
});