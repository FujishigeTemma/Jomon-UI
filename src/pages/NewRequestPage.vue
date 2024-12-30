<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import NewRequestFileForm from '/@/components/newRequest/NewRequestFileForm.vue'
import NewRequestTag from '/@/components/newRequest/NewRequestTag.vue'
import NewRequestTargets from '/@/components/newRequest/NewRequestTargets.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputText from '/@/components/shared/InputText.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { requestTemplates } from '/@/features/requestTemplate/model'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

import { useNewRequest } from './composables/useNewRequest'

const tagStore = useTagStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const { isTagFetched } = storeToRefs(tagStore)
const { isGroupFetched, groupOptions } = storeToRefs(groupStore)
const { isUserFetched, me } = storeToRefs(userStore)

const { isSending, request, files, postRequest } = useNewRequest()

if (!isTagFetched.value) {
  useFetchTagsUsecase()
}
if (!isGroupFetched.value) {
  useFetchGroupsUsecase()
}
if (!isUserFetched.value) {
  useFetchUsersUsecase()
}
</script>

<template>
  <div class="pb-8">
    <h1 class="text-2xl">申請の新規作成</h1>
  </div>
  <form class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">申請者</label>
      <span>{{ me?.name }}</span>
    </div>
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium" for="title">タイトル</label>
      <InputText
        id="title"
        v-model="request.title"
        auto-focus
        placeholder="タイトルを入力" />
    </div>
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium" for="details">詳細</label>
      <MarkdownTextarea
        id="details"
        v-model="request.content"
        placeholder=""
        :templates="requestTemplates" />
    </div>
    <NewRequestTargets
      :targets="request.targets"
      @input="request.targets = $event" />
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium" for="group">グループ</label>
      <InputSelectSingle
        id="group"
        v-model="request.group"
        class="w-full"
        :options="groupOptions"
        placeholder="グループを選択" />
    </div>
    <NewRequestTag :tags="request.tags" @input="request.tags = $event" />
    <NewRequestFileForm :files="files" @input="files = $event" />
    <div class="text-right">
      <SimpleButton
        :disabled="isSending"
        font-size="base"
        padding="md"
        @click.stop="postRequest">
        申請を作成
      </SimpleButton>
    </div>
  </form>
</template>
