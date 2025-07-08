export interface IAPIResponse<T> {
  isSuccessful: boolean;
  message?: string | null;
  payload?: T | null;
}
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
} from "axios";
import { API_CONFIG } from "../config/api-config";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    // Add request interceptor for debugging
    this.api.interceptors.request.use(
      (config) => {
        console.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: (config.baseURL || '') + (config.url || ''),
          data: config.data,
          params: config.params
        });
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for debugging
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', {
          status: response.status,
          url: response.config?.url || 'unknown',
          data: response.data
        });
        return response;
      },
      (error) => {
        console.error('API Response Error:', {
          status: error.response?.status,
          url: error.config?.url || 'unknown',
          message: error.message,
          data: error.response?.data
        });
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  async get<T>(url: string, params?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { params });
    return response.data;
  }

  // Generic POST method
  async post<T>(url: string, data: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data);
    return response.data;
  }

  // Generic PUT method
  async put<T>(url: string, data: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data);
    return response.data;
  }

  // Generic DELETE method
  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
