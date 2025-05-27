<template>
  <UCard :class="{ 'opacity-50': isLoading }" class="p-6 relative">
    <template #header>
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">1. Digitalisierung der Workshop-Ergebnisse</h3>
        <UBadge
          :color="stepStatus === 'done' ? 'green' : stepStatus === 'in-progress' ? 'yellow' : 'gray'"
          variant="subtle"
          size="sm"
        >
          {{ statusLabel }}
        </UBadge>
      </div>
    </template>

    <p class="text-sm text-gray-600 mb-4">
      Die im Workshop entstandenen Artefakte wie Poster, Notizen oder Skizzen werden digital erfasst, um sie weiter zu verarbeiten.
    </p>

    <div v-if="stepStatus === 'done'">
      <p class="text-sm text-gray-700 mb-2">Die folgenden Materialien wurden digitalisiert:</p>
      <ul class="list-disc list-inside text-sm text-gray-800 mb-4">
        <li v-for="(item, index) in digitizedItems" :key="index">
          {{ item }}
        </li>
      </ul>
      <UButton
        icon="i-lucide-eye"
        label="Artefakte ansehen"
        size="sm"
        color="neutral"
        variant="outline"
        @click="openPreview"
      />
    </div>

    <div v-else>
      <p class="text-sm text-gray-500 italic">
        Die Digitalisierung ist noch nicht abgeschlossen. Voraussichtlicher Abschluss: KW 24.
      </p>
    </div>

    <ULoader v-if="isLoading" class="absolute inset-0 bg-white/60 flex items-center justify-center" />
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  stepStatus: 'not-started' | 'in-progress' | 'done'
  digitizedItems?: string[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'preview'): void
}>()

const statusLabel = computed(() => {
  switch (props.stepStatus) {
    case 'done':
      return 'Abgeschlossen'
    case 'in-progress':
      return 'In Bearbeitung'
    default:
      return 'Offen'
  }
})

function openPreview() {
  emit('preview')
}
</script>