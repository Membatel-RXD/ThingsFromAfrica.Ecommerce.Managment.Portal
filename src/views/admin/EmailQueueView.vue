<template>
  <div class="email-queue-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-blue-darken-3">Email Queue</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Monitor and manage email delivery queue
          </p>
        </div>
        <div class="d-flex gap-2">
          <v-btn
            color="blue-darken-2"
            variant="outlined"
            prepend-icon="mdi-refresh"
            @click="refreshQueue"
            :loading="store.loading"
          >
            Refresh
          </v-btn>
          <v-btn
            color="orange-darken-2"
            variant="outlined"
            prepend-icon="mdi-retry"
            @click="retryAllFailed"
            :loading="retryingAll"
            :disabled="store.getFailedEmails.length === 0"
          >
            Retry All Failed
          </v-btn>
        </div>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-email-clock</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ totalEmails }}</h3>
                <p class="text-body-2 text-blue-darken-1">Total Emails</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-clock-outline</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ pendingEmails }}</h3>
                <p class="text-body-2 text-orange-darken-1">Pending</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="red-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="red-darken-3" size="40" class="me-3">mdi-alert-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-red-darken-3">{{ failedEmails }}</h3>
                <p class="text-body-2 text-red-darken-1">Failed</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ sentEmails }}</h3>
                <p class="text-body-2 text-green-darken-1">Sent</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Search and Filters -->
      <v-card class="elevation-2 mb-6">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                label="Search emails..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                label="Status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="priorityFilter"
                label="Priority"
                :items="priorityOptions"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn
                variant="outlined"
                @click="clearFilters"
                prepend-icon="mdi-refresh"
                block
              >
                Clear
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Email Queue Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-blue-lighten-5">
          <v-icon class="me-2" color="blue-darken-3">mdi-email-multiple</v-icon>
          Email Queue Management
          <v-spacer></v-spacer>
          <div class="d-flex gap-2">
            <v-btn
              color="red-darken-2"
              variant="outlined"
              size="small"
              prepend-icon="mdi-delete-sweep"
              @click="clearFailedDialog = true"
              :disabled="store.getFailedEmails.length === 0"
            >
              Clear Failed
            </v-btn>
            <v-btn
              color="green-darken-2"
              variant="outlined"
              size="small"
              prepend-icon="mdi-delete-sweep"
              @click="clearSentDialog = true"
              :disabled="store.getSentEmails.length === 0"
            >
              Clear Sent
            </v-btn>
          </div>
        </v-card-title>
        
        <!-- Loading State -->
        <div v-if="store.loading && store.emails.length === 0" class="pa-12 text-center">
          <v-progress-circular indeterminate color="blue-darken-2" size="64"></v-progress-circular>
          <p class="mt-4 text-grey-darken-1">Loading email queue...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="store.error && store.emails.length === 0" class="pa-12 text-center">
          <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
          <h3 class="text-h6 text-error mb-2">Failed to load email queue</h3>
          <p class="text-grey-darken-1 mb-4">{{ store.error }}</p>
          <v-btn color="blue-darken-2" @click="retryLoad" prepend-icon="mdi-refresh">
            Retry
          </v-btn>
        </div>

        <!-- Empty State -->
        <div v-else-if="!store.loading && store.emails.length === 0" class="pa-12 text-center">
          <v-icon color="grey" size="64" class="mb-4">mdi-email-outline</v-icon>
          <h3 class="text-h6 text-grey-darken-1 mb-2">No emails in queue</h3>
          <p class="text-grey-darken-1 mb-4">The email queue is currently empty</p>
        </div>

        <!-- Data Table -->
        <v-data-table
          v-else
          :headers="headers"
          :items="filteredEmails"
          :loading="store.loading"
          :search="search"
          class="elevation-1"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              variant="flat"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.priority="{ item }">
            <v-chip
              :color="getPriorityColor(item.priority)"
              size="small"
              variant="flat"
            >
              {{ getPriorityLabel(item.priority) }}
            </v-chip>
          </template>

          <template v-slot:item.attemptCount="{ item }">
            <div class="d-flex align-center">
              <span class="me-2">{{ item.attemptCount }}/{{ item.maxAttempts }}</span>
              <v-progress-linear
                :model-value="(item.attemptCount / item.maxAttempts) * 100"
                :color="item.attemptCount >= item.maxAttempts ? 'red' : 'orange'"
                height="4"
                rounded
              ></v-progress-linear>
            </div>
          </template>

          <template v-slot:item.scheduledAt="{ item }">
            {{ formatDate(item.scheduledAt) }}
          </template>

          <template v-slot:item.sentAt="{ item }">
            {{ item.sentAt ? formatDate(item.sentAt) : 'Not sent' }}
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  v-bind="props"
                />
              </template>
              <v-list>
                <v-list-item @click="viewEmail(item)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-eye" />
                  </template>
                  <v-list-item-title>View Details</v-list-item-title>
                </v-list-item>
                
                <v-list-item 
                  v-if="item.status === 'Failed' && item.attemptCount < item.maxAttempts"
                  @click="retryEmail(item)"
                >
                  <template v-slot:prepend>
                    <v-icon icon="mdi-retry" />
                  </template>
                  <v-list-item-title>Retry</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click="deleteEmail(item)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-delete" />
                  </template>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- View Email Dialog -->
    <v-dialog v-model="viewDialog" max-width="800">
      <v-card>
        <v-card-title class="bg-blue-lighten-4 text-blue-darken-3">
          <v-icon class="me-2">mdi-email</v-icon>
          Email Details
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div v-if="selectedEmail" class="space-y-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="selectedEmail.toEmail"
                  label="To Email"
                  variant="outlined"
                  readonly
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="selectedEmail.toName"
                  label="To Name"
                  variant="outlined"
                  readonly
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-text-field
              :model-value="selectedEmail.subject"
              label="Subject"
              variant="outlined"
              readonly
              density="compact"
            ></v-text-field>
            
            <v-textarea
              :model-value="selectedEmail.body"
              label="Body"
              variant="outlined"
              readonly
              rows="8"
              auto-grow
            ></v-textarea>
            
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="selectedEmail.status"
                  label="Status"
                  variant="outlined"
                  readonly
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="`${selectedEmail.attemptCount}/${selectedEmail.maxAttempts}`"
                  label="Attempts"
                  variant="outlined"
                  readonly
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="getPriorityLabel(selectedEmail.priority)"
                  label="Priority"
                  variant="outlined"
                  readonly
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="formatDate(selectedEmail.scheduledAt)"
                  label="Scheduled At"
                  variant="outlined"
                  readonly
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="selectedEmail.sentAt ? formatDate(selectedEmail.sentAt) : 'Not sent'"
                  label="Sent At"
                  variant="outlined"
                  readonly
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-text-field
              v-if="selectedEmail.errorMessage"
              :model-value="selectedEmail.errorMessage"
              label="Error Message"
              variant="outlined"
              readonly
              density="compact"
              color="error"
            ></v-text-field>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-2"
            variant="outlined"
            @click="viewDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-red-lighten-4 text-red-darken-3">
          <v-icon class="me-2">mdi-delete</v-icon>
          Delete Email
        </v-card-title>
        
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this email from the queue?</p>
          <p class="text-caption text-grey-darken-1 mt-2">
            This action cannot be undone.
          </p>
        </v-card-text>
        
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red-darken-2"
            variant="elevated"
            @click="confirmDelete"
            :loading="store.loading"
            class="ms-2"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Clear Failed Emails Dialog -->
    <v-dialog v-model="clearFailedDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-red-lighten-4 text-red-darken-3">
          <v-icon class="me-2">mdi-delete-sweep</v-icon>
          Clear Failed Emails
        </v-card-title>
        
        <v-card-text class="pa-6">
          <p>Are you sure you want to clear all failed emails from the queue?</p>
          <p class="text-caption text-grey-darken-1 mt-2">
            This will permanently delete {{ store.getFailedEmails.length }} failed emails.
          </p>
        </v-card-text>
        
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            @click="clearFailedDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red-darken-2"
            variant="elevated"
            @click="confirmClearFailed"
            :loading="store.loading"
            class="ms-2"
          >
            Clear All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Clear Sent Emails Dialog -->
    <v-dialog v-model="clearSentDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-green-lighten-4 text-green-darken-3">
          <v-icon class="me-2">mdi-delete-sweep</v-icon>
          Clear Sent Emails
        </v-card-title>
        
        <v-card-text class="pa-6">
          <p>Are you sure you want to clear all sent emails from the queue?</p>
          <p class="text-caption text-grey-darken-1 mt-2">
            This will permanently delete {{ store.getSentEmails.length }} sent emails.
          </p>
        </v-card-text>
        
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            @click="clearSentDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green-darken-2"
            variant="elevated"
            @click="confirmClearSent"
            :loading="store.loading"
            class="ms-2"
          >
            Clear All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useEmailQueueStore } from '@/stores/emailQueue';
