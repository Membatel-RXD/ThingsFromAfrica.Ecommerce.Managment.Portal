<template>
  <div>
    <!-- app bar -->
    <v-app-bar :elevation="3" color="orange-darken-2">
      <div class="d-flex w-100" id="nav-content">
        <v-img 
          v-if="companyLogo"
          :src="companyLogo" 
          alt="TFA Logo"
          max-height="40"
          max-width="40"
          class="me-3"
        >
          <template v-slot:error>
            <v-icon color="yellow-lighten-2" icon="mdi-tree" class="me-3" />
          </template>
        </v-img>
        <v-icon v-else color="yellow-lighten-2" icon="mdi-tree" class="me-3" />
        <div>
          <p class="text-uppercase text-yellow-lighten-2 my-auto font-weight-bold">TFA Admin</p>
          <p class="text-caption text-orange-lighten-3">Things From Africa</p>
        </div>
        <v-spacer />
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="yellow-lighten-2" class="d-flex align-center user-dropdown-btn" style="min-width: 0;">
              <v-icon color="orange-darken-2" size="27" icon="mdi-account-circle" />
              <span class="mx-2 user-navbar-username" v-if="userStore.user">{{ username }}</span>
              <v-icon color="orange-darken-2" size="20" icon="mdi-chevron-down" />
            </v-btn>
          </template>
          <v-list>
            <v-list-item :to="{ name: 'profile' }">
              <template v-slot:prepend>
                <v-icon icon="mdi-account" />
              </template>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logoutDialog = true">
              <template v-slot:prepend>
                <v-icon color="error" icon="mdi-logout" />
              </template>
              <v-list-item-title class="text-error">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-dialog v-model="logoutDialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Confirm Logout</v-card-title>
            <v-card-text>Do you want to logout?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="logoutDialog = false">Cancel</v-btn>
              <v-btn color="error" variant="elevated" @click="confirmLogout">Logout</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-app-bar>

    <!-- navigation drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      location="left" 
      :width="300"
      class="wood-crafts-sidebar"
      color="orange-darken-3"
    >
      <v-list nav density="comfortable" class="text-orange-lighten-5">
        
        <!-- Dashboard -->
        <v-list-item 
          active-class="bg-yellow-accent-3 text-orange-darken-4" 
          :to="{ name: 'dashboard' }"
          class="mb-2"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-view-dashboard" color="yellow-lighten-2" />
          </template>
          <v-list-item-title class="font-weight-medium">Dashboard</v-list-item-title>
        </v-list-item>

        <!-- Product Management -->
        <v-list-group value="products">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-package-variant">
              <v-list-item-title>Products</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item :to="{ name: 'admin-products' }" link exact>
            <v-list-item-title>All Products</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'admin-categories' }"><v-list-item-title>Categories</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'reviews' }"><v-list-item-title>Reviews</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'CareInstructions' }"><v-list-item-title>Care Instructions</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'DiscountTypes' }"><v-list-item-title>Discount Types</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'promotions' }"><v-list-item-title>Promotions</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'PromotionUsage' }"><v-list-item-title>Promotion Usage</v-list-item-title></v-list-item>
        </v-list-group>

        <!-- Order Management -->
        <v-list-group value="orders">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-shopping">
              <v-list-item-title>Orders</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item :to="{ name: 'admin-orders' }"><v-list-item-title>All Orders</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'order-items' }"><v-list-item-title>Order Items</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'order-status' }"><v-list-item-title>Order Status</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'order-status-history' }"><v-list-item-title>Status History</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'shipments' }"><v-list-item-title>Shipments</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'shipment-items' }"><v-list-item-title>Shipment Items</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'shipping-methods' }"><v-list-item-title>Shipping Methods</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'shipping-rates' }"><v-list-item-title>Shipping Rates</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'shipping-restrictions' }"><v-list-item-title>Shipping Restrictions</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'shopping-cart' }"><v-list-item-title>Shopping Cart</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'stock-alerts' }"><v-list-item-title>Stock Alerts</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'inventory-transactions' }"><v-list-item-title>Inventory Transactions</v-list-item-title></v-list-item>
        </v-list-group>

        <!-- Customer Management -->
        <v-list-group value="customers">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-group">
              <v-list-item-title>Customers</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item :to="{ name: 'AllCustomers' }"><v-list-item-title>All Customers</v-list-item-title></v-list-item>
        </v-list-group>

        <!-- Artisans & Vendors -->
        <v-list-group value="artisans-vendors">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-hard-hat">
              <v-list-item-title>Artisans & Vendors</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item :to="{ name: 'artisans' }"><v-list-item-title>Artisans</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'wood-types' }"><v-list-item-title>Wood Types</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'craft-types' }"><v-list-item-title>Craft Types</v-list-item-title></v-list-item>
        </v-list-group>

        <!-- Payments -->
        <v-list-group value="payments">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-credit-card">
              <v-list-item-title>Payments</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item :to="{ name: 'payments' }"><v-list-item-title>All Payments</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'payment-methods' }"><v-list-item-title>Payment Methods</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'revenue-reports' }"><v-list-item-title>Revenue Reports</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'artisan-payouts' }"><v-list-item-title>Artisan Payouts</v-list-item-title></v-list-item>
        </v-list-group>
            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'payment-methods' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-credit-card" />
              </template>
              <v-list-item-title>Payment Methods</v-list-item-title>
            </v-list-item>

        <!-- Marketing -->
        <v-list-group value="marketing">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-bullhorn">
              <v-list-item-title>Marketing</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item :to="{ name: 'email-templates' }"><v-list-item-title>Email Templates</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'email-queue' }"><v-list-item-title>Email Queue</v-list-item-title></v-list-item>
        </v-list-group>

        <!-- Analytics -->
        <v-list-group value="analytics">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-chart-bar">
              <v-list-item-title>Analytics</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item :to="{ name: 'sales-analytics' }"><v-list-item-title>Sales Analytics</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'product-analytics' }"><v-list-item-title>Product Analytics</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'customer-insights' }"><v-list-item-title>Customer Insights</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'website-analytics' }"><v-list-item-title>Website Analytics</v-list-item-title></v-list-item>
        </v-list-group>

        <!-- Settings -->
        <v-list-group value="settings">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-cog">
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
          </template>
          <!-- Core System Settings -->
          <v-list-item :to="{ name: 'general-settings' }"><v-list-item-title>General Settings</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'security' }"><v-list-item-title>Security</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'system-logs' }"><v-list-item-title>System Logs</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'backup-restore' }"><v-list-item-title>Backup & Restore</v-list-item-title></v-list-item>
          <!-- User Management Essentials -->
          <v-list-item :to="{ name: 'system-user-management' }"><v-list-item-title>System Users</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'roles' }"><v-list-item-title>Roles</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'permissions' }"><v-list-item-title>Permissions</v-list-item-title></v-list-item>
          <v-list-item :to="{ name: 'role-permissions' }"><v-list-item-title>Role Permissions</v-list-item-title></v-list-item>
          <!-- Advanced User Management (optional, collapsed) -->
          <v-list-group value="advanced-user-management">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-shield-account">
                <v-list-item-title>Advanced User Management</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item :to="{ name: 'user-login-history' }"><v-list-item-title>User Login History</v-list-item-title></v-list-item>
            <v-list-item :to="{ name: 'user-sessions' }"><v-list-item-title>User Sessions</v-list-item-title></v-list-item>
            <v-list-item :to="{ name: 'oauth-providers' }"><v-list-item-title>OAuth Providers</v-list-item-title></v-list-item>
            <v-list-item :to="{ name: 'user-oauth-connections' }"><v-list-item-title>User OAuth Connections</v-list-item-title></v-list-item>
          </v-list-group>
        </v-list-group>

      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router";
  import { storeToRefs } from "pinia";
  import { useAppStore } from "@/stores/app";
  import { useUserStore } from "@/stores/user";
  import { computed, ref } from "vue";
