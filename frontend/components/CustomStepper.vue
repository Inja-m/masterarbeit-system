<template>
  <div class="w-full">
    <!-- Stepper Kopf mit Icons und Trennlinien -->
    <div class="flex items-center justify-between bg-elevated rounded-lg p-4 mb-2">
      <template v-for="(step, index) in steps" :key="index">
				<div
					class="flex items-center"
					:class="{ 'flex-1': index < steps.length - 1 }"
				>
					<!-- Step Icon -->
					<div
						@click="setActive(index)"
						class="flex flex-col items-center cursor-pointer z-10"
					>
						<div
							class="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full transition-all"
							:class="[
								index <= completedStep
									? 'bg-inverted text-inverted'
									: 'border text-toned',
								index === activeStep
									? 'outline outline-2 outline-primary outline-offset-2'
									: ''
							]"
						>
							<component :is="step.icon" class="w-4 h-4 md:w-6 md:h-6" stroke-width="2" />
						</div>
					</div>

					<!-- Trennlinie, außer beim letzten -->
					<div
						v-if="index < steps.length - 1"
						class="flex-grow h-0.5 mx-1 md:mx-2"
						:class="index < completedStep ? 'bg-inverted' : 'bg-accented'"
					></div>
				</div>
			</template>
    </div>

    <!-- Content -->
    <div class="bg-elevated rounded-lg p-4">
      <div class="font-medium mb-2">{{ steps[activeStep].title }}</div>
      <slot :name="steps[activeStep].slot" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  steps: { title: string; slot: string; icon: any }[]
  completedStep: number
}>()

const activeStep = ref(0)

function setActive(index: number) {
  activeStep.value = index
}
</script>
