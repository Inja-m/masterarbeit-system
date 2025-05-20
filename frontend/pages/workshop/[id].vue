<template>
  <Section>
		<div class="flex items-center justify-between">
    	<UBadge size="sm" color="warning">{{
      	resWorkshop.data.workshop_serie.project.name
    	}}</UBadge>
		  <NotificationSetting :title="`Mitteilungen zu „${resWorkshop.data.workshop_serie.name}“ verwalten`"/>
		 </div>
    <h1 class="py-2">
      {{ resWorkshop.data.workshop_serie.name }}
    </h1>
    <IconText :icon="Calendar" :text="formatDate(resWorkshop.data.date)" />
    <IconText :icon="MapPin" :text="resWorkshop.data.location" />
    <div v-if="resWorkshop.data.reward">
      <IconText :icon="HandCoins" :text="resWorkshop.data.reward" />
    </div>
    <UAccordion :items="items" />
    <div class="my-4 mx-2">
      <CustomStepper
        :steps="resWorkshop.data.workshop_serie.evaluation_steps"
        :completed-step="completedStep"
      />
    </div>
  </Section>
  <Section bg-color="bg-primary-100" class="light text-default">
    <h1 class="pb-4">Wir freuen uns über einen weiteren Austausch</h1>
    <UForm :state="state" class="pb-4" @submit="onSubmit">
      <UFormField name="anonym">
        <UCheckbox
          v-model="state.anonym"
          label="Nachricht anonym senden"
          color="neutral"
          class="pb-2"
        />
      </UFormField>
      <UFormField name="message">
        <UTextarea
          v-model="state.message"
          color="neutral"
          placeholder="Deine Nachricht..."
          class="w-full focus:bg-transparent"
        >
          <template #trailing>
            <UButton
              icon="i-heroicons-paper-airplane"
              color="neutral"
              variant="link"
              type="submit"
            />
          </template>
        </UTextarea>
      </UFormField>
    </UForm>
    <div v-for="message in messages" :key="message.id">
      <Message
        :time="formatRelativeTime(message.createdAt)"
        :name="message.author?.username || 'Anonym'"
        :message="message.message"
      />
    </div>
  </Section>
</template>

<script setup lang="ts">
import { Calendar, MapPin, HandCoins} from 'lucide-vue-next'
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

const { findOne, find, create } = useStrapi()
const route = useRoute()
const workshopID = route.params.id as string
const messages = ref<Message[]>([])

const user = useStrapiUser()
const state = reactive({
  anonym: false,
  message: undefined
})

onMounted(() => {
  console.log('test')
  loadMessages()
})
const resWorkshop = await findOne<Workshop>('workshops', workshopID, {
  populate: { workshop_serie: { populate: '*' } }
})
const items = ref<AccordionItem[]>([
  {
    label: 'Beschreibung',
    icon: 'i-lucide-scroll-text',
    content: resWorkshop.data.workshop_serie.description
  }
])
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

async function loadMessages() {
  try {
    const result = await find<Message>('messages', {
      filters: {
        workshop: {
          id: {
            $eq: resWorkshop.data.id
          }
        }
      },
      populate: ['author'],
      sort: ['createdAt:desc']
    })

    messages.value = result.data
  } catch (error) {
    console.error('Fehler beim Laden der Nachrichten:', error)
  }
}

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)

  const seconds = (now.getTime() - date.getTime()) / 1000
  const daysDiff = Math.floor(seconds / 86400)

  if (seconds < 60) return 'vor wenigen Sekunden'
  if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min.`
  if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std.`

  if (daysDiff < 7) {
    return `${daysDiff === 1 ? 'Gestern' : `vor ${daysDiff} Tagen`}`
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

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  try {
    const message: any = {
      message: state.message,
      workshop: resWorkshop.data.documentId
    }
    if (!state.anonym) {
      message.author = user.value?.id
    }
    await create('messages', message)
    state.anonym = false
    state.message = undefined
    await loadMessages()
  } catch (err) {
    console.error('Fehler beim Senden:', err)
  }
}
</script>
