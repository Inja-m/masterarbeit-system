<template>
  <div>
		<HeaderTitle
      v-if="metaHeader.showHeader"
      :title="metaHeader.title"
      :show-back="metaHeader.back"
      :show-menu="metaHeader.showMenu"
      @back="handleBack"
    />
    <main class="p-4 md:p-6">
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
	console.log(meta.showHeader)
  return {
    title: meta.title ?? '',
    back: meta.back ?? null,
    showMenu: meta.showMenu ?? false,
    showHeader: meta.showHeader ?? false,
  }
})

function handleBack() {
  router.push(metaHeader.value.back) 
}
</script>