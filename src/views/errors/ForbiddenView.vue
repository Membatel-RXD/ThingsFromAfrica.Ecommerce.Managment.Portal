<template>
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="text-center pa-8" elevation="8">
            <v-card-text>
              <!-- Error Icon -->
              <v-icon 
                size="120" 
                color="error" 
                class="mb-4"
              >
                mdi-lock-alert
              </v-icon>
              
              <!-- Error Code -->
              <h1 class="display-1 font-weight-bold text-error mb-2">
                403
              </h1>
              
              <!-- Error Title -->
              <h2 class="headline font-weight-medium mb-4">
                Access Forbidden
              </h2>
              
              <!-- Error Description -->
              <p class="body-1 text-medium-emphasis mb-6">
                Sorry, you don't have permission to access this page. 
                This could be because you're not logged in, your account 
                doesn't have the required privileges, or the resource is restricted.
              </p>
              
              <!-- Action Buttons -->
              <div class="d-flex flex-column flex-sm-row gap-3 justify-center">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  prepend-icon="mdi-home"
                  @click="goHome"
                >
                  Go to Homepage
                </v-btn>
                
                <v-btn
                  color="secondary"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-account-circle"
                  @click="goToLogin"
                >
                  Sign In
                </v-btn>
              </div>
              
              <!-- Additional Help -->
              <v-divider class="my-6"></v-divider>
              
              <div class="text-caption text-medium-emphasis">
                <p class="mb-2">Need help? Contact our support team</p>
                <v-btn
                  color="info"
                  variant="text"
                  size="small"
                  prepend-icon="mdi-email"
                  @click="contactSupport"
                >
                  support@yourstore.com
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Back to Previous Page Button -->
      <v-fab
        location="bottom end"
        color="secondary"
        icon="mdi-arrow-left"
        @click="goBack"
        class="ma-4"
      >
        <v-tooltip activator="parent" location="left">
          Go Back
        </v-tooltip>
      </v-fab>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Navigation methods
  const goHome = (): void => {
    router.push('/')
  }
  
  const goToLogin = (): void => {
    router.push('/login')
  }
  
  const goBack = (): void => {
    if (window.history.length > 1) {
      router.go(-1)
    } else {
      router.push('/')
    }
  }
  
  const contactSupport = (): void => {
    window.location.href = 'mailto:support@yourstore.com'
  }
  </script>
  
  <style scoped>
  .fill-height {
    min-height: 100vh;
  }
  
  .gap-3 {
    gap: 12px;
  }
  
  .v-card {
    border-radius: 16px;
  }
  
  .display-1 {
    font-size: 3.5rem !important;
    line-height: 1.2;
  }
  
  .headline {
    font-size: 1.75rem !important;
    line-height: 1.3;
  }
  
  @media (max-width: 600px) {
    .display-1 {
      font-size: 2.5rem !important;
    }
    
    .headline {
      font-size: 1.5rem !important;
    }
  }
  </style>