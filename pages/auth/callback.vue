<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900"
  >
    <div class="text-center">
      <div
        v-if="error"
        class="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4"
      >
        <p class="text-red-200">{{ error }}</p>
      </div>
      <div v-else class="flex flex-col items-center space-y-4">
        <Icon
          name="heroicons:arrow-path"
          class="h-8 w-8 text-blue-400 animate-spin"
        />
        <p class="text-blue-200">Authenticating...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
import { API_CONFIG_ADMIN, ROUTES } from "~/utils/constants";

definePageMeta({
  layout: false,
  middleware: [], // Sử dụng mảng rỗng để vô hiệu hóa tất cả middleware
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const error = ref(null);

// Verify state to prevent CSRF attacks
const verifyState = () => {
  const returnedState = route.query.state;
  console.log("Verifying state:", returnedState, "expected:", API_CONFIG_ADMIN.STATE);
  return returnedState === API_CONFIG_ADMIN.STATE;
};

// Handle the OAuth callback
const handleCallback = async () => {
  try {
    console.log("Handling OAuth callback...");
    console.log("Route query:", route.query);

    // Verify state parameter
    if (!verifyState()) {
      error.value = "Invalid state parameter";
      console.error("Invalid state parameter");
      setTimeout(() => router.push(ROUTES.LOGIN), 2000);
      return;
    }

    // Get the authorization code
    const code = route.query.code;
    if (!code) {
      error.value = "No authorization code received";
      console.error("No authorization code received");
      setTimeout(() => router.push(ROUTES.LOGIN), 2000);
      return;
    }

    console.log("Exchanging code for tokens...");
    console.log("Authorization code:", code);

    // Exchange code for tokens
    const result = await userStore.login(null, null, {
      grant_type: "authorization_code",
      client_id: API_CONFIG_ADMIN.CLIENT_ID,
      client_secret: API_CONFIG_ADMIN.CLIENT_SECRET,
      code,
      redirect_uri: `${window.location.origin}/auth/callback`,
    });

    console.log("Login result:", result);

    // Check localStorage for token
    if (process.client) {
      console.log("Access token in localStorage:", localStorage.getItem("access_token"));
      console.log("Refresh token in localStorage:", localStorage.getItem("refresh_token"));
    }

    if (result.success) {
      // Redirect to admin dashboard on success
      console.log("Authentication successful, redirecting to admin dashboard...");
      router.push(ROUTES.ADMIN_HOME);
    } else {
      error.value = result.error || "Authentication failed";
      console.error("Authentication failed:", result.error);
      setTimeout(() => router.push(ROUTES.LOGIN), 2000);
    }
  } catch (err) {
    console.error("Callback error:", err);
    error.value = "An error occurred during authentication";
    setTimeout(() => router.push(ROUTES.LOGIN), 2000);
  }
};

// Execute callback handling when component mounts
onMounted(() => {
  console.log("Callback component mounted");
  handleCallback();
});
</script>