import type { EmailQueue } from '@/stores/types/member';

const store = useEmailQueueStore();

// Reactive data
const search = ref('');
const statusFilter = ref('all');
const priorityFilter = ref('all');
const viewDialog = ref(false);
const deleteDialog = ref(false);
const clearFailedDialog = ref(false);
const clearSentDialog = ref(false);
const retryingAll = ref(false);
const selectedEmail = ref<EmailQueue | null>(null);
const emailToDelete = ref<EmailQueue | null>(null);

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

// Table headers
const headers = [
  { title: 'To Email', key: 'toEmail', sortable: true },
  { title: 'To Name', key: 'toName', sortable: true },
  { title: 'Subject', key: 'subject', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'Attempts', key: 'attemptCount', sortable: false },
  { title: 'Scheduled', key: 'scheduledAt', sortable: true },
  { title: 'Sent', key: 'sentAt', sortable: true },
  { title: 'Created', key: 'createdAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
];

// Filter options
const statusOptions = [
  { title: 'All', value: 'all' },
  { title: 'Pending', value: 'Pending' },
  { title: 'Sent', value: 'Sent' },
  { title: 'Failed', value: 'Failed' }
];

const priorityOptions = [
  { title: 'All', value: 'all' },
  { title: 'Low', value: '0' },
  { title: 'Normal', value: '1' },
  { title: 'High', value: '2' },
  { title: 'Urgent', value: '3' }
];

// Computed properties
const filteredEmails = computed(() => {
  let filtered = store.emails;

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(e => e.status === statusFilter.value);
  }

  // Priority filter
  if (priorityFilter.value !== 'all') {
    filtered = filtered.filter(e => e.priority === parseInt(priorityFilter.value));
  }

  // Search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(e => 
      e.toEmail.toLowerCase().includes(searchLower) ||
      e.toName.toLowerCase().includes(searchLower) ||
      e.subject.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
});

