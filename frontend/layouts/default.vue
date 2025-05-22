<template>
  <div class="flex flex-col h-screen">
		<HeaderTitle
      v-if="metaHeader.showHeader"
      :title="metaHeader.title"
      :show-back="metaHeader.back"
			:show-x="metaHeader.showX"
      @back="handleBack"
    />
    <main class="grow overflow-y-auto">
      <slot />
    </main>
		<BottomNavigation v-if="!isLoginPage" />
  </div>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoginPage = computed(() => route.path === '/login')

const metaHeader = computed(() => {
  const meta = route.meta?.header || {}
	console.log(meta.workshopID)
  return {
    title: meta.title ?? '',
    back: meta.back ?? null,
    showHeader: meta.showHeader ?? false,
		showX: meta.showX ?? false
  }
})

function handleBack() {
  router.push(metaHeader.value.back) 
}
</script>