<template>
    <v-container class="fill-height pa-0" fluid>
      <v-row no-gutters class="fill-height">
        <!-- Left side - Background image -->
        <v-col cols="12" md="6" class="d-none d-md-flex">
          <div class="d-flex flex-column justify-center align-center pa-8 bg-gradient-to-br from-amber-50 to-orange-100 w-100">
            <div class="text-center">
              <v-icon size="120" color="amber-darken-3" class="mb-4">mdi-saw-blade</v-icon>
              <h1 class="text-h3 font-weight-bold text-amber-darken-4 mb-4">WoodCraft</h1>
              <p class="text-h6 text-grey-darken-1 mb-4">Handcrafted wooden treasures for your home</p>
              <v-chip color="amber" variant="outlined" class="mb-2">Premium Quality</v-chip>
              <v-chip color="amber" variant="outlined" class="mb-2 ml-2">Sustainable</v-chip>
              <v-chip color="amber" variant="outlined" class="mb-2 ml-2">Artisan Made</v-chip>
            </div>
          </div>
        </v-col>
  
        <!-- Right side - Registration form -->
        <v-col cols="12" md="6">
          <div class="d-flex flex-column justify-center align-center pa-8 h-100">
            <v-card class="w-100" max-width="500" elevation="0">
              <v-card-title class="text-center mb-4">
                <div class="w-100">
                  <h2 class="text-h4 font-weight-bold text-amber-darken-4 mb-2">Create Account</h2>
                  <p class="text-body-1 text-grey-darken-1">Join our community of wood enthusiasts</p>
                </div>
              </v-card-title>
  
              <!-- Step Progress -->
              <v-stepper v-model="currentStep" class="mb-6" elevation="0">
                <v-stepper-header>
                  <v-stepper-item
                    :complete="currentStep > 1"
                    step="1"
                    title="Personal"
                  ></v-stepper-item>
                  <v-divider></v-divider>
                  <v-stepper-item
                    :complete="currentStep > 2"
                    step="2"
                    title="Security"
                  ></v-stepper-item>
                  <v-divider></v-divider>
                  <v-stepper-item
                    :complete="currentStep > 3"
                    step="3"
                    title="Preferences"
                  ></v-stepper-item>
                </v-stepper-header>
              </v-stepper>
  
              <v-form ref="form" @submit.prevent="handleSubmit">
                <!-- Step 1: Personal Information -->
                <div v-if="currentStep === 1" class="step-content">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.firstName"
                        :rules="[rules.required]"
                        label="First Name"
                        prepend-inner-icon="mdi-account"
                        variant="outlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.lastName"
                        :rules="[rules.required]"
                        label="Last Name"
                        prepend-inner-icon="mdi-account"
                        variant="outlined"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
  
                  <v-text-field
                    v-model="formData.displayName"
                    label="Display Name"
                    prepend-inner-icon="mdi-account-circle"
                    variant="outlined"
                    hint="How should we display your name?"
                    persistent-hint
                  ></v-text-field>
  
                  <v-text-field
                    v-model="formData.email"
                    :rules="[rules.required, rules.email]"
                    label="Email Address"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    type="email"
                    required
                  ></v-text-field>
  
                  <v-text-field
                    v-model="formData.username"
                    :rules="[rules.required, rules.minLength(3)]"
                    label="Username"
                    prepend-inner-icon="mdi-at"
                    variant="outlined"
                    required
                  ></v-text-field>
  
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.phoneNumber"
                        label="Phone Number"
                        prepend-inner-icon="mdi-phone"
                        variant="outlined"
                        type="tel"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.dateOfBirth"
                        label="Date of Birth"
                        prepend-inner-icon="mdi-calendar"
                        variant="outlined"
                        type="date"
                      ></v-text-field>
                    </v-col>
                  </v-row>
  
                  <v-select
                    v-model="formData.gender"
                    :items="genderOptions"
                    label="Gender"
                    prepend-inner-icon="mdi-human-male-female"
                    variant="outlined"
                    clearable
                  ></v-select>
                </div>
  
                <!-- Step 2: Security -->
                <div v-if="currentStep === 2" class="step-content">
                  <v-text-field
                    v-model="formData.password"
                    :rules="[rules.required, rules.minLength(8)]"
                    label="Password"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    required
                    @click:append-inner="showPassword = !showPassword"
                  ></v-text-field>
  
                  <v-text-field
                    v-model="formData.confirmPassword"
                    :rules="[rules.required, rules.passwordMatch]"
                    label="Confirm Password"
                    prepend-inner-icon="mdi-lock-check"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    required
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  ></v-text-field>
  
                  <v-alert
                    type="info"
                    variant="tonal"
                    class="mb-4"
                    title="Password Requirements"
                    text="Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters."
                  ></v-alert>
                </div>
  
                <!-- Step 3: Preferences -->
                <div v-if="currentStep === 3" class="step-content">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="formData.preferredLanguage"
                        :items="languageOptions"
                        label="Preferred Language"
                        prepend-inner-icon="mdi-translate"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="formData.preferredCurrency"
                        :items="currencyOptions"
                        label="Preferred Currency"
                        prepend-inner-icon="mdi-currency-usd"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                  </v-row>
  
                  <v-select
                    v-model="formData.timeZone"
                    :items="timezoneOptions"
                    label="Time Zone"
                    prepend-inner-icon="mdi-clock-outline"
                    variant="outlined"
                  ></v-select>
  
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-h6">
                      <v-icon class="mr-2">mdi-bell-outline</v-icon>
                      Notification Preferences
                    </v-card-title>
                    <v-card-text>
                      <v-checkbox
                        v-for="option in notificationOptions"
                        :key="option.value"
                        v-model="formData.notificationPreferences"
                        :label="option.label"
                        :value="option.value"
                        density="compact"
                      ></v-checkbox>
                    </v-card-text>
                  </v-card>
  
                  <v-checkbox
                    v-model="formData.agreeToTerms"
                    :rules="[rules.required]"
                    required
                  >
                    <template #label>
                      <div>
                        I agree to the 
                        <a href="#" class="text-amber-darken-2" @click.stop>Terms of Service</a> 
                        and 
                        <a href="#" class="text-amber-darken-2" @click.stop>Privacy Policy</a>
                      </div>
                    </template>
                  </v-checkbox>
                </div>
  
                <!-- Navigation Buttons -->
                <div class="d-flex justify-space-between mt-6">
                  <v-btn
                    v-if="currentStep > 1"
                    variant="outlined"
                    @click="previousStep"
                    prepend-icon="mdi-arrow-left"
                  >
                    Previous
                  </v-btn>
                  <v-spacer v-else></v-spacer>
  
                  <v-btn
                    v-if="currentStep < 3"
                    color="amber-darken-3"
                    @click="nextStep"
                    append-icon="mdi-arrow-right"
                  >
                    Next
                  </v-btn>
                  <v-btn
                    v-else
                    color="amber-darken-3"
                    type="submit"
                    :loading="isLoading"
                    append-icon="mdi-check"
                  >
                    Create Account
                  </v-btn>
                </div>
              </v-form>
  
              <v-divider class="my-6"></v-divider>
  
              <div class="text-center">
                <p class="text-body-2 text-grey-darken-1">
                  Already have an account? 
                  <a href="/login" class="text-amber-darken-2 text-decoration-none">Sign in here</a>
                </p>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
  
      <!-- Success Dialog -->
      <v-dialog v-model="successDialog" max-width="400">
        <v-card>
          <v-card-title class="text-center">
            <v-icon size="64" color="success" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h5">Account Created!</div>
          </v-card-title>
          <v-card-text class="text-center">
            <p>Your account has been successfully created. Please check your email for verification.</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="amber-darken-3" @click="successDialog = false">
              Continue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { CreateUsersRequest } from '@/stores/types/member'
