<script setup>
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

// Import components
import DataTable from "~/components/common/DataTable.vue";
import Pagination from "~/components/common/Pagination.vue";
import {
  confirm,
  alert,
  notifySuccess,
  notifyError,
  notifyWarning,
} from "~/utils/notification";

// API integration
const { $api } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// State
const loading = ref(true);
const error = ref(null);
const users = ref([]);
const pagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
});

// Search and filter parameters
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = ref(10);
const sortBy = ref("created_at");
const sortDirection = ref("desc");
const roleFilter = ref("");
const statusFilter = ref("");

// Per page options
const perPageOptions = [
  { value: 10, label: "10 per page" },
  { value: 25, label: "25 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" },
];

// DataTable columns configuration
const columns = [
  {
    key: "index",
    label: "#",
    sortable: false,
    width: "60px",
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    width: "200px",
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    width: "250px",
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    width: "120px",
    align: "center",
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: "120px",
    align: "center",
  },
  {
    key: "created_at",
    label: "Created",
    sortable: true,
    width: "170px",
  },
  {
    key: "last_login_at",
    label: "Last Login",
    sortable: true,
    width: "170px",
  },
  {
    key: "orders_count",
    label: "Orders",
    sortable: true,
    width: "100px",
    align: "center",
  },
];

// DataTable actions configuration
const actions = [
  {
    key: "view",
    icon: "heroicons:eye",
    label: "View User",
    color:
      "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300",
  },
  {
    key: "edit",
    icon: "heroicons:pencil",
    label: "Edit User",
    color:
      "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
  },
  {
    key: "activate",
    icon: "heroicons:check-circle",
    label: "Activate",
    color:
      "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300",
    show: (item) => item.status !== "active",
  },
  {
    key: "deactivate",
    icon: "heroicons:hand-raised",
    label: "Deactivate",
    color:
      "text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300",
    show: (item) => item.status === "active",
  },
  {
    key: "block",
    icon: "heroicons:no-symbol",
    label: "Block",
    color:
      "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
    show: (item) => item.status !== "blocked" && item.role !== "admin",
  },
  {
    key: "delete",
    icon: "heroicons:trash",
    label: "Delete",
    color:
      "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
    show: (item) => item.role !== "admin",
  },
];

// Fetch users from API
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log("Fetching users...");
    const response = await $api.get("api/user/list", {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value || undefined,
        sort_by: sortBy.value,
        sort_order: sortDirection.value,
        role: roleFilter.value || undefined,
        status: statusFilter.value || undefined,
      },
    });

    console.log("API response:", response);

    if (response.success) {
      users.value = response.data.data;

      // Update pagination info
      pagination.value = {
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total: response.data.total,
        last_page: response.data.last_page,
      };
    } else {
      error.value = response.message || "Failed to fetch users";
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    error.value = err.message || "An error occurred while fetching users";
  } finally {
    loading.value = false;
  }
};

// Handle search
const handleSearch = () => {
  currentPage.value = 1;
  fetchUsers();
};

// Handle pagination
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchUsers();
};

// Handle per page change
const changePerPage = (value) => {
  perPage.value = value;
  currentPage.value = 1;
  fetchUsers();
};

// Handle sorting
const handleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column;
    sortDirection.value = "asc";
  }
  fetchUsers();
};

// Handle row click
const handleRowClick = ({ item }) => {
  router.push(`/admin/users/${item.id}`);
};

// Handle filter change
const handleFilterChange = () => {
  currentPage.value = 1;
  fetchUsers();
};

// Handle actions
const handleAction = ({ action, item }) => {
  switch (action) {
    case "view":
      router.push(`/admin/users/${item.id}`);
      break;
    case "edit":
      router.push(`/admin/users/${item.id}/edit`);
      break;
    case "activate":
      activateUser(item.id);
      break;
    case "deactivate":
      deactivateUser(item.id);
      break;
    case "block":
      blockUser(item.id);
      break;
    case "delete":
      confirmDeleteUser(item);
      break;
  }
};

// Delete user confirmation
const confirmDeleteUser = (user) => {
  if (user.role === "admin") {
    notifyWarning("Admin users cannot be deleted");
    return;
  }
  confirm(
    `Are you sure you want to delete user ${user.name}? This action cannot be undone.`,
    "Confirm Delete"
  )
    .then(() => {
      deleteUser(user.id);
    })
    .catch(() => {
      // Canceled by user
    });
};

// Activate user with confirmation
const activateUser = async (userId) => {
  try {
    const response = await $api.post(`api/user/${userId}/activate`);
    if (response.success) {
      notifySuccess("User has been activated");
      fetchUsers();
    } else {
      notifyError(response.message || "Failed to activate user");
    }
  } catch (err) {
    console.error("Error activating user:", err);
    notifyError(err.message || "An error occurred while activating the user");
  }
};

// Deactivate user with confirmation
const deactivateUser = async (userId) => {
  try {
    confirm(
      "Are you sure you want to deactivate this user?",
      "Confirm Deactivate"
    )
      .then(async () => {
        const response = await $api.post(`api/user/${userId}/deactivate`);
        if (response.success) {
          notifySuccess("User has been deactivated");
          fetchUsers();
        } else {
          notifyError(response.message || "Failed to deactivate user");
        }
      })
      .catch(() => {
        // Canceled by user
      });
  } catch (err) {
    console.error("Error deactivating user:", err);
    notifyError(err.message || "An error occurred while deactivating the user");
  }
};

