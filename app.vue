<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Set default color mode
const colorMode = useColorMode();
colorMode.preference = "system";

// Set default language
const { locale } = useI18n();
locale.value = "en";
</script>
