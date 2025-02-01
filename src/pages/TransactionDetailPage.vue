<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parsePathParams'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import EditTransactionForm from '/@/components/transactionDetail/EditTransactionForm.vue'
import TransactionDetail from '/@/components/transactionDetail/TransactionDetail.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import type { Transaction } from '/@/features/transaction/model'
import { useFetchTransactionUsecase } from '/@/features/transaction/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const { isUserFetched, isAdmin } = storeToRefs(userStore)
const { isTagFetched } = storeToRefs(tagStore)
const { isGroupFetched } = storeToRefs(groupStore)

const isEditMode = ref(false)

const transaction = ref<Transaction>(await useFetchTransactionUsecase(id)) //TODO: この書き方いいのかな

function finishEditing(editedTransaction: Transaction) {
  transaction.value = editedTransaction
  isEditMode.value = false
}

if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
if (!isTagFetched.value) {
  await useFetchTagsUsecase()
}
if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}
</script>

<template>
  <div v-if="transaction !== undefined" class="flex flex-col gap-6">
    <div class="flex items-center">
      <h1 class="text-2xl">入出金記録の詳細</h1>
      <SimpleButton
        v-if="isAdmin && transaction.request && !isEditMode"
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click="isEditMode = true">
        編集
      </SimpleButton>
    </div>
    <TransactionDetail v-if="!isEditMode" :transaction="transaction" />
    <EditTransactionForm
      v-else
      :transaction="transaction"
      @cancel="isEditMode = false"
      @finish-editing="finishEditing($event)" />
    <RouterLink class="w-fit" :to="`/requests/${transaction.request}`">
      <SimpleButton font-size="base" padding="sm">
        紐づいている申請へ移動
      </SimpleButton>
    </RouterLink>
  </div>
</template>
