import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { EmailTemplate } from './types/member';

export const useEmailTemplateStore = defineStore('emailTemplate', {
  state: () => ({
    templates: [] as EmailTemplate[],
    loading: false,
    error: null as string | null,
    selectedTemplate: null as EmailTemplate | null,
  }),

  getters: {
    getTemplates: (state) => state.templates,
    getTemplateById: (state) => (id: number) =>
      state.templates.find(t => t.templateId === id) || null,
  },

  actions: {
    async fetchTemplates() {
      this.loading = true;
      this.error = null;
      try {
        console.log('Fetching email templates from API...');
        const response = await apiService.get<IAPIResponse<EmailTemplate[]>>('/api/v1/EmailTemplates/GetAll');
        console.log('API Response:', response);
        if (response.isSuccessful) {
          this.templates = response.payload || [];
          console.log('Templates loaded:', this.templates.length);
        } else {
          this.error = response.remark || 'Failed to fetch templates';
          console.error('API Error:', this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch templates';
        console.error('Fetch Error:', e);
      } finally {
        this.loading = false;
      }
    },

    async fetchTemplateById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.get<IAPIResponse<EmailTemplate>>(`/api/v1/EmailTemplates/GetById/${id}`);
        if (response.isSuccessful) {
          this.selectedTemplate = response.payload;
        } else {
          this.error = response.remark || 'Failed to fetch template';
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch template';
      } finally {
        this.loading = false;
      }
    },

    async createTemplate(data: Omit<EmailTemplate, 'templateId' | 'createdAt' | 'modifiedAt'>) {
      this.loading = true;
      this.error = null;
      try {
        const now = new Date().toISOString();
        const payload = { ...data, createdAt: now, modifiedAt: now };
        console.log('Creating template with payload:', payload);
        const response = await apiService.post<IAPIResponse<EmailTemplate>>('/api/v1/EmailTemplates/Add', payload);
        console.log('Create API Response:', response);
        if (response.isSuccessful && response.payload) {
          this.templates.push(response.payload);
          return response.payload;
        } else {
          this.error = response.remark || 'Failed to create template';
          throw new Error(this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to create template';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateTemplate(id: number, data: Partial<EmailTemplate>) {
      this.loading = true;
      this.error = null;
      try {
        const now = new Date().toISOString();
        const payload = { ...data, modifiedAt: now };
        console.log('Updating template with payload:', payload);
        const response = await apiService.put<IAPIResponse<EmailTemplate>>(`/api/v1/EmailTemplates/Update/${id}`, payload);
        console.log('Update API Response:', response);
        if (response.isSuccessful && response.payload) {
          const idx = this.templates.findIndex(t => t.templateId === id);
          if (idx !== -1) this.templates[idx] = response.payload;
          return response.payload;
        } else {
          this.error = response.remark || 'Failed to update template';
          throw new Error(this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to update template';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteTemplate(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.delete<IAPIResponse<null>>(`/api/v1/EmailTemplates/Delete/${id}`);
        if (response.isSuccessful) {
          this.templates = this.templates.filter(t => t.templateId !== id);
          return true;
        } else {
          this.error = response.remark || 'Failed to delete template';
          throw new Error(this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to delete template';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    // Helper method to clear errors
    clearError() {
      this.error = null;
    },

    // Helper method to clear selected template
    clearSelectedTemplate() {
      this.selectedTemplate = null;
    },
  },
}); 