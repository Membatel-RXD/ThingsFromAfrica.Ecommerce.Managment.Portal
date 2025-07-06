import { defineStore } from "pinia";
import { apiService, type IAPIResponse } from "@/services/api";

import { UserRole, type AuthenticationResponse, type CreateUsersRequest, type LoginCredentials, type UserRoleRequest } from "./types/member";


interface User {
  userId: number;
  username: string;
  email: string;
  token: string;
  role: UserRoleRequest;
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

    async checkAuthStatus() {
      try {
        // If already initialized, don't check again
        if (this.isInitialized) return;

        // Check if we have persisted authentication state
        if (this.isAuthenticated && this.token && this.user) {
          // Check if token is expired
          if (this.isTokenExpired) {
            this.logout();
            return;
          }

          // Optionally validate token with backend (you can skip this for faster loading)
          try {
            const response = await apiService.get<IAPIResponse<User>>(
              `/Users/GetProfileData?email=${this.user?.email}`,
            );

            if (response?.isSuccessful && response.payload) {
              // Token is valid, update user data if needed
              this.user = { ...this.user, ...response.payload };
              this.isAuthenticated = true;
            } else {
              // Token is invalid or user doesn't exist
              this.logout();
              return;
            }
          } catch (validationError) {
            // If validation fails, log error but don't logout immediately
            // This allows offline usage or handles temporary network issues
            console.warn('Token validation failed, but keeping user logged in:', validationError);
          }
        } else {
          // No persisted authentication state
          this.logout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        this.logout();
      } finally {
        this.isInitialized = true;
      }
    },


    async getAllUsers() {
      try {
       

        const response = await apiService.get<IAPIResponse<User[]>>(
          "/Users/GetUsers",
        );
        if (response != null) {
          if (response.isSuccessful) {
            this.users = response.payload || [];
          } else {
            this.users = [];
          }
        }
      } catch (e: unknown) {
        throw e;
      }
    },

    async getUserData() {
      try {
       
        const response = await apiService.get<IAPIResponse<User>>(
          `/Users/GetProfileData?email=${this.user?.email}`,
        );
        if (response != null) {
          if (response.isSuccessful && response.payload) {
            this.user = response.payload;
          } else {
            this.user = null;
          }
        }
      } catch (e: unknown) {
        throw e;
      }
    },

    async CreateNewUser(userCreationRequest: CreateUsersRequest): Promise<IAPIResponse<object>> {
      try {

       
        const response = await apiService.post<IAPIResponse<object>>(
          "/Users/Add",
          userCreationRequest
        );
        if (response !== null) {
          if (response.isSuccessful) {
            await this.getAllUsers();
          }
        }
        return response;
      } catch (error) {
        throw error;
      }
    },

    async login(credentials: LoginCredentials): Promise<IAPIResponse<AuthenticationResponse>> {
      try {
        const response = await apiService.post<IAPIResponse<AuthenticationResponse>>(
          "/Users/Authenticate",
          credentials
        );

        console.log(JSON.stringify(response));

        if (response?.isSuccessful && response.payload) {
          const authResponse = response.payload;
          const tokenPayload = JSON.parse(atob(authResponse.token.split('.')[1]));
          const fullName = tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

          this.user = {
            userId: authResponse.userId,
            username: fullName,
            email: authResponse.email,
            role: authResponse.userRole,
            token: authResponse.token,
          };
          this.token = authResponse.token;
          this.role = authResponse.userRole.roleName;
          this.isAuthenticated = true;
          this.isInitialized = true;        }

        return response;
      } catch (error) {
        throw error;
      }
    },
    hasRole(requiredRole: UserRole): boolean {
      return this.role === requiredRole;
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