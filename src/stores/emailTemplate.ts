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
        const response = await apiService.get<IAPIResponse<EmailTemplate[]>>('/email-templates');
        if (response.isSuccessful) {
          this.templates = response.payload || [];
        } else {
          this.error = response.remark || 'Failed to fetch templates';
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch templates';
      } finally {
        this.loading = false;
      }
    },
    async fetchTemplateById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.get<IAPIResponse<EmailTemplate>>(`/email-templates/${id}`);
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
        const response = await apiService.post<IAPIResponse<EmailTemplate>>('/email-templates', payload);
        if (response.isSuccessful && response.payload) {
          this.templates.push(response.payload);
        } else {
          this.error = response.remark || 'Failed to create template';
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to create template';
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
        const response = await apiService.put<IAPIResponse<EmailTemplate>>(`/email-templates/${id}`, payload);
        if (response.isSuccessful && response.payload) {
          const idx = this.templates.findIndex(t => t.templateId === id);
          if (idx !== -1) this.templates[idx] = response.payload;
        } else {
          this.error = response.remark || 'Failed to update template';
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to update template';
      } finally {
        this.loading = false;
      }
    },
    async deleteTemplate(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.delete<IAPIResponse<null>>(`/email-templates/${id}`);
        if (response.isSuccessful) {
          this.templates = this.templates.filter(t => t.templateId !== id);
        } else {
          this.error = response.remark || 'Failed to delete template';
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to delete template';
      } finally {
        this.loading = false;
      }
    },
  },
}); 