import { UserRole } from "@/stores/types/member";

  const router = useRouter();
  const appStore = useAppStore();
  const userStore = useUserStore();
  
  // Company logo path
  const companyLogo = ref('/path/to/tfa-logo.png');

  const username = computed(() => userStore.user?.username);

  const logout = () => {
    userStore.logout();
    router.push('/login');
  };

  const { drawer } = storeToRefs(appStore);

  const logoutDialog = ref(false);
  function confirmLogout() {
    logoutDialog.value = false;
    logout();
  }

  // Helper function to check if the current user has any of the specified roles
  const hasRole = (allowedRoles: string[]) => {
    // If user is not authenticated, deny access
    if (!userStore.isAuthenticated || !userStore.role) {
      return false;
    }

    // Check if the user's role is in the list of allowed roles
    return allowedRoles.includes(userStore.role as string);
  };
</script>

<style scoped>
  #nav-content {
    width: 100%;
  }

  .wood-crafts-sidebar {
    background: linear-gradient(180deg, #E65100 0%, #BF360C 100%);
  }

  .wood-crafts-sidebar .v-list-item {
    border-radius: 8px;
    margin: 2px 8px;
  }

  .wood-crafts-sidebar .v-list-item:hover {
    background-color: rgba(255, 193, 7, 0.1);
  }

  .wood-crafts-sidebar .v-list-subheader {
    padding-top: 16px;
    padding-bottom: 8px;
  }

  .company-logo {
    height: 40px;
    width: auto;
    max-width: 40px;
    object-fit: contain;
  }

  .logout-btn {
    background-color: #fff !important;
    color: #B00020 !important;
    border: 1px solid #B00020 !important;
  }

  .user-navbar-username {
    color: #222 !important;
    font-size: 1.15rem;
    font-weight: bold;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.10);
  }

  .user-dropdown-btn {
    background: #FFF59D !important; /* Vuetify yellow-lighten-2 */
    border-radius: 24px !important;
    padding: 0 10px 0 16px !important;
    min-height: 40px;
  }
</style>