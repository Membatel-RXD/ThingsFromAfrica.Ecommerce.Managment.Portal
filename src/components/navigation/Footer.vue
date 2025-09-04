<template>
  <v-footer app color="transparent" absolute>
    <v-col class="pa-3">
      <v-row class="justify-center align-center"> </v-row>
      <v-row class="justify-center">
        <div>Things From Africa &copy; {{ new Date().getFullYear() }}</div>
      </v-row>
    </v-col>
  </v-footer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { xs, sm, mobile } = useDisplay()

// You can use these reactive properties directly in template
// xs.value, sm.value, mobile.value are all boolean
</script>