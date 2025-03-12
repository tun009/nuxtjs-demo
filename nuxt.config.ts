// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/icon',
    ['@nuxtjs/i18n', {
      locales: [
        {
          code: 'en',
          name: 'English',
          file: 'en.json'
        },
        {
          code: 'vi',
          name: 'Tiếng Việt',
          file: 'vi.json'
        }
      ],
      lazy: true,
      langDir: 'locales',
      defaultLocale: 'en',
      strategy: 'prefix_except_default'
    }]
  ],

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

  compatibilityDate: '2025-03-12'
})