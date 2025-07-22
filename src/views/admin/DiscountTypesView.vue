<template>
  <div style="padding: 20px;">
    <!-- Header -->
    <div style="background: #fff3e0;" class="pa-4 d-flex align-center mb-2">
      <v-icon color="orange-darken-2" class="mr-2">mdi-tag</v-icon>
      <span class="text-h5 font-weight-bold text-orange-darken-4">Discount Types Management</span>
      <v-spacer />
      <v-btn color="orange-darken-2" @click="dialog = true">Add New</v-btn>
    </div>
    <v-card class="pa-0">
      <v-table>
        <thead>
          <tr>
            <th>Type Name</th>
            <th>Type Code</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in discountTypes" :key="idx">
            <td>{{ item.typeName }}</td>
            <td>{{ item.typeCode }}</td>
            <td>
              <v-chip :color="item.isActive ? 'success' : 'grey'" size="small" class="text-white">
                {{ item.isActive ? 'Active' : 'Inactive' }}
              </v-chip>
            </td>
            <td>
              <v-icon
                size="20"
                :color="item.isActive ? 'success' : 'error'"
                class="mr-1"
                style="cursor:pointer;"
                @click="toggleActive(idx)"
                :title="item.isActive ? 'Set Inactive' : 'Set Active'"
              >
                mdi-power
              </v-icon>
              <v-icon size="20" color="primary" class="mr-1" style="cursor:pointer;" @click="editType(idx)">mdi-pencil</v-icon>
              <v-icon size="20" color="error" class="mr-1" style="cursor:pointer;" @click="askDeleteType(idx)">mdi-delete</v-icon>
              <v-icon size="20" color="blue" style="cursor:pointer;" @click="viewType(idx)">mdi-eye</v-icon>
            </td>
          </tr>
          <tr v-if="discountTypes.length === 0">
            <td colspan="4" class="text-center text-grey">No discount types found.</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title>{{ editIndex === null ? 'Add Discount Type' : 'Edit Discount Type' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveType">
            <v-text-field v-model="form.typeName" label="Type Name" class="mb-2" />
            <v-text-field v-model="form.typeCode" label="Type Code" class="mb-2" />
            <v-switch v-model="form.isActive" label="Is Active" color="success" class="mb-2" />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="orange-darken-2" @click="saveType">{{ editIndex === null ? 'Create' : 'Update' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="400px">
      <v-card>
        <div class="d-flex align-center pa-4" style="background: #fff3e0;">
          <v-icon color="orange-darken-2" class="mr-2">mdi-tag</v-icon>
          <span class="text-h6 font-weight-bold text-orange-darken-4">Discount Type</span>
        </div>
        <v-card-text>
          <div v-if="selectedType">
            <div class="mb-2"><b>Type Name:</b> {{ selectedType.typeName }}</div>
            <div class="mb-2"><b>Type Code:</b> {{ selectedType.typeCode }}</div>
            <div class="mb-2"><b>Status:</b>
              <v-chip :color="selectedType.isActive ? 'success' : 'grey'" size="small" class="text-white">
                {{ selectedType.isActive ? 'Active' : 'Inactive' }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn variant="text" @click="viewDialog = false">Close</v-btn>
          <v-btn color="orange-darken-2" @click="selectedTypeIdx !== null && editType(selectedTypeIdx)">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="pa-6 bg-red-lighten-5">
          <v-icon class="me-2" color="red-darken-3">mdi-delete</v-icon>
          Confirm Delete
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this discount type?</p>
          <p class="text-caption text-grey-darken-1 mt-2">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-2" @click="confirmDeleteType" :loading="loading" class="ms-2">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api';
import { useSnackbarStore } from '@/stores/snackbar';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const snackbar = useSnackbarStore();

const dialog = ref(false);
const viewDialog = ref(false);
const editIndex = ref<number|null>(null);
const selectedType = ref<any>(null);
const selectedTypeIdx = ref<number|null>(null);
const discountTypes = ref<any[]>([]);
const loading = ref(false);
const error = ref('');
const form = ref({
  typeName: '',
  typeCode: '',
  isActive: true
});
const deleteDialog = ref(false);
const deleteIndex = ref<number|null>(null);

async function fetchDiscountTypes() {
  loading.value = true;
  error.value = '';
  try {
    const res = await apiService.get(`${API_BASE}DiscountTypes/GetAll`);
    if (res.isSuccessful && Array.isArray(res.payload)) {
      discountTypes.value = res.payload;
    } else {
      error.value = res.remark || 'Failed to fetch discount types.';
      snackbar.error(error.value);
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to fetch discount types.';
    snackbar.error(error.value);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDiscountTypes);

function closeDialog() {
  dialog.value = false;
  editIndex.value = null;
  form.value = { typeName: '', typeCode: '', isActive: true };
}

async function saveType() {
  loading.value = true;
  error.value = '';
  try {
    if (editIndex.value === null) {
      // Create
      const res = await apiService.post(`${API_BASE}DiscountTypes/Add`, { ...form.value });
      if (res.isSuccessful && res.payload) {
        discountTypes.value.push(res.payload);
        snackbar.success('Discount type created successfully');
        closeDialog();
      } else {
        error.value = res.remark || 'Failed to add discount type.';
        snackbar.error(error.value);
      }
    } else {
      // Update
      const id = discountTypes.value[editIndex.value].discountTypeId;
      const res = await apiService.put(`${API_BASE}DiscountTypes/Update?discounttypeid=${id}`, { ...form.value, discountTypeId: id });
      if (res.isSuccessful && res.payload) {
        discountTypes.value[editIndex.value] = res.payload;
        snackbar.success('Discount type updated successfully');
        closeDialog();
      } else {
        error.value = res.remark || 'Failed to update discount type.';
        snackbar.error(error.value);
      }
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to save discount type.';
    snackbar.error(error.value);
  } finally {
    loading.value = false;
  }
}

function editType(idx: number) {
  editIndex.value = idx;
  form.value = { ...discountTypes.value[idx] };
  dialog.value = true;
}

function askDeleteType(idx: number) {
  deleteIndex.value = idx;
  deleteDialog.value = true;
}

async function confirmDeleteType() {
  if (deleteIndex.value === null) return;
  const idx = deleteIndex.value;
  const id = discountTypes.value[idx].discountTypeId;
  loading.value = true;
  error.value = '';
  try {
    const res = await apiService.delete(`${API_BASE}DiscountTypes/Delete?discounttypeid=${id}`);
    if (res.isSuccessful) {
      discountTypes.value.splice(idx, 1);
      snackbar.success('Discount type deleted successfully');
    } else {
      error.value = res.remark || 'Failed to delete discount type.';
      snackbar.error(error.value);
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to delete discount type.';
    snackbar.error(error.value);
  } finally {
    loading.value = false;
    deleteDialog.value = false;
    deleteIndex.value = null;
  }
}

async function viewType(idx: number) {
  const id = discountTypes.value[idx].discountTypeId;
  loading.value = true;
  error.value = '';
  try {
    const res = await apiService.get(`${API_BASE}DiscountTypes/GetById?discounttypeid=${id}`);
    if (res.isSuccessful && res.payload) {
      selectedType.value = res.payload;
      selectedTypeIdx.value = idx;
      viewDialog.value = true;
    } else {
      error.value = res.remark || 'Failed to fetch discount type.';
      snackbar.error(error.value);
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to fetch discount type.';
    snackbar.error(error.value);
  } finally {
    loading.value = false;
  }
}

async function toggleActive(idx: number) {
  const item = discountTypes.value[idx];
  const id = item.discountTypeId;
  loading.value = true;
  error.value = '';
  try {
    const updated = { ...item, isActive: !item.isActive };
    const res = await apiService.put(`${API_BASE}DiscountTypes/Update?discounttypeid=${id}`, { ...updated });
    if (res.isSuccessful && res.payload) {
      discountTypes.value[idx] = res.payload;
      snackbar.success(`Discount type ${updated.isActive ? 'activated' : 'deactivated'} successfully`);
    } else {
      error.value = res.remark || 'Failed to update status.';
      snackbar.error(error.value);
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to update status.';
    snackbar.error(error.value);
  } finally {
    loading.value = false;
  }
}
</script> 