<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import { useToast } from 'vue-toastification'
import EditButton from '/@/components/shared/EditButton.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import { useRequest } from '/@/features/request/composables'
import type { RequestDetail } from '/@/features/request/model'
import { editRequestUsecase } from '/@/features/request/usecase'
import type { Tag } from '/@/features/tag/model'

const props = defineProps<{
  request: RequestDetail
}>()

const userStore = useUserStore()
const { isRequestCreator } = useRequest(props.request)
const { me } = storeToRefs(userStore)
const toast = useToast()

const hasAuthority = isRequestCreator.value(me.value)

const isEditMode = ref(false)
const editedTags = ref<Tag[]>(props.request.tags)
const toggleEditTags = () => {
  if (isEditMode.value) {
    editedTags.value = props.request.tags
  }
  isEditMode.value = !isEditMode.value
}
const handleUpdateTags = async () => {
  try {
    await editRequestUsecase(props.request.id, {
      ...props.request,
      group: props.request.group?.id ?? null, // TODO: 関係ないときでも書かないといけないので、デフォルトの値をどこかに置いておく
      tags: editedTags.value
    })
    toast.success('更新しました')
  } catch {
    toast.error('更新に失敗しました')
  }
  isEditMode.value = false
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-bold">タグ</h2>
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditTags" />
    </div>
    <div>
      <div v-if="!isEditMode">
        <TagsGroup v-if="request?.tags" :tags="request.tags" />
        <span v-else>なし</span>
      </div>
      <div v-else>
        <InputSelectTagWithCreation
          v-model="editedTags"
          @close="handleUpdateTags" />
      </div>
    </div>
  </div>
</template>
