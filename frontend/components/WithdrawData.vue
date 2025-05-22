<template>
  <UModal
    v-model:open="modalOpen"
    fullscreen
    title="Daten zurückziehen"
    :close="{
      color: 'neutral'
    }"
  >
    <UButton
      label="Daten zurückziehen"
      color="neutral"
      variant="ghost"
      icon="i-lucide-file-x"
    />
    <template #body>
			<h2>
				Workshop: {{ resWorkshop.data.workshop_serie.name }}
			</h2>
      <p class="mb-6">Gib bitte deinen persönlichen Code ein, damit wir deine Daten aus der Erhebung entfernen können.</p>

      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
        @error="onError"
      >
        <UFormField
          label="Persönlicher Code"
          name="identifier"
          :error="errors.code"
          @input="() => validate(state)"
        >
          <UInput v-model="state.code" class="w-full " />
        </UFormField>
        <div class="flex justify-end my-6">
          <UButton
            label="Code überprüfen"
            type="submit"
            class="flex justify-end"
          />
        </div>
      </UForm>

      <UAlert
        v-if="verified"
        color="warning"
        variant="subtle"
        icon="i-lucide-alert-circle"
        class="mb-4"
      >
        <template #title>Hinweis zum Datenrückzug</template>
        <template #description>
          Durch das Zurückziehen werden deine Daten dauerhaft gelöscht und nicht
          in der Auswertung verwendet. Bei Gruppenarbeiten wird die gesamte
          Gruppenarbeit entfernt.
        </template>
      </UAlert>
			</template>
			<template #footer>
      <UModal v-model:open="showModal" title="Daten löschen?">
        <UButton
          v-if="verified"
          label="Daten jetzt zurückziehen"
          color="neutral"
          class="w-full flex justify-center items-center"
          @click="confirmWithdraw"
        />
        <template #body>
          <p>
            Möchtest du wirklich deine Daten entfernen? Diese Aktion kann nicht
            rückgängig gemacht werden.
          </p>
        </template>
        <template #footer>
          <UButton color="neutral" variant="subtle" @click="showModal = false"
            >Abbrechen</UButton
          >
          <UButton color="neutral" variant="outline" @click="withdraw"
            >Ja, löschen</UButton
          >
        </template>
      </UModal>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import type { Workshop } from '../types/Workshop'

const props = defineProps<{
  open: boolean
  workshopId: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { findOne } = useStrapi()

const modalOpen = ref(props.open)
const verified = ref(false)
const showModal = ref(false)
const submited = ref(false)

const state = reactive({
  code: ''
})

const errors = reactive({
  code: undefined as string | undefined
})

const resWorkshop = await findOne<Workshop>('workshops', props.workshopId, {
  populate: { workshop_serie: { populate: '*' } }
})

watch(
  () => props.open,
  (val) => {
    modalOpen.value = val
  }
)

watch(modalOpen, (val) => {
  emit('update:open', val)
})
watch(showModal, (val) => {
  modalOpen.value = val
})

const validate = async (state: any): Promise<FormError[]> => {
  const errorList = []
  if (!state.code) {
    errorList.push({ name: 'identifier', message: 'Erforderlich' })
  }
  return errorList
}

async function onSubmit(_event: FormSubmitEvent<typeof state>) {
  // Beispielprüfung (normalerweise API)
  submited.value = true
  if (state.code === 'ABCD1234') {
    verified.value = true
    errors.code = undefined
  } else {
    verified.value = false
    errors.code = 'Code ungültig'
    console.log('error')
  }
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    console.log('Error')
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function confirmWithdraw() {
  showModal.value = true
}

function withdraw() {
  // Hier: API-Aufruf zur Datenlöschung
  // und alert für paar sekunden
  showModal.value = false
  verified.value = false
  state.code = ''
}
</script>
