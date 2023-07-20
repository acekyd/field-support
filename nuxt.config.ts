// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  pages: true,
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  }
})
