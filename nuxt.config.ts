// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/i18n'
  ],
  devServer: {
    port: 8080,
    host: '0.0.0.0'
  },
  i18n: {
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        file: 'en.json'
      },
      {
        code: 'vi',
        file: 'vi.json'
      }
    ],
    strategy: 'prefix_except_default'
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  app: {
    head: {
      title: 'Software License Store',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Buy software licenses for desktop applications'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Cấu hình SSR/CSR cho từng trang
  routeRules: {
    // Các trang cần SEO sử dụng SSR
    '/': { ssr: true },
    '/products': { ssr: true },
    '/products/*': { ssr: true },
    
    // Các trang không cần SEO sử dụng CSR
    '/user/**': { ssr: false },
    '/admin/**': { ssr: false },
    '/auth/**': { ssr: false },
    '/cart': { ssr: false }
  },

  // Cấu hình runtime config
  runtimeConfig: {
    // Private keys are only available on the server
    apiSecret: process.env.API_SECRET,
    
    // Public keys that are exposed to the client
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://ngochoaitn.ddns.net:8081'
    }
  },

  compatibilityDate: '2025-03-12',

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  // Thêm cấu hình cho CKEditor 5
  build: {
    transpile: ['@ckeditor/ckeditor5-vue', '@ckeditor/ckeditor5-build-classic'],
  },
  
  // Cấu hình vite để xử lý CKEditor 5
  vite: {
    optimizeDeps: {
      include: ['@ckeditor/ckeditor5-vue', '@ckeditor/ckeditor5-build-classic'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/editor.scss";',
        },
      },
    },
  },
})