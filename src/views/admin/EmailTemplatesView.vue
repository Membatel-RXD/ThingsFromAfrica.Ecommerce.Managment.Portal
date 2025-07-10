<template>
  <div class="email-templates-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-blue-darken-3">Email Templates</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage and customize email templates for your business communications
          </p>
        </div>
        <v-btn
          color="blue-darken-2"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Add Template
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-email-multiple</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ totalTemplates }}</h3>
                <p class="text-body-2 text-blue-darken-1">Total Templates</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activeTemplates }}</h3>
                <p class="text-body-2 text-green-darken-1">Active Templates</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-clock-outline</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ recentTemplates }}</h3>
                <p class="text-body-2 text-orange-darken-1">Recently Modified</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="purple-darken-3" size="40" class="me-3">mdi-email-send</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ inactiveTemplates }}</h3>
                <p class="text-body-2 text-purple-darken-1">Inactive Templates</p>
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
                label="Search templates..."
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
                v-model="sortBy"
                label="Sort By"
                :items="sortOptions"
                variant="outlined"
                density="compact"
                hide-details
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

      <!-- Email Templates Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-blue-lighten-5">
          <v-icon class="me-2" color="blue-darken-3">mdi-email-multiple</v-icon>
          Email Templates Management
        </v-card-title>
        
        <!-- Loading State -->
        <div v-if="store.loading && store.templates.length === 0" class="pa-12 text-center">
          <v-progress-circular indeterminate color="blue-darken-2" size="64"></v-progress-circular>
          <p class="mt-4 text-grey-darken-1">Loading email templates...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="store.error && store.templates.length === 0" class="pa-12 text-center">
          <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
          <h3 class="text-h6 text-error mb-2">Failed to load templates</h3>
          <p class="text-grey-darken-1 mb-4">{{ store.error }}</p>
          <v-btn color="blue-darken-2" @click="retryLoad" prepend-icon="mdi-refresh">
            Retry
          </v-btn>
        </div>

        <!-- Empty State -->
        <div v-else-if="!store.loading && store.templates.length === 0" class="pa-12 text-center">
          <v-icon color="grey" size="64" class="mb-4">mdi-email-outline</v-icon>
          <h3 class="text-h6 text-grey-darken-1 mb-2">No email templates found</h3>
          <p class="text-grey-darken-1 mb-4">Create your first email template to get started</p>
          <v-btn color="blue-darken-2" @click="openCreateDialog" prepend-icon="mdi-plus">
            Create Template
          </v-btn>
        </div>

        <!-- Data Table -->
        <v-data-table
          v-else
          :headers="headers"
          :items="filteredTemplates"
          :loading="store.loading"
          :search="search"
          class="elevation-1"
          :sort-by="[{ key: 'modifiedAt', order: 'desc' }]"
        >
          <template v-slot:item.isActive="{ item }">
            <v-chip
              :color="item.isActive ? 'green' : 'grey'"
              size="small"
              variant="flat"
            >
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template v-slot:item.modifiedAt="{ item }">
            {{ formatDate(item.modifiedAt) }}
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
                <v-list-item @click="viewTemplate(item)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-eye" />
                  </template>
                  <v-list-item-title>View</v-list-item-title>
                </v-list-item>
                <v-list-item @click="editTemplate(item)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-pencil" />
                  </template>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="cloneTemplate(item)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-content-copy" />
                  </template>
                  <v-list-item-title>Clone</v-list-item-title>
                </v-list-item>
                <v-list-item @click="testTemplate(item)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-email-send" />
                  </template>
                  <v-list-item-title>Test Send</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="deleteTemplate(item)" class="text-error">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-delete" color="error" />
                  </template>
                  <v-list-item-title class="text-error">Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card>
        <v-card-title class="pa-6 bg-blue-lighten-5">
          <v-icon class="me-2" color="blue-darken-3">
            {{ editMode ? 'mdi-pencil' : 'mdi-plus' }}
          </v-icon>
          {{ editMode ? 'Edit Template' : 'Create New Template' }}
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="isFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.templateName"
                  :rules="[rules.required]"
                  label="Template Name"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.templateCode"
                  :rules="[rules.required, rules.uniqueCode]"
                  label="Template Code"
                  variant="outlined"
                  required
                  hint="Unique identifier for the template"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>

            <v-text-field
              v-model="formData.subject"
              :rules="[rules.required]"
              label="Email Subject"
              variant="outlined"
              required
            ></v-text-field>

            <v-textarea
              v-model="formData.body"
              :rules="[rules.required]"
              label="Email Body"
              variant="outlined"
              required
              rows="10"
              hint="Use HTML tags for formatting. Available variables: {{customerName}}, {{orderNumber}}, {{totalAmount}}"
              persistent-hint
            ></v-textarea>

            <v-switch
              v-model="formData.isActive"
              label="Active"
              color="green"
              hide-details
            ></v-switch>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue-darken-2"
            @click="saveTemplate"
            :loading="store.loading"
            :disabled="!isFormValid"
            class="ms-2"
          >
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Template Dialog -->
    <v-dialog v-model="viewDialog" max-width="800">
      <v-card>
        <v-card-title class="pa-6 bg-blue-lighten-5">
          <v-icon class="me-2" color="blue-darken-3">mdi-eye</v-icon>
          Template Details
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-4 mb-4" color="blue-lighten-5">
                <h3 class="text-h6 mb-2">{{ selectedTemplate?.templateName }}</h3>
                <v-chip color="blue" size="small" class="mb-2">
                  {{ selectedTemplate?.templateCode }}
                </v-chip>
                <p class="text-body-2 mb-0">{{ selectedTemplate?.subject }}</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="pa-4 mb-4" color="green-lighten-5">
                <h4 class="text-h6 mb-2">Status</h4>
                <v-chip
                  :color="selectedTemplate?.isActive ? 'green' : 'grey'"
                  size="small"
                  class="mb-2"
                >
                  {{ selectedTemplate?.isActive ? 'Active' : 'Inactive' }}
                </v-chip>
                <p class="text-body-2 mb-0">
                  Created: {{ formatDate(selectedTemplate?.createdAt) }}
                </p>
                <p class="text-body-2 mb-0">
                  Modified: {{ formatDate(selectedTemplate?.modifiedAt) }}
                </p>
              </v-card>
            </v-col>
          </v-row>

          <v-card class="pa-4" color="grey-lighten-5">
            <h4 class="text-h6 mb-2">Email Body Preview</h4>
            <div class="pa-2" style="background:#f9f9f9; border-radius:4px; min-height:200px" v-html="selectedTemplate?.body"></div>
          </v-card>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="viewDialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue-darken-2"
            @click="editFromView"
            class="ms-2"
          >
            Edit Template
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Test Send Dialog -->
    <v-dialog v-model="testDialog" max-width="500">
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-email-send</v-icon>
          Test Email Template
        </v-card-title>
        
        <v-card-text class="pa-6">
          <p class="mb-4">Send a test email to verify the template works correctly.</p>
          <v-text-field
            v-model="testEmail"
            label="Test Email Address"
            variant="outlined"
            type="email"
            :rules="[rules.required, rules.email]"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="testDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="orange-darken-2"
            @click="sendTestEmail"
            :loading="sendingTest"
            class="ms-2"
          >
            Send Test
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="pa-6 bg-red-lighten-5">
          <v-icon class="me-2" color="red-darken-3">mdi-delete</v-icon>
          Confirm Delete
        </v-card-title>
        
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete the template <strong>"{{ templateToDelete?.templateName }}"</strong>?</p>
          <p class="text-caption text-grey-darken-1 mt-2">This action cannot be undone.</p>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red-darken-2"
            @click="confirmDelete"
            :loading="store.loading"
            class="ms-2"
          >
            Delete
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
import { useEmailTemplateStore } from '@/stores/emailTemplate';
import type { EmailTemplate } from '@/stores/types/member';

