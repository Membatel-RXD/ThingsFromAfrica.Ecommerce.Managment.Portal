<template>
  <div class="login-container">
    <div class="login-overlay">
      <div class="login-card">
        <!-- Logo and Header -->
        <div class="header">
          <div class="logo">
            <v-icon icon="mdi-shopping-outline" size="x-large" color="primary"></v-icon>
          </div>
          <h1 class="title">Welcome Back</h1>
          <p class="subtitle">Sign in to your account</p>
        </div>

        <!-- Login Form -->
        <v-form v-model="isFormValid" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <v-text-field
            v-model="email"
            label="Email"
            variant="outlined"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email-outline"
            class="mb-4"
            autocomplete="email"
            color="primary"
          ></v-text-field>

          <!-- Password Field -->
          <v-text-field
            v-model="password"
            label="Password"
            variant="outlined"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-2"
            autocomplete="current-password"
            color="primary"
          ></v-text-field>

          <!-- Remember Me and Forgot Password -->
          <div class="actions-row">
            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              color="primary"
              hide-details
              density="compact"
            ></v-checkbox>

            <v-btn
              variant="text"
              color="primary"
              @click="forgotPasswordDialog = true"
              class="forgot-password-btn"
            >
              Forgot Password?
            </v-btn>
          </div>

          <!-- Login Button -->
          <v-btn
            block
            color="primary"
            size="large"
            type="submit"
            :loading="isLoading"
            :disabled="!isFormValid"
            class="login-btn mt-6"
            elevation="2"
          >
            Sign In
          </v-btn>
        </v-form>
      </div>

      <!-- Copyright Footer -->
      <div class="footer">
        <p>© {{ new Date().getFullYear() }} Things From Africa. All rights reserved.</p>
      </div>
    </div>

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="forgotPasswordDialog" max-width="500" class="reset-dialog">
      <v-card>
        <v-card-title class="headline">Reset Password</v-card-title>
        <v-card-text>
          <p class="mb-4">Enter your email address and we'll send you a link to reset your password.</p>
          <v-form v-model="isResetFormValid" @submit.prevent="sendResetLink">
            <v-text-field
              v-model="resetEmail"
              label="Email Address"
              variant="outlined"
              :rules="[rules.required, rules.email]"
              prepend-inner-icon="mdi-email-outline"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="forgotPasswordDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="sendResetLink"
            :disabled="!isResetFormValid"
            class="ms-2"
          >
            Send Reset Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

// Form data
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const isFormValid = ref(false);
const isLoading = ref(false);

// Reset password
const forgotPasswordDialog = ref(false);
const resetEmail = ref('');
const isResetFormValid = ref(false);

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

// Validation rules
const rules = {
  required: (value:string) => !!value || 'This field is required',
  email: (value:string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Please enter a valid email address';
  }
};

// Local login handler
const handleLogin = async () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  try {
    const response = await userStore.login(email.value, password.value); // Add await here
    if (response.isSuccessful) {
      showNotification('Login successful!', 'success');
      await nextTick();
      router.push('/admin/dashboard');
    } else {

      console.log(JSON.stringify(response));

      showNotification('Invalid username or password', 'error');
    }
  } catch (e) {
    showNotification('Login failed. Please try again.', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Reset password handler
const sendResetLink = () => {
  if (!isResetFormValid.value) return;
  forgotPasswordDialog.value = false;
  showNotification(`Password reset link sent to ${resetEmail.value}`, 'info');
  resetEmail.value = '';
};



// Notification helper
const showNotification = (text:string, color:string) => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fff !important;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.login-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  /* Remove any padding */
  padding: 0;
  margin: 0;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: none;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  background-color: #f0f4ff;
  border-radius: 50%;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
  text-align: center;
}

.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.forgot-password-btn {
  font-size: 0.875rem;
}

.login-btn {
  text-transform: none;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.75rem 0;
}

.footer {
  margin-top: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
}

@media (max-width: 600px) {
  .login-card {
    max-width: 90%;
    padding: 1.5rem;
  }
}
</style>