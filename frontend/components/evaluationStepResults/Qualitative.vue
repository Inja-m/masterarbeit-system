<template>
  <h2>User Stories</h2>
  <UCarousel 
    v-slot="{ item }"
    :items="result"
    class="w-full max-w-2xl mx-auto my-4 light"
    dots
    loop
  >
    <UCard class="h-40 flex flex-col justify-between p-4 dark text-default text-sm">
      <p>
        Als <strong>{{ item.role }}</strong> möchte ich <em>{{ item.goal }}</em
        >, damit {{ item.benefit }}.
      </p>
    </UCard>
  </UCarousel>
</template>

<script setup lang="ts">
const props = defineProps<{
  result: Array
}>()
</script>