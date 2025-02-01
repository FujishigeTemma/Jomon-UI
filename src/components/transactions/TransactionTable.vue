<script lang="ts" setup>
import EditButton from '/@/components/shared/EditButton.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Transaction } from '/@/features/transaction/model'
import { editTransactionUsecase } from '/@/features/transaction/usecase'
import { formatDate } from '/@/lib/date'
import router from '/@/router'

interface Props {
  page: number
  transactions: Transaction[]
}
const props = defineProps<Props>()

const sliceTransactionAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return props.transactions.slice(start, end)
}

const navigateToTransaction = (transactionId: string) => {
  router.push(`/transactions/${transactionId}`)
}

// TODO: 入出金を削除する API を作成
const deleteTransaction = (_transactionId: string) => {
  editTransactionUsecase(_transactionId, {
    amount: 0,
    target: '',
    request: '',
    tags: [],
    group: ''
  })
}
</script>

<template>
  <table
    class="hidden md:table table-auto border-collapse w-full overflow-x-scroll rounded-xl shadow">
    <thead>
      <tr>
        <th
          v-for="key in [
            '年 月 日',
            '取引額',
            '取引相手',
            '取引グループ',
            'タグ',
            '操作'
          ]"
          :key="key"
          scope="col"
          class="px-1 py-4 text-left font-normal bg-surface-tertiary first:pl-6 first:rounded-ss-xl last:pr-6 last:rounded-se-xl">
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(transaction, index) in sliceTransactionAt(props.page, 10)"
        :key="index"
        tabindex="0"
        :aria-label="'View details for ' + transaction.id"
        class="cursor-pointer border-b hover:bg-hover-secondary"
        @click="navigateToTransaction(transaction.id)"
        @keydown.enter="navigateToTransaction(transaction.id)"
        @keydown.space.stop="navigateToTransaction(transaction.id)">
        <td class="px-1 pl-6 py-4">
          {{ formatDate(transaction.createdAt) }}
        </td>
        <td class="px-1 py-4 text-nowrap">{{ transaction.amount }}円</td>
        <td class="px-1 py-4">{{ transaction.target }}</td>
        <td class="px-1 py-4">
          {{ transaction.group ? transaction.group.description : 'なし' }}
        </td>
        <td class="px-1 py-4">
          <TagsGroup :limit="3" :tags="transaction.tags" />
        </td>
        <td class="px-1 pr-6 py-4 content-center">
          <EditButton
            is-edit-mode
            class="px-1 py-1 rounded-full hover:bg-surface-secondary"
            @click.stop="deleteTransaction(transaction.id)"
            @keydown.enter="deleteTransaction(transaction.id)"
            @keydown.space.stop="deleteTransaction(transaction.id)" />
        </td>
      </tr>
    </tbody>
  </table>

  <div class="md:hidden divide-y w-full overflow-x-scroll rounded shadow">
    <router-link
      v-for="transaction in sliceTransactionAt(props.page, 10)"
      :key="transaction.id"
      class="flex flex-col gap-y-2 hover:bg-hover-secondary px-6 py-4"
      :to="`transactions/${transaction.id}`">
      <div class="flex gap-4">
        <div class="truncate mr-auto">
          {{ transaction.group ? transaction.group.description : 'なし' }}
        </div>
        <div class="text-right">{{ transaction.amount }}円</div>
      </div>
      <div class="flex gap-4">
        <div class="mr-auto">
          {{ transaction.target }}
        </div>
        <div class="text-right">
          {{ formatDate(transaction.createdAt) }}
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-auto mr-auto">
          <TagsGroup :limit="3" :tags="transaction.tags" />
        </div>
        <div class="flex justify-end items-end">
          <EditButton class="w-4" is-edit-mode />
        </div>
      </div>
    </router-link>
  </div>
</template>
