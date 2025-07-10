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

          <!-- Divider -->
          <div class="divider">
            <span>OR</span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <v-btn variant="outlined" prepend-icon="mdi-google" class="social-btn">
              Google
            </v-btn>
            <v-btn variant="outlined" prepend-icon="mdi-facebook" class="social-btn">
              Facebook
            </v-btn>
          </div>

          <!-- Sign Up Link -->
          <div class="signup-link">
            <span>Don't have an account?</span>
            <v-btn
              variant="text"
              color="primary"
              @click="goToSignup"
              class="ms-2"
            >
              Sign Up
            </v-btn>
          </div>

          <!-- Continue Shopping -->
          <div class="continue-shopping">
            <v-btn
              variant="text"
              color="grey-darken-1"
              @click="continueShopping"
              prepend-icon="mdi-arrow-left"
              class="mt-2"
            >
              Continue Shopping
            </v-btn>
          </div>
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
import { useUserStore} from "@/stores/user";
import { LoginCredentials, UserRole } from '@/stores/types/member';

const router = useRouter();

// Form data
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const isFormValid = ref(false);
const isLoading = ref(false);

const userStore = useUserStore();

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

// Login handler
const handleLogin = async () => {
  if (!isFormValid.value) return;

  isLoading.value = true;

  try {
    const loginCredentials = {
      Email: email.value,
      password: password.value,
    } as LoginCredentials;

    const loginResponse = await userStore.login(loginCredentials);

    if (loginResponse.isSuccessful && loginResponse.payload) {
      const authResponse = loginResponse.payload;

      await nextTick();

      try {
        // Handle password change requirement first
        // if (authResponse.shouldChangePassword) {
        //   await router.push("/user/profile");
        //   return;
        // }

        // Get user role and handle navigation for e-commerce
        const userRole = userStore.role;
        
        if (!userRole) {
          console.warn("No role assigned to user, redirecting to shop");
          await router.push('/admin/dashboard');
          return;
        }

        // E-commerce role-based navigation
        const roleNavigation = {
          [UserRole.SuperAdmin?.toLowerCase()]: '/admin/dashboard',
          [UserRole.Admin?.toLowerCase()]: '/admin/dashboard',
          [UserRole.Manager?.toLowerCase()]: '/admin/orders'
        };

        const targetRoute = roleNavigation[userRole.toLowerCase()];
        console.log("The role navigation is this: "+targetRoute);
        if (targetRoute) {
         // await router.push(targetRoute);
         await router.push({ name: "admin-dashboard" });
  
        } else {
          // Default fallback for customers
          console.warn(`Unknown role: ${userRole}, redirecting to shop`);
          await router.push('/shop');
        }

        // Show success notification
        showNotification(`Welcome back, ${authResponse.fULLname || userStore.user?.username}!`, 'success');

      } catch (navigationError) {
        console.error("Navigation failed:", navigationError);
        showNotification('Login successful, but navigation failed. Please try refreshing the page.', 'warning');
      }
    } else {
      // Handle unsuccessful login
      const errorMessage = loginResponse.message || "Invalid login credentials chadzunda";
      showNotification(errorMessage, 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('Network')) {
        showNotification('Network error. Please check your connection and try again.', 'error');
      } else if (error.message.includes('timeout')) {
        showNotification('Request timeout. Please try again.', 'error');
      } else {
        showNotification('Error logging in. Please try again.', 'error');
      }
    } else {
      showNotification('An unexpected error occurred. Please try again.', 'error');
    }
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

// Navigation handlers
const goToSignup = () => {
  router.push('/signup');
};

const continueShopping = () => {
  router.push('/shop');
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
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
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

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: #777;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 1rem;
  font-size: 0.875rem;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  flex: 1;
  text-transform: none;
}

.signup-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #666;
}

.continue-shopping {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
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

  .social-login {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>