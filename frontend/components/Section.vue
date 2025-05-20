<template>
  <section :class="['p-4 md:p-6', bgColor]">
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps({
  bgColor: {
    type: String,
    default: 'bg-default'
  }
})
</script>