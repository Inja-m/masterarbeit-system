<template>
  <!-- Button zum Hinzufügen eines Workshops -->
  <div class="flex justify-end">
    <JoinGroupModal />
  </div>
	<div v-for="workshop in userWorkshops" :key="workshop.id" class="mt-6">
		<NuxtLink :to="`/workshop/${workshop.documentId}`" class="block">
			<UCard variant="soft">
      <template #header>
				<h2 class="text-lg font-semibold">{{ workshop.workshop_serie.name }}</h2>
      </template>
			<UBadge size="sm" color="warning" class="mb-2">{{workshop.workshop_serie.project.name}}</UBadge>
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
import type { Participation } from '~/types/Participation'
import type { Workshop } from '~/types/Workshop'

const { fetchUser } = useStrapiAuth()
const { find } = useStrapi()

const userWorkshops = ref<Workshop[]>([])

const fetchUserWorkshops = async () => {
  try {
    const user = await fetchUser()

    const response = await find<Participation>('participations', {
      filters: {
        user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: {
				workshop_group: {
      populate: {
        workshop: {
          populate: {
            workshop_serie: {
              populate: ['project'], // Hier wird die Relation zu "project" aufgelöst
            },
          },
        },
      },
    },
      },
    })
		userWorkshops.value = response.data.map(participation => {
			return participation.workshop_group.workshop})
    
console.log(userWorkshops)
  } catch (error) {
    console.error('Fehler beim Laden der User-Workshops:', error)
  }
}

onMounted(fetchUserWorkshops)

</script>