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

export interface User {
  roleId: number
  passwordHash: string
  username: string
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
  categoryId: number;
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
  artisanId: number;
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
  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
  deletedAt: string; // ISO date string
  deletedBy: number;
}
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
export interface Customer{
  
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