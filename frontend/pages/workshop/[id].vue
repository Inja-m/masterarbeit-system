<template>
	<UBadge size="sm" color="warning">{{resWorkshop.data.workshop_serie.project.name}}</UBadge>
	<div class="font-medium text-lg md:text-xl my-2 md:my-4">
		{{resWorkshop.data.workshop_serie.name}}
	</div>
	<p>
    <span v-if="isExpanded">{{ resWorkshop.data.workshop_serie.description}}</span>
    <span v-if="!isExpanded">{{ resWorkshop.data.workshop_serie.description.slice(0, 50) }}...</span>
		<UButton @click="toggleDescription" size="xs" color="info" variant="link">{{ isExpanded ? 'Weniger' : 'Mehr' }}</UButton>
  </p>
	<IconText :icon="Calendar" :text="formatDate(resWorkshop.data.date)" />
	<IconText :icon="MapPin" :text=resWorkshop.data.location />
	<div v-if=resWorkshop.data.reward>
		<IconText :icon="HandCoins" :text=resWorkshop.data.reward />
	</div>
	<!--{{ resWorkshop.data.workshop_serie.evaluation_steps }}-->
	<!--<div v-for="evaluationSteps in resWorkshop.data.workshop_serie.evaluation_steps" :key="evaluationSteps.id">
  <h2>{{ evaluationSteps.name }}</h2>
</div>-->

	<div class="my-4 mx-2 ">
		<CustomStepper
		:steps="resWorkshop.data.workshop_serie.evaluation_steps"
		:activeStep="currentStep"
		:completedStep="completedStep"
	>
	</CustomStepper>
</div>

</template>

<script setup lang="ts">
import { Calendar, MapPin, HandCoins } from 'lucide-vue-next'
import type { Workshop } from '../../types/Workshop'
import type { WorkshopResult } from '~/types/WorkshopResult'
import type { progress } from '#build/ui'

definePageMeta({
	name:'details',
  header: {
    title: 'Details',
    back: '/',
    showMenu: true,
		showHeader:true
  }
})
//import type { WorkshopSerie } from '~/types/WorkshopSerie'

const { findOne, find } = useStrapi()

const route = useRoute()
const workshopID = route.params.id as string

const resWorkshop = await findOne<Workshop>('workshops', workshopID, {populate:{workshop_serie: {populate: '*'}}})
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
    const result = resWorkshopResults.data.find((r: any) => r.evaluation_step.id === step.id)
    return {
      ...step,
      evaluationStatus: result?.evaluationStatus || 'todo' // fallback falls kein Ergebnis
    }
  })
})

const orderedSteps = computed(() => {
  const order = { done: 0, inProgress: 1, todo: 2 }
  return [...stepsWithStatus.value].sort((a, b) => order[a.evaluationStatus] - order[b.evaluationStatus])
})

const completedStep = computed(() =>
  orderedSteps.value.findLastIndex((step: any) => step.evaluationStatus === 'done')
)
//const serie = await findOne<WorkshopSerie>('workshop-series', {populate: ['workshops']})

//const steps = await find('evaluation-steps')

const isExpanded = ref(false);

function toggleDescription() {
  isExpanded.value = !isExpanded.value;
}

const currentStep = ref(0)
</script>