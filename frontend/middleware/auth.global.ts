export default defineNuxtRouteMiddleware(async (to) => {
  // Seite /login überspringen
	console.log('test')
  if (to.path === '/login') return

  const token = useStrapiToken()
console.log(token)
  if (!token.value) {
    return navigateTo('/login')
  }
})