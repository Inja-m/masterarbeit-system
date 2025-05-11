export default defineNuxtRouteMiddleware(async (to) => {
  // Seite /login überspringen
  if (to.path === '/login') return
	
  const token = useStrapiToken()
  if (!token.value) {
    return navigateTo('/login')
  }
})