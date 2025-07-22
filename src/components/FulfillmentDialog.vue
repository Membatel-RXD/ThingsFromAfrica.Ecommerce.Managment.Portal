<template>
  <v-dialog v-model="open" max-width="800" persistent>
    <v-card>
      <v-card-title class="pa-4">
        <v-icon class="me-2" :color="iconColor">{{ icon }}</v-icon>
        {{ dialogTitle }}
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-row v-if="type !== 'label'">
            <v-col cols="12">
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th v-if="type === 'packing'">Unit Price</th>
                    <th v-if="type === 'packing'">Total</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in localItems" :key="item.orderItemId">
                    <td>{{ item.productName }}</td>
                    <td><v-text-field v-model.number="localItems[idx].quantity" type="number" min="1" dense hide-details /></td>
                    <td v-if="type === 'packing'"><v-text-field v-model.number="localItems[idx].unitPrice" type="number" min="0" dense hide-details /></td>
                    <td v-if="type === 'packing'">{{ (item.quantity * item.unitPrice).toFixed(2) }}</td>
                    <td><v-btn icon="mdi-pencil" variant="text" size="small" @click="editRow(idx)" /></td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="localOrder.shippingFirstName" label="Shipping First Name" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="localOrder.shippingLastName" label="Shipping Last Name" dense />
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field v-model="localOrder.shippingAddressLine1" label="Shipping Address" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="localOrder.shippingCity" label="Shipping City" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="localOrder.shippingCountryName" label="Shipping Country" dense />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="localOrder.customerNotes" label="Customer Notes" rows="2" dense />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('close')">Cancel</v-btn>
        <v-btn color="success" @click="confirm">Download PDF</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
const props = defineProps({
  type: String, // 'picking', 'packing', 'label'
  order: Object,
  items: Array
});
const emit = defineEmits(['close', 'confirm']);
const open = ref(true);
const localOrder = ref({ ...props.order });
const localItems = ref(props.items ? JSON.parse(JSON.stringify(props.items)) : []);
watch(() => props.order, (val) => { localOrder.value = { ...val }; });
watch(() => props.items, (val) => { localItems.value = val ? JSON.parse(JSON.stringify(val)) : []; });
const dialogTitle = computed(() =>
  props.type === 'picking' ? `Picking List for Order #${localOrder.value.orderNumber}` :
  props.type === 'packing' ? `Packing Slip for Order #${localOrder.value.orderNumber}` :
  'Shipping Label'
);
const icon = computed(() =>
  props.type === 'picking' ? 'mdi-clipboard-list-outline' :
  props.type === 'packing' ? 'mdi-package-variant-closed' :
  'mdi-label'
);
const iconColor = computed(() =>
  props.type === 'picking' ? 'teal' :
  props.type === 'packing' ? 'brown' :
  'deep-purple'
);
function editRow(idx) {
  // Optionally open a more detailed edit dialog for the row
}
function confirm() {
  emit('confirm', { type: props.type, order: localOrder.value, items: localItems.value });
}
</script> 