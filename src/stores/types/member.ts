export interface LoginCredentials {
    Email: string;
    password: string;
  }
  export enum UserStatus {
    Pending = "Pending",
    Suspended = "Suspended",
    Inactive = "Inactive",
    Active = "Active"
}
export enum UserRole {
    SuperAdmin = "SuperAdmin",
    Admin = "Admin",
    Manager = "Manager",
    Staff = "Staff",
    Customer = "Customer",
    Guest = "Guest"
}
export interface UserRoleRequest {
  roleId: number;
  roleName: string;
  roleDescription: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string
}

export interface AuthenticationResponse {
  token: string;
  tokenExpiration: string; 
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  userRole: UserRoleRequest;
  userName: string;
}

export interface CreateUsersRequest {
  roleId: number // required
  passwordHash?: string | null
  username?: string | null
  email?: string | null
  emailVerified?: boolean | null
  emailVerificationToken?: string | null
  emailVerificationExpiry?: string | null // ISO string or null
  passwordSalt?: string | null
  passwordResetToken?: string | null
  passwordResetExpiry?: string | null
  lastPasswordChange?: string | null
  isLocked?: boolean | null
  lockoutEndDate?: string | null
  failedLoginAttempts?: number | null
  lastLoginAt?: string | null
  lastLoginIP?: string | null
  twoFactorEnabled?: boolean | null
  twoFactorSecret?: string | null
  twoFactorBackupCodes?: string | null
  userStatus?: string | null
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  dateOfBirth?: string | null // YYYY-MM-DD or null
  gender?: string | null
  profileImageUrl?: string | null
  phoneNumber?: string | null
  phoneVerified?: boolean | null
  phoneVerificationCode?: string | null
  phoneVerificationExpiry?: string | null
  preferredLanguage?: string | null
  preferredCurrency?: string | null
  timeZone?: string | null
  notificationPreferences?: string | null
  createdAt?: string | null
  modifiedAt?: string | null
  lastActiveAt?: string | null
}
export interface Product {
  weight: number;
  length: number;
  width: number;
  height: number;
  basePrice: number;
  productId: number;
  productName: string;
  productSlug: string;
  sku: string;
  itemCode: string;
  categoryId: number|null;
  craftTypeId: number;
  woodTypeId: number;
  productDescription: string;
  shortDescription: string;
  touristPrice: number;
  localPrice: number;
  costPrice: number;
  currency: string;
  usdPrice: number;
  woodType: string;
  woodOrigin: string;
  craftingTechnique: string;
  craftingTime: string;
  difficultyLevel: string;
  artisanId: number|null;
  artisanName: string;
  artisanVillage: string;
  artisanStory: string;
  culturalSignificance: string;
  tribalOrigin: string;
  culturalStory: string;
  traditionalUse: string;
  woodGrain: string;
  woodColor: string;
  woodHardness: string;
  woodFinish: string;
  condition: string;
  qualityGrade: string;
  handmadeLevel: string;
  stockQuantity: number;
  isUnique: boolean;
  lowStockThreshold: number;
  stockStatus: string;
  productStatus: string;
  isVisible: boolean;
  isFeatured: boolean;
  isAuthentic: boolean;
  isCertified: boolean;
  mainImageUrl: string;
  galleryImages: string;
  processImages: string;
  artisanImage: string;
  videoUrl: string;
  isPopularWithTourists: boolean;
  touristFriendlySize: boolean;
  packingFriendly: boolean;
  shippingFragile: boolean;
  isSouvenir: boolean;
  souvenirType: string;
  giftWrappingAvailable: boolean;
  personalizationAvailable: boolean;
  careInstructions: string;
  cleaningInstructions: string;
  storageInstructions: string;
  shippingWeight: number;
  packagingRequired: string;
  shippingRestrictions: string;
  customsCode: string;
  requiresPhytosanitaryCertificate: boolean;
  averageRating: number;
  reviewCount: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  yearMade: number;
  isAntique: boolean;
  ageCategory: string;
  customAttributes: string;
  createdAt: string; 
  modifiedAt: string; 
  createdBy: number;
  modifiedBy: number|null;
  isDeleted: boolean;
  deletedAt: string|null;
  deletedBy: number|number;
}

