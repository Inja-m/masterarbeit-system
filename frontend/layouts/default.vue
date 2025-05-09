<template>
  <div>
    <!--<HeaderTitle />-->
    <main class="p-4 md:p-6">
      <slot />
    </main>
		<BottomNavigation v-if="!isLoginPage" />
  </div>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isLoginPage = computed(() => route.path === '/login')
</script>