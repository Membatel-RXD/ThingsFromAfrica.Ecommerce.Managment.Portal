<template>
    <div class="artisan-payouts-view">
      <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-3">Artisan Payouts</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage artisan payments and commission tracking
            </p>
          </div>
        </div>
  
        <!-- Coming Soon Section -->
        <v-row justify="center" class="mt-12">
          <v-col cols="12" md="8" lg="6">
            <v-card class="text-center pa-8" elevation="4">
              <v-card-text>
                <!-- Icon -->
                <div class="mb-6">
                  <v-icon 
                    color="orange-darken-3" 
                    size="120"
                    class="mb-4"
                  >
                    mdi-account-cash
                  </v-icon>
                </div>
  
                <!-- Title -->
                <h2 class="text-h3 font-weight-bold text-orange-darken-3 mb-4">
                  Coming Soon
                </h2>
  
                <!-- Description -->
                <p class="text-h6 text-grey-darken-1 mb-6">
                  We're working hard to bring you a comprehensive artisan payout management system.
                </p>
  
                <!-- Features List -->
                <div class="text-left mb-6">
                  <h3 class="text-h6 font-weight-bold text-orange-darken-2 mb-3">
                    What's Coming:
                  </h3>
                  <v-list class="bg-transparent">
                    <v-list-item
                      v-for="feature in upcomingFeatures"
                      :key="feature.title"
                      class="px-0"
                    >
                      <template v-slot:prepend>
                        <v-icon 
                          :color="feature.color" 
                          size="20"
                          class="me-3"
                        >
                          {{ feature.icon }}
                        </v-icon>
                      </template>
                      <v-list-item-title class="text-body-1">
                        {{ feature.title }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
  
                <!-- Progress Indicator -->
                <div class="mb-6">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2 text-grey-darken-1">Development Progress</span>
                    <span class="text-body-2 font-weight-bold text-orange-darken-3">{{ progressPercentage }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="progressPercentage"
                    color="orange-darken-3"
                    height="8"
                    rounded
                  />
                </div>
  
                <!-- Notification Signup -->
                <div class="mb-6">
                  <h4 class="text-h6 font-weight-bold text-orange-darken-2 mb-3">
                    Get Notified When It's Ready
                  </h4>
                  <v-row justify="center">
                    <v-col cols="12" sm="8" md="6">
                      <v-text-field
                        v-model="notificationEmail"
                        label="Your email address"
                        prepend-inner-icon="mdi-email"
                        variant="outlined"
                        density="comfortable"
                        :rules="emailRules"
                        hide-details="auto"
                        class="mb-3"
                      />
                      <v-btn
                        color="orange-darken-2"
                        variant="elevated"
                        size="large"
                        block
                        @click="subscribeToNotifications"
                        :loading="subscribing"
                        :disabled="!isValidEmail"
                      >
                        <v-icon class="me-2">mdi-bell</v-icon>
                        Notify Me
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
  
                <!-- Estimated Launch -->
                <div class="mt-8">
                  <v-chip
                    color="orange-lighten-2"
                    size="large"
                    variant="tonal"
                    prepend-icon="mdi-calendar"
                  >
                    Estimated Launch: Q2 2025
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Additional Info Cards -->
        <v-row class="mt-8" justify="center">
          <v-col cols="12" md="4">
            <v-card class="text-center pa-4" variant="outlined">
              <v-icon color="blue-darken-3" size="48" class="mb-3">
                mdi-shield-check
              </v-icon>
              <h3 class="text-h6 font-weight-bold text-blue-darken-3 mb-2">
                Secure Payments
              </h3>
              <p class="text-body-2 text-grey-darken-1">
                Bank-level security for all artisan transactions
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="text-center pa-4" variant="outlined">
              <v-icon color="green-darken-3" size="48" class="mb-3">
                mdi-chart-line
              </v-icon>
              <h3 class="text-h6 font-weight-bold text-green-darken-3 mb-2">
                Real-time Tracking
              </h3>
              <p class="text-body-2 text-grey-darken-1">
                Monitor earnings and payouts in real-time
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="text-center pa-4" variant="outlined">
              <v-icon color="purple-darken-3" size="48" class="mb-3">
                mdi-cog
              </v-icon>
              <h3 class="text-h6 font-weight-bold text-purple-darken-3 mb-2">
                Automated Processing
              </h3>
              <p class="text-body-2 text-grey-darken-1">
                Automated payout scheduling and processing
              </p>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Snackbar for notifications -->
        <v-snackbar
          v-model="showSnackbar"
          :color="snackbarColor"
          :timeout="4000"
          location="top"
        >
          {{ snackbarMessage }}
          <template v-slot:actions>
            <v-btn
              variant="text"
              @click="showSnackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  // Reactive data
  const notificationEmail = ref<string>('')
  const subscribing = ref<boolean>(false)
  const progressPercentage = ref<number>(35)
  const showSnackbar = ref<boolean>(false)
  const snackbarMessage = ref<string>('')
  const snackbarColor = ref<string>('success')
  
  // Upcoming features data
  const upcomingFeatures = ref([
    {
      title: 'Automated commission calculations',
      icon: 'mdi-calculator',
      color: 'orange-darken-3'
    },
    {
      title: 'Increment payment tracking',
      icon: 'mdi-credit-card-multiple',
      color: 'blue-darken-3'
    },
    {
      title: 'Payout scheduling',
      icon: 'mdi-clock-outline',
      color: 'green-darken-3'
    },
    {
      title: 'Detailed earnings reports and analytics',
      icon: 'mdi-chart-bar',
      color: 'purple-darken-3'
    },
   
    {
      title: 'Artisan performance tracking',
      icon: 'mdi-trophy',
      color: 'amber-darken-3'
    }
  ])
  
  // Email validation rules
  const emailRules = [
    (value: string) => !!value || 'Email is required',
    (value: string) => /.+@.+\..+/.test(value) || 'Must be a valid email'
  ]
  
  // Computed properties
  const isValidEmail = computed(() => {
    return notificationEmail.value && /.+@.+\..+/.test(notificationEmail.value)
  })
  
  // Methods
  const subscribeToNotifications = async (): Promise<void> => {
    if (!isValidEmail.value) return
  
    subscribing.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Success
      snackbarMessage.value = 'Thank you! We\'ll notify you when artisan payouts are ready.'
      snackbarColor.value = 'success'
      showSnackbar.value = true
      notificationEmail.value = ''
      
    } catch (error) {
      // Error
      snackbarMessage.value = 'Something went wrong. Please try again.'
      snackbarColor.value = 'error'
      showSnackbar.value = true
    } finally {
      subscribing.value = false
    }
  }
  </script>
  
  <style scoped>
  .artisan-payouts-view {
    background-color: #fafafa;
    min-height: 100vh;
  }
  
  .v-card {
    border-radius: 12px;
  }
  
  .v-progress-linear {
    border-radius: 4px;
  }
  
  .v-list-item {
    min-height: 40px;
  }
  </style>