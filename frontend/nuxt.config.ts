// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
    public: {
      strapiBaseUrl: process.env.STRAPI_URL || 'http://localhost:1337'
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
   '@nuxt/content',
   '@nuxt/eslint',
   '@nuxt/fonts',
   '@nuxt/icon',
   '@nuxt/image',
   '@nuxt/scripts',
   '@nuxt/test-utils',
   '@nuxt/ui',
   '@vite-pwa/nuxt',
   '@nuxtjs/strapi',
	 '@nuxtjs/strapi'
  ],
  css: ['~/assets/css/main.css'],
	imports: {
    dirs: ['utils']
  }
})