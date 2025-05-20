<template>
  <div class="w-full">
    <!-- Stepper Kopf mit Icons und Trennlinien -->
    <div
      class="flex items-center justify-between bg-accented rounded-lg p-4 mb-2"
    >
      <template v-for="(step, index) in steps" :key="index">
        <div
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <!-- Step Icon -->
          <div
            class="flex flex-col items-center cursor-pointer z-10"
            @click="setActive(index)"
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
              <component
                :is="getIconComponent(step.icon)"
                class="w-4 h-4 md:w-6 md:h-6"
                stroke-width="2"
              />
            </div>
          </div>

          <!-- Trennlinie, außer beim letzten -->
          <div
            v-if="index < steps.length - 1"
            class="flex-grow bg-inverted mx-1 md:mx-2"
            :class="index < completedStep ? 'h-[1.5px]' : 'h-[0.5px]'"
          />
        </div>
      </template>
    </div>

    <!-- Content -->
    <div class="bg-accented rounded-lg p-4">
      <h2>{{ steps[activeStep].name }}</h2>
      <p>{{ steps[activeStep].description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps<{
  steps: { name: string; description: string; icon: string }[]
  completedStep: number
}>()

function getIconComponent(component: string) {
  return (
    LucideIcons[component as keyof typeof LucideIcons] || LucideIcons.HelpCircle
  )
}

const activeStep = ref(0)

function setActive(index: number) {
  activeStep.value = index
}
</script>
