<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import { formatDateAndTime } from '/@/lib/date'

import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import MarkdownIt from '/@/components//shared/MarkdownIt.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'
import { useRequest } from '/@/features/request/composables'
import type { RequestDetail } from '/@/features/request/model'
import { editRequestUsecase } from '/@/features/request/usecase'
import RequestAttachment from './RequestAttachment.vue'

const props = defineProps<{
  request: RequestDetail
}>()

const formattedDateAndTime = formatDateAndTime(props.request.createdAt)

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)
const toast = useToast()
const { isRequestCreator } = useRequest(props.request)
const { me } = storeToRefs(userStore)

const hasAuthority = isRequestCreator.value(me.value)
const isEditMode = ref(false)
const editedContent = ref(props.request.content)
const toggleEditContent = () => {
  if (isEditMode.value) {
    editedContent.value = props.request.content
  }
  isEditMode.value = !isEditMode.value
}
const handleUpdateContent = async () => {
  try {
    await editRequestUsecase(props.request.id, {
      ...props.request,
      group: props.request.group?.id ?? null, // TODO: 関係ないときでも書かないといけないので、デフォルトの値をどこかに置いておく
      content: editedContent.value
    })
    toast.success('更新しました')
  } catch {
    toast.error('更新に失敗しました')
  }
  isEditMode.value = false
}
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex w-full items-center">
      <div class="flex items-center gap-4 flex-1">
        <UserIcon class="w-12" :name="userMap[request.createdBy]" />
        <div>
          <span class="font-bold">{{ userMap[request.createdBy] }}</span>
          がこの申請を作成しました
        </div>
      </div>
      <time
        class="text-text-secondary"
        :datetime="request.createdAt.toISO() ?? ''">
        {{ formattedDateAndTime }}
      </time>
    </div>
    <div class="ml-16 flex items-start gap-2">
      <div
        v-if="!isEditMode"
        class="border border-surface-secondary px-4 py-3 rounded-lg flex-1 w-full">
        <MarkdownIt :text="request.content" />
        <RequestAttachment :files="request.files" />
      </div>
      <MarkdownTextarea
        v-else
        v-model="editedContent"
        auto-focus
        class="flex-1" />
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditContent" />
    </div>
    <div class="flex justify-end">
      <SimpleButton
        v-if="isEditMode"
        font-size="base"
        padding="sm"
        @click="handleUpdateContent">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
