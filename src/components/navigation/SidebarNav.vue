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
        <p class="my-auto me-3 text-yellow-lighten-2" v-if="userStore.user">Hello {{ username }}!</p>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="yellow-lighten-2">
              <v-icon color="orange-darken-2" size="27" icon="mdi-account-circle" />
            </v-btn>
          </template>
          
          <v-list>
            <v-list-item :to="{ name: 'profile' }">
              <template v-slot:prepend>
                <v-icon icon="mdi-account" />
              </template>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="logout">
              <template v-slot:prepend>
                <v-icon icon="mdi-logout" />
              </template>
              <v-list-item-title>Logout ({{username}})</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
        <v-list-subheader class="text-uppercase font-weight-bold text-yellow-lighten-2">
          Product Management
        </v-list-subheader>

        <v-list-group value="products">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-package-variant">
              <v-list-item-title>Products</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'products' }">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-eye" />
            </template>
            <v-list-item-title>All Products</v-list-item-title>
          </v-list-item>

          <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'products-create' }">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-plus" />
            </template>
            <v-list-item-title>Add Product</v-list-item-title>
          </v-list-item>

          <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'wood-types' }">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-tree" />
            </template>
            <v-list-item-title>Wood Types</v-list-item-title>
          </v-list-item>

          <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'craft-types' }">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-palette" />
            </template>
            <v-list-item-title>Craft Types</v-list-item-title>
          </v-list-item>

          <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'categories' }">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-tag-multiple" />
            </template>
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Order Management -->
        <v-list-subheader class="text-uppercase font-weight-bold text-yellow-lighten-2">
          Order Management
        </v-list-subheader>

        <v-list-group value="orders">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-shopping">
              <v-list-item-title>Orders</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'orders' }">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-format-list-bulleted" />
            </template>
            <v-list-item-title>All Orders</v-list-item-title>
          </v-list-item>

          <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'orders-pending' }">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-clock-outline" />
            </template>
            <v-list-item-title>Pending Orders</v-list-item-title>
          </v-list-item>

          <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'shipments' }">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-truck-delivery" />
            </template>
            <v-list-item-title>Shipments</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Customer & Artisan Management -->
        <v-list-subheader class="text-uppercase font-weight-bold text-yellow-lighten-2">
          User Management
        </v-list-subheader>

        <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'customers' }">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-group" color="yellow-lighten-2" />
          </template>
          <v-list-item-title>Customers</v-list-item-title>
        </v-list-item>

        <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'artisans' }">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-hard-hat" color="yellow-lighten-2" />
          </template>
          <v-list-item-title>Artisans</v-list-item-title>
        </v-list-item>

        <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'reviews' }">
          <template v-slot:prepend>
            <v-icon icon="mdi-star" color="yellow-lighten-2" />
          </template>
          <v-list-item-title>Reviews</v-list-item-title>
        </v-list-item>

        <!-- Inventory Management -->
        <template v-if="hasRole([UserRole.Admin, UserRole.Manager])">
          <v-list-subheader class="text-uppercase font-weight-bold text-yellow-lighten-2">
            Inventory Management
          </v-list-subheader>

          <v-list-group value="inventory">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-warehouse">
                <v-list-item-title>Inventory</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'inventory-dashboard' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-view-dashboard-outline" />
              </template>
              <v-list-item-title>Inventory Dashboard</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'stock-alerts' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-alert-circle-outline" />
              </template>
              <v-list-item-title>Stock Alerts</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'stock-movement' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-swap-horizontal" />
              </template>
              <v-list-item-title>Stock Movement</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Financial Management -->
        <template v-if="hasRole([UserRole.Admin, UserRole.Manager])">
          <v-list-subheader class="text-uppercase font-weight-bold text-yellow-lighten-2">
            Financial Management
          </v-list-subheader>

          <v-list-group value="finances">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-currency-usd">
                <v-list-item-title>Finances</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'payments' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-credit-card" />
              </template>
              <v-list-item-title>Payments</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'revenue-reports' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-chart-line" />
              </template>
              <v-list-item-title>Revenue Reports</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'artisan-payouts' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-account-cash" />
              </template>
              <v-list-item-title>Artisan Payouts</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Marketing & Promotions -->
        <template v-if="hasRole([UserRole.Admin, UserRole.Manager])">
          <v-list-subheader class="text-uppercase font-weight-bold text-yellow-lighten-2">
            Marketing & Promotions
          </v-list-subheader>

          <v-list-group value="marketing">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-bullhorn">
                <v-list-item-title>Marketing</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'promotions' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-sale" />
              </template>
              <v-list-item-title>Promotions</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'email-templates' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-email-outline" />
              </template>
              <v-list-item-title>Email Templates</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'newsletters' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-newspaper" />
              </template>
              <v-list-item-title>Newsletters</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Reports & Analytics -->
        <template v-if="hasRole([UserRole.Admin, UserRole.Manager])">
          <v-list-subheader class="text-uppercase font-weight-bold text-yellow-lighten-2">
            Reports & Analytics
          </v-list-subheader>

          <v-list-group value="reports">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-file-chart">
                <v-list-item-title>Reports</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'sales-reports' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-chart-bar" />
              </template>
              <v-list-item-title>Sales Reports</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'product-analytics' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-analytics" />
              </template>
              <v-list-item-title>Product Analytics</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'customer-insights' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-account-search" />
              </template>
              <v-list-item-title>Customer Insights</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- System Settings -->
        <template v-if="hasRole([UserRole.Admin])">
          <v-list-subheader class="text-uppercase font-weight-bold text-yellow-lighten-2">
            System Settings
          </v-list-subheader>

          <v-list-group value="settings">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-cog">
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'general-settings' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-cog-outline" />
              </template>
              <v-list-item-title>General Settings</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'user-management' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-account-multiple" />
              </template>
              <v-list-item-title>User Management</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'system-logs' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-file-document-outline" />
              </template>
              <v-list-item-title>System Logs</v-list-item-title>
            </v-list-item>

            <v-list-item active-class="bg-yellow-accent-3 text-orange-darken-4" :to="{ name: 'backup-restore' }">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-backup-restore" />
              </template>
              <v-list-item-title>Backup & Restore</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>

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
</style>