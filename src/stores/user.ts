import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";
import type { LoginCredentials, AuthenticationResponse } from "./types/member";

interface User {
  userId: number;
  username: string;
  email: string;
  token: string;
  role: any; // simplified, since UserRoleRequest is removed
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    role: null as string | null,
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
      return this.role === requiredRole;
    },
    async login(email: string, password: string) {
      try {
        const credentials: LoginCredentials = { Email: email, password };
        const apiResponse = await apiService.post<IAPIResponse<AuthenticationResponse>>("/Users/Authenticate", credentials);
        if (apiResponse && apiResponse.isSuccessful && apiResponse.payload) {

          const response = apiResponse.payload;
          this.user = {
            userId: response.userId,
            username: response.userName,
            email: response.email,
            token: response.token,
            role: response.userRole?.roleName,
          };
          this.isAuthenticated = true;
          this.token = response.token;
          this.role = response.userRole?.roleName;
         
          return apiResponse;
        } else {
          return { isSuccessful: false, remark: apiResponse.message || "failed to authenticate due to an error" };
        }
      } catch (error) {
        this.isAuthenticated = false;
        throw error;
      }
    },
    loginLocal(email: string, password: string): boolean {
      // Hardcoded credentials for development only
      const validUser = {
        email: 'admin@thingsfromafrica.com',
        password: 'admin123!',
        role: 'superadmin',
        username: 'admin',
        userId: 1,
        token: 'local-dev-token',
      };
      if (email === validUser.email && password === validUser.password) {
        this.user = {
          userId: validUser.userId,
          username: validUser.username,
          email: validUser.email,
          token: validUser.token,
          role: validUser.role,
        };
        this.isAuthenticated = true;
        this.token = validUser.token;
        this.role = validUser.role;
        this.isInitialized = true;
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } else {
        this.user = null;
        this.isAuthenticated = false;
        this.token = null;
        this.role = null;
        return false;
      }
    }
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