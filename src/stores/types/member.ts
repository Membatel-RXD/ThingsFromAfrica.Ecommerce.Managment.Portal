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
