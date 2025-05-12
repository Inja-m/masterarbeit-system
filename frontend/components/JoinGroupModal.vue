<template>
  <UModal  :close="{ onClick: () => emit('close', false) }" :dismissible="false"  title="Workshop hinzufügen" close-icon="i-lucide-x">
    <template #body>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
        @error="onError"
      >
        <UFormField  label="Workshop-Identifier" name="identifier"  @input="() => validate(state)">
          <UInput v-model="state.identifier" class="w-full" />
        </UFormField>
				<UFormField v-if="groups.length > 1" label="Gruppen Auswahl" name="groupID">
					<USelect
					v-model="state.groupId"
          :items="groups.map((g) => ({ label: g.name, value: g.documentId }))"
          placeholder="auswählen..."
					class="w-full"
        />
				</UFormField>
        <UButton :disabled="!isFormValid" type="submit"> Hinzufügen </UButton>

      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Workshop } from '../types/Workshop'
import type { WorkshopGroup } from '../types/WorkshopGroup'

import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'

const { find, create } = useStrapi()
const { fetchUser } = useStrapiAuth()
const emit = defineEmits<{ close: [boolean] }>()

const groups = ref<WorkshopGroup[]>([])

const state = reactive({
  identifier: '',
  groupId: ''
})

const isFormValid = computed(() => {
  return !!state.identifier && !!state.groupId
})

const validate = async (state: any): Promise<FormError[]> => {
  const errors = []	
	const exists = await doesIdentifierExist(state.identifier)
  if (!state.identifier) {
		errors.push({ name: 'identifier', message: 'Erforderlich' })
	} else if (!exists) {
		errors.push({ name: 'identifier', message: 'Nicht Valide' })
		if(state.groupId){
			state.groupId = ''
			groups.value = []
		}
	} 
	if (exists && !state.groupId) loadWorkshopGroups()
  if (!state.groupId) errors.push({ name: 'groupId', message: 'Erforderlich' })

  return errors
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
		console.log('Error')
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
	try {
    const user = await fetchUser()
    await create('participations', {
      user: user.value.id,
      workshop_group: state.groupId
    })
		emit('close', true)
  } catch (error: any) {
    console.error(
      'Fehler beim Erstellen der Participation:',
      JSON.stringify(error, null, 2)
    )
  }
}

const doesIdentifierExist = async (identifier: string): Promise<boolean> => {
  if (!identifier) return false

	const res = await find<Workshop>('workshops', {
    filters: {
      identifier: state.identifier
    },
    populate: { workshop_groups: { populate: '*' } }
  })

  return res.data.length > 0
}

const loadWorkshopGroups = async () => {
  const res = await find<Workshop>('workshops', {
    filters: {
      identifier: state.identifier
    },
    populate: { workshop_groups: { populate: '*' } }
  })
  const workshop = res.data?.[0]

  groups.value = workshop.workshop_groups

	if (groups.value.length === 1) {
    state.groupId = groups.value[0].documentId
  }
}

</script>
