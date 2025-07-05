import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import {useUserStore} from "@/stores/user";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: {
      layout: "blank",
      requiresAuth: false,
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/auth/SignupView.vue"),
    meta: {
      layout: "blank",
      requiresAuth: false,
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/auth/ForgotPasswordView.vue"),
    meta: {
      layout: "blank",
      requiresAuth: false,
    },
  },
  // Public Shopping Routes
  {
    path: "/shop",
    name: "shop",
    component: () => import("@/views/shop/ShopView.vue"),
    meta: {
      layout: "default",
      requiresAuth: false,
    },
  },
  {
    path: "/products/:id",
    name: "product-detail",
    component: () => import("@/views/shop/ProductDetailView.vue"),
    meta: {
      layout: "default",
      requiresAuth: false,
    },
  },
  {
    path: "/categories",
    name: "categories",
    component: () => import("@/views/shop/CategoriesView.vue"),
    meta: {
      layout: "default",
      requiresAuth: false,
    },
  },
  {
    path: "/categories/:slug",
    name: "category-products",
    component: () => import("@/views/shop/CategoryProductsView.vue"),
    meta: {
      layout: "default",
      requiresAuth: false,
    },
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/shop/SearchView.vue"),
    meta: {
      layout: "default",
      requiresAuth: false,
    },
  },
  // Customer Protected Routes
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/customer/CartView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
      roles: ["customer"],
    },
  },
  {
    path: "/wishlist",
    name: "wishlist",
    component: () => import("@/views/customer/WishlistView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
      roles: ["customer"],
    },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("@/views/customer/CheckoutView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
      roles: ["customer"],
    },
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import("@/views/customer/OrdersView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
      roles: ["customer"],
    },
  },
  {
    path: "/orders/:id",
    name: "order-detail",
    component: () => import("@/views/customer/OrderDetailView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
      roles: ["customer"],
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/customer/ProfileView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
      roles: ["customer"],
    },
  },
  {
    path: "/addresses",
    name: "addresses",
    component: () => import("@/views/customer/AddressesView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
      roles: ["customer"],
    },
  },
  // Admin Routes
  {
    path: "/admin",
    redirect: "/admin/dashboard",
  },
  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    component: () => import("@/views/admin/DashboardView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  // Dashboard route (alias for admin-dashboard)
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/admin/DashboardView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  // Product Management Routes
  {
    path: "/admin/products",
    name: "admin-products",
    component: () => import("@/views/admin/ProductsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/admin/ProductsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: '/products/:id',
    name: 'product-details',
    component: () => import("@/views/admin/ProductsView.vue"),
    props: true // Pass route param as prop
  },
  {
    path: "/admin/products/create",
    name: "admin-product-create",
    component: () => import("@/views/admin/ProductCreateView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  {
    path: "/products/create",
    name: "products-create",
    component: () => import("@/views/admin/ProductCreateView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/admin/products/:id/edit",
    name: "admin-product-edit",
    component: () => import("@/views/admin/ProductEditView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  {
    path: "/admin/categories",
    name: "admin-categories",
    component: () => import("@/views/admin/CategoriesView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  // Wood Types and Craft Types Routes
  {
    path: "/wood-types",
    name: "wood-types",
    component: () => import("@/views/admin/WoodTypesView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/craft-types",
    name: "craft-types",
    component: () => import("@/views/admin/CraftTypesView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  // Order Management Routes
  {
    path: "/admin/orders",
    name: "admin-orders",
    component: () => import("@/views/admin/OrdersView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/orders-pending",
    name: "orders-pending",
    component: () => import("@/views/admin/OrdersPendingView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/shipments",
    name: "shipments",
    component: () => import("@/views/admin/ShipmentsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/admin/orders/:id",
    name: "admin-order-detail",
    component: () => import("@/views/admin/OrderDetailView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  // Customer Management Routes
  {
    path: "/admin/customers",
    name: "admin-customers",
    component: () => import("@/views/admin/CustomersView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  {
    path: "/customers",
    name: "customers",
    component: () => import("@/views/admin/CustomersView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/artisans",
    name: "artisans",
    component: () => import("@/views/admin/ArtisansView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/reviews",
    name: "reviews",
    component: () => import("@/views/admin/ReviewsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  // Inventory Management Routes
  {
    path: "/inventory-dashboard",
    name: "inventory-dashboard",
    component: () => import("@/views/admin/InventoryDashboardView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "inventory_manager"],
    },
  },
  {
    path: "/stock-alerts",
    name: "stock-alerts",
    component: () => import("@/views/admin/StockAlertsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "inventory_manager"],
    },
  },
  {
    path: "/stock-movement",
    name: "stock-movement",
    component: () => import("@/views/admin/StockMovementView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "inventory_manager"],
    },
  },
  // Financial Management Routes
  {
    path: "/payments",
    name: "payments",
    component: () => import("@/views/admin/PaymentsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "accountant"],
    },
  },
  {
    path: "/revenue-reports",
    name: "revenue-reports",
    component: () => import("@/views/admin/RevenueReportsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "accountant"],
    },
  },
  {
    path: "/artisan-payouts",
    name: "artisan-payouts",
    component: () => import("@/views/admin/ArtisanPayoutsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "accountant"],
    },
  },
  // Marketing & Promotions Routes
  {
    path: "/promotions",
    name: "promotions",
    component: () => import("@/views/admin/PromotionsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "marketing"],
    },
  },
  {
    path: "/email-templates",
    name: "email-templates",
    component: () => import("@/views/admin/EmailTemplatesView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "marketing"],
    },
  },
  {
    path: "/newsletters",
    name: "newsletters",
    component: () => import("@/views/admin/NewslettersView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager", "marketing"],
    },
  },
  // Reports & Analytics Routes
  {
    path: "/sales-reports",
    name: "sales-reports",
    component: () => import("@/views/admin/SalesReportsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/product-analytics",
    name: "product-analytics",
    component: () => import("@/views/admin/ProductAnalyticsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/customer-insights",
    name: "customer-insights",
    component: () => import("@/views/admin/CustomerInsightsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin", "manager"],
    },
  },
  {
    path: "/admin/analytics",
    name: "admin-analytics",
    component: () => import("@/views/admin/AnalyticsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  // System Settings Routes
  {
    path: "/general-settings",
    name: "general-settings",
    component: () => import("@/views/admin/GeneralSettingsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  {
    path: "/user-management",
    name: "user-management",
    component: () => import("@/views/admin/UserManagementView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  {
    path: "/system-logs",
    name: "system-logs",
    component: () => import("@/views/admin/SystemLogsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  {
    path: "/backup-restore",
    name: "backup-restore",
    component: () => import("@/views/admin/BackupRestoreView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  {
    path: "/admin/settings",
    name: "admin-settings",
    component: () => import("@/views/admin/SettingsView.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
      roles: ["admin", "superadmin"],
    },
  },
  // Vendor Routes (if applicable)
  {
    path: "/vendor",
    redirect: "/vendor/dashboard",
  },
  {
    path: "/vendor/dashboard",
    name: "vendor-dashboard",
    component: () => import("@/views/vendor/DashboardView.vue"),
    meta: {
      layout: "vendor",
      requiresAuth: true,
      roles: ["vendor"],
    },
  },
  {
    path: "/vendor/products",
    name: "vendor-products",
    component: () => import("@/views/vendor/ProductsView.vue"),
    meta: {
      layout: "vendor",
      requiresAuth: true,
      roles: ["vendor"],
    },
  },
  {
    path: "/vendor/orders",
    name: "vendor-orders",
    component: () => import("@/views/vendor/OrdersView.vue"),
    meta: {
      layout: "vendor",
      requiresAuth: true,
      roles: ["vendor"],
    },
  },
  {
    path: "/vendor/analytics",
    name: "vendor-analytics",
    component: () => import("@/views/vendor/AnalyticsView.vue"),
    meta: {
      layout: "vendor",
      requiresAuth: true,
      roles: ["vendor"],
    },
  },
  // User Profile Routes
  {
    path: "/user/profile",
    name: "user-profile",
    component: () => import("@/views/user/ProfileView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
    },
  },
  {
    path: "/user/change-password",
    name: "change-password",
    component: () => import("@/views/user/ChangePasswordView.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
    },
  },
  // Error Pages
  {
    path: "/404",
    name: "not-found",
    component: () => import("@/views/errors/NotFoundView.vue"),
    meta: {
      layout: "blank",
      requiresAuth: false,
    },
  },
  {
    path: "/403",
    name: "forbidden",
    component: () => import("@/views/errors/ForbiddenView.vue"),
    meta: {
      layout: "blank",
      requiresAuth: false,
    },
  },
  // Catch all route
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const loginDashboard = async (): Promise<string> => {
  const userStore = useUserStore();
  const userRole = userStore.role;

  if (!userRole) {
    return '/shop';
  }

  // Normalize user role to lowercase
  const normalizedRole = userRole.toLowerCase();

  const roleNavigation: Record<string, string> = {
    customer: '/shop',
    admin: '/admin/dashboard',
    superadmin: '/admin/dashboard',
    manager: '/admin/orders',
    vendor: '/vendor/dashboard',
    artisan: '/vendor/dashboard',
    inventory_manager: '/inventory-dashboard',
    accountant: '/payments',
    marketing: '/promotions',
    customer_service: '/customers',
  };

  return roleNavigation[normalizedRole] || '/shop';
};

// Helper function to check if user has required role
const hasRequiredRole = (userRole: string, requiredRoles: string[]): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole.toLowerCase());
};

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next("/login");
    return;
  }

  // Check if user is logged in and trying to access login page
  if (to.path === "/login" && userStore.isAuthenticated) {
    const url = await loginDashboard();
    next(url);
    return;
  }

  // Check role-based access
  if (to.meta.requiresAuth && to.meta.roles && userStore.isAuthenticated) {
    const userRole = userStore.role;
    if (!userRole || !hasRequiredRole(userRole, to.meta.roles as string[])) {
      next("/403"); // Forbidden
      return;
    }
  }

  next();
});

export default router;