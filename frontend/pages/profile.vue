<template>
  <Section>
    <div class="flex flex-col items-center justify-center space-y-6 py-12">
      <UAvatar :alt="user.username" :ui="{      root: 'size-36 text-4xl'   }" />
      <h1 class="text-2xl font-semibold">{{ user.username }}</h1>
      <UButton 
        trailing-icon="i-lucide-log-out" 
        size="md" 
        color="neutral"
        class="mt-4" 
				@click="handleLogout" 
      >
        Ausloggen
      </UButton>
    </div>
  </Section>
</template>

<script setup lang="ts">
const { logout, fetchUser } = useStrapiAuth()
const user = await fetchUser()

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}
</script>