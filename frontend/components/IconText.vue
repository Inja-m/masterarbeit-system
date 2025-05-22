<template>
  <div class="flex items-center space-x-2 py-1">
		<component :is="icon" :size="20" stroke-width="1.5" />
    <div class="text-base">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  icon: Component
  text: string
}>()

</script>