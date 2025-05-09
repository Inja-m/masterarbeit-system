<template>
  <div class="flex items-center justify-between bg-elevated p-4 md:p-6">
    <UIcon v-if="showBack" name="lucide:chevron-left" size="24" @click="$emit('back')" />
    <div class="flex-1 text-center font-medium text-lg md:text-xl">
      {{ title }}
    </div>
    <UIcon v-if="showMenu" name="lucide:ellipsis-vertical" size="24" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  showBack?: boolean
  showMenu?: boolean
}>()

defineEmits(['back'])
</script>