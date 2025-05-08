<template>
	<UBadge size="sm" color="warning">Projekt Name</UBadge>
	<div class="font-medium text-lg md:text-xl my-2 md:my-4">
		{{resWorkshop.data.workshop_serie.name}}
	</div>
	<p>
    <span v-if="isExpanded">{{ resWorkshop.data.workshop_serie.description}}</span>
    <span v-if="!isExpanded">{{ resWorkshop.data.workshop_serie.description.slice(0, 50) }}...</span>
		<UButton @click="toggleDescription" size="xs" color="info" variant="link">{{ isExpanded ? 'Weniger' : 'Mehr' }}</UButton>
  </p>
	<IconText :icon="Calendar" text="18.04.2024" />
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
		:completedStep="1"
	>
	</CustomStepper>
</div>

</template>

<script setup lang="ts">
import { Home, Truck, CreditCard, Calendar, MapPin, HandCoins } from 'lucide-vue-next'
import type { Workshop } from '../types/Workshop'
//import type { WorkshopSerie } from '~/types/WorkshopSerie'

const { find, findOne } = useStrapi()

const workshopID = 'nw7fo74q6yv78o8euq8xw5x7'

const resWorkshop = await findOne<Workshop>('workshops', workshopID, {populate:{workshop_serie: {populate: '*'}}})

//const serie = await findOne<WorkshopSerie>('workshop-series', {populate: ['workshops']})

//const steps = await find('evaluation-steps')

const isExpanded = ref(false);

function toggleDescription() {
  isExpanded.value = !isExpanded.value;
}

const currentStep = ref(0)
const stepItems = [
  { title: 'Adresse', slot: 'step1', icon: Home },
  { title: 'Versand', slot: 'step2', icon: Truck },
  { title: 'Zahlung', slot: 'step3', icon: CreditCard },
	{ title: 'Adresse', slot: 'step1', icon: Home },
  { title: 'Versand', slot: 'step2', icon: Truck },
  { title: 'Zahlung', slot: 'step3', icon: CreditCard }
]

</script>