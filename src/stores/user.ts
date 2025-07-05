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
  }),
  getters: {
    getUser: (state) => state.user
  },

  actions: {
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      this.role = null;
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
        }

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
        paths: ['isAuthenticated', 'user', 'token', 'role', 'configurations']
      }
    ]
  },
});