<script setup>
definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
});

// Dữ liệu giả cho người dùng
const users = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'user', 
    status: 'active', 
    created: '2024-01-15', 
    lastLogin: '2024-06-20',
    orders: 5
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'user', 
    status: 'active', 
    created: '2024-02-10', 
    lastLogin: '2024-06-18',
    orders: 3
  },
  { 
    id: 3, 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    role: 'user', 
    status: 'active', 
    created: '2024-02-15', 
    lastLogin: '2024-06-15',
    orders: 2
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    email: 'emily@example.com', 
    role: 'user', 
    status: 'inactive', 
    created: '2024-03-05', 
    lastLogin: '2024-05-10',
    orders: 1
  },
  { 
    id: 5, 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    role: 'user', 
    status: 'active', 
    created: '2024-03-20', 
    lastLogin: '2024-06-19',
    orders: 4
  },
  { 
    id: 6, 
    name: 'Sarah Wilson', 
    email: 'sarah@example.com', 
    role: 'user', 
    status: 'active', 
    created: '2024-04-02', 
    lastLogin: '2024-06-17',
    orders: 2
  },
  { 
    id: 7, 
    name: 'David Miller', 
    email: 'david@example.com', 
    role: 'user', 
    status: 'blocked', 
    created: '2024-04-15', 
    lastLogin: '2024-05-05',
    orders: 0
  },
  { 
    id: 8, 
    name: 'Jennifer Taylor', 
    email: 'jennifer@example.com', 
    role: 'user', 
    status: 'active', 
    created: '2024-05-01', 
    lastLogin: '2024-06-16',
    orders: 1
  },
  { 
    id: 9, 
    name: 'Admin User', 
    email: 'admin@example.com', 
    role: 'admin', 
    status: 'active', 
    created: '2024-01-01', 
    lastLogin: '2024-06-20',
    orders: 0
  }
]);

// Tìm kiếm người dùng
const searchQuery = ref('');
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  );
});

// Lọc theo trạng thái
const statusFilter = ref('all');
const statusFilteredUsers = computed(() => {
  if (statusFilter.value === 'all') return filteredUsers.value;
  return filteredUsers.value.filter(user => user.status === statusFilter.value);
});

// Lọc theo vai trò
const roleFilter = ref('all');
const roleFilteredUsers = computed(() => {
  if (roleFilter.value === 'all') return statusFilteredUsers.value;
  return statusFilteredUsers.value.filter(user => user.role === roleFilter.value);
});

// Sắp xếp
const sortBy = ref('created');
const sortDirection = ref('desc');

const sortedUsers = computed(() => {
  const users = [...roleFilteredUsers.value];
  
  users.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy.value === 'created') {
      comparison = new Date(a.created) - new Date(b.created);
    } else if (sortBy.value === 'lastLogin') {
      comparison = new Date(a.lastLogin) - new Date(b.lastLogin);
    } else if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy.value === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortBy.value === 'orders') {
      comparison = a.orders - b.orders;
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
  
  return users;
});

// Thay đổi sắp xếp
const changeSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortDirection.value = 'desc';
  }
};

// Phân trang
const currentPage = ref(1);
const itemsPerPage = ref(5);

const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return sortedUsers.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(sortedUsers.value.length / itemsPerPage.value);
});

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Chuyển trang
const goToPage = (page) => {
  currentPage.value = page;
};

// Xóa người dùng
const deleteUser = (id) => {
  if (id === 9) {
    alert('Cannot delete admin user');
    return;
  }
  
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(user => user.id !== id);
  }
};

// Thay đổi trạng thái người dùng
const changeUserStatus = (user, newStatus) => {
  if (user.id === 9 && newStatus !== 'active') {
    alert('Cannot change admin user status');
    return;
  }
  
  const index = users.value.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users.value[index].status = newStatus;
  }
};

// Thống kê
const statistics = computed(() => {
  const total = users.value.length;
  const active = users.value.filter(user => user.status === 'active').length;
  const inactive = users.value.filter(user => user.status === 'inactive').length;
  const blocked = users.value.filter(user => user.status === 'blocked').length;
  const admins = users.value.filter(user => user.role === 'admin').length;
  
  return {
    total,
    active,
    inactive,
    blocked,
    admins
  };
});

// Định dạng ngày
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Users</h1>
      <NuxtLink to="/admin/users/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
        <Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
        New User
      </NuxtLink>
    </div>
    
    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-4">
            <Icon name="heroicons:users" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
            <div class="text-2xl font-bold">{{ statistics.total }}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 mr-4">
            <Icon name="heroicons:check-circle" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Active</div>
            <div class="text-2xl font-bold">{{ statistics.active }}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300 mr-4">
            <Icon name="heroicons:clock" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Inactive</div>
            <div class="text-2xl font-bold">{{ statistics.inactive }}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300 mr-4">
            <Icon name="heroicons:x-circle" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Blocked</div>
            <div class="text-2xl font-bold">{{ statistics.blocked }}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-4">
            <Icon name="heroicons:shield-check" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Admins</div>
            <div class="text-2xl font-bold">{{ statistics.admins }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Search and filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="Search users by name or email..." 
            />
          </div>
        </div>
        <div class="flex gap-2">
          <select 
            v-model="statusFilter" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
          
          <select 
            v-model="roleFilter" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          
          <select 
            v-model="itemsPerPage" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option :value="5">5 per page</option>
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
            <option :value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Users table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th 
                @click="changeSort('name')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Name
                  <Icon 
                    v-if="sortBy === 'name'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th 
                @click="changeSort('email')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Email
                  <Icon 
                    v-if="sortBy === 'email'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th 
                @click="changeSort('created')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Created
                  <Icon 
                    v-if="sortBy === 'created'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th 
                @click="changeSort('lastLogin')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Last Login
                  <Icon 
                    v-if="sortBy === 'lastLogin'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th 
                @click="changeSort('orders')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Orders
                  <Icon 
                    v-if="sortBy === 'orders'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                    <span>{{ user.name.charAt(0) }}</span>
                  </div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  ]"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(user.created) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(user.lastLogin) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ user.orders }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <div class="relative group">
                    <button class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
                    </button>
                    <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block border border-gray-200 dark:border-gray-700">
                      <NuxtLink :to="`/admin/users/${user.id}`" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        View Details
                      </NuxtLink>
                      <NuxtLink :to="`/admin/users/${user.id}/edit`" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Edit User
                      </NuxtLink>
                      <button 
                        v-if="user.status !== 'active'" 
                        @click="changeUserStatus(user, 'active')" 
                        class="block w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Activate
                      </button>
                      <button 
                        v-if="user.status !== 'inactive'" 
                        @click="changeUserStatus(user, 'inactive')" 
                        class="block w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Deactivate
                      </button>
                      <button 
                        v-if="user.status !== 'blocked'" 
                        @click="changeUserStatus(user, 'blocked')" 
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Block
                      </button>
                      <button 
                        @click="deleteUser(user.id)" 
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="9" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No users found. Try a different search term or filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, sortedUsers.length) }}</span> of <span class="font-medium">{{ sortedUsers.length }}</span> results
            </p>
          </div>
          <div v-if="totalPages > 1">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="goToPage(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <Icon name="heroicons:chevron-left" class="h-5 w-5" />
              </button>
              
              <button 
                v-for="page in pageNumbers" 
                :key="page" 
                @click="goToPage(page)" 
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium',
                  currentPage === page 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                ]"
              >
                {{ page }}
              </button>
              
              <button 
                @click="goToPage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <Icon name="heroicons:chevron-right" class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 