import { ref, computed } from 'vue'
  

  // Form data interface
  interface FormData {
    firstName: string
    lastName: string
    displayName: string
    username: string
    email: string
    password: string
    confirmPassword: string
    phoneNumber: string
    dateOfBirth: string
    gender: string
    preferredLanguage: string
    preferredCurrency: string
    timeZone: string
    notificationPreferences: string[]
    agreeToTerms: boolean
  }
  
  // Reactive data
  const currentStep = ref(1)
  const isLoading = ref(false)
  const successDialog = ref(false)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const form = ref()
  
  const formData = ref<FormData>({
    firstName: '',
    lastName: '',
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    preferredLanguage: 'en',
    preferredCurrency: 'USD',
    timeZone: 'UTC',
    notificationPreferences: [],
    agreeToTerms: false
  })
  
  // Options for select fields
  const genderOptions = [
    { title: 'Male', value: 'male' },
    { title: 'Female', value: 'female' },
    { title: 'Other', value: 'other' },
    { title: 'Prefer not to say', value: 'prefer-not-to-say' }
  ]
  
  const languageOptions = [
    { title: 'English', value: 'en' },
    { title: 'Spanish', value: 'es' },
    { title: 'French', value: 'fr' },
    { title: 'German', value: 'de' },
    { title: 'Italian', value: 'it' }
  ]
  
  const currencyOptions = [
    { title: 'US Dollar ($)', value: 'USD' },
    { title: 'Euro (€)', value: 'EUR' },
    { title: 'British Pound (£)', value: 'GBP' },
    { title: 'Canadian Dollar (C$)', value: 'CAD' },
    { title: 'Australian Dollar (A$)', value: 'AUD' }
  ]
  
  const timezoneOptions = [
    { title: 'UTC', value: 'UTC' },
    { title: 'Eastern Time', value: 'America/New_York' },
    { title: 'Central Time', value: 'America/Chicago' },
    { title: 'Mountain Time', value: 'America/Denver' },
    { title: 'Pacific Time', value: 'America/Los_Angeles' },
    { title: 'GMT', value: 'Europe/London' },
    { title: 'CET', value: 'Europe/Paris' }
  ]
  
  const notificationOptions = [
    { label: 'Email Promotions', value: 'email_promotions' },
    { label: 'Order Updates', value: 'email_order_updates' },
    { label: 'New Products', value: 'email_new_products' },
    { label: 'SMS Notifications', value: 'sms_notifications' }
  ]
  
  // Validation rules
  const rules = {
    required: (value: any) => !!value || 'This field is required',
    email: (value: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'Invalid email format'
    },
    minLength: (min: number) => (value: string) => 
      value.length >= min || `Must be at least ${min} characters`,
    passwordMatch: (value: string) => 
      value === formData.value.password || 'Passwords do not match'
  }
  
  // Methods
  const nextStep = async () => {
    const { valid } = await form.value.validate()
    if (valid) {
      currentStep.value++
    }
  }
  
  const previousStep = () => {
    currentStep.value--
  }
  
  const handleSubmit = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return
  
    isLoading.value = true
  
    try {
      const registrationData: Partial<CreateUsersRequest> = {
        roleId: 2, // Assuming 2 is customer role
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        displayName: formData.value.displayName || `${formData.value.firstName} ${formData.value.lastName}`,
        username: formData.value.username,
        email: formData.value.email,
        phoneNumber: formData.value.phoneNumber || null,
        dateOfBirth: formData.value.dateOfBirth || null,
        gender: formData.value.gender || null,
        preferredLanguage: formData.value.preferredLanguage,
        preferredCurrency: formData.value.preferredCurrency,
        timeZone: formData.value.timeZone,
        notificationPreferences: JSON.stringify(formData.value.notificationPreferences),
        userStatus: 'active',
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        isLocked: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      }
  
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      successDialog.value = true
      
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .step-content {
    min-height: 400px;
  }
  
  .bg-gradient-to-br {
    background: linear-gradient(135deg, #fef7e0 0%, #fed7aa 100%);
  }
  </style>