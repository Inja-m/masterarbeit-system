<template>
  <UBadge size="sm" color="warning">{{
    resWorkshop.data.workshop_serie.project.name
  }}</UBadge>
  <div class="font-medium text-lg md:text-xl my-2 md:my-4">
    {{ resWorkshop.data.workshop_serie.name }}
  </div>
  <p>
    <span v-if="isExpanded">
      {{ resWorkshop.data.workshop_serie.description }}
    </span>
    <span v-if="!isExpanded">
      {{ resWorkshop.data.workshop_serie.description.slice(0, 50) }}...
    </span>
    <UButton @click="toggleDescription" size="xs" color="info" variant="link">
      {{ isExpanded ? 'Weniger' : 'Mehr' }}
    </UButton>
  </p>
  <IconText :icon="Calendar" :text="formatDate(resWorkshop.data.date)" />
  <IconText :icon="MapPin" :text="resWorkshop.data.location" />
  <div v-if="resWorkshop.data.reward">
    <IconText :icon="HandCoins" :text="resWorkshop.data.reward" />
  </div>

  <div class="my-4 mx-2">
    <CustomStepper
      :steps="resWorkshop.data.workshop_serie.evaluation_steps"
      :completed-step="completedStep"
    />
  </div>
		<div class="font-medium text-lg md:text-xl my-2 md:my-4">
    Wir freuen uns über einen weiteren Austausch
  </div>
  <div v-for="message in messages.data" :key="message.id">
    <Message
      :time="formatRelativeTime(message.createdAt)"
      :name="message.author?.username || 'Anonym'"
      :message="message.message"
    />
  </div>
  <!-- Nachricht schreiben + Anonym senden -->

  <UCheckbox
    v-model="isAnonymous"
    label="Nachricht anonym senden"
    color="neutral"
  />
  <UInput v-model="newMessage" placeholder="Deine Nachricht..." color="neutral">
    <template #trailing>
      <UButton
        icon="i-heroicons-paper-airplane"
        color="neutral"
        variant="link"
        @click="sendMessage"
      />
    </template>
  </UInput>
  
</template>

<script setup lang="ts">
import { Calendar, MapPin, HandCoins } from 'lucide-vue-next'
import type { Workshop } from '../../types/Workshop'
import type { WorkshopResult } from '~/types/WorkshopResult'
import type { Message } from '~/types/Message'

definePageMeta({
  name: 'details',
  header: {
    title: 'Details',
    back: '/',
    showMenu: true,
    showHeader: true
  }
})

const { findOne, find } = useStrapi()
const route = useRoute()
const workshopID = route.params.id as string
const isExpanded = ref(false)
const newMessage = ref('')
const isAnonymous = ref(false)

function toggleDescription() {
  isExpanded.value = !isExpanded.value
}

const resWorkshop = await findOne<Workshop>('workshops', workshopID, {
  populate: { workshop_serie: { populate: '*' } }
})
const resWorkshopResults = await find<WorkshopResult>('workshop-results', {
  filters: {
    workshop: {
      id: {
        $eq: resWorkshop.data.id
      }
    }
  },
  populate: ['evaluation_step']
})

const stepsWithStatus = computed(() => {
  return resWorkshop.data.workshop_serie.evaluation_steps.map((step: any) => {
    const result = resWorkshopResults.data.find(
      (r: any) => r.evaluation_step.id === step.id
    )
    return {
      ...step,
      evaluationStatus: result?.evaluationStatus || 'todo' // fallback falls kein Ergebnis
    }
  })
})

const orderedSteps = computed(() => {
  const order = { done: 0, inProgress: 1, todo: 2 }
  return [...stepsWithStatus.value].sort(
    (a, b) => order[a.evaluationStatus] - order[b.evaluationStatus]
  )
})

const completedStep = computed(() =>
  orderedSteps.value.findLastIndex(
    (step: any) => step.evaluationStatus === 'done'
  )
)

const messages = await find<Message>('messages', {
  filters: {
    workshop: {
      id: {
        $eq: resWorkshop.data.id
      }
    }
  },
  populate: ['author']
})

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)

  const seconds = (now.getTime() - date.getTime()) / 1000
  const daysDiff = Math.floor(seconds / 86400)

  if (seconds < 60) return 'vor wenigen Sekunden'
  if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min.`
  if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std.`

  if (daysDiff < 7) {
    return `${daysDiff === 1 ? 'Gestern' : 'vor ${daysDiff} Tagen'}`
  }

  const weeks = Math.floor(daysDiff / 7)
  if (daysDiff < 30) {
    return `${weeks === 1 ? 'letzte Woche' : 'vor ${weeks} Wochen'}`
  }

  const months = Math.floor(daysDiff / 30)
  if (daysDiff < 365) {
    return `${months === 1 ? 'letzter Monat' : 'vor ${months} Monaten'}`
  }

  const years = Math.floor(daysDiff / 365)
  return `${years === 1 ? 'letztes Jahr' : 'vor ${years} Jahren'}`
}

async function sendMessage() {
  try {
    const { create } = useStrapi()
    const message: any = {
      message: newMessage.value,
      workshop: resWorkshop.data.documentId
    }
    // Nur anhängen, wenn nicht anonym
    if (!isAnonymous.value) {
      const user = useStrapiUser()
      message.author = user.value?.id
    }
    await create('messages', message)

    newMessage.value = ''
    isAnonymous.value = false
  } catch (err) {
    console.error('Fehler beim Senden:', err)
  }
}
</script>
