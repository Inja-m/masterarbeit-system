<template>
  <UModal title="Workshop hinzufügen" close-icon="i-lucide-x">
		<UButton label="Hinzufügen" color="neutral" variant="subtle" />
		<template #body>
      <UInput v-model="identifier" placeholder="Workshop-Identifier" />

      <UButton @click="loadWorkshopGroups" class="mt-2">Workshop prüfen</UButton>
			
      <div v-if="groups.length > 0" class="mt-4">
        <USelect
          :items="groups.map(g => ({ label: g.name, value: g.documentId }))"
          placeholder="Gruppe auswählen"
					v-model="selectedGroupId"
        />
      </div>
      <UButton :disabled="!selectedGroupId" @click="confirm">Teilnehmen</UButton>
	</template>
  </UModal>
</template>

<script setup lang="ts">
import type { Workshop } from '../types/Workshop'
import type { WorkshopGroup } from '../types/WorkshopGroup'

const identifier = ref('')
const groups = ref<WorkshopGroup[]>([])
const selectedGroupId = ref<number | null>(null)

const { find, create } = useStrapi()
const { fetchUser } = useStrapiAuth()

const loadWorkshopGroups = async () => {
	console.log(identifier.value)
  const res = await find<Workshop>('workshops', {
    filters: {
      identifier: identifier.value,
    },
    populate: {workshop_groups: {populate: '*'}},
  })
	console.log(res)
  const workshop = res.data?.[0]
  if (!workshop) {
    alert('Workshop nicht gefunden')
    return
  }

  groups.value = workshop.workshop_groups
	console.log(workshop)
	console.log(groups)
}

const confirm = async () => {
	try {
  const user = await fetchUser()
	console.log(user.value.id)
	console.log(selectedGroupId.value)
		await create('participations', {
			user: user.value.id,
			workshop_group: selectedGroupId.value
		})
  alert('Teilnahme erfolgreich!')
  } catch (error: any) {
		console.error('Fehler beim Erstellen der Participation:', JSON.stringify(error, null, 2))
  }
}
</script>