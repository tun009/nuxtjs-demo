<script setup>
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

// Import components
import DataTable from "~/components/common/DataTable.vue";
import Pagination from "~/components/common/Pagination.vue";
import { formatDate } from "~/utils/common";
// Import notification utilities
import {
  confirm,
  notifySuccess,
  notifyError,
  notifyInfo,
} from "~/utils/notification";
// API integration
const { $api } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// State
const loading = ref(true);
const error = ref(null);
const orders = ref([]);
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

// DataTable columns configuration
const columns = [
  {
    key: "index",
    label: "Order",
    sortable: false,
    width: "60px",
  },
  {
    key: "order_code",
    label: "Order Code",
    sortable: true,
    width: "180px",
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
    width: "130px",
    align: "right",
  },
  {
    key: "limit_devices",
    label: "Device Limit",
    sortable: true,
    width: "120px",
    align: "center",
  },
  {
    key: "status",
    label: "Status",
    sortable: false,
    width: "120px",
    align: "center",
  },
  {
    key: "created_at",
    label: "Created",
    sortable: false,
    width: "170px",
  },
];

// DataTable actions configuration
const actions = [
  {
    key: "view",
    icon: "heroicons:eye",
    label: "View Order",
    color:
      "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300",
  },
  {
    key: "invoice",
    icon: "heroicons:document-text",
    label: "Download Invoice",
    color:
      "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
  },
  {
    key: "resend",
    icon: "heroicons:envelope",
    label: "Resend Email",
    color:
      "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300",
  },
  {
    key: "delete",
    icon: "heroicons:trash",
    label: "Delete Order",
    color:
      "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
  },
];

// Fetch orders from API
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log("Fetching orders...");
    const response = await $api.get("api/orders", {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value || undefined,
        sort_by: sortBy.value,
        sort_direction: sortDirection.value,
      },
    });

    console.log("API response:", response);

    if (response.success) {
      orders.value = response.data.data;

      // Update pagination info
      pagination.value = {
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total: response.data.total,
        last_page: response.data.last_page,
      };
    } else {
      error.value = response.message || "Failed to fetch orders";
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
    error.value = err.message || "An error occurred while fetching orders";
  } finally {
    loading.value = false;
  }
};

// Handle search
const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
  fetchOrders();
};

// Handle pagination
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchOrders();
};

// Handle per page change
const handlePerPageChange = (value) => {
  perPage.value = value;
  currentPage.value = 1;
  fetchOrders();
};

// Handle sorting
const handleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column;
    sortDirection.value = "asc";
  }
  fetchOrders();
};

// Handle actions
const handleAction = ({ action, item }) => {
  switch (action) {
    case "view":
      router.push(`/admin/orders/${item.id}`);
      break;
    case "invoice":
      downloadInvoice(item.id);
      break;
    case "resend":
      resendOrderConfirmation(item.id);
      break;
    case "delete":
      console.log("Delete order:", item);
      confirmDeleteOrder(item);
      break;
  }
};

// Download invoice
const downloadInvoice = (orderId) => {
  // Implement invoice download logic
  notifyInfo(`Downloading invoice for order #${orderId}`);
};

// Resend order confirmation
const resendOrderConfirmation = async (orderId) => {
  try {
    const response = await $api.post(
      `api/orders/${orderId}/resend-confirmation`
    );
    if (response.success) {
      notifySuccess("Order confirmation email has been resent");
    } else {
      notifyError(response.message || "Failed to resend confirmation email");
    }
  } catch (err) {
    console.error("Error resending confirmation:", err);
    notifyError(
      err.message || "An error occurred while resending the confirmation email"
    );
  }
};

// Delete order confirmation
const confirmDeleteOrder = (order) => {
  console.log("confirmDeleteOrder");
  confirm(
    `Are you sure you want to delete order #${order.order_code}? This action cannot be undone.`,
    "Confirm Delete",
    {
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      deleteOrder(order.id);
    })
    .catch(() => {
      // Cancelled by user
    });
};

// Delete order
const deleteOrder = async (orderId) => {
  try {
    const response = await $api.delete(`api/orders/${orderId}`);
    if (response.success) {
      notifySuccess("Order has been deleted successfully");
      // Refresh the orders list
      fetchOrders();
    } else {
      notifyError(response.message || "Failed to delete order");
    }
  } catch (err) {
    console.error("Error deleting order:", err);
    notifyError(err.message || "An error occurred while deleting the order");
  }
};
const changePerPage = (value) => {
  perPage.value = value;
  currentPage.value = 1; // Reset về trang đầu tiên
  fetchOrders();
};
// Fetch orders on component mount
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
  if (route.query.sort_direction) {
    sortDirection.value = route.query.sort_direction;
  }

  fetchOrders();
});

// Watch for search query changes to update URL
watch(
  [searchQuery, currentPage, perPage, sortBy, sortDirection],
  () => {
    // Update URL with search params without refreshing the page
    router.push({
      query: {
        search: searchQuery.value || undefined,
        page: currentPage.value !== 1 ? currentPage.value : undefined,
        per_page: perPage.value !== 10 ? perPage.value : undefined,
        sort_by: sortBy.value !== "created_at" ? sortBy.value : undefined,
        sort_direction:
          sortDirection.value !== "desc" ? sortDirection.value : undefined,
      },
    });
  },
  { deep: true }
);

// Status color mapping
const getStatusInfo = (status) => {
  const statusMap = {
    active: {
      text: "Active",
      class:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-400/20",
    },
    pending: {
      text: "Pending",
      class:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-400/20",
    },
    failed: {
      text: "Failed",
      class:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-400/20",
    },
    cancelled: {
      text: "Cancelled",
      class:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-400/20",
    },
    refunded: {
      text: "Refunded",
      class:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-400/20",
    },
    paid: {
      text: "Paid",
      class:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-400/20",
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

// Coppy order code
const copyOrderCode = (code) => {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      notifySuccess("Order code copied to clipboard!", "Copied");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      notifyError("Failed to copy order code");
    });
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
      <h1 class="text-2xl font-bold">Orders</h1>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div class="flex items-center w-full gap-4">
        <!-- Search box -->
        <div class="relative w-full md:w-80 flex-1">
          <input
            v-model="searchQuery"
            @input="debounce(() => handleSearch(searchQuery), 500)"
            type="text"
            placeholder="Search Orders..."
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
        <button
          @click="handleSearch"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Icon name="heroicons:magnifying-glass" class="h-5 w-5 mr-2" />
          Search
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <DataTable
        :columns="columns"
        :items="orders"
        :loading="loading"
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        :empty-message="error ? error : 'No orders found'"
        :actions="actions"
        :actions-dropdown="true"
        @sort="handleSort"
        @action="handleAction"
        custom-class="overflow-auto max-h-[calc(100vh-362px)]"
      >
        <!-- Custom cell templates -->
        <template #cell(index)="{ item, index }">
          {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
        </template>

        <template #cell(order_code)="{ item }">
          <div class="flex items-center">
            <span class="mr-2">{{ item.order_code }}</span>
            <button
              @click.stop="copyOrderCode(item.order_code)"
              class="p-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center justify-center"
            >
              <Icon
                name="heroicons:document-duplicate"
                class="h-4 w-4 text-gray-600 dark:text-gray-300"
              />
            </button>
          </div>
        </template>

        <template #cell(price)="{ item }">
          <div class="text-right">
            {{ parseFloat(item.price).toLocaleString() }}
            {{ item.price_unit || "USD" }}
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
