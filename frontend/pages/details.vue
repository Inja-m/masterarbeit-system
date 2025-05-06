<template>
	<UBadge size="sm" color="warning">Projekt Name</UBadge>
	<div class="font-medium text-lg md:text-xl my-2 md:my-4">
		Workshop Name
	</div>
	<p>
    <span v-if="isExpanded">{{ fullDescription}}</span>
    <span v-if="!isExpanded">{{ fullDescription.slice(0, 50) }}...</span>
		<UButton @click="toggleDescription" size="xs" color="info" variant="link">{{ isExpanded ? 'Weniger' : 'Mehr' }}</UButton>
  </p>
	<IconText :icon="Calendar" text="18.04.2024" />
	<IconText :icon="MapPin" text="Universität zu Lübeck" />
	<IconText :icon="HandCoins" text="2 VP Stunden" />

	<div class="my-4 mx-2 ">
		<CustomStepper
		:steps="stepItems"
		:activeStep="currentStep"
		:completedStep="1"
	>
		<template #step1>
			<p>Inhalt für Schritt 1</p>
		</template>
		<template #step2>
			<p>Inhalt für Schritt 2</p>
		</template>
		<template #step3>
			<p>Inhalt für Schritt 3</p>
		</template>
	</CustomStepper>
</div>

</template>

<script setup lang="ts">
import { Home, Truck, CreditCard, Calendar, MapPin, HandCoins } from 'lucide-vue-next'

const fullDescription = 'Hier steht ein kurzer Beschreibungstext zu diesem Workshop, der geht noch weiter.';
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