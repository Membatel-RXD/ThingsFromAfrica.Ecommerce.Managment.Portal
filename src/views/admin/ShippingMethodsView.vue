<template>
  <div class="shipping-methods-view">
    <v-container fluid class="pa-6 shipping-methods-main-container">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Shipping Methods</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage all available shipping methods
          </p>
        </div>
        <v-btn
          color="orange-darken-2"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Add Shipping Method
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-truck-fast</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalMethods }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Methods</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-earth</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ internationalCount }}</h3>
                <p class="text-body-2 text-green-darken-1">International Methods</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ activeCount }}</h3>
                <p class="text-body-2 text-blue-darken-1">Active Methods</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                label="Search by Name, Code, Description..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="activeFilter"
                label="Active Status"
                :items="activeOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="internationalFilter"
                label="International?"
                :items="internationalOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Shipping Methods Data Table -->
      <div class="table-scroll-area">
        <v-card>
          <v-card-title class="pa-6 bg-orange-lighten-5">
            <v-icon class="me-2" color="orange-darken-3">mdi-truck-fast</v-icon>
            Shipping Methods Management
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="filteredMethods"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.isActive="{ item }">
              <v-chip :color="item.isActive ? 'green' : 'grey'" size="small">
                {{ item.isActive ? 'Active' : 'Inactive' }}
              </v-chip>
            </template>
            <template v-slot:item.isInternational="{ item }">
              <v-chip :color="item.isInternational ? 'blue' : 'orange'" size="small">
                {{ item.isInternational ? 'International' : 'Domestic' }}
              </v-chip>
            </template>
            <template v-slot:item.createdAt="{ item }">
              <span>{{ formatDate(item.createdAt) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn :icon="item.isActive ? 'mdi-check-circle' : 'mdi-cancel'"
                     variant="text"
                     size="small"
                     :color="item.isActive ? 'green' : 'grey'"
                     @click="toggleStatus(item)"
                     :title="item.isActive ? 'Deactivate' : 'Activate'"
              />
              <v-btn icon="mdi-eye" variant="text" size="small" color="blue" @click="viewItem(item)" />
              <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="editItem(item)" />
              <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteItem(item)" />
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-container>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="addDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4" style="background:#fff3e0;">
          <v-icon color="orange" class="me-2">mdi-truck-fast</v-icon>
          {{ editMode ? 'Edit Shipping Method' : 'Add Shipping Method' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.methodName" label="Method Name" prepend-inner-icon="mdi-truck" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.methodCode" label="Method Code" prepend-inner-icon="mdi-barcode" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.description" label="Description" prepend-inner-icon="mdi-note-text" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.estimatedDays" label="Estimated Days" prepend-inner-icon="mdi-calendar" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.sortOrder" label="Sort Order" prepend-inner-icon="mdi-sort" type="number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.isActive" label="Active?" />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.isInternational" label="International?" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.createdAt" label="Created At" prepend-inner-icon="mdi-calendar" type="date" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateMethod() : createMethod()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4 bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          View Shipping Method
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(value, key) in selectedItem" :key="key">
              <v-list-item-title class="font-weight-bold">{{ key }}</v-list-item-title>
              <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-red-lighten-4 text-red-darken-3">
          <v-icon class="me-2">mdi-delete</v-icon>
          Delete Shipping Method
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this shipping method?</p>
          <p class="text-caption text-grey-darken-1 mt-2">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-2" variant="elevated" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useShippingMethodStore } from '@/stores/shippingMethod';
import { useSnackbarStore } from '@/stores/snackbar';

const shippingMethodStore = useShippingMethodStore();
const loading = computed(() => shippingMethodStore.loading);
const error = computed(() => shippingMethodStore.error);
const search = ref('');
const activeFilter = ref('All');
const internationalFilter = ref('All');

const headers = [
  { title: 'ID', key: 'shippingMethodId' },
  { title: 'Name', key: 'methodName' },
  { title: 'Code', key: 'methodCode' },
  { title: 'Description', key: 'description' },
  { title: 'Estimated Days', key: 'estimatedDays' },
  { title: 'Active', key: 'isActive' },
  { title: 'International', key: 'isInternational' },
  { title: 'Sort Order', key: 'sortOrder' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const activeOptions = ['All', 'Active', 'Inactive'];
const internationalOptions = ['All', 'International', 'Domestic'];

const filteredMethods = computed(() => {
  return shippingMethodStore.getMethods.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.methodName.toLowerCase().includes(s) ||
      item.methodCode.toLowerCase().includes(s) ||
      (item.description && item.description.toLowerCase().includes(s));
    const matchesActive = activeFilter.value === 'All' ||
      (activeFilter.value === 'Active' && item.isActive) ||
      (activeFilter.value === 'Inactive' && !item.isActive);
    const matchesInternational = internationalFilter.value === 'All' ||
      (internationalFilter.value === 'International' && item.isInternational) ||
      (internationalFilter.value === 'Domestic' && !item.isInternational);
    return matchesSearch && matchesActive && matchesInternational;
  });
});

// Stats
const totalMethods = computed(() => shippingMethodStore.getMethods.length);
const internationalCount = computed(() => shippingMethodStore.getInternationalMethods.length);
const activeCount = computed(() => shippingMethodStore.getActiveMethods.length);

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref({
  shippingMethodId: '', // was undefined
  methodName: '',
  methodCode: '',
  description: '',
  estimatedDays: '',
  isActive: true,
  isInternational: false,
  sortOrder: '',
  createdAt: '',
});
const editMode = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const selectedItem = ref<any>(null);
const itemToDelete = ref<any>(null);
const rules = {
  required: (v: any) => !!v || 'Required',
};
const snackbar = useSnackbarStore();
const openCreateDialog = () => {
  addDialog.value = true;
  editMode.value = false;
  Object.assign(newItem.value, {
    shippingMethodId: '',
    methodName: '',
    methodCode: '',
    description: '',
    estimatedDays: '',
    isActive: true,
    isInternational: false,
    sortOrder: '',
    createdAt: '',
  });
};
const createMethod = async () => {
  if (!addForm.value?.validate()) return;
  await shippingMethodStore.addMethod({
    methodName: newItem.value.methodName,
    methodCode: newItem.value.methodCode,
    description: newItem.value.description,
    estimatedDays: newItem.value.estimatedDays,
    isActive: newItem.value.isActive,
    isInternational: newItem.value.isInternational,
    sortOrder: newItem.value.sortOrder ? Number(newItem.value.sortOrder) : undefined,
  });
  if (shippingMethodStore.error) {
    snackbar.error(shippingMethodStore.error);
  } else {
    snackbar.success('Shipping method added successfully');
  }
  addDialog.value = false;
};
const viewItem = (item: any) => {
  selectedItem.value = { ...item };
  viewDialog.value = true;
};
const editItem = (item: any) => {
  editMode.value = true;
  addDialog.value = true;
  Object.assign(newItem.value, {
    shippingMethodId: item.shippingMethodId ?? '',
    methodName: item.methodName ?? '',
    methodCode: item.methodCode ?? '',
    description: item.description ?? '',
    estimatedDays: item.estimatedDays ?? '',
    isActive: item.isActive ?? true,
    isInternational: item.isInternational ?? false,
    sortOrder: item.sortOrder ?? '',
    createdAt: item.createdAt ?? '',
  });
};
const updateMethod = async () => {
  if (!addForm.value?.validate()) return;
  if (typeof newItem.value.shippingMethodId !== 'number') {
    snackbar.error('Invalid shipping method ID');
    return;
  }
  await shippingMethodStore.updateMethod(newItem.value.shippingMethodId, {
    methodName: newItem.value.methodName,
    methodCode: typeof newItem.value.methodCode === 'string' ? newItem.value.methodCode : '',
    description: newItem.value.description,
    estimatedDays: newItem.value.estimatedDays,
    isActive: newItem.value.isActive,
    isInternational: newItem.value.isInternational,
    sortOrder: newItem.value.sortOrder ? Number(newItem.value.sortOrder) : 0,
  });
  await shippingMethodStore.fetchMethods();
  if (shippingMethodStore.error) {
    snackbar.error(shippingMethodStore.error);
  } else {
    snackbar.success('Shipping method updated successfully');
  }
  addDialog.value = false;
  editMode.value = false;
};
const deleteItem = (item: any) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};
const confirmDelete = async () => {
  if (itemToDelete.value) {
    await shippingMethodStore.deleteMethod(itemToDelete.value.shippingMethodId);
    if (shippingMethodStore.error) {
      snackbar.error(shippingMethodStore.error);
    } else {
      snackbar.success('Shipping method deleted successfully');
      await shippingMethodStore.fetchMethods(); // Refresh the table after delete
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};
const toggleStatus = async (item: any) => {
  await shippingMethodStore.updateMethod(item.shippingMethodId, { isActive: !item.isActive });
  if (shippingMethodStore.error) {
    snackbar.error(shippingMethodStore.error);
  } else {
    snackbar.success('Shipping method status updated');
    await shippingMethodStore.fetchMethods(); // Refresh the table
  }
};
const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  shippingMethodStore.fetchMethods();
});
</script>

<style scoped>
.shipping-methods-view {
  background: #f8f9fa;
}
.shipping-methods-main-container {
  min-height: 100vh;
}
.table-scroll-area {
  /* No flex, no min-height, no max-height, no overflow */
}
.v-footer {
  margin-top: auto;
}
</style> 