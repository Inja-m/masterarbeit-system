<template>
  <div class="flex items-center space-x-2">
		<component :is="icon" :size="18" stroke-width="1" />
    <div class="text-base">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  icon: Component
  text: string
}>()

</script>