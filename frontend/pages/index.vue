<template>
  <!-- Button zum Hinzufügen eines Workshops -->
  <div class="flex justify-end">
    <UButton trailing-icon="i-lucide-plus" size="md"> Hinzufügen </UButton>
  </div>
  <div v-for="workshop in workshops.data" :key="workshop.id" class="mt-6">
		<NuxtLink :to="`/workshop/${workshop.documentId}`" class="block">
			<UCard variant="soft">
      <template #header>
				<UBadge size="sm" color="warning">{{workshop.workshop_serie.project.name}}</UBadge>
				<h2 class="text-lg font-semibold">{{ workshop.workshop_serie.name }}</h2>
      </template>
      <IconText :icon="Calendar"  :text="formatDate(workshop.date)" />
      <IconText :icon="MapPin" :text="workshop.location" />
      <div v-if="workshop.reward">
        <IconText :icon="HandCoins" :text="workshop.reward" />
      </div>
      {{ workshop.workshop_serie.description.slice(0, 50) }}...
    </UCard>
		</NuxtLink>
    
  </div>
</template>

<script setup lang="ts">
import { Calendar, MapPin, HandCoins } from 'lucide-vue-next'
import type { Workshop } from '../types/Workshop'

definePageMeta({
	name:'home',
})

const { find } = useStrapi()

const workshops = await find<Workshop>('workshops', {
  populate: {workshop_serie: {populate: '*'}}
})
</script>