export interface CreateProductRequest extends Omit<Product,'productId' 
    | 'deletedBy' |
     'isDeleted' |
     'modifiedAt'|
     'createdAt'|
     'artisanImage'|
      'deletedAt'>{};

export interface Order {
  statusId: number;
  orderStatus: string;
  customerEmail: string;
  orderId: number;
  orderNumber: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingStateProvince: string;
  billingPostalCode: string;
  billingCountryCode: string;
  billingCountryName: string;
  billingCompany: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingStateProvince: string;
  shippingPostalCode: string;
  shippingCountryCode: string;
  shippingCountryName: string;
  shippingCompany: string;
  subTotal: number;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  currency: string;
  isTouristOrder: boolean;
  touristCountry: string;
  requiresPhytosanitaryCertificate: boolean;
  customerNotes: string;
  adminNotes: string;
  orderDate: string; // ISO date string
  requiredDate: string; // ISO date string
  shippedDate: string; // ISO date string
  deliveredDate: string; // ISO date string
  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string
  createdBy: number;
  modifiedBy: number;
  customerId: number;
  customerPhone: string;
  status: string;
}

export interface AddressDTO {
  addressId: number
  userId: number
  addressLine1: string
  addressLine2: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
  contactName: string
  contactPhone: string
  addressType: string
  isActive: boolean
  isDefault: boolean
  createdAt: string // ISO 8601 date string
  modifiedAt: string // ISO 8601 date string
}

export interface Customer{
  userId: number
  customerType: string
  companyName: string
  taxId: string
  marketingOptIn: boolean
  newsletterOptIn: boolean
  smsOptIn: boolean
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string // ISO 8601 date string
  customerLifetimeValue: number
  loyaltyPoints: number
  loyaltyTier: string
  createdAt: string // ISO 8601 date string
  modifiedAt: string // ISO 8601 date string
}

export interface User {
  roleId: number
  passwordHash: string
  username: string
  userId:number;
  email: string
  emailVerified: boolean
  emailVerificationToken: string
  emailVerificationExpiry: string // ISO date string
  passwordSalt: string
  passwordResetToken: string
  passwordResetExpiry: string // ISO date string
  lastPasswordChange: string // ISO date string
  isLocked: boolean
  lockoutEndDate: string // ISO date string
  failedLoginAttempts: number
  lastLoginAt: string // ISO date string
  lastLoginIP: string
  twoFactorEnabled: boolean
  twoFactorSecret: string
  twoFactorBackupCodes: string
  userStatus: string // or UserStatus enum
  firstName: string
  lastName: string
  displayName: string
  dateOfBirth: string // YYYY-MM-DD
  gender: string // or Gender enum
  profileImageUrl: string
  phoneNumber: string
  phoneVerified: boolean
  phoneVerificationCode: string
  phoneVerificationExpiry: string // ISO date string
  preferredLanguage: string
  preferredCurrency: string
  timeZone: string
  notificationPreferences: string
  createdAt: string // ISO date string
  modifiedAt: string // ISO date string
  lastActiveAt: string // ISO date string
}

export interface CustomerProfileContainerDTO {
  customerProfile: Customer
  userDetails: User
  userAddresses: AddressDTO[]
}

export interface WoodCreatetionRequest {
  woodName: string;
  woodDescription: string;
  woodCharacteristics: string;
  woodOrigin: string;
  woodHardness: string;
  woodColor: string;
  isNative: boolean;
  isRare: boolean;
  isActive: boolean;
  createdAt: string; 
}
export interface WoodType extends WoodCreatetionRequest {
  woodTypeId: number;
}
export interface CreateProductCategory{
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
  categoryImageUrl: string;
  isTouristFavorite: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string; 
}
export interface  ProductCategory  extends CreateProductCategory{
  categoryId: number;
}
export interface CraftTypeCreationRequest {
  craftTypeName: string;
  craftTypeDescription: string;
  isActive: boolean;
  createdAt: string; 
}
export interface CraftType extends CraftTypeCreationRequest {
  craftTypeId: number;
}

