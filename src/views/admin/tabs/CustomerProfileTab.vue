<template>
  <div>
    <h3>Profile Tab</h3>
    <div>Name: {{ customer.name }}</div>
    <div>Type: {{ customer.type || '—' }}</div>
    <!-- Add more fields as needed -->
    <div class="mt-2 text-grey">(Profile details go here)</div>
  </div>
</template>
<script setup>
const props = defineProps({ customer: Object });
</script> 