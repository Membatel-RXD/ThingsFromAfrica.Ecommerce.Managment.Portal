<template>
  <v-footer app color="transparent">
    <v-col class="pa-3">
      <v-row class="justify-center align-center"></v-row>
      <v-row class="justify-center">
        <div>Things From Africa &copy; {{ new Date().getFullYear() }}</div>
      </v-row>
    </v-col>
  </v-footer>
</template>

<script lang="ts">
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
</style>
