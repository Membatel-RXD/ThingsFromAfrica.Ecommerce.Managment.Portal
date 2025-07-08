import { defineStore } from 'pinia';
import { apiService, type IAPIResponse } from '@/services/api';
import type { EmailQueue } from './types/member';

export const useEmailQueueStore = defineStore('emailQueue', {
  state: () => ({
    emails: [] as EmailQueue[],
    loading: false,
    error: null as string | null,
    selectedEmail: null as EmailQueue | null,
  }),

  getters: {
    getEmails: (state) => state.emails,
    getEmailById: (state) => (id: number) =>
      state.emails.find(e => e.emailId === id) || null,
    
    // Filter emails by status
    getEmailsByStatus: (state) => (status: string) =>
      state.emails.filter(e => e.status === status),
    
    // Get pending emails
    getPendingEmails: (state) =>
      state.emails.filter(e => e.status === 'Pending'),
    
    // Get failed emails
    getFailedEmails: (state) =>
      state.emails.filter(e => e.status === 'Failed'),
    
    // Get sent emails
    getSentEmails: (state) =>
      state.emails.filter(e => e.status === 'Sent'),
    
    // Get emails that need retry
    getRetryEmails: (state) =>
      state.emails.filter(e => e.status === 'Failed' && e.attemptCount < e.maxAttempts),
  },

  actions: {
    async fetchEmails() {
      this.loading = true;
      this.error = null;
      try {
        console.log('Fetching email queue from API...');
        const response = await apiService.get<IAPIResponse<EmailQueue[]>>('/api/v1/EmailQueue/GetAll');
        console.log('API Response:', response);
        if (response.isSuccessful) {
          this.emails = response.payload || [];
          console.log('Emails loaded:', this.emails.length);
        } else {
          this.error = response.remark || 'Failed to fetch emails';
          console.error('API Error:', this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch emails';
        console.error('Fetch Error:', e);
      } finally {
        this.loading = false;
      }
    },

    async fetchEmailById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.get<IAPIResponse<EmailQueue>>(`/api/v1/EmailQueue/GetById/${id}`);
        if (response.isSuccessful) {
          this.selectedEmail = response.payload;
        } else {
          this.error = response.remark || 'Failed to fetch email';
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch email';
      } finally {
        this.loading = false;
      }
    },

    async retryEmail(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.post<IAPIResponse<EmailQueue>>(`/api/v1/EmailQueue/Retry/${id}`, {});
        if (response.isSuccessful && response.payload) {
          // Update the email in the list
          const idx = this.emails.findIndex(e => e.emailId === id);
          if (idx !== -1) this.emails[idx] = response.payload;
          return response.payload;
        } else {
          this.error = response.remark || 'Failed to retry email';
          throw new Error(this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to retry email';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteEmail(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.delete<IAPIResponse<null>>(`/api/v1/EmailQueue/Delete/${id}`);
        if (response.isSuccessful) {
          this.emails = this.emails.filter(e => e.emailId !== id);
          return true;
        } else {
          this.error = response.remark || 'Failed to delete email';
          throw new Error(this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to delete email';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async clearFailedEmails() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.delete<IAPIResponse<null>>('/api/v1/EmailQueue/ClearFailed');
        if (response.isSuccessful) {
          this.emails = this.emails.filter(e => e.status !== 'Failed');
          return true;
        } else {
          this.error = response.remark || 'Failed to clear failed emails';
          throw new Error(this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to clear failed emails';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async clearSentEmails() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.delete<IAPIResponse<null>>('/api/v1/EmailQueue/ClearSent');
        if (response.isSuccessful) {
          this.emails = this.emails.filter(e => e.status !== 'Sent');
          return true;
        } else {
          this.error = response.remark || 'Failed to clear sent emails';
          throw new Error(this.error);
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to clear sent emails';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    // Helper method to clear errors
    clearError() {
      this.error = null;
    },

    // Helper method to clear selected email
    clearSelectedEmail() {
      this.selectedEmail = null;
    },

    // Method to refresh the email queue
    async refreshQueue() {
      await this.fetchEmails();
    },
  },
}); 