export default defineNuxtRouteMiddleware(async (to, from) => {
	const { fetchUser } = useStrapiAuth()
  const user = await fetchUser()

  if (!user) {
    return navigateTo('/login')
  }
})