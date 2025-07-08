<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h2 class="text-h5 font-weight-bold">Email Templates</h2>
        <v-btn color="#f5810a" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>
          Add Template
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="Search templates"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mb-4"
        />
        <v-data-table
          :headers="headers"
          :items="filteredTemplates"
          :loading="store.loading"
          loading-text="Loading templates..."
          item-key="templateId"
          class="elevation-1"
        >
          <template #item.isActive="{ item }">
            <v-chip :color="item.isActive ? 'green' : 'grey'" small>{{ item.isActive ? 'Active' : 'Inactive' }}</v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn icon size="small" @click="openViewDialog(item)"><v-icon>mdi-eye</v-icon></v-btn>
            <v-btn icon size="small" @click="openEditDialog(item)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon size="small" @click="toggleActive(item)"><v-icon>{{ item.isActive ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off' }}</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <EmailTemplateForm
        :template="selectedTemplate"
        :edit-mode="editMode"
        @save="onSave"
        @cancel="closeDialog"
      />
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card>
        <v-card-title class="font-weight-bold">Template Details</v-card-title>
        <v-card-text>
          <div><strong>Name:</strong> {{ selectedTemplate?.templateName }}</div>
          <div><strong>Code:</strong> {{ selectedTemplate?.templateCode }}</div>
          <div><strong>Subject:</strong> {{ selectedTemplate?.subject }}</div>
          <div class="mt-2"><strong>Body:</strong></div>
          <div class="pa-2" style="background:#f9f9f9; border-radius:4px; min-height:80px" v-html="selectedTemplate?.body"></div>
          <div class="mt-2"><strong>Status:</strong> <v-chip :color="selectedTemplate?.isActive ? 'green' : 'grey'" small>{{ selectedTemplate?.isActive ? 'Active' : 'Inactive' }}</v-chip></div>
          <div class="mt-2"><strong>Created:</strong> {{ formatDate(selectedTemplate?.createdAt) }}</div>
          <div><strong>Modified:</strong> {{ formatDate(selectedTemplate?.modifiedAt) }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEmailTemplateStore } from '@/stores/emailTemplate';
import EmailTemplateForm from './EmailTemplateForm.vue';

const store = useEmailTemplateStore();
const search = ref('');
const dialog = ref(false);
const viewDialog = ref(false);
const editMode = ref(false);
const selectedTemplate = ref(null);

const headers = [
  { title: 'Name', key: 'templateName' },
  { title: 'Code', key: 'templateCode' },
  { title: 'Subject', key: 'subject' },
  { title: 'Status', key: 'isActive', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
];

const filteredTemplates = computed(() => {
  if (!search.value) return store.templates;
  const q = search.value.toLowerCase();
  return store.templates.filter(t =>
    t.templateName.toLowerCase().includes(q) ||
    t.templateCode.toLowerCase().includes(q) ||
    t.subject.toLowerCase().includes(q)
  );
});

function openCreateDialog() {
  selectedTemplate.value = null;
  editMode.value = false;
  dialog.value = true;
}
function openEditDialog(template) {
  selectedTemplate.value = { ...template };
  editMode.value = true;
  dialog.value = true;
}
function openViewDialog(template) {
  selectedTemplate.value = { ...template };
  viewDialog.value = true;
}
function closeDialog() {
  dialog.value = false;
}
async function onSave(data) {
  if (editMode.value && selectedTemplate.value) {
    await store.updateTemplate(selectedTemplate.value.templateId, data);
  } else {
    await store.createTemplate(data);
  }
  dialog.value = false;
  await store.fetchTemplates();
}
async function toggleActive(template) {
  await store.updateTemplate(template.templateId, { isActive: !template.isActive });
  await store.fetchTemplates();
}
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString();
}
onMounted(() => {
  store.fetchTemplates();
});
</script>

