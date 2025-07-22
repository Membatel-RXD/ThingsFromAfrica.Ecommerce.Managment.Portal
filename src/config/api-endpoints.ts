export const API_ENDPOINTS = {
  // Artisans
  GET_ALL_ARTISANS: "/Artisans/GetAll",
  GET_ARTISAN_BY_ID: "/Artisans/GetById",
  ADD_ARTISAN: "/Artisans/Add",
  UPDATE_ARTISAN: "/Artisans/Update",
  DELETE_ARTISAN: "/Artisans/Delete",

  // CraftTypes
  GET_ALL_CRAFT_TYPES: "/CraftTypes/GetAll",
  GET_CRAFT_TYPE_BY_ID: "/CraftTypes/GetById",
  ADD_CRAFT_TYPE: "/CraftTypes/Add",
  UPDATE_CRAFT_TYPE: "/CraftTypes/Update",
  DELETE_CRAFT_TYPE: "/CraftTypes/Delete",

  // CustomerProfiles
  GET_ALL_CUSTOMER_PROFILES: "/CustomerProfiles/GetAll",
  GET_CUSTOMER_PROFILE_BY_ID: "/CustomerProfiles/GetById",
  ADD_CUSTOMER_PROFILE: "/CustomerProfiles/Add",
  UPDATE_CUSTOMER_PROFILE: "/CustomerProfiles/Update",
  DELETE_CUSTOMER_PROFILE: "/CustomerProfiles/Delete",
  GET_CUSTOMER_PROFILES: "/CustomerProfiles/GetCustomerProfiles",

  // DiscountTypes
  GET_ALL_DISCOUNT_TYPES: "/DiscountTypes/GetAll",
  GET_DISCOUNT_TYPE_BY_ID: "/DiscountTypes/GetById",
  ADD_DISCOUNT_TYPE: "/DiscountTypes/Add",
  UPDATE_DISCOUNT_TYPE: "/DiscountTypes/Update",
  DELETE_DISCOUNT_TYPE: "/DiscountTypes/Delete",

  // EmailQueue
  GET_ALL_EMAIL_QUEUES: "/EmailQueue/GetAll",
  GET_EMAIL_QUEUE_BY_ID: "/EmailQueue/GetById",
  ADD_EMAIL_QUEUE: "/EmailQueue/Add",
  UPDATE_EMAIL_QUEUE: "/EmailQueue/Update",
  DELETE_EMAIL_QUEUE: "/EmailQueue/Delete",

  // EmailTemplates
  GET_ALL_EMAIL_TEMPLATES: "/EmailTemplates/GetAll",
  GET_EMAIL_TEMPLATE_BY_ID: "/EmailTemplates/GetById",
  ADD_EMAIL_TEMPLATE: "/EmailTemplates/Add",
  UPDATE_EMAIL_TEMPLATE: "/EmailTemplates/Update",
  DELETE_EMAIL_TEMPLATE: "/EmailTemplates/Delete",

  // InventoryTransactions
  GET_ALL_INVENTORY_TRANSACTIONS: "/InventoryTransactions/GetAll",
  GET_INVENTORY_TRANSACTION_BY_ID: "/InventoryTransactions/GetById",
  ADD_INVENTORY_TRANSACTION: "/InventoryTransactions/Add",
  UPDATE_INVENTORY_TRANSACTION: "/InventoryTransactions/Update",
  DELETE_INVENTORY_TRANSACTION: "/InventoryTransactions/Delete",

  // LoggedCRUDOperations
  GET_ALL_LOGGED_CRUD_OPERATIONS: "/LoggedCRUDOperations/GetAll",
  GET_LOGGED_CRUD_OPERATION_BY_ID: "/LoggedCRUDOperations/GetById",
  ADD_LOGGED_CRUD_OPERATION: "/LoggedCRUDOperations/Add",
  UPDATE_LOGGED_CRUD_OPERATION: "/LoggedCRUDOperations/Update",
  DELETE_LOGGED_CRUD_OPERATION: "/LoggedCRUDOperations/Delete",

  // OAuthProviders
  GET_ALL_OAUTH_PROVIDERS: "/OAuthProviders/GetAll",
  GET_OAUTH_PROVIDER_BY_ID: "/OAuthProviders/GetById",
  ADD_OAUTH_PROVIDER: "/OAuthProviders/Add",
  UPDATE_OAUTH_PROVIDER: "/OAuthProviders/Update",
  DELETE_OAUTH_PROVIDER: "/OAuthProviders/Delete",

  // OrderItems
  GET_ALL_ORDER_ITEMS: "/OrderItems/GetAll",
  GET_ORDER_ITEM_BY_ID: "/OrderItems/GetById",
  ADD_ORDER_ITEM: "/OrderItems/Add",
  UPDATE_ORDER_ITEM: "/OrderItems/Update",
  DELETE_ORDER_ITEM: "/OrderItems/Delete",

  // Orders
  CREATE_ORDER: "/Orders/CreateOrder",
  CUSTOMER_CREATES_ORDER: "/Orders/CustomerCreatesOrder",
  GET_ALL_ORDERS: "/Orders/GetAll",
  GET_ORDER_BY_ID: "/Orders/GetById",
  GET_ORDERS_BY_CUSTOMER: "/Orders/GetByCustomer",
  ADD_ORDER: "/Orders/Add",
  UPDATE_ORDER: "/Orders/Update",
  DELETE_ORDER: "/Orders/Delete",
  UPDATE_ORDER_STATUS: "/Orders/UpdateStatus",
  SHIP_ORDER: "/Orders/Ship",
  DELIVER_ORDER: "/Orders/Deliver",
  CANCEL_ORDER: "/Orders/Cancel",
  UPDATE_ORDER_NOTES: "/Orders/UpdateNotes",

  // OrderStatus
  GET_ALL_ORDER_STATUSES: "/OrderStatus/GetAll",
  GET_ORDER_STATUS_BY_ID: "/OrderStatus/GetById",
  ADD_ORDER_STATUS: "/OrderStatus/Add",
  UPDATE_ORDER_STATUS_INFO: "/OrderStatus/Update",
  DELETE_ORDER_STATUS: "/OrderStatus/Delete",

  // OrderStatusHistory
  GET_ALL_ORDER_STATUS_HISTORY: "/OrderStatusHistory/GetAll",
  GET_ORDER_STATUS_HISTORY_BY_ID: "/OrderStatusHistory/GetById",
  ADD_ORDER_STATUS_HISTORY: "/OrderStatusHistory/Add",
  UPDATE_ORDER_STATUS_HISTORY: "/OrderStatusHistory/Update",
  DELETE_ORDER_STATUS_HISTORY: "/OrderStatusHistory/Delete",

  // PaymentMethods
  GET_ALL_PAYMENT_METHODS: "/PaymentMethods/GetAll",
  GET_PAYMENT_METHOD_BY_ID: "/PaymentMethods/GetById",
  ADD_PAYMENT_METHOD: "/PaymentMethods/Add",
  UPDATE_PAYMENT_METHOD: "/PaymentMethods/Update",
  DELETE_PAYMENT_METHOD: "/PaymentMethods/Delete",

  // Payments
  GET_ALL_PAYMENTS: "/Payments/GetAll",
  GET_PAYMENT_BY_ID: "/Payments/GetById",
  ADD_PAYMENT: "/Payments/Add",
  UPDATE_PAYMENT: "/Payments/Update",
  DELETE_PAYMENT: "/Payments/Delete",

  // PayPal
  PAYPAL_CREATE_ORDER: "/PayPal/create-order",
  PAYPAL_CAPTURE_ORDER: "/PayPal/capture-order",

  // Permissions
  GET_ALL_PERMISSIONS: "/Permissions/GetAll",
  GET_PERMISSION_BY_ID: "/Permissions/GetById",
  ADD_PERMISSION: "/Permissions/Add",
  UPDATE_PERMISSION: "/Permissions/Update",
  DELETE_PERMISSION: "/Permissions/Delete",

  // Product
  CREATE_PRODUCT: "/Product/CreateProduct",

  // ProductCareInstructions
  GET_ALL_PRODUCT_CARE_INSTRUCTIONS: "/ProductCareInstructions/GetAll",
  GET_PRODUCT_CARE_INSTRUCTION_BY_ID: "/ProductCareInstructions/GetById",
  ADD_PRODUCT_CARE_INSTRUCTION: "/ProductCareInstructions/Add",
  UPDATE_PRODUCT_CARE_INSTRUCTION: "/ProductCareInstructions/Update",
  DELETE_PRODUCT_CARE_INSTRUCTION: "/ProductCareInstructions/Delete",

  // ProductCategories
  GET_ALL_PRODUCT_CATEGORIES: "/ProductCategories/GetAll",
  GET_PRODUCT_CATEGORY_BY_ID: "/ProductCategories/GetById",
  ADD_PRODUCT_CATEGORY: "/ProductCategories/Add",
  UPDATE_PRODUCT_CATEGORY: "/ProductCategories/Update",
  DELETE_PRODUCT_CATEGORY: "/ProductCategories/Delete",

  // ProductReviews
  GET_ALL_PRODUCT_REVIEWS: "/ProductReviews/GetAll",
  GET_PRODUCT_REVIEW_BY_ID: "/ProductReviews/GetById",
  ADD_PRODUCT_REVIEW: "/ProductReviews/Add",
  UPDATE_PRODUCT_REVIEW: "/ProductReviews/Update",
  DELETE_PRODUCT_REVIEW: "/ProductReviews/Delete",

  // Products
  GET_ALL_PRODUCTS: "/Products/GetAll",
  GET_PRODUCT_BY_ID: "/Products/GetById",
  ADD_PRODUCT: "/Products/Add",
  UPDATE_PRODUCT: "/Products/Update",
  DELETE_PRODUCT: "/Products/Delete",

  // Promotions
  GET_ALL_PROMOTIONS: "/Promotions/GetAll",
  GET_PROMOTION_BY_ID: "/Promotions/GetById",
  ADD_PROMOTION: "/Promotions/Add",
  UPDATE_PROMOTION: "/Promotions/Update",
  DELETE_PROMOTION: "/Promotions/Delete",

  // PromotionUsage
  GET_ALL_PROMOTION_USAGE: "/PromotionUsage/GetAll",
  GET_PROMOTION_USAGE_BY_ID: "/PromotionUsage/GetById",
  ADD_PROMOTION_USAGE: "/PromotionUsage/Add",
  UPDATE_PROMOTION_USAGE: "/PromotionUsage/Update",
  DELETE_PROMOTION_USAGE: "/PromotionUsage/Delete",

  // RolePermissions
  GET_ALL_ROLE_PERMISSIONS: "/RolePermissions/GetAll",
  GET_ROLE_PERMISSION_BY_ID: "/RolePermissions/GetById",
  ADD_ROLE_PERMISSION: "/RolePermissions/Add",
  UPDATE_ROLE_PERMISSION: "/RolePermissions/Update",
  DELETE_ROLE_PERMISSION: "/RolePermissions/Delete",

  // Roles
  GET_ALL_ROLES: "/Roles/GetAll",
  GET_ROLE_BY_ID: "/Roles/GetById",
  ADD_ROLE: "/Roles/Add",
  UPDATE_ROLE: "/Roles/Update",
  DELETE_ROLE: "/Roles/Delete",

  // SalesAnalytics
  GET_ALL_SALES_ANALYTICS: "/SalesAnalytics/GetAll",
  GET_SALES_ANALYTIC_BY_ID: "/SalesAnalytics/GetById",
  ADD_SALES_ANALYTIC: "/SalesAnalytics/Add",
  UPDATE_SALES_ANALYTIC: "/SalesAnalytics/Update",
  DELETE_SALES_ANALYTIC: "/SalesAnalytics/Delete",

  // ShipmentItems
  GET_ALL_SHIPMENT_ITEMS: "/ShipmentItems/GetAll",
  GET_SHIPMENT_ITEM_BY_ID: "/ShipmentItems/GetById",
  ADD_SHIPMENT_ITEM: "/ShipmentItems/Add",
  UPDATE_SHIPMENT_ITEM: "/ShipmentItems/Update",
  DELETE_SHIPMENT_ITEM: "/ShipmentItems/Delete",

  // Shipments
  GET_ALL_SHIPMENTS: "/Shipments/GetAll",
  GET_SHIPMENT_BY_ID: "/Shipments/GetById",
  ADD_SHIPMENT: "/Shipments/Add",
  UPDATE_SHIPMENT: "/Shipments/Update",
  DELETE_SHIPMENT: "/Shipments/Delete",

  // ShippingMethods
  GET_ALL_SHIPPING_METHODS: "/ShippingMethods/GetAll",
  GET_SHIPPING_METHOD_BY_ID: "/ShippingMethods/GetById",
  ADD_SHIPPING_METHOD: "/ShippingMethods/Add",
  UPDATE_SHIPPING_METHOD: "/ShippingMethods/Update",
  DELETE_SHIPPING_METHOD: "/ShippingMethods/Delete",

  // ShippingRates
  GET_ALL_SHIPPING_RATES: "/ShippingRates/GetAll",
  GET_SHIPPING_RATE_BY_ID: "/ShippingRates/GetById",
  ADD_SHIPPING_RATE: "/ShippingRates/Add",
  UPDATE_SHIPPING_RATE: "/ShippingRates/Update",
  DELETE_SHIPPING_RATE: "/ShippingRates/Delete",

  // ShippingRestrictions
  GET_ALL_SHIPPING_RESTRICTIONS: "/ShippingRestrictions/GetAll",
  GET_SHIPPING_RESTRICTION_BY_ID: "/ShippingRestrictions/GetById",
  ADD_SHIPPING_RESTRICTION: "/ShippingRestrictions/Add",
  UPDATE_SHIPPING_RESTRICTION: "/ShippingRestrictions/Update",
  DELETE_SHIPPING_RESTRICTION: "/ShippingRestrictions/Delete",

  // ShoppingCart
  GET_SHOPPING_CART_BY_CUSTOMER_ID: "/ShoppingCart/GetByCustomerId/{customerId}",
  GET_ALL_SHOPPING_CARTS: "/ShoppingCart/GetAll",
  GET_SHOPPING_CART_BY_ID: "/ShoppingCart/GetById",
  ADD_SHOPPING_CART: "/ShoppingCart/Add",
  UPDATE_SHOPPING_CART: "/ShoppingCart/Update",
  DELETE_SHOPPING_CART: "/ShoppingCart/Delete",

  // StockAlerts
  GET_ALL_STOCK_ALERTS: "/StockAlerts/GetAll",
  GET_STOCK_ALERT_BY_ID: "/StockAlerts/GetById",
  ADD_STOCK_ALERT: "/StockAlerts/Add",
  UPDATE_STOCK_ALERT: "/StockAlerts/Update",
  DELETE_STOCK_ALERT: "/StockAlerts/Delete",

  // TouristFeatures
  GET_ALL_TOURIST_FEATURES: "/TouristFeatures/GetAll",
  GET_TOURIST_FEATURE_BY_ID: "/TouristFeatures/GetById",
  ADD_TOURIST_FEATURE: "/TouristFeatures/Add",
  UPDATE_TOURIST_FEATURE: "/TouristFeatures/Update",
  DELETE_TOURIST_FEATURE: "/TouristFeatures/Delete",

  // UserAddresses
  GET_USER_ADDRESSES_BY_CUSTOMER_ID: "/UserAddresses/GetByCustomerId/{customerId}",
  GET_ALL_USER_ADDRESSES: "/UserAddresses/GetAll",
  GET_USER_ADDRESS_BY_ID: "/UserAddresses/GetById",
  ADD_USER_ADDRESS: "/UserAddresses/Add",
  UPDATE_USER_ADDRESS: "/UserAddresses/Update",
  DELETE_USER_ADDRESS: "/UserAddresses/Delete",

  // UserLoginHistory
  GET_ALL_USER_LOGIN_HISTORY: "/UserLoginHistory/GetAll",
  GET_USER_LOGIN_HISTORY_BY_ID: "/UserLoginHistory/GetById",
  ADD_USER_LOGIN_HISTORY: "/UserLoginHistory/Add",
  UPDATE_USER_LOGIN_HISTORY: "/UserLoginHistory/Update",
  DELETE_USER_LOGIN_HISTORY: "/UserLoginHistory/Delete",

  // UserOAuthConnections
  GET_ALL_USER_OAUTH_CONNECTIONS: "/UserOAuthConnections/GetAll",
  GET_USER_OAUTH_CONNECTION_BY_ID: "/UserOAuthConnections/GetById",
  ADD_USER_OAUTH_CONNECTION: "/UserOAuthConnections/Add",
  UPDATE_USER_OAUTH_CONNECTION: "/UserOAuthConnections/Update",
  DELETE_USER_OAUTH_CONNECTION: "/UserOAuthConnections/Delete",

  // Users
  LOGIN: "/Users/Authenticate",
  SIGNUP: "/Users/SignUp",
  GET_ALL_USERS: "/Users/GetAll",
  GET_USER_BY_ID: "/Users/GetById",
  ADD_USER: "/Users/Add",
  UPDATE_USER: "/Users/Update",
  DELETE_USER: "/Users/Delete",

  // UserSessions
  GET_ALL_USER_SESSIONS: "/UserSessions/GetAll",
  GET_USER_SESSION_BY_ID: "/UserSessions/GetById",
  ADD_USER_SESSION: "/UserSessions/Add",
  UPDATE_USER_SESSION: "/UserSessions/Update",
  DELETE_USER_SESSION: "/UserSessions/Delete",

  // WebsiteAnalytics
  GET_ALL_WEBSITE_ANALYTICS: "/WebsiteAnalytics/GetAll",
  GET_WEBSITE_ANALYTIC_BY_ID: "/WebsiteAnalytics/GetById",
  ADD_WEBSITE_ANALYTIC: "/WebsiteAnalytics/Add",
  UPDATE_WEBSITE_ANALYTIC: "/WebsiteAnalytics/Update",
  DELETE_WEBSITE_ANALYTIC: "/WebsiteAnalytics/Delete",

  // Wishlist
  GET_ALL_WISHLISTS: "/Wishlist/GetAll",
  GET_WISHLIST_BY_ID: "/Wishlist/GetById",
  ADD_WISHLIST: "/Wishlist/Add",
  UPDATE_WISHLIST: "/Wishlist/Update",
  DELETE_WISHLIST: "/Wishlist/Delete",

  // WoodTypes
  GET_ALL_WOOD_TYPES: "/WoodTypes/GetAll",
  GET_WOOD_TYPE_BY_ID: "/WoodTypes/GetById",
  ADD_WOOD_TYPE: "/WoodTypes/Add",
  UPDATE_WOOD_TYPE: "/WoodTypes/Update",
  DELETE_WOOD_TYPE: "/WoodTypes/Delete",

  // Returns & Refunds
  GET_ALL_RETURN_REQUESTS: "/Returns/GetAll",
  GET_RETURN_REQUEST_BY_ID: "/Returns/GetById",
  CREATE_RETURN_REQUEST: "/Returns/Create",
  UPDATE_RETURN_REQUEST: "/Returns/Update",
  DELETE_RETURN_REQUEST: "/Returns/Delete",
  APPROVE_RETURN_REQUEST: "/Returns/Approve",
  REJECT_RETURN_REQUEST: "/Returns/Reject",
  GET_RETURNS_BY_ORDER: "/Returns/GetByOrder",
  GET_RETURNS_BY_CUSTOMER: "/Returns/GetByCustomer",

  // RMA Management
  GET_ALL_RMA: "/RMA/GetAll",
  GET_RMA_BY_ID: "/RMA/GetById",
  CREATE_RMA: "/RMA/Create",
  UPDATE_RMA: "/RMA/Update",
  DELETE_RMA: "/RMA/Delete",
  GENERATE_RMA_NUMBER: "/RMA/GenerateNumber",

  // Refund Handling
  GET_ALL_REFUNDS: "/Refunds/GetAll",
  GET_REFUND_BY_ID: "/Refunds/GetById",
  CREATE_REFUND: "/Refunds/Create",
  UPDATE_REFUND: "/Refunds/Update",
  DELETE_REFUND: "/Refunds/Delete",
  PROCESS_REFUND: "/Refunds/Process",
  GET_REFUNDS_BY_ORDER: "/Refunds/GetByOrder",

  // Restock Items
  GET_ALL_RESTOCK_ITEMS: "/RestockItems/GetAll",
  GET_RESTOCK_ITEM_BY_ID: "/RestockItems/GetById",
  CREATE_RESTOCK_ITEM: "/RestockItems/Create",
  UPDATE_RESTOCK_ITEM: "/RestockItems/Update",
  DELETE_RESTOCK_ITEM: "/RestockItems/Delete",
  RESTOCK_ITEM: "/RestockItems/Restock",

  // Damaged Goods
  GET_ALL_DAMAGED_GOODS: "/DamagedGoods/GetAll",
  GET_DAMAGED_GOOD_BY_ID: "/DamagedGoods/GetById",
  CREATE_DAMAGED_GOOD: "/DamagedGoods/Create",
  UPDATE_DAMAGED_GOOD: "/DamagedGoods/Update",
  DELETE_DAMAGED_GOOD: "/DamagedGoods/Delete",
  MARK_AS_DAMAGED: "/DamagedGoods/MarkAsDamaged",
};