<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
    <div class="text-center">
      <div v-if="error" class="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
        <p class="text-red-200">{{ error }}</p>
      </div>
      <div v-else class="flex flex-col items-center space-y-4">
        <Icon name="heroicons:arrow-path" class="h-8 w-8 text-blue-400 animate-spin" />
        <p class="text-blue-200">Authenticating...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthApi } from "~/composables/api/useAuth";
import { API_CONFIG_ADMIN } from "~/utils/constants";

definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const { login } = useAuthApi();
const error = ref(null);

// Verify state to prevent CSRF attacks
const verifyState = () => {
  const returnedState = route.query.state;
  return returnedState === API_CONFIG_ADMIN.STATE;
};

// Handle the OAuth callback
const handleCallback = async () => {
  try {
    // Verify state parameter
    if (!verifyState()) {
      error.value = "Invalid state parameter";
      setTimeout(() => router.push("/auth/login"), 2000);
      return;
    }

    // Get the authorization code
    const code = route.query.code;
    if (!code) {
      error.value = "No authorization code received";
      setTimeout(() => router.push("/auth/login"), 2000);
      return;
    }

    // Exchange code for tokens
    const result = await login(null, null, {
      grant_type: "authorization_code",
      client_id: API_CONFIG_ADMIN.CLIENT_ID,
      client_secret: API_CONFIG_ADMIN.CLIENT_SECRET,
      code,
      redirect_uri: `${window.location.origin}/auth/callback`
    });

    if (result.success) {
      // Redirect to admin dashboard on success
      router.push("/admin");
    } else {
      error.value = result.message || "Authentication failed";
      setTimeout(() => router.push("/auth/login"), 2000);
    }
  } catch (err) {
    console.error("Callback error:", err);
    error.value = "An error occurred during authentication";
    setTimeout(() => router.push("/auth/login"), 2000);
  }
};

// Execute callback handling when component mounts
onMounted(() => {
  handleCallback();
});
</script> 