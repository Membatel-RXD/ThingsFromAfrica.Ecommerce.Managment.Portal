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
              <v-icon size="20" color="error" class="mr-1" style="cursor:pointer;" @click="deleteType(idx)">mdi-delete</v-icon>
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
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const dialog = ref(false);
const viewDialog = ref(false);
const editIndex = ref<number|null>(null);
const selectedType = ref<any>(null);
const selectedTypeIdx = ref<number|null>(null);
const discountTypes = ref([
  { typeName: 'Percentage', typeCode: 'PERCENT', isActive: true },
  { typeName: 'Fixed Amount', typeCode: 'FIXED', isActive: false }
]);
const form = ref({
  typeName: '',
  typeCode: '',
  isActive: true
});
function closeDialog() {
  dialog.value = false;
  editIndex.value = null;
  form.value = { typeName: '', typeCode: '', isActive: true };
}
function saveType() {
  if (editIndex.value === null) {
    discountTypes.value.push({ ...form.value });
  } else {
    discountTypes.value[editIndex.value] = { ...form.value };
  }
  closeDialog();
}
function editType(idx: number) {
  editIndex.value = idx;
  form.value = { ...discountTypes.value[idx] };
  dialog.value = true;
}
function deleteType(idx: number) {
  discountTypes.value.splice(idx, 1);
}
function viewType(idx: number) {
  selectedType.value = discountTypes.value[idx];
  selectedTypeIdx.value = idx;
  viewDialog.value = true;
}
function toggleActive(idx: number) {
  discountTypes.value[idx].isActive = !discountTypes.value[idx].isActive;
}
</script> 