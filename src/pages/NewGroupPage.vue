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
      <label class="font-medium">グループ名</label>
      <InputText
        v-model="group.name"
        auto-focus
        placeholder="グループ名を入力"
        required />
    </div>
    <div class="flex flex-col gap-3">
      <label class="font-medium" for="details">説明</label>
      <MarkdownTextarea
        id="details"
        v-model="group.description"
        placeholder=""
        required />
    </div>
    <div class="flex flex-col gap-3">
      <label class="font-medium">予算</label>
      <div class="flex w-1/2">
        <InputNumber v-model="group.budget" class="mr-2" :min="1" required />円
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <label class="font-medium">オーナー</label>
      <InputSelectMultiple
        v-model="group.owners"
        class="w-full"
        :options="userOptions"
        placeholder="オーナーを選択" />
    </div>
    <div class="flex flex-col gap-3">
      <label class="font-medium">メンバー</label>
      <InputSelectMultiple
        v-model="group.members"
        class="w-full"
        :options="userOptions"
        placeholder="メンバーを選択" />
    </div>
    <div>
      <SimpleButton
        class="ml-auto mt-8 block"
        :disabled="isSending"
        font-size="xl"
        padding="md"
        @click="handleCreateGroup">
        グループを作成
      </SimpleButton>
    </div>
  </form>
</template>
