// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  pages: true,
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  }
})