// Block user with confirmation
const blockUser = async (userId) => {
  try {
    confirm("Are you sure you want to block this user?", "Confirm Block")
      .then(async () => {
        const response = await $api.post(`api/user/${userId}/block`);
        if (response.success) {
          notifySuccess("User has been blocked");
          fetchUsers();
        } else {
          notifyError(response.message || "Failed to block user");
        }
      })
      .catch(() => {
        // Canceled by user
      });
  } catch (err) {
    console.error("Error blocking user:", err);
    notifyError(err.message || "An error occurred while blocking the user");
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const response = await $api.delete(`api/user/${userId}`);
    if (response.success) {
      notifySuccess("User has been deleted");
      fetchUsers();
    } else {
      notifyError(response.message || "Failed to delete user");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    notifyError(err.message || "An error occurred while deleting the user");
  }
};

// Fetch users on component mount
onMounted(() => {
  // Initialize from URL query params
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page);
  }
  if (route.query.per_page) {
    perPage.value = parseInt(route.query.per_page);
  }
  if (route.query.sort_by) {
    sortBy.value = route.query.sort_by;
  }
  if (route.query.sort_order) {
    sortDirection.value = route.query.sort_order;
  }
  if (route.query.role) {
    roleFilter.value = route.query.role;
  }
  if (route.query.status) {
    statusFilter.value = route.query.status;
  }

  fetchUsers();
});

// Watch for search query changes to update URL
watch(
  [
    searchQuery,
    currentPage,
    perPage,
    sortBy,
    sortDirection,
    roleFilter,
    statusFilter,
  ],
  () => {
    // Update URL with search params without refreshing the page
    router.push({
      query: {
        search: searchQuery.value || undefined,
        page: currentPage.value !== 1 ? currentPage.value : undefined,
        per_page: perPage.value !== 10 ? perPage.value : undefined,
        sort_by: sortBy.value !== "created_at" ? sortBy.value : undefined,
        sort_order:
          sortDirection.value !== "desc" ? sortDirection.value : undefined,
        role: roleFilter.value || undefined,
        status: statusFilter.value || undefined,
      },
    });
  },
  { deep: true }
);

// Status styling
const getStatusInfo = (status) => {
  const statusMap = {
    active: {
      text: "Active",
      class:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-400/20",
    },
    inactive: {
      text: "Inactive",
      class:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-400/20",
    },
    blocked: {
      text: "Blocked",
      class:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-400/20",
    },
  };

  status = status?.toLowerCase() || "unknown";
  return (
    statusMap[status] || {
      text: "Unknown",
      class:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-400/20",
    }
  );
};

// Role styling
const getRoleInfo = (role) => {
  const roleMap = {
    admin: {
      text: "Admin",
      class:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-400/20",
    },
    user: {
      text: "User",
      class:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-400/20",
    },
  };

  role = role?.toLowerCase() || "unknown";
  return (
    roleMap[role] || {
      text: role?.charAt(0)?.toUpperCase() + role?.slice(1) || "Unknown",
      class:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-400/20",
    }
  );
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

// Debounce function for search
const debounce = (fn, time) => {
  let timeout;
  return function () {
    const args = arguments;
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, time);
  };
};
</script>

<template>
  <div class="p-6 pt-0">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Users</h1>
      <NuxtLink
        to="/admin/users/new"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
        New User
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="relative w-full md:w-80 flex-1">
          <input
            v-model="searchQuery"
            @input="debounce(() => handleSearch(), 500)"
            type="text"
            placeholder="Search users by name or email..."
            class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10"
          />
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <Icon
              name="heroicons:magnifying-glass"
              class="h-5 w-5 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="handleSearch"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Icon name="heroicons:magnifying-glass" class="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <DataTable
        :columns="columns"
        :items="users"
        :loading="loading"
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        :empty-message="error ? error : 'No users found'"
        :actions="actions"
        :actions-dropdown="true"
        @sort="handleSort"
        @row-click="handleRowClick"
        @action="handleAction"
        custom-class="overflow-auto max-h-[calc(100vh-362px)]"
      >
        <!-- Custom cell templates -->
        <template #cell(index)="{ item, index }">
          {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
        </template>

        <template #cell(name)="{ item }">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3"
              v-if="!item.avatar"
            >
              <span>{{ item.name?.charAt(0) }}</span>
            </div>
            <img
              v-else
              :src="item.avatar"
              class="w-8 h-8 rounded-full mr-3"
              alt="User Avatar"
            />
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ item.name }}
            </div>
          </div>
        </template>

        <template #cell(role)="{ item }">
          <div class="flex justify-center">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getRoleInfo(item.role).class"
            >
              {{ getRoleInfo(item.role).text }}
            </span>
          </div>
        </template>

        <template #cell(status)="{ item }">
          <div class="flex justify-center">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusInfo(item.status).class"
            >
              {{ getStatusInfo(item.status).text }}
            </span>
          </div>
        </template>

        <template #cell(created_at)="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #cell(last_login_at)="{ item }">
          {{ formatDate(item.last_login_at) }}
        </template>

        <template #cell(orders_count)="{ item }">
          <div class="text-center">
            {{ item.orders_count || 0 }}
          </div>
        </template>
      </DataTable>
      <Pagination
        :current-page="pagination.current_page"
        :per-page="pagination.per_page"
        :total="pagination.total"
        @page-change="handlePageChange"
        @per-page-change="changePerPage"
      />
    </div>
  </div>
</template>

<style>
.transition-opacity {
  transition: opacity 0.3s ease;
}
</style>