const totalEmails = computed(() => store.emails.length);
const pendingEmails = computed(() => store.getPendingEmails.length);
const failedEmails = computed(() => store.getFailedEmails.length);
const sentEmails = computed(() => store.getSentEmails.length);

// Methods
const refreshQueue = async () => {
  try {
    await store.refreshQueue();
    showNotification('Email queue refreshed successfully!', 'success');
  } catch (error: any) {
    showNotification(error.message || 'Failed to refresh queue', 'error');
  }
};

const retryAllFailed = async () => {
  retryingAll.value = true;
  try {
    const failedEmails = store.getFailedEmails.filter(e => e.attemptCount < e.maxAttempts);
    let successCount = 0;
    
    for (const email of failedEmails) {
      try {
        await store.retryEmail(email.emailId);
        successCount++;
      } catch (error) {
        console.error(`Failed to retry email ${email.emailId}:`, error);
      }
    }
    
    showNotification(`Retried ${successCount} out of ${failedEmails.length} failed emails`, 'success');
  } catch (error: any) {
    showNotification(error.message || 'Failed to retry emails', 'error');
  } finally {
    retryingAll.value = false;
  }
};

const viewEmail = (email: EmailQueue) => {
  selectedEmail.value = email;
  viewDialog.value = true;
};

const retryEmail = async (email: EmailQueue) => {
  try {
    await store.retryEmail(email.emailId);
    showNotification('Email retry initiated successfully!', 'success');
  } catch (error: any) {
    showNotification(error.message || 'Failed to retry email', 'error');
  }
};

const deleteEmail = (email: EmailQueue) => {
  emailToDelete.value = email;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!emailToDelete.value) return;

  try {
    await store.deleteEmail(emailToDelete.value.emailId);
    showNotification('Email deleted successfully!', 'success');
    deleteDialog.value = false;
  } catch (error: any) {
    showNotification(error.message || 'Failed to delete email', 'error');
  }
};

const confirmClearFailed = async () => {
  try {
    await store.clearFailedEmails();
    showNotification('Failed emails cleared successfully!', 'success');
    clearFailedDialog.value = false;
  } catch (error: any) {
    showNotification(error.message || 'Failed to clear failed emails', 'error');
  }
};

const confirmClearSent = async () => {
  try {
    await store.clearSentEmails();
    showNotification('Sent emails cleared successfully!', 'success');
    clearSentDialog.value = false;
  } catch (error: any) {
    showNotification(error.message || 'Failed to clear sent emails', 'error');
  }
};

const clearFilters = () => {
  search.value = '';
  statusFilter.value = 'all';
  priorityFilter.value = 'all';
};

const retryLoad = async () => {
  try {
    await store.fetchEmails();
  } catch (error: any) {
    console.error('Error retrying fetch:', error);
    showNotification(error.message || 'Failed to load emails', 'error');
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'orange';
    case 'Sent': return 'green';
    case 'Failed': return 'red';
    default: return 'grey';
  }
};

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 0: return 'grey';
    case 1: return 'blue';
    case 2: return 'orange';
    case 3: return 'red';
    default: return 'grey';
  }
};

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 0: return 'Low';
    case 1: return 'Normal';
    case 2: return 'High';
    case 3: return 'Urgent';
    default: return 'Unknown';
  }
};

const showNotification = (text: string, color: string) => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

onMounted(async () => {
  try {
    await store.fetchEmails();
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    showNotification(error.message || 'Error loading email queue', 'error');
  }
});

// Watch for store errors
watch(() => store.error, (error) => {
  if (error) {
    showNotification(error, 'error');
    store.clearError();
  }
});
</script>

<style scoped>
.email-queue-view {
  background-color: #fafafa;
  min-height: 100vh;
}

.v-data-table ::v-deep(.v-data-table__wrapper) {
  border-radius: 0;
}

.v-data-table ::v-deep(.v-data-table-header) {
  background-color: #E3F2FD;
}

.v-data-table ::v-deep(.v-data-table-header th) {
  color: #1976D2 !important;
  font-weight: bold;
}

.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}

.v-chip {
  border-radius: 6px;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}
</style> 