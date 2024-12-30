<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import { ref } from 'vue'
import RequestTarget from '/@/components/requestDetail/RequestTarget.vue'
import type { RequestTargetDetail } from '/@/features/requestTarget/model'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { editRequestUsecase } from '/@/features/request/usecase'
import type { RequestDetail } from '/@/features/request/model'
import { useRequest } from '/@/features/request/composables'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  request: RequestDetail
}>()

const userStore = useUserStore()
const { isRequestCreator } = useRequest(props.request)
const { me } = storeToRefs(userStore)
const toast = useToast()

const hasAuthority = isRequestCreator.value(me.value)

const isEditMode = ref(false)
const editedTargets = ref<RequestTargetDetail[]>(props.request.targets)
const toggleEditTargets = () => {
  editedTargets.value = props.request.targets
  isEditMode.value = !isEditMode.value
}

const handleUpdateTargets = async () => {
  if (editedTargets.value.some(target => target.target === null)) {
    toast.error('払い戻し対象者を選択してください')
    return
  }
  try {
    await editRequestUsecase(props.request.id, {
      ...props.request,
      group: props.request.group?.id ?? null, // TODO: 関係ないときでも書かないといけないので、デフォルトの値をどこかに置いておく
      targets: editedTargets.value
    })
    toast.success('更新しました')
  } catch {
    toast.error('更新に失敗しました')
  }
  isEditMode.value = false
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <div class="text-sm font-bold">払い戻し対象者</div>
      <div class="flex items-center gap-2">
        <SimpleButton
          v-if="isEditMode"
          font-size="base"
          padding="sm"
          @click="handleUpdateTargets">
          完了
        </SimpleButton>
        <EditButton
          v-if="hasAuthority"
          :is-edit-mode="isEditMode"
          @click="toggleEditTargets" />
      </div>
    </div>
    <div v-if="request" class="flex flex-col gap-2">
      <RequestTarget
        v-for="(target, i) in request.targets"
        :key="target.id"
        v-model:target-model="editedTargets[i]"
        :is-edit-mode="isEditMode"
        :request="request"
        :target="target" />
    </div>
  </div>
</template>
