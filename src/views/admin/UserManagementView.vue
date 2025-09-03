<template>
  <div class="user-management-view">
    <v-container fluid class="pa-6">
      <!-- Page Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-orange-darken-3">User Management</h1>
          <p class="text-body-1 text-grey-darken-1 mt-1">
            Manage system users and their access
          </p>
        </div>
        <v-btn
          color="orange-darken-2"
          variant="elevated"
          prepend-icon="mdi-account-plus"
          @click="openCreateDialog"
        >
          Add User
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="orange-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-3" size="40" class="me-3">mdi-account-group</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-orange-darken-3">{{ totalUsers }}</h3>
                <p class="text-body-2 text-orange-darken-1">Total Users</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" size="40" class="me-3">mdi-account-check</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-green-darken-3">{{ activeUsers }}</h3>
                <p class="text-body-2 text-green-darken-1">Active Users</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="blue-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-3" size="40" class="me-3">mdi-lock-alert</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-blue-darken-3">{{ lockedUsers }}</h3>
                <p class="text-body-2 text-blue-darken-1">Locked Users</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="purple-darken-3" size="40" class="me-3">mdi-shield-key</v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-purple-darken-3">{{ twoFactorUsers }}</h3>
                <p class="text-body-2 text-purple-darken-1">2FA Enabled</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                label="Search users..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="statusFilter"
                label="Status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="roleFilter"
                label="Role"
                :items="roleFilterOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-btn
                color="orange-darken-2"
                variant="outlined"
                block
                @click="clearFilters"
              >
                Clear Filters
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Users Data Table -->
      <v-card>
        <v-card-title class="pa-6 bg-orange-lighten-5">
          <v-icon class="me-2" color="orange-darken-3">mdi-account-group</v-icon>
          User Management
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :loading="loading"
          class="elevation-1"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        >
          <template v-slot:[`item.profileImageUrl`]="{ item }">
            <v-avatar size="40" class="ma-2">
              <v-img 
                v-if="item.profileImageUrl" 
                :src="item.profileImageUrl" 
                :alt="item.displayName || item.username" 
              />
              <v-icon v-else color="grey">mdi-account</v-icon>
            </v-avatar>
          </template>
          
          <template v-slot:[`item.displayName`]="{ item }">
            <div>
              <div class="font-weight-bold">
                {{ item.displayName || `${item.firstName} ${item.lastName}` }}
              </div>
              <div class="text-caption text-grey-darken-1">{{ item.username }}</div>
            </div>
          </template>
          
          <template v-slot:[`item.email`]="{ item }">
            <span class="text-caption">{{ item.email }}</span>
          </template>
          
          <template v-slot:[`item.role`]="{ item }">
            <v-chip 
              :color="getRoleColor(item.roleId)" 
              size="small" 
              variant="flat"
            >
              {{ getRoleName(item.roleId) }}
            </v-chip>
          </template>
          
          <template v-slot:[`item.userStatus`]="{ item }">
            <v-chip 
              :color="item.isLocked ? 'red' : 'green'" 
              size="small" 
              variant="flat"
            >
              {{ item.isLocked ? 'Locked' : 'Active' }}
            </v-chip>
          </template>
          
          <template v-slot:[`item.lastLoginAt`]="{ item }">
            <span class="text-caption">{{ formatDate(item.lastLoginAt) }}</span>
          </template>
          
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn 
              icon="mdi-eye" 
              variant="text" 
              size="small" 
              color="blue" 
              @click="viewUser(item)"
              :disabled="actionLoading"
            />
            <v-btn 
              icon="mdi-pencil" 
              variant="text" 
              size="small" 
              color="primary" 
              @click="openEditDialog(item)"
              :disabled="actionLoading"
            />
            <v-btn 
              :icon="item.isLocked ? 'mdi-lock-open' : 'mdi-lock'" 
              variant="text" 
              size="small" 
              color="warning" 
              @click="toggleLock(item)"
              :disabled="actionLoading"
              :loading="lockingUserId === item.userId"
            />
            <v-btn 
              icon="mdi-delete" 
              variant="text" 
              size="small" 
              color="error" 
              @click="confirmDeleteUser(item)"
              :disabled="actionLoading"
            />
          </template>
        </v-data-table>
      </v-card>

      <!-- Add User Dialog -->
      <v-dialog v-model="addDialog" max-width="600" persistent>
        <v-card>
          <v-card-title class="text-h5">Add New User</v-card-title>
          <v-card-subtitle>Default password will be generated if not provided</v-card-subtitle>
          
          <v-card-text>
            <v-form ref="addUserForm" v-model="addUserValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="newUser.firstName" 
                    label="First Name" 
                    :rules="[rules.required]" 
                    required 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="newUser.lastName" 
                    label="Last Name" 
                    :rules="[rules.required]" 
                    required 
                  />
                </v-col>
              </v-row>
              
              <v-text-field 
                v-model="newUser.username" 
                label="Username" 
                :rules="[rules.required, rules.minLength(3)]" 
                required 
              />
              
              <v-text-field 
                v-model="newUser.email" 
                label="Email" 
                :rules="[rules.required, rules.email]" 
                required 
              />
              
              <v-text-field 
                v-model="newUser.password" 
                label="Password (Optional)" 
                :rules="newUser.password ? [rules.minLength(6)] : []" 
                type="password"
                hint="Leave empty to generate default password"
              />
              
              <v-select 
                v-model="newUser.roleId" 
                :items="roleSelectOptions" 
                label="Role" 
                :rules="[rules.required]" 
                required 
              />
              
              <v-text-field 
                v-model="newUser.phoneNumber" 
                label="Phone Number (Optional)" 
                :rules="newUser.phoneNumber ? [rules.phone] : []"
              />
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="closeAddDialog" :disabled="adding">
              Cancel
            </v-btn>
            <v-btn 
              color="primary" 
              :disabled="!addUserValid" 
              @click="addUser"
              :loading="adding"
            >
              Add User
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- View User Dialog -->
      <v-dialog v-model="viewDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">User Details</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img 
                      v-if="selectedUser.profileImageUrl" 
                      :src="selectedUser.profileImageUrl" 
                    />
                    <v-icon v-else>mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>
                  {{ selectedUser.displayName || `${selectedUser.firstName} ${selectedUser.lastName}` }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ selectedUser.username }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <v-divider class="my-4" />
            
            <div class="mb-3">
              <strong>Email:</strong> {{ selectedUser.email }}
            </div>
            <div class="mb-3">
              <strong>Phone:</strong> {{ selectedUser.phoneNumber || 'Not provided' }}
            </div>
            <div class="mb-3">
              <strong>Role:</strong> 
              <v-chip :color="getRoleColor(selectedUser.roleId)" size="small" class="ml-2">
                {{ getRoleName(selectedUser.roleId) }}
              </v-chip>
            </div>
            <div class="mb-3">
              <strong>Status:</strong> 
              <v-chip 
                :color="selectedUser.isLocked ? 'red' : 'green'" 
                size="small" 
                class="ml-2"
              >
                {{ selectedUser.isLocked ? 'Locked' : 'Active' }}
              </v-chip>
            </div>
            <div class="mb-3">
              <strong>Email Verified:</strong> 
              <v-icon :color="selectedUser.emailVerified ? 'green' : 'red'" class="ml-2">
                {{ selectedUser.emailVerified ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
            </div>
            <div class="mb-3">
              <strong>2FA Enabled:</strong> 
              <v-icon :color="selectedUser.twoFactorEnabled ? 'green' : 'red'" class="ml-2">
                {{ selectedUser.twoFactorEnabled ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
            </div>
            <div class="mb-3">
              <strong>Last Login:</strong> {{ formatDate(selectedUser.lastLoginAt) }}
            </div>
            <div class="mb-3">
              <strong>Created:</strong> {{ formatDate(selectedUser.createdAt) }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="viewDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Edit User Dialog -->
      <v-dialog v-model="editDialog" max-width="600" persistent>
        <v-card>
          <v-card-title class="text-h5">Edit User</v-card-title>
          <v-card-text>
            <v-form ref="editUserForm" v-model="editUserValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="editUser.firstName" 
                    label="First Name" 
                    :rules="[rules.required]" 
                    required 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="editUser.lastName" 
                    label="Last Name" 
                    :rules="[rules.required]" 
                    required 
                  />
                </v-col>
              </v-row>
              
              <v-text-field 
                v-model="editUser.username" 
                label="Username" 
                :rules="[rules.required, rules.minLength(3)]" 
                required 
              />
              
              <v-text-field 
                v-model="editUser.email" 
                label="Email" 
                :rules="[rules.required, rules.email]" 
                required 
              />
              
              <v-select 
                v-model="editUser.roleId" 
                :items="roleSelectOptions" 
                label="Role" 
                :rules="[rules.required]" 
                required 
              />
              
              <v-text-field 
                v-model="editUser.phoneNumber" 
                label="Phone Number" 
                :rules="editUser.phoneNumber ? [rules.phone] : []"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="closeEditDialog" :disabled="updating">
              Cancel
            </v-btn>
            <v-btn 
              color="primary" 
              :disabled="!editUserValid" 
              @click="updateUser"
              :loading="updating"
            >
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete User Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5">Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete user <strong>{{ userToDelete?.username }}</strong>? 
            This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="deleteDialog = false" :disabled="deleting">
              Cancel
            </v-btn>
            <v-btn 
              color="error" 
              @click="deleteUser"
              :loading="deleting"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar for notifications -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
        location="top right"
      >
        {{ snackbar.message }}
        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar.show = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
//import { useCustomerStore } from '@/stores/customer';
import type { SystemUserRoles, UserAccount, UserDTO } from '@/stores/types/member';
import { apiService, type IAPIResponse } from '@/services/api';

const userStore = useUserStore();
//const customerStore = useCustomerStore();

// State
const users = computed(() => userStore.users);
const roleOptions = ref<SystemUserRoles[]>([]);
const loading = ref(false);
const actionLoading = ref(false);
const adding = ref(false);
const updating = ref(false);
const deleting = ref(false);
const lockingUserId = ref<number | null>(null);

// Filters
const search = ref('');
const statusFilter = ref('All');
const roleFilter = ref('All');

const statusOptions = ['All', 'Active', 'Locked'];

// Computed options for role filter
const roleFilterOptions = computed(() => [
  'All',
  ...roleOptions.value.map(role => role.roleName)
]);

const roleSelectOptions = computed(() =>
  roleOptions.value.map(role => ({
    title: role.roleName,
    value: role.roleId
  }))
);

// Table headers
const headers = [
  { title: 'Photo', key: 'profileImageUrl', sortable: false },
  { title: 'Name', key: 'displayName', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Status', key: 'userStatus', sortable: true },
  { title: 'Last Login', key: 'lastLoginAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Dialog states
const addDialog = ref(false);
const viewDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

// Form states
const addUserForm = ref();
const editUserForm = ref();
const addUserValid = ref(false);
const editUserValid = ref(false);

// User objects
const selectedUser = ref<UserDTO>({} as UserDTO);
const editUser = ref<UserDTO>({} as UserDTO);
const userToDelete = ref<UserDTO | null>(null);

const newUser = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  roleId: null as number | null,
  phoneNumber: ''
});

// Snackbar for notifications
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Validation rules
const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email address',
  minLength: (len: number) => (v: string) => 
    (v && v.length >= len) || `Must be at least ${len} characters`,
  phone: (v: string) => 
    !v || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(v) || 'Please enter a valid phone number'
};

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value;
  
  // Status filter
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(u => 
      statusFilter.value === 'Active' ? !u.isLocked : u.isLocked
    );
  }
  
  // Role filter
  if (roleFilter.value !== 'All') {
    const selectedRole = roleOptions.value.find(role => role.roleName === roleFilter.value);
    if (selectedRole) {
      filtered = filtered.filter(u => u.roleId === selectedRole.roleId);
    }
  }
  
  // Search filter
  if (search.value) {
    const s = search.value.toLowerCase();
    filtered = filtered.filter(u =>
      (u.displayName && u.displayName.toLowerCase().includes(s)) ||
      (u.firstName && u.firstName.toLowerCase().includes(s)) ||
      (u.lastName && u.lastName.toLowerCase().includes(s)) ||
      (u.username && u.username.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s))
    );
  }
  
  return filtered;
});

const totalUsers = computed(() => users.value.length);
const activeUsers = computed(() => users.value.filter(u => !u.isLocked).length);
const lockedUsers = computed(() => users.value.filter(u => u.isLocked).length);
const twoFactorUsers = computed(() => users.value.filter(u => u.twoFactorEnabled).length);

// Utility functions
function formatDate(dateStr: string) {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function getRoleName(roleId: number): string {
  const role = roleOptions.value.find(r => r.roleId === roleId);
  return role?.roleName || 'Unknown';
}

function getRoleColor(roleId: number): string {
  const role = roleOptions.value.find(r => r.roleId === roleId);
  if (!role) return 'grey';
  
  // Color mapping based on common role types
  if (role.roleName.toLowerCase().includes('admin')) return 'red';
  if (role.roleName.toLowerCase().includes('manager')) return 'orange';
  if (role.roleName.toLowerCase().includes('supervisor')) return 'purple';
  return 'primary';
}

function showSnackbar(message: string, color: string = 'success') {
  snackbar.value = {
    show: true,
    message,
    color
  };
}

function clearFilters() {
  search.value = '';
  statusFilter.value = 'All';
  roleFilter.value = 'All';
}

// API functions
async function getUserRoles() {
  try {
    const response = await apiService.get<IAPIResponse<SystemUserRoles[]>>('Roles/GetAll');
    if (response?.isSuccessful && response.payload) {
      roleOptions.value = response.payload.filter(a => a.isActive === true);
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    showSnackbar('Failed to load roles', 'error');
  }
}

// User management functions
function openCreateDialog() {
  newUser.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    roleId: null,
    phoneNumber: ''
  };
  addDialog.value = true;
}

function closeAddDialog() {
  addDialog.value = false;
  newUser.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    roleId: null,
    phoneNumber: ''
  };
}

async function addUser() {
  if (!addUserForm.value?.validate()) return;
  
  adding.value = true;
  try {
    const user: UserAccount = {
      username: newUser.value.username,
      email: newUser.value.email,
      displayName: `${newUser.value.firstName} ${newUser.value.lastName}`,
      firstName: newUser.value.firstName,
      lastName: newUser.value.lastName,
      profileImageUrl: '',
      phoneNumber: newUser.value.phoneNumber || '',
      phoneVerified: false,
      emailVerified: true,
      isLocked: false,
      lastLoginAt: '',
      twoFactorEnabled: false,
      userStatus: 'active',
      passwordHash: newUser.value.password || 'defaultPassword',
      passwordSalt: newUser.value.password || 'defaultPassword',
      createdAt: new Date().toISOString(),
      roleId: newUser.value.roleId || 0,
      emailVerificationToken: '',
      emailVerificationExpiry: '',
      passwordResetToken: '',
      passwordResetExpiry: '',
      lastPasswordChange: '',
      lockoutEndDate: '',
      failedLoginAttempts: 0,
      lastLoginIP: '',
      twoFactorSecret: '',
      twoFactorBackupCodes: '',
      dateOfBirth: '',
      gender: '',
      phoneVerificationCode: '',
      phoneVerificationExpiry: '',
      preferredLanguage: '',
      preferredCurrency: '',
      timeZone: '',
      notificationPreferences: '',
      modifiedAt: '',
      lastActiveAt: ''
    };

    const response = await userStore.CreateNewUser(user);
    
    if (response.isSuccessful) {
      showSnackbar('User created successfully');
      closeAddDialog();
    } else {
      showSnackbar(response.message || 'Failed to create user', 'error');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    showSnackbar('Failed to create user', 'error');
  } finally {
    adding.value = false;
  }
}

function viewUser(user: UserDTO) {
  selectedUser.value = { ...user };
  viewDialog.value = true;
}

function openEditDialog(user: UserDTO) {
  editUser.value = { ...user };
  editDialog.value = true;
}

function closeEditDialog() {
  editDialog.value = false;
  editUser.value = {} as UserDTO;
}

async function updateUser() {
  if (!editUserForm.value?.validate()) return;
  
  updating.value = true;
  try {
    const response = await userStore.updateUser(editUser.value);
    
    if (response.isSuccessful) {
      showSnackbar('User updated successfully');
      closeEditDialog();
    } else {
      showSnackbar(response.message || 'Failed to update user', 'error');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    showSnackbar('Failed to update user', 'error');
  } finally {
    updating.value = false;
  }
}

async function toggleLock(user: UserDTO) {
  lockingUserId.value = user.userId;
  try {
    const response = await userStore.toggleUserLock(user.userId, !user.isLocked);
    
    if (response.isSuccessful) {
      showSnackbar(
        `User ${!user.isLocked ? 'locked' : 'unlocked'} successfully`
      );
    } else {
      showSnackbar(response.message || 'Failed to update user status', 'error');
    }
  } catch (error) {
    console.error('Error toggling user lock:', error);
    showSnackbar('Failed to update user status', 'error');
  } finally {
    lockingUserId.value = null;
  }
}

function confirmDeleteUser(user: UserDTO) {
  userToDelete.value = user;
  deleteDialog.value = true;
}

async function deleteUser() {
  if (!userToDelete.value) return;
  
  deleting.value = true;
  try {
    const response = await userStore.deleteUser(userToDelete.value.userId);
    
    if (response.isSuccessful) {
      showSnackbar('User deleted successfully');
      deleteDialog.value = false;
      userToDelete.value = null;
    } else {
      showSnackbar(response.message || 'Failed to delete user', 'error');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    showSnackbar('Failed to delete user', 'error');
  } finally {
    deleting.value = false;
  }
}

// Initialize component
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      userStore.getAllUsers(),
      getUserRoles()
    ]);
  } catch (error) {
    console.error('Error loading initial data:', error);
    showSnackbar('Failed to load initial data', 'error');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.user-management-view{
    background: #fff;
    min-height: 100vh;
  }
  </style>
  