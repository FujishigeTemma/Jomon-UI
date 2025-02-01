<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { directionOptions } from '/@/stores/transaction'
import { useUserStore } from '/@/stores/user'

import NewTransactionTarget from '/@/components/newTransaction/NewTransactionTarget.vue'
import InputNumber from '/@/components/shared/InputNumber.vue'
import InputRadioButton from '/@/components/shared/InputRadioButton.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

import { useNewTransaction } from './composables/useNewTransaction'

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const { isUserFetched, isAdmin } = storeToRefs(userStore)
const { isTagFetched } = storeToRefs(tagStore)
const { isGroupFetched, groupOptions } = storeToRefs(groupStore)

const { isSending, transaction, moneyDirection, postTransaction } =
  useNewTransaction()

if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
if (!isTagFetched.value) {
  await useFetchTagsUsecase()
}
</script>

<template>
  <div v-if="!isAdmin">権限がありません。</div>
  <div v-else>
    <div class="pb-6">
      <h1 class="text-2xl">入出金記録の新規作成</h1>
    </div>
    <form class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium" for="amount">金額</label>
        <div>
          <InputNumber
            id="amount"
            v-model="transaction.amount"
            auto-focus
            class="mr-2"
            :min="1" />円
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">入出金の方向</label>
        <InputRadioButton
          v-model="moneyDirection"
          :options="directionOptions" />
      </div>
      <NewTransactionTarget
        :targets="transaction.targets"
        @input="transaction.targets = $event" />
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium" for="group">グループ</label>
        <InputSelectSingle
          id="group"
          v-model="transaction.group"
          class="w-full"
          :options="groupOptions"
          placeholder="グループを選択" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium" for="tag">タグ</label>
        <InputSelectTagWithCreation id="tag" v-model="transaction.tags" />
      </div>
      <div class="text-right">
        <SimpleButton
          :disabled="isSending"
          font-size="base"
          padding="md"
          @click.stop="postTransaction">
          入出金記録を作成
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
