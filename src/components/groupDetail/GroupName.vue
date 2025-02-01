<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import EditButton from '/@/components/shared/EditButton.vue'
import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  isEditMode: boolean
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
  (e: 'finishEditing'): void
}>()

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()
const { canEditGroup } = groupDetailStore
const { group, editedValue } = storeToRefs(groupDetailStore)
const { me } = storeToRefs(userStore)

const hasAuthority = canEditGroup(me.value)
</script>

<template>
  <div v-if="group" class="flex items-center gap-3">
    <h1 v-if="!props.isEditMode" class="flex-grow text-2xl">
      {{ group.name }}
    </h1>
    <InputText
      v-else
      v-model="editedValue.name"
      auto-focus
      class="flex-grow"
      placeholder="グループ名" />
    <SimpleButton
      v-if="isEditMode"
      font-size="base"
      padding="sm"
      @click="emit('finishEditing')">
      完了
    </SimpleButton>
    <EditButton
      v-if="hasAuthority"
      :is-edit-mode="props.isEditMode"
      @click="
        props.isEditMode
          ? emit('changeEditMode', '')
          : emit('changeEditMode', 'name')
      " />
  </div>
</template>
