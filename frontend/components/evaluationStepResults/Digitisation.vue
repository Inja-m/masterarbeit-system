<template>
  <div v-if="hasAnyPicture">
    <h2>Die folgenden Materialien von dir wurden digitalisiert:</h2>
    <div v-for="res in result" :key="res.id">
      <ul class="list-disc list-inside my-4">
        <li v-for="pictureGroup in res.Pictures" :key="pictureGroup.id">
          {{ pictureGroup.description }}
        </li>
      </ul>
    </div>
  </div>
  <div class="flex justify-end">
    <UModal
      v-model:open="modalOpen"
      title="Artefakte des Workshops"
      :close="{
        color: 'neutral',
        variant: 'ghost',
        class: 'overflow-y-auto max-h-screen rounded-full'
      }"
    >
      <UButton
        icon="i-lucide-eye"
        label="Artefakte ansehen"
        size="sm"
        color="neutral"
        variant="outline"
      />
      <template #body>
        <UCarousel
          v-slot="{ item }"
          loop
          dots
          :items="carouselItems"
          class="w-full max-w-xs mx-auto mb-6"
        >
          <h2 class="flex justify-center">{{ item.description }}</h2>
          <img :src="item.src" width="320" height="320" class="rounded-lg" />
        </UCarousel>
      </template>
    </UModal>
  </div>
  <div v-if="hasAnyText">
    <h2>Weiteres:</h2>
    <div v-for="res in result" :key="res.id" class="space-y-4">
      <div v-for="textgroup in res.Text" :key="textgroup.id">
        <p>{{ textgroup.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImageUrl } from '@/composables/useImageUrl'
const { getImageUrl } = useImageUrl()

const props = defineProps<{
  result: {
    type: Array
    required: true
  }
}>()

const hasAnyText = computed(() =>
  props.result?.some((res) => res.Text?.some((t) => t.text?.trim()))
)

const hasAnyPicture = computed(() =>
  props.result?.some(res =>
    Array.isArray(res.Pictures) && res.Pictures.length > 0
  )
)

const modalOpen = ref(false)
const carouselItems = computed(() => {
  const items = []
  for (const res of props.result) {
    for (const pictureGroup of res.Pictures) {
      for (const image of pictureGroup.pictures) {
        items.push({
          src: getImageUrl(image),
          alt: image.name || 'Bild',
          description: pictureGroup.description || ''
        })
      }
    }
  }
  console.log(items)
  return items
})
</script>