export interface OrderDto {
  statusId: number;
  orderStatus: string;
  customerEmail: string;
  orderId: number;
  orderNumber: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddressLine1: string;
  billingCity: string;
  billingCountryCode: string;
  billingCountryName: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddressLine1: string;
  shippingCity: string;
  shippingCountryCode: string;
  shippingCountryName: string;
  subTotal: number;
  totalAmount: number;
  currency: string;
  isTouristOrder: boolean;
  touristCountry: string;
  requiresPhytosanitaryCertificate: boolean;
  customerNotes: string;
  adminNotes: string;
  orderDate: string; // ISO 8601 date string
  requiredDate: string;
  shippedDate: string;
  deliveredDate: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: number;
  modifiedBy: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  shippingStateProvince: string;
  shippingPostalCode: string;
  shippingAddressLine2: string;
  shippingCompany: string;
  billingStateProvince: string;
  billingPostalCode: string;
  billingAddressLine2: string;
  billingCompany: string;
  customerId: number;
  customerPhone: string;
}

export interface OrderCreationRequest {
  customerEmail: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddressLine1: string;
  billingCity: string;
  billingCountryCode: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddressLine1: string;
  shippingCity: string;
  shippingCountryCode: string;
  subTotal: number;
  totalAmount: number;
  currency: string;
  isTouristOrder?: boolean;
  touristCountry?: string;
  requiresPhytosanitaryCertificate?: boolean;
  customerNotes?: string;
  adminNotes?: string;
  requiredDate?: string;
  taxAmount?: number;
  shippingAmount?: number;
  discountAmount?: number;
  shippingStateProvince?: string;
  shippingPostalCode?: string;
  shippingAddressLine2?: string;
  shippingCompany?: string;
  billingStateProvince?: string;
  billingPostalCode?: string;
  billingAddressLine2?: string;
  billingCompany?: string;
  customerId: number;
  customerPhone?: string;
}

export interface ArtisanDTO {
 // ISO 8601 date string
 artisanId: number
 artisanName: string
 artisanSlug: string
 village: string
 region: string
 biography: string
 yearsOfExperience: number
 specialization: string
 contactPhone: string
 contactEmail: string
 profileImageUrl: string
 isActive: boolean
 createdAt?: string // ISO 8601 date string
 modifiedAt?: string
}

 export interface  ProductCreationRequestWithImages {
  productName: string; // Required, length 1-255
  productSlug: string; // Required, max length 255
  sku: string;         // Required, max length 100
  itemCode?: string;   // Optional, max length 100
  isDeleted?:boolean;
  categoryId?: number | null;
  craftTypeId?: number | null;
  woodTypeId?: number | null;

  productDescription?: string;  // max length 2000
  shortDescription?: string;    // max length 500

  basePrice: number;      // >= 0
  touristPrice: number;   // >= 0
  localPrice: number;     // >= 0
  costPrice: number;      // >= 0

  currency?: string;      // max length 3, default "USD"

  usdPrice: number;       // >= 0
  weight: number;         // >= 0
  length: number;         // >= 0
  width: number;          // >= 0
  height: number;         // >= 0

  woodType?: string;          // max length 100
  woodOrigin?: string;        // max length 100
  craftingTechnique?: string; // max length 200
  craftingTime?: string;      // max length 100
  difficultyLevel?: string;   // max length 50

  artisanId?: number | null;
  artisanName?: string;       // max length 200
  artisanVillage?: string;    // max length 200
  artisanStory?: string;      // max length 1000
  culturalSignificance?: string; // max length 1000
  tribalOrigin?: string;      // max length 200
  culturalStory?: string;     // max length 1000
  traditionalUse?: string;    // max length 500

  woodGrain?: string;         // max length 100
  woodColor?: string;         // max length 100
  woodHardness?: string;      // max length 100
  woodFinish?: string;        // max length 100
  condition?: string;         // max length 100

  qualityGrade?: string;      // max length 50
  handmadeLevel?: string;     // max length 50

  stockQuantity: number;      // >= 0

  isUnique: boolean;

  lowStockThreshold: number;  // >= 0

  stockStatus?: string;       // max length 50
  productStatus?: string;     // max length 50, default "draft"

  isVisible?: boolean;        // default true
  isFeatured: boolean;
  isAuthentic?: boolean;      // default true
  isCertified: boolean;

  videoUrl?: string;          // URL string

  isPopularWithTourists: boolean;
  touristFriendlySize: boolean;
  packingFriendly: boolean;
  shippingFragile: boolean;
  isSouvenir: boolean;

  souvenirType?: string;      // max length 100

  giftWrappingAvailable: boolean;
  personalizationAvailable: boolean;

  careInstructions?: string;      // max length 500
  cleaningInstructions?: string;  // max length 500
  storageInstructions?: string;   // max length 500

  shippingWeight: number;      // >= 0

  packagingRequired?: string;      // max length 200
  shippingRestrictions?: string;   // max length 500
  customsCode?: string;            // max length 50

  requiresPhytosanitaryCertificate: boolean;

  averageRating: number;      // 0 to 5
  reviewCount: number;        // >= 0

  metaTitle?: string;         // max length 200
  metaDescription?: string;   // max length 500
  metaKeywords?: string;      // max length 500

  yearMade: number;           // 1800 to 2100
  isAntique: boolean;

  ageCategory?: string;       // max length 100
  customAttributes?: string;  // max length 1000

  createdBy: number;          // Required

  // File uploads: in TypeScript this would be handled differently,
  // possibly using File or Blob types in frontend
  mainImageFile?: File | null;
  galleryImageFiles?: File[] | null;
  processImageFiles?: File[] | null;
  artisanImageFile?: File | null;
}


