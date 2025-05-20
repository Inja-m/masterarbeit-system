<template>
  <UDrawer :title="title">
    <UButton color="neutral" variant="ghost">
      <component :is="currentIcon" :size="22" stroke-width="2" />
    </UButton>

    <template #body>
      <URadioGroup
        v-model="value"
        :items="items"
        variant="table"
        color="neutral"
        indicator="end"
      >
        <!-- Label-Slot für jedes Item -->
        <template #label="{ item }">
          <div class="flex items-center gap-2">
            <component :is="item.icon" :size="18" stroke-width="2"  />
            <span>{{ item.label }}</span>
          </div>
        </template>
      </URadioGroup>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { useStrapi, useStrapiUser } from '#imports'
import { Bell, BellOff, BellRing } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  workshopId: string
}>()

const strapi = useStrapi()
const user = useStrapiUser()

const value = ref<'all' | 'relevant' | 'off'>('off')
const participationId = ref<number | null>(null)

// Dein Radio-Items
const items = [
  { label: 'Alle', value: 'all', icon: Bell },
  {
    label: 'Relevantesten',
    description: 'Nur Benachrichtigungen zum Fortschritt.',
    value: 'relevant',
    icon: BellRing,
  },
  { label: 'Aus', value: 'off', icon: BellOff },
]

// Icon abhängig vom Wert
const currentIcon = computed(() => {
  return items.find((i) => i.value === value.value)?.icon || BellOff
})

// Teilnahme-Daten laden (pro User + Workshop)
onMounted(async () => {
  const res = await strapi.find<Participation>('participations', {
    filters: {
      user: { id: { $eq: user.value?.id } },
      workshop_group: { workshops: { id: { $eq: props.workshopId } } }
    }
  })

  if (res.data.length > 0) {
    const participation = res.data[0]
    participationId.value = participation.documentId
    value.value = participation.notification
  }
})

// Speichern bei Änderung
watch(value, async (newVal) => {
	console.log(newVal)
	console.log(participationId.value)
  if (!participationId.value) return

  try {
    await strapi.update<Participation>('participations', participationId.value, {
      notification: newVal
    })
  } catch (err) {
    console.error('Fehler beim Speichern der Benachrichtigung:', err)
  }
})
</script>
