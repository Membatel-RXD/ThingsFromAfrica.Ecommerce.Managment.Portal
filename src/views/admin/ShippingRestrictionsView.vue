<template>
  <div class="shipping-restrictions-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">Shipping Restrictions</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage country-specific shipping restrictions and requirements
          </p>
        </div>
        <v-btn
          color="orange-darken-2"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Add Restriction
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-alert</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalRestrictions }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Restrictions</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-earth</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ uniqueCountries }}</h3>
                <p class="text-body-2 text-green-darken-1">Countries</p>
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
                <p class="text-body-2 text-blue-darken-1">Active Restrictions</p>
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
                label="Search by Country, Wood Type, Requirements..."
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
                v-model="woodImportFilter"
                label="Allows Wood Imports?"
                :items="woodImportOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Shipping Restrictions Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-alert</v-icon>
          Shipping Restrictions Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredRestrictions"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.isActive="{ item }">
            <v-chip :color="item.isActive ? 'green' : 'grey'" size="small">
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>
          <template v-slot:item.allowsWoodImports="{ item }">
            <v-chip :color="item.allowsWoodImports ? 'green' : 'red'" size="small">
              {{ item.allowsWoodImports ? 'Allowed' : 'Not Allowed' }}
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
    </v-container>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="addDialog" max-width="700">
      <v-card>
        <v-card-title class="pa-4" style="background:#fff3e0;">
          <v-icon color="orange" class="me-2">mdi-alert</v-icon>
          {{ editMode ? 'Edit Restriction' : 'Add Restriction' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="addFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.countryCode" label="Country Code" prepend-inner-icon="mdi-earth" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.countryName" label="Country Name" prepend-inner-icon="mdi-earth" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.allowsWoodImports" label="Allows Wood Imports?" />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.requiresPhytosanitaryCertificate" label="Requires Phytosanitary Certificate?" />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.requiresCustomsDeclaration" label="Requires Customs Declaration?" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newItem.maxValueAllowed" label="Max Value Allowed" prepend-inner-icon="mdi-cash" type="number" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.restrictedWoodTypes" label="Restricted Wood Types" prepend-inner-icon="mdi-tree" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newItem.additionalRequirements" label="Additional Requirements" prepend-inner-icon="mdi-note-text" />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newItem.isActive" label="Active?" />
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
          <v-btn color="orange-darken-2" :disabled="!addFormValid" @click="editMode ? updateRestriction() : createRestriction()">{{ editMode ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="700">
      <v-card>
        <v-card-title class="pa-4 bg-blue-lighten-5">
          <v-icon color="blue" class="me-2">mdi-eye</v-icon>
          View Restriction
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
          Delete Restriction
        </v-card-title>
        <v-card-text class="pa-6">
          <p>Are you sure you want to delete this restriction?</p>
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
import { useShippingRestrictionStore } from '@/stores/shippingRestriction';
import { useSnackbarStore } from '@/stores/snackbar';

const shippingRestrictionStore = useShippingRestrictionStore();
const snackbar = useSnackbarStore();
const loading = computed(() => shippingRestrictionStore.loading);
const error = computed(() => shippingRestrictionStore.error);
const search = ref('');
const activeFilter = ref('All');
const woodImportFilter = ref('All');

const headers = [
  { title: 'ID', key: 'restrictionId' },
  { title: 'Country', key: 'countryName' },
  { title: 'Country Code', key: 'countryCode' },
  { title: 'Allows Wood Imports', key: 'allowsWoodImports' },
  { title: 'Requires Phytosanitary Certificate', key: 'requiresPhytosanitaryCertificate' },
  { title: 'Requires Customs Declaration', key: 'requiresCustomsDeclaration' },
  { title: 'Max Value Allowed', key: 'maxValueAllowed' },
  { title: 'Restricted Wood Types', key: 'restrictedWoodTypes' },
  { title: 'Additional Requirements', key: 'additionalRequirements' },
  { title: 'Active', key: 'isActive' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const activeOptions = ['All', 'Active', 'Inactive'];
const woodImportOptions = ['All', 'Allowed', 'Not Allowed'];

const filteredRestrictions = computed(() => {
  return shippingRestrictionStore.getRestrictions.filter(item => {
    const s = search.value.toLowerCase();
    const matchesSearch = !s ||
      item.countryName.toLowerCase().includes(s) ||
      item.countryCode.toLowerCase().includes(s) ||
      (item.restrictedWoodTypes && item.restrictedWoodTypes.toLowerCase().includes(s)) ||
      (item.additionalRequirements && item.additionalRequirements.toLowerCase().includes(s));
    const matchesActive = activeFilter.value === 'All' ||
      (activeFilter.value === 'Active' && item.isActive) ||
      (activeFilter.value === 'Inactive' && !item.isActive);
    const matchesWoodImport = woodImportFilter.value === 'All' ||
      (woodImportFilter.value === 'Allowed' && item.allowsWoodImports) ||
      (woodImportFilter.value === 'Not Allowed' && !item.allowsWoodImports);
    return matchesSearch && matchesActive && matchesWoodImport;
  });
});

// Stats
const totalRestrictions = computed(() => shippingRestrictionStore.getRestrictions.length);
const uniqueCountries = computed(() => new Set(shippingRestrictionStore.getRestrictions.map(item => item.countryCode)).size);
const activeCount = computed(() => shippingRestrictionStore.getRestrictions.filter(i => i.isActive).length);

const addDialog = ref(false);
const addForm = ref();
const addFormValid = ref(false);
const newItem = ref({
  countryCode: '',
  countryName: '',
  allowsWoodImports: true,
  requiresPhytosanitaryCertificate: false,
  requiresCustomsDeclaration: false,
  maxValueAllowed: '',
  restrictedWoodTypes: '',
  additionalRequirements: '',
  isActive: true,
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
const openCreateDialog = () => {
  addDialog.value = true;
  editMode.value = false;
  Object.assign(newItem.value, {
    countryCode: '',
    countryName: '',
    allowsWoodImports: true,
    requiresPhytosanitaryCertificate: false,
    requiresCustomsDeclaration: false,
    maxValueAllowed: '',
    restrictedWoodTypes: '',
    additionalRequirements: '',
    isActive: true,
    createdAt: '',
  });
};
const createRestriction = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    countryCode: newItem.value.countryCode,
    countryName: newItem.value.countryName,
    allowsWoodImports: newItem.value.allowsWoodImports,
    requiresPhytosanitaryCertificate: newItem.value.requiresPhytosanitaryCertificate,
    requiresCustomsDeclaration: newItem.value.requiresCustomsDeclaration,
    maxValueAllowed: newItem.value.maxValueAllowed ? Number(newItem.value.maxValueAllowed) : undefined,
    restrictedWoodTypes: newItem.value.restrictedWoodTypes,
    additionalRequirements: newItem.value.additionalRequirements,
    isActive: newItem.value.isActive,
  };
  await shippingRestrictionStore.addRestriction(payload);
  if (shippingRestrictionStore.error) {
    snackbar.error(shippingRestrictionStore.error);
  } else {
    snackbar.success('Shipping restriction added successfully');
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
  Object.assign(newItem.value, { ...item });
};
const updateRestriction = async () => {
  if (!addForm.value?.validate()) return;
  const payload = {
    countryCode: newItem.value.countryCode,
    countryName: newItem.value.countryName,
    allowsWoodImports: newItem.value.allowsWoodImports,
    requiresPhytosanitaryCertificate: newItem.value.requiresPhytosanitaryCertificate,
    requiresCustomsDeclaration: newItem.value.requiresCustomsDeclaration,
    maxValueAllowed: newItem.value.maxValueAllowed ? Number(newItem.value.maxValueAllowed) : undefined,
    restrictedWoodTypes: newItem.value.restrictedWoodTypes,
    additionalRequirements: newItem.value.additionalRequirements,
    isActive: newItem.value.isActive,
  };
  await shippingRestrictionStore.updateRestriction(Number(newItem.value.restrictionId), payload);
  if (shippingRestrictionStore.error) {
    snackbar.error(shippingRestrictionStore.error);
  } else {
    snackbar.success('Shipping restriction updated successfully');
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
    await shippingRestrictionStore.deleteRestriction(itemToDelete.value.restrictionId);
    if (shippingRestrictionStore.error) {
      snackbar.error(shippingRestrictionStore.error);
    } else {
      snackbar.success('Shipping restriction deleted successfully');
    }
  }
  deleteDialog.value = false;
  itemToDelete.value = null;
};
const toggleStatus = async (item: any) => {
  await shippingRestrictionStore.updateRestriction(item.restrictionId, { isActive: !item.isActive });
  if (shippingRestrictionStore.error) {
    snackbar.error(shippingRestrictionStore.error);
  } else {
    snackbar.success('Shipping restriction status updated');
  }
};
const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  shippingRestrictionStore.fetchRestrictions();
});
</script>

<style scoped>
.shipping-restrictions-view {
  background: #f8f9fa;
}
</style> 