const store = useEmailTemplateStore();

// Reactive data
const search = ref('');
const statusFilter = ref('all');
const sortBy = ref('modifiedAt');
const dialog = ref(false);
const viewDialog = ref(false);
const testDialog = ref(false);
const deleteDialog = ref(false);
const editMode = ref(false);
const isFormValid = ref(false);
const sendingTest = ref(false);
const selectedTemplate = ref<EmailTemplate | null>(null);
const templateToDelete = ref<EmailTemplate | null>(null);
const testEmail = ref('');

const form = ref();
const formData = ref({
  templateName: '',
  templateCode: '',
  subject: '',
  body: '',
  isActive: true
});

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

// Table headers
const headers = [
  { title: 'Template Name', key: 'templateName', sortable: true },
  { title: 'Template Code', key: 'templateCode', sortable: true },
  { title: 'Subject', key: 'subject', sortable: true },
  { title: 'Status', key: 'isActive', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: true },
  { title: 'Modified', key: 'modifiedAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
];

// Filter options
const statusOptions = [
  { title: 'All', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' }
];

const sortOptions = [
  { title: 'Recently Modified', value: 'modifiedAt' },
  { title: 'Name A-Z', value: 'templateName' },
  { title: 'Code A-Z', value: 'templateCode' },
  { title: 'Recently Created', value: 'createdAt' }
];

// Validation rules
const rules = {
  required: (value: any) => !!value || 'This field is required',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Invalid email format';
  },
  uniqueCode: (value: string) => {
    if (!value) return true;
    const existing = store.templates.find(t => 
      t.templateCode === value && 
      (!editMode.value || t.templateId !== selectedTemplate.value?.templateId)
    );
    return !existing || 'Template code must be unique';
  }
};

// Computed properties
const filteredTemplates = computed(() => {
  let filtered = store.templates;

  // Status filter
  if (statusFilter.value !== 'all') {
    const isActive = statusFilter.value === 'active';
    filtered = filtered.filter(t => t.isActive === isActive);
  }

  // Search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(t => 
      t.templateName.toLowerCase().includes(searchLower) ||
      t.templateCode.toLowerCase().includes(searchLower) ||
      t.subject.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
});

const totalTemplates = computed(() => store.templates.length);
const activeTemplates = computed(() => store.templates.filter(t => t.isActive).length);
const inactiveTemplates = computed(() => store.templates.filter(t => !t.isActive).length);
const recentTemplates = computed(() => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return store.templates.filter(t => new Date(t.modifiedAt) > oneWeekAgo).length;
});

