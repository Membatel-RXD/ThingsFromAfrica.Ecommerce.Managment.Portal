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
          :search="search"
          class="elevation-1"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        >
          <template v-slot:item.profileImageUrl="{ item }">
            <v-avatar size="40" class="ma-2">
              <v-img v-if="item.profileImageUrl" :src="item.profileImageUrl" :alt="item.displayName || item.username" />
              <v-icon v-else color="grey">mdi-account</v-icon>
            </v-avatar>
          </template>
          <template v-slot:item.displayName="{ item }">
            <div>
              <div class="font-weight-bold">{{ item.displayName || (item.firstName + ' ' + item.lastName) }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.username }}</div>
            </div>
          </template>
          <template v-slot:item.email="{ item }">
            <span class="text-caption">{{ item.email }}</span>
          </template>
          <template v-slot:item.role="{ item }">
            <v-chip color="primary" size="small" variant="flat">{{ item.role }}</v-chip>
          </template>
          <template v-slot:item.userStatus="{ item }">
            <v-chip :color="item.isLocked ? 'grey' : 'green'" size="small" variant="flat">
              {{ item.isLocked ? 'Locked' : 'Active' }}
            </v-chip>
          </template>
          <template v-slot:item.lastLoginAt="{ item }">
            <span class="text-caption">{{ formatDate(item.lastLoginAt) }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-eye" variant="text" size="small" color="blue" @click="viewUser(item)" />
            <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="openEditDialog(item)" />
            <v-btn :icon="item.isLocked ? 'mdi-lock-open' : 'mdi-lock'" variant="text" size="small" color="warning" @click="toggleLock(item)" />
            <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDeleteUser(item)" />
          </template>
        </v-data-table>
      </v-card>
      <!-- Add User Dialog -->
      <v-dialog v-model="addDialog" max-width="500">
        <v-card>
          <v-card-title>Add New User</v-card-title>
          <v-card-text>
            <v-form ref="addUserForm" v-model="addUserValid">
              <v-text-field v-model="newUser.firstName" label="First Name" :rules="[rules.required]" required />
              <v-text-field v-model="newUser.lastName" label="Last Name" :rules="[rules.required]" required />
              <v-text-field v-model="newUser.username" label="Username" :rules="[rules.required]" required />
              <v-text-field v-model="newUser.email" label="Email" :rules="[rules.required, rules.email]" required />
              <v-text-field v-model="newUser.password" label="Password" :rules="[rules.required, rules.min(6)]" type="password" required />
              <v-select v-model="newUser.role" :items="roleOptions" label="Role" :rules="[rules.required]" required />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
            <v-btn color="primary" :disabled="!addUserValid" @click="addUser">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- View User Dialog -->
      <v-dialog v-model="viewDialog" max-width="500">
        <v-card>
          <v-card-title>User Details</v-card-title>
          <v-card-text>
            <div><strong>Name:</strong> {{ selectedUser.displayName || (selectedUser.firstName + ' ' + selectedUser.lastName) }}</div>
            <div><strong>Username:</strong> {{ selectedUser.username }}</div>
            <div><strong>Email:</strong> {{ selectedUser.email }}</div>
            <div><strong>Role:</strong> {{ selectedUser.role }}</div>
            <div><strong>Status:</strong> <v-chip :color="selectedUser.isLocked ? 'grey' : 'green'" size="small">{{ selectedUser.isLocked ? 'Locked' : 'Active' }}</v-chip></div>
            <div><strong>Last Login:</strong> {{ formatDate(selectedUser.lastLoginAt) }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="viewDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Edit User Dialog -->
      <v-dialog v-model="editDialog" max-width="500">
        <v-card>
          <v-card-title>Edit User</v-card-title>
          <v-card-text>
            <v-form ref="editUserForm" v-model="editUserValid">
              <v-text-field v-model="editUser.firstName" label="First Name" :rules="[rules.required]" required />
              <v-text-field v-model="editUser.lastName" label="Last Name" :rules="[rules.required]" required />
              <v-text-field v-model="editUser.username" label="Username" :rules="[rules.required]" required />
              <v-text-field v-model="editUser.email" label="Email" :rules="[rules.required, rules.email]" required />
              <v-select v-model="editUser.role" :items="roleOptions" label="Role" :rules="[rules.required]" required />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
            <v-btn color="primary" :disabled="!editUserValid" @click="updateUser">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Delete User Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card>
          <v-card-title>Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete this user?</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="error" @click="deleteUser">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { UserRole } from '@/stores/types/member';

// Dummy data for demonstration (replace with API call)
const users = ref([
  {
    userId: 1,
    username: 'admin',
    email: 'admin@thingsfromafrica.com',
    displayName: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    profileImageUrl: '',
    isLocked: false,
    lastLoginAt: '2025-07-13T10:29:44.990Z',
    twoFactorEnabled: true,
    userStatus: 'active',
    createdAt: '2025-07-13T10:29:44.990Z',
    role: 'SuperAdmin',
  },
  {
    userId: 2,
    username: 'jdoe',
    email: 'jdoe@example.com',
    displayName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    profileImageUrl: '',
    isLocked: true,
    lastLoginAt: '2025-07-12T09:15:00.000Z',
    twoFactorEnabled: false,
    userStatus: 'locked',
    createdAt: '2025-07-12T09:15:00.000Z',
    role: 'Staff',
  },
]);

const search = ref('');
const statusFilter = ref('All');
const statusOptions = ['All', 'Active', 'Locked'];

const headers = [
  { title: 'Photo', key: 'profileImageUrl', sortable: false },
  { title: 'Name', key: 'displayName', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Status', key: 'userStatus', sortable: true },
  { title: 'Last Login', key: 'lastLoginAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Add User Dialog state
const addDialog = ref(false);
const addUserForm = ref();
const addUserValid = ref(false);
const newUser = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  role: '',
});
const roleOptions = [
  'SuperAdmin',
  'Admin',
  'Manager',
  'Staff',
  'Marketing',
  'Customer',
  'Guest',
];
const rules = {
  required: (v: string) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  min: (len: number) => (v: string) => (v && v.length >= len) || `Min ${len} characters`,
};

const filteredUsers = computed(() => {
  let filtered = users.value;
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(u => (statusFilter.value === 'Active' ? !u.isLocked : u.isLocked));
  }
  if (search.value) {
    const s = search.value.toLowerCase();
    filtered = filtered.filter(u =>
      (u.displayName && u.displayName.toLowerCase().includes(s)) ||
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

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

function clearFilters() {
  search.value = '';
  statusFilter.value = 'All';
}

function openCreateDialog() {
  addDialog.value = true;
  Object.assign(newUser.value, { firstName: '', lastName: '', username: '', email: '', password: '', role: '' });
}
function addUser() {
  if (!addUserForm.value?.validate()) return;
  users.value.push({
    userId: users.value.length + 1,
    username: newUser.value.username,
    email: newUser.value.email,
    displayName: newUser.value.firstName + ' ' + newUser.value.lastName,
    firstName: newUser.value.firstName,
    lastName: newUser.value.lastName,
    profileImageUrl: '',
    isLocked: false,
    lastLoginAt: '',
    twoFactorEnabled: false,
    userStatus: 'active',
    createdAt: new Date().toISOString(),
    role: newUser.value.role,
  });
  addDialog.value = false;
}
// Dialog states and user objects
const viewDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedUser = ref<any>({});
const editUser = ref<any>({});
const editUserForm = ref();
const editUserValid = ref(false);

function viewUser(user: any) {
  selectedUser.value = { ...user };
  viewDialog.value = true;
}
function openEditDialog(user: any) {
  editUser.value = { ...user };
  editDialog.value = true;
}
function updateUser() {
  if (!editUserForm.value?.validate()) return;
  const idx = users.value.findIndex(u => u.userId === editUser.value.userId);
  if (idx !== -1) {
    users.value[idx] = { ...users.value[idx], ...editUser.value, displayName: editUser.value.firstName + ' ' + editUser.value.lastName };
  }
  editDialog.value = false;
}
function toggleLock(user: any) {
  const idx = users.value.findIndex(u => u.userId === user.userId);
  if (idx !== -1) {
    users.value[idx].isLocked = !users.value[idx].isLocked;
    users.value[idx].userStatus = users.value[idx].isLocked ? 'locked' : 'active';
  }
}
const userToDelete = ref<any>(null);
function confirmDeleteUser(user: any) {
  userToDelete.value = user;
  deleteDialog.value = true;
}
function deleteUser() {
  if (userToDelete.value) {
    users.value = users.value.filter(u => u.userId !== userToDelete.value.userId);
  }
  deleteDialog.value = false;
  userToDelete.value = null;
}
</script>

<style scoped>
.user-management-view {
  background: #fff;
  min-height: 100vh;
}
</style>
