import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { LoginCredentials, AuthenticationResponse } from "./types/member";
import type { UserRole } from "./types/userRole";

interface User {
  userId: number;
  username: string;
  email: string;
  token: string;
  role: UserRole | null;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: true, // Force sidebar/header to show for dev
    role: null as UserRole | null,
    token: null as string | null,
    users: [] as User[],
    isInitialized: false, 
  }),
  getters: {
    getUser: (state) => state.user,
    isTokenExpired: (state) => {
      if (!state.token) return true;
      
      try {
        const tokenPayload = JSON.parse(atob(state.token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return tokenPayload.exp < currentTime;
      } catch (error) {
        console.error('Error parsing token:', error);
        return true;
      }
    }
  },

  actions: {
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      this.role = null;
      this.isInitialized = true;
      
      // Clear localStorage
      localStorage.removeItem('user');
      
      // Redirect to login if router is available
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    },
    hasRole(requiredRole: string): boolean {
      return this.role?.roleName === requiredRole;
    },
    async login(email: string, password: string) {
      try {
        const credentials: LoginCredentials = { Email: email, password };
        const apiResponse = await apiService.post<IAPIResponse<AuthenticationResponse>>(API_ENDPOINTS.LOGIN, credentials);
        if (apiResponse && apiResponse.isSuccessful && apiResponse.payload) {

          const response = apiResponse.payload;
          this.user = {
            userId: response.userId,
            username: response.userName,
            email: response.email,
            token: response.token,
            role: response.userRole,
          };
          this.isAuthenticated = true;
          this.token = response.token;
          this.role = response.userRole;
         
          return apiResponse;
        } else {
          return { isSuccessful: false, remark: apiResponse.message || "failed to authenticate due to an error" };
        }
      } catch (error) {
        this.isAuthenticated = false;
        throw error;
      }
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['isAuthenticated', 'user', 'token', 'role']
      }
    ]
  },
});