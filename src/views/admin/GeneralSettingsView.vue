<template>
  <v-container class="py-8" max-width="600">
    <v-card>
      <v-card-title>
        <span class="text-h5">General Settings</span>
      </v-card-title>
      <v-card-subtitle>
        Configure your portal’s basic information and branding.
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="formValid" ref="formRef">
          <v-text-field
            v-model="settings.siteName"
            label="Site Name"
            :rules="[rules.required]"
            required
          />
          <v-text-field
            v-model="settings.companyName"
            label="Company Name"
            :rules="[rules.required]"
            required
          />
          <v-text-field
            v-model="settings.contactEmail"
            label="Contact Email"
            :rules="[rules.required, rules.email]"
            required
          />
          <v-text-field
            v-model="settings.phone"
            label="Contact Phone"
          />
          <v-file-input
            v-model="settings.logo"
            label="Upload Logo"
            accept="image/*"
            prepend-icon="mdi-image"
          />
          <v-switch
            v-model="settings.maintenanceMode"
            label="Enable Maintenance Mode"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveSettings" :disabled="!formValid">Save</v-btn>
        <v-btn text @click="resetForm">Reset</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formRef = ref();
const formValid = ref(false);

const settings = ref({
  siteName: '',
  companyName: '',
  contactEmail: '',
  phone: '',
  logo: null,
  maintenanceMode: false,
});

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
};

const snackbar = ref({ show: false, text: '', color: 'success' });

function saveSettings() {
  if (formRef.value?.validate()) {
    // TODO: Save logic (API call)
    snackbar.value = { show: true, text: 'Settings saved!', color: 'success' };
  }
}

function resetForm() {
  formRef.value?.reset();
}
</script>
