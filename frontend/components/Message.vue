<template>
  <div class="flex items-start gap-3 mb-4">
    <!-- Avatar -->
    <UAvatar
      :src="avatar"
			:alt="name"
      size="md"
      class="mt-1"
    />
    <!-- Message content -->
      <UCard variant="soft">
			<p class="text-xs font-semibold text-muted mb-1">{{ name }} • {{time}}</p>
        <slot>{{ message }}</slot>
      </UCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  avatar?: string
  name?: string
  message?: string
  time?: string
}>()
</script>
