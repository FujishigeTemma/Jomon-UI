<script lang="ts" setup>
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  targets: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<(e: 'input', value: string[]) => void>()

function handleEditTarget(index: number, value: string) {
  emit(
    'input',
    props.targets.map((target, i) => (i === index ? value : target))
  )
}

function handleAddTarget() {
  emit('input', [...props.targets, ''])
}
function handleRemoveTarget(index: number) {
  emit(
    'input',
    props.targets.filter((_, i) => i !== index)
  )
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium" for="target">取引相手</label>
    <ul class="flex flex-col gap-2">
      <li
        v-for="(target, i) in targets"
        :key="target"
        class="flex items-center gap-3">
        <InputText
          class="flex-grow"
          :model-value="target"
          placeholder="取引相手"
          @update:model-value="handleEditTarget(i, $event)" />
        <button
          v-if="props.targets.length > 1"
          class="flex"
          type="button"
          @click="handleRemoveTarget(i)">
          <TrashIcon class="w-6 text-error-primary" />
        </button>
      </li>
    </ul>
    <div class="ml-3">
      <SimpleButton font-size="base" padding="sm" @click="handleAddTarget">
        <PlusIcon class="w-5 mr-2" />
        取引相手を追加
      </SimpleButton>
    </div>
  </div>
</template>
