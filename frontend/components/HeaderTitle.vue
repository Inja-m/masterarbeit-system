<template>
  <div class="flex items-center justify-between bg-elevated p-4 md:p-6">
    <ChevronLeft
      v-if="showBack"
      :size="24" stroke-width="2"
      @click="$emit('back')"
    />
    <div class="flex-1 text-center font-medium text-lg md:text-xl">
      {{ title }}
    </div>
    <UDrawer v-if="showDrawer" v-model:open="openDrawer">
      <UButton color="neutral" variant="ghost">
      <EllipsisVertical :size="24" stroke-width="2" />
    	</UButton>

      <template #content>
				<div class="p-4">
					<WithdrawData
					v-model:open="openModal"
          :workshopId="workshopId"
          @update:open="handleModalToggle" />
				</div>
      </template>
    </UDrawer>
  </div>
	  
</template>

<script setup lang="ts">
import { EllipsisVertical, ChevronLeft } from 'lucide-vue-next'

defineProps<{
  title: string
	workshopId?: string
  showBack?: string
	showX?: boolean
}>()

defineEmits(['back'])

const route = useRoute()
const workshopId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const showDrawer = computed(() => route.name === 'workshop-details')

const openDrawer = ref(false)
const openModal = ref(false)

function handleModalToggle(val: boolean) {
  openModal.value = val
  if (!val) {
    // Wenn Modal geschlossen wird, Drawer schließen
    openDrawer.value = false
  }
}
</script>
