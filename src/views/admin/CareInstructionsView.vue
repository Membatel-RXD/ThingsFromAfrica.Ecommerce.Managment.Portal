<template>
  <div style="padding: 20px;">
    <!-- Header -->
    <div style="background: #fff3e0;" class="pa-4 d-flex align-center mb-2">
      <v-icon color="orange-darken-2" class="mr-2">mdi-information-outline</v-icon>
      <span class="text-h5 font-weight-bold text-orange-darken-4">Care Instructions Management</span>
      <v-spacer />
      <v-btn color="orange-darken-2" @click="dialog = true">Add New</v-btn>
    </div>
    <v-card class="pa-0">
      <v-table>
        <thead>
          <tr>
            <th style="width: 100px;">Sort Order <v-icon small>mdi-arrow-up</v-icon></th>
            <th>Type</th>
            <th>Instruction</th>
            <th>Important</th>
            <th>Product</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pagedInstructions" :key="idx">
            <td>{{ item.sortOrder }}</td>
            <td>{{ item.instructionType }}</td>
            <td>
              <span :title="item.instruction">
                {{ item.instruction.length > 40 ? item.instruction.slice(0, 40) + '...' : item.instruction }}
              </span>
            </td>
            <td>
              <v-chip :color="item.isImportant ? 'success' : 'grey'" size="small" class="text-white">
                {{ item.isImportant ? 'Important' : 'Standard' }}
              </v-chip>
            </td>
            <td>{{ getProductName(item.productId) }}</td>
            <td>
              <v-icon size="20" color="primary" class="mr-1" style="cursor:pointer;" @click="editInstruction(idx)">mdi-pencil</v-icon>
              <v-icon size="20" color="error" class="mr-1" style="cursor:pointer;" @click="deleteInstruction(idx)">mdi-delete</v-icon>
              <v-icon size="20" color="blue" style="cursor:pointer;" @click="viewInstruction(idx)">mdi-eye</v-icon>
            </td>
          </tr>
          <tr v-if="pagedInstructions.length === 0">
            <td colspan="6" class="text-center text-grey">No care instructions found.</td>
          </tr>
        </tbody>
      </v-table>
      <!-- Pagination -->
      <div class="d-flex justify-end align-center pa-2">
        <span class="mr-2">Items per page:</span>
        <v-select v-model="itemsPerPage" :items="[5, 10, 20]" dense hide-details style="max-width: 70px;" />
        <span class="mx-2">{{ pageStart + 1 }}-{{ pageEnd }} of {{ careInstructions.length }}</span>
        <v-btn icon :disabled="page === 1" @click="page--"><v-icon>mdi-chevron-left</v-icon></v-btn>
        <v-btn icon :disabled="pageEnd >= careInstructions.length" @click="page++"><v-icon>mdi-chevron-right</v-icon></v-btn>
      </div>
    </v-card>
    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editIndex === null ? 'Add Care Instruction' : 'Edit Care Instruction' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveInstruction">
            <v-select v-model="form.productId" :items="productOptions" label="Product" class="mb-2" />
            <v-select v-model="form.instructionType" :items="instructionTypes" label="Instruction Type" class="mb-2" />
            <v-textarea v-model="form.instruction" label="Instruction" class="mb-2" />
            <v-switch v-model="form.isImportant" label="Is Important" color="error" class="mb-2" />
            <v-text-field v-model.number="form.sortOrder" label="Sort Order" type="number" class="mb-2" />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="orange-darken-2" @click="saveInstruction">{{ editIndex === null ? 'Create' : 'Update' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewDialog" max-width="500px">
      <v-card>
        <div class="d-flex align-center pa-4" style="background: #fff3e0;">
          <v-icon color="orange-darken-2" class="mr-2">mdi-information-outline</v-icon>
          <span class="text-h6 font-weight-bold text-orange-darken-4">Care Instruction</span>
        </div>
        <v-card-text>
          <div v-if="selectedInstruction">
            <div class="mb-2"><b>Type:</b> {{ selectedInstruction.instructionType }}</div>
            <div class="mb-2"><b>Instruction:</b> {{ selectedInstruction.instruction }}</div>
            <div class="mb-2"><b>Sort Order:</b> {{ selectedInstruction.sortOrder }}</div>
            <div class="mb-2"><b>Created At:</b> {{ selectedInstruction.createdAt || '—' }}</div>
            <div class="mb-2"><b>Product:</b> {{ getProductName(selectedInstruction.productId) }}</div>
            <div class="mt-2">
              <v-chip :color="selectedInstruction.isImportant ? 'success' : 'grey'" size="small" class="text-white mr-2">
                {{ selectedInstruction.isImportant ? 'Important' : 'Standard' }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn variant="text" @click="viewDialog = false">Close</v-btn>
          <v-btn color="orange-darken-2" @click="editInstruction(selectedInstructionIdx)">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
const dialog = ref(false);
const editIndex = ref<number|null>(null);
const instructionTypes = ['Cleaning', 'Storage', 'Usage', 'Other'];
const productOptions = [
  { title: 'Office Desk', value: 1 },
  { title: 'Wooden Bowl', value: 2 },
  { title: 'Handmade Chair', value: 3 }
];
const careInstructions = ref([
  { productId: 1, instructionType: 'Cleaning', instruction: 'Wipe with a dry cloth.', isImportant: true, sortOrder: 1 },
  { productId: 2, instructionType: 'Storage', instruction: 'Store in a cool, dry place.', isImportant: false, sortOrder: 2 }
]);
const form = ref({
  productId: null,
  instructionType: '',
  instruction: '',
  isImportant: false,
  sortOrder: 1
});
const itemsPerPage = ref(5);
const page = ref(1);
const pageStart = computed(() => (page.value - 1) * itemsPerPage.value);
const pageEnd = computed(() => Math.min(page.value * itemsPerPage.value, careInstructions.value.length));
const pagedInstructions = computed(() => careInstructions.value.slice(pageStart.value, pageEnd.value));
const viewDialog = ref(false);
const selectedInstruction = ref<any>(null);
const selectedInstructionIdx = ref<number|null>(null);
function getProductName(productId: number) {
  const prod = productOptions.find(p => p.value === productId);
  return prod ? prod.title : '—';
}
function closeDialog() {
  dialog.value = false;
  editIndex.value = null;
  form.value = { productId: null, instructionType: '', instruction: '', isImportant: false, sortOrder: 1 };
}
function saveInstruction() {
  if (editIndex.value === null) {
    careInstructions.value.push({ ...form.value });
  } else {
    careInstructions.value[editIndex.value] = { ...form.value };
  }
  closeDialog();
}
function editInstruction(idx: number) {
  editIndex.value = idx;
  form.value = { ...careInstructions.value[idx] };
  dialog.value = true;
}
function deleteInstruction(idx: number) {
  careInstructions.value.splice(idx, 1);
}
function viewInstruction(idx: number) {
  selectedInstruction.value = careInstructions.value[idx];
  selectedInstructionIdx.value = idx;
  viewDialog.value = true;
}
</script> 