// Methods
const openCreateDialog = () => {
  editMode.value = false;
  resetForm();
  dialog.value = true;
};

const editTemplate = (template: EmailTemplate) => {
  editMode.value = true;
  selectedTemplate.value = template;
  formData.value = { ...template };
  dialog.value = true;
};

const viewTemplate = (template: EmailTemplate) => {
  selectedTemplate.value = template;
  viewDialog.value = true;
};

const editFromView = () => {
  viewDialog.value = false;
  editTemplate(selectedTemplate.value!);
};

const cloneTemplate = (template: EmailTemplate) => {
  editMode.value = false;
  selectedTemplate.value = template;
  formData.value = {
    ...template,
    templateName: `${template.templateName} (Copy)`,
    templateCode: `${template.templateCode}_copy`
  };
  dialog.value = true;
};

const testTemplate = (template: EmailTemplate) => {
  selectedTemplate.value = template;
  testEmail.value = '';
  testDialog.value = true;
};

const deleteTemplate = (template: EmailTemplate) => {
  templateToDelete.value = template;
  deleteDialog.value = true;
};

const saveTemplate = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  try {
    if (editMode.value && selectedTemplate.value) {
      await store.updateTemplate(selectedTemplate.value.templateId, formData.value);
      showNotification('Template updated successfully!', 'success');
    } else {
      await store.createTemplate(formData.value);
      showNotification('Template created successfully!', 'success');
    }
    closeDialog();
  } catch (error: any) {
    showNotification(error.message || 'Failed to save template', 'error');
  }
};

const confirmDelete = async () => {
  if (!templateToDelete.value) return;

  try {
    await store.deleteTemplate(templateToDelete.value.templateId);
    showNotification('Template deleted successfully!', 'success');
    deleteDialog.value = false;
  } catch (error: any) {
    showNotification(error.message || 'Failed to delete template', 'error');
  }
};

const sendTestEmail = async () => {
  if (!testEmail.value || !selectedTemplate.value) return;

  sendingTest.value = true;
  try {
    // TODO: Implement actual test email API call
    // const response = await apiService.post('/api/v1/EmailTemplates/TestSend', {
    //   templateId: selectedTemplate.value.templateId,
    //   testEmail: testEmail.value
    // });
    
    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 2000));
    showNotification(`Test email sent to ${testEmail.value}`, 'success');
    testDialog.value = false;
  } catch (error: any) {
    showNotification(error.message || 'Failed to send test email', 'error');
  } finally {
    sendingTest.value = false;
  }
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    templateName: '',
    templateCode: '',
    subject: '',
    body: '',
    isActive: true
  };
  selectedTemplate.value = null;
  editMode.value = false;
};

const clearFilters = () => {
  search.value = '';
  statusFilter.value = 'all';
  sortBy.value = 'modifiedAt';
};

const retryLoad = async () => {
  try {
    await store.fetchTemplates();
  } catch (error: any) {
    console.error('Error retrying fetch:', error);
    showNotification(error.message || 'Failed to load templates', 'error');
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

const showNotification = (text: string, color: string) => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

onMounted(async () => {
  try {
    await store.fetchTemplates();
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    showNotification(error.message || 'Error loading templates', 'error');
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
.email-templates-view {
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
</style>

