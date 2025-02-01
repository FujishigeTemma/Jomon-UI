<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'
import { useUserStore } from '/@/stores/user'

import { toPage } from '/@/lib/parseQueryParams'

import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import TransactionTable from '/@/components/transactions/TransactionTable.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchTransactionsUsecase } from '/@/features/transaction/usecase'

const route = useRoute()
const page = ref(toPage(route.query.page))

const transactionStore = useTransactionStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const { transactions } = storeToRefs(transactionStore)
const { isGroupFetched } = storeToRefs(groupStore)
const { isTagFetched } = storeToRefs(tagStore)
const { isAdmin } = storeToRefs(userStore)

//TODO:  `request: toId(route.query.requestID)`でフィルターする
await useFetchTransactionsUsecase()
if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}
if (!isTagFetched.value) {
  await useFetchTagsUsecase()
}

watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div class="relative flex w-full items-center mb-7">
    <h1 class="text-center text-2xl">入出金記録一覧</h1>
    <div v-if="isAdmin" class="ml-7">
      <RouterLink to="/transactions/new">
        <SimpleButton font-size="lg" padding="md">
          入出金記録を作成
        </SimpleButton>
      </RouterLink>
    </div>
  </div>
  <div class="min-h-128">
    <!-- TODO: ソートボタン, 各カラムの検索フィルター -->
    <TransactionTable
      v-if="transactions"
      :page="page"
      :transactions="transactions" />
    <div v-else>loading...</div>

    <PaginationBar
      v-if="transactions && transactions.length > 0"
      class="mt-7"
      :current-page="page"
      path="/transactions"
      :total-pages="Math.ceil(transactions.length / 10)" />
  </div>
</template>
