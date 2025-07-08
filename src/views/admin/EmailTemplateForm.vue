<template>
  <v-card>
    <v-card-title class="font-weight-bold">
      {{ editMode ? 'Edit Template' : 'Create Template' }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-text-field
          v-model="formData.templateName"
          label="Template Name"
          :rules="[rules.required]"
          required
          class="mb-3"
        />
        <v-text-field
          v-model="formData.templateCode"
          label="Template Code"
          :rules="[rules.required]"
          required
          class="mb-3"
        />
        <v-text-field
          v-model="formData.subject"
          label="Subject"
          :rules="[rules.required]"
          required
          class="mb-3"
        />
        <v-textarea
          v-model="formData.body"
          label="Body (HTML supported)"
          :rules="[rules.required]"
          auto-grow
          rows="5"
          class="mb-3"
        />
        <v-switch
          v-model="formData.isActive"
          label="Active"
          color="success"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="$emit('cancel')">Cancel</v-btn>
      <v-btn color="primary" :disabled="!valid" @click="submit">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
const props = defineProps({
  template: { type: Object, default: null },
  editMode: { type: Boolean, default: false },
});
const emit = defineEmits(['save', 'cancel']);

const valid = ref(false);
const form = ref();
const formData = ref({
  templateName: '',
  templateCode: '',
  subject: '',
  body: '',
  isActive: true,
});

const rules = {
  required: (v: string) => !!v || 'Required',
};

watch(
  () => props.template,
  (val) => {
    if (val) {
      formData.value = {
        templateName: val.templateName || '',
        templateCode: val.templateCode || '',
        subject: val.subject || '',
        body: val.body || '',
        isActive: val.isActive ?? true,
      };
    } else {
      formData.value = {
        templateName: '',
        templateCode: '',
        subject: '',
        body: '',
        isActive: true,
      };
    }
  },
  { immediate: true }
);

function submit() {
  if (!valid.value) return;
  emit('save', { ...formData.value });
}
</script> 