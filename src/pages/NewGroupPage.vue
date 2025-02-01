<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import InputText from '/@/components/shared/InputText.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { createGroupUsecase } from '/@/features/group/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import { useUserStore } from '/@/stores/user'
import { useNewGroup } from './composables/useNewGroup'

const toast = useToast()
const router = useRouter()

const userStore = useUserStore()
const { isUserFetched, userOptions } = storeToRefs(userStore)

const { isSending, group } = useNewGroup()

const handleCreateGroup = async () => {
  try {
    await createGroupUsecase(group.value)
    toast.success('グループを作成しました')
    router.push('/groups')
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
}

if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl">グループの新規作成</h1>
  </div>
  <form class="flex flex-col gap-6">
    <div class="flex flex-col gap-3">
      <label class="font-medium" for="group-name">グループ名</label>
      <InputText
        id="group-name"
        v-model="group.name"
        auto-focus
        placeholder="グループ名を入力"
        required />
    </div>
    <div class="flex flex-col gap-3">
      <label class="font-medium" for="group-description">説明</label>
      <MarkdownTextarea
        id="group-description"
        v-model="group.description"
        placeholder=""
        required />
    </div>
    <div class="flex flex-col gap-3">
      <label class="font-medium" for="group-budget">予算</label>
      <div class="flex w-1/2">
        <InputNumber
          id="group-budget"
          v-model="group.budget"
          class="mr-2"
          :min="1"
          required />円
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <label class="font-medium" for="group-owner">オーナー</label>
      <InputSelectMultiple
        id="group-owner"
        v-model="group.owners"
        :options="userOptions"
        placeholder="オーナーを選択" />
    </div>
    <div class="flex flex-col gap-3">
      <label class="font-medium" for="group-member">メンバー</label>
      <InputSelectMultiple
        id="group-member"
        v-model="group.members"
        :options="userOptions"
        placeholder="メンバーを選択" />
    </div>
    <SimpleButton
      class="ml-auto mt-8 block"
      :disabled="isSending"
      font-size="xl"
      padding="md"
      @click="handleCreateGroup">
      グループを作成
    </SimpleButton>
  </form>
</template>