export type CreateArtisanRequest = Omit<ArtisanDTO, 'artisanId' | 'createdAt' | 'modifiedAt'>
export interface PromotionDTO {
  discountTypeId: number
  discountValue: number
  promotionId: number
  promotionName: string
  startDate: string // ISO 8601 date string e.g. "2025-07-07T12:05:36.980Z"
  endDate: string   // ISO 8601 date string
  isActive: boolean
  createdAt: string // ISO 8601 date string
  createdBy: number
  promotionCode: string
  description: string
  isPercentage: boolean
  minimumOrderAmount: number
  maximumDiscountAmount: number
  maxUsageCount: number
  currentUsageCount: number
  maxUsagePerCustomer: number
  isTouristOnly: boolean
  applicableCountries: string // comma-separated country codes or names
}
export type CreatePromotionRequest = Omit<PromotionDTO, 'promotionId' | 'createdAt'>
export interface PaymentDTO {
  paymentId: number
  orderId: number
  paymentMethodId: number
  paymentAmount: number
  currency: string
  paymentStatus: string
  transactionId: string
  paymentReference: string
  paymentGateway: string
  processorResponse: string
  paymentDate: string // ISO 8601 date string
  processedDate: string // ISO 8601 date string
  createdAt: string // ISO 8601 date string
  createdBy: number|null
}
export interface CreatePaymentRequest extends Omit<PaymentDTO, 'paymentId' | 'createdAt' | 'processedDate'> {}
export interface PaymentMethodDTO {
  paymentMethodId: number
  methodName: string
  methodCode: string
  isActive: boolean
  isOnline: boolean
  sortOrder: number
  description: string
}
export interface CreatePaymentMethodRequest extends Omit<PaymentMethodDTO, 'paymentMethodId'> {}

export interface Review {
  rating: number;
  reviewId: number;
  productId: number;
  customerId: number;
  orderId: number;
  reviewTitle: string;
  reviewText: string;
  isTouristReview: boolean;
  reviewerCountry: string;
  isApproved: boolean;
  isVisible: boolean;
  moderatedBy: number;
  moderatedAt: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ReviewCreateOrUpdate {
  rating: number;
  productId: number;
  customerId: number;
  orderId: number;
  reviewTitle: string;
  reviewText: string;
  isTouristReview: boolean;
  reviewerCountry: string;
  isApproved: boolean;
  isVisible: boolean;
  moderatedBy: number;
  moderatedAt: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ShipmentDTO {
  shipmentId: number;
  orderId: number;
  shippingMethodId: number;
  trackingNumber: string;
  carrierName: string;
  shippingLabelUrl: string;
  shipmentStatus: string;
  packageWeight: number;
  packageLength: number;
  packageWidth: number;
  packageHeight: number;
  packagingNotes: string;
  requiresPhytosanitaryCertificate: boolean;
  phytosanitaryCertificateNumber: string;
  customsDeclarationNumber: string;
  shippedDate: string; // ISO 8601 date string
  estimatedDeliveryDate: string; // ISO 8601 date string
  actualDeliveryDate: string; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  createdBy: number;
}
export interface CreateShipment extends Omit<ShipmentDTO,'shipmentId'>{}