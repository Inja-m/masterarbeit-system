<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="text-center text-2xl font-semibold">Mein Profil</h1>
    </div>
<!--{{ user }}-->
<!--<UAvatar :alt="user.username" size="3xl" />
{{ user.username }}-->
<UButton @click="logout" trailing-icon="i-lucide-log-out" size="md">Ausloggen</UButton>
  </div>
</template>

<script setup lang="ts">
const { logout, fetchUser } = useStrapiAuth()
const user = await fetchUser()

</script>

