<script setup>
import { useUserStore } from "~/stores/user";

definePageMeta({
  middleware: ["admin"],
});

const userStore = useUserStore();
const currentUser = computed(() => userStore.user || {});
const logout = () => {
  userStore.logout();
  router.push("/auth/login");
};
const router = useRouter();

// Sidebar state
const isSidebarOpen = ref(true);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Sidebar menu
const sidebarMenu = [
  {
    name: "Dashboard",
    icon: "heroicons:home",
    to: "/admin",
  },
  {
    name: "Products",
    icon: "heroicons:cube",
    to: "/admin/products",
  },
  {
    name: "Orders",
    icon: "heroicons:shopping-cart",
    to: "/admin/orders",
  },
  {
    name: "Users",
    icon: "heroicons:users",
    to: "/admin/users",
  },
];

// User dropdown
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) {
    isNotificationsOpen.value = false;
  }
};
const closeUserMenu = () => {
  isUserMenuOpen.value = false;
};

// Notifications dropdown
const isNotificationsOpen = ref(false);
const notificationsRef = ref(null);
const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
  if (isNotificationsOpen.value) {
    isUserMenuOpen.value = false;
  }
};
const closeNotifications = () => {
  isNotificationsOpen.value = false;
};

// Xử lý click outside bằng cách sử dụng event listener thông thường
onMounted(() => {
  // Thêm event listener cho click outside
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  // Loại bỏ event listener khi component bị hủy
  document.removeEventListener("click", handleClickOutside);
});

// Hàm xử lý click outside
const handleClickOutside = (event) => {
  // Kiểm tra click outside cho user menu
  if (
    userMenuRef.value &&
    !userMenuRef.value.contains(event.target) &&
    isUserMenuOpen.value
  ) {
    closeUserMenu();
  }

  // Kiểm tra click outside cho notifications
  if (
    notificationsRef.value &&
    !notificationsRef.value.contains(event.target) &&
    isNotificationsOpen.value
  ) {
    closeNotifications();
  }
};

// Mock notifications
const notifications = [
  {
    id: 1,
    title: "New Order",
    message: "You have a new order from John Doe",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "New User",
    message: "Jane Smith just registered",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Server Update",
    message: "Server maintenance completed successfully",
    time: "2 hours ago",
    read: true,
  },
];

// Mark all notifications as read
const markAllAsRead = () => {
  notifications.forEach((notification) => {
    notification.read = true;
  });
};

// Theme toggle
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const toggleDarkMode = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};

// Handle logout
const handleLogout = () => {
  logout();
};
</script>

<template>
  <div class="h-screen bg-gray-100 dark:bg-gray-900 flex overflow-hidden">
    <!-- Collapsed Sidebar (Icons only) -->
    <aside
      v-if="!isSidebarOpen"
      class="fixed lg:relative inset-y-0 left-0 z-50 w-16 bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center py-4"
    >
      <button
        @click="toggleSidebar"
        class="p-2 mb-6 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
      >
        <Icon name="heroicons:bars-3" class="h-6 w-6" />
      </button>

      <div class="flex-1 flex flex-col items-center space-y-4">
        <NuxtLink
          v-for="item in sidebarMenu"
          :key="item.name"
          :to="item.to"
          class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
          :title="item.name"
        >
          <Icon :name="item.icon" class="h-6 w-6" />
        </NuxtLink>
      </div>

      <button
        @click="handleLogout"
        class="p-2 mt-6 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
        title="Logout"
      >
        <Icon name="heroicons:arrow-right-on-rectangle" class="h-6 w-6" />
      </button>
    </aside>

    <!-- Full Sidebar -->
    <aside
      v-if="isSidebarOpen"
      class="inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out"
    >
      <!-- Sidebar header -->
      <div
        class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700"
      >
        <NuxtLink
          to="/admin"
          class="flex items-center space-x-2 text-blue-600 dark:text-blue-400"
        >
          <Icon name="heroicons:cube" class="h-8 w-8" />
          <span class="text-lg font-bold">Admin Panel</span>
        </NuxtLink>
        <button
          @click="toggleSidebar"
          class="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
        >
          <Icon name="heroicons:x-mark" class="h-6 w-6" />
        </button>
      </div>

      <!-- Sidebar content -->
      <div class="py-4 px-4">
        <ul class="space-y-1">
          <li v-for="item in sidebarMenu" :key="item.name">
            <NuxtLink
              :to="item.to"
              class="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
              active-class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              <Icon :name="item.icon" class="h-5 w-5 mr-3" />
              <span>{{ item.name }}</span>
            </NuxtLink>
          </li>
        </ul>

        <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Icon
              name="heroicons:arrow-right-on-rectangle"
              class="h-5 w-5 mr-3"
            />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header
        class="sticky top-0 z-40 h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center px-4 lg:px-6 min-w-0"
      >
        <button
          v-if="!isSidebarOpen"
          @click="toggleSidebar"
          class="p-1 mr-4 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
        >
          <Icon name="heroicons:bars-3" class="h-6 w-6" />
        </button>

        <h1 class="text-lg font-medium text-gray-800 dark:text-white">
          Admin Dashboard
        </h1>

        <div class="ml-auto flex items-center space-x-4">
          <!-- Theme toggle -->
          <button
            @click="toggleDarkMode"
            class="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
          >
            <Icon v-if="isDark" name="heroicons:sun" class="h-6 w-6" />
            <Icon v-else name="heroicons:moon" class="h-6 w-6" />
          </button>

          <!-- Notifications -->
          <div class="relative" ref="notificationsRef">
            <button
              @click="toggleNotifications"
              class="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 relative"
            >
              <Icon name="heroicons:bell" class="h-6 w-6" />
              <span
                v-if="notifications.some((n) => !n.read)"
                class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"
              ></span>
            </button>

            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
            >
              <div
                class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700"
              >
                <h3 class="font-medium">Notifications</h3>
                <button
                  @click="markAllAsRead"
                  class="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Mark all as read
                </button>
              </div>

              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  :class="[
                    'px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700',
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : '',
                  ]"
                >
                  <div class="flex justify-between">
                    <h4 class="text-sm font-medium">
                      {{ notification.title }}
                    </h4>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{
                      notification.time
                    }}</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {{ notification.message }}
                  </p>
                </div>

                <div
                  v-if="notifications.length === 0"
                  class="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No notifications
                </div>
              </div>

              <div
                class="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-center"
              >
                <NuxtLink
                  to="/admin/notifications"
                  class="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all notifications
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- User menu -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <div
                class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300"
              >
                <span>{{ currentUser?.name?.charAt(0) || "A" }}</span>
              </div>
              <span class="hidden md:inline-block">{{
                currentUser?.name || "Admin"
              }}</span>
              <Icon name="heroicons:chevron-down" class="h-4 w-4" />
            </button>

            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
            >
              <div
                class="px-4 py-2 border-b border-gray-200 dark:border-gray-700"
              >
                <div class="text-sm font-medium">
                  {{ currentUser?.name || "Admin" }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ currentUser?.email || "admin@example.com" }}
                </div>
              </div>

              <NuxtLink
                to="/admin/profile"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Your Profile
              </NuxtLink>
              <NuxtLink
                to="/admin/settings"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Settings
              </NuxtLink>

              <div
                class="border-t border-gray-200 dark:border-gray-700 mt-1"
              ></div>

              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.h-main {
  height: calc(100vh - 4rem);
  overflow: auto;
}
/* Add any additional styles here */
</style>
