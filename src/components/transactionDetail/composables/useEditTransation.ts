import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useTagStore } from '/@/stores/tag'

import type { Transaction } from '/@/lib/apiTypes'
import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { convertTransaction } from '/@/lib/date'

export type MoneyDirection = 'toTraP' | 'fromTraP'

interface EditedTransaction {
  amount: number
  target: string
  request: string | null
  tags: Tag[]
  group: string | null
}

export const useEditTransaction = (transaction: Transaction) => {
  const toast = useToast()
  const tagStore = useTagStore()

  const editedValue = ref<EditedTransaction>({
    amount: transaction.amount,
    target: transaction.target,
    request: transaction.request,
    tags: transaction.tags,
    group: transaction.group.id
  })
  const moneyDirection = ref<MoneyDirection>('toTraP')
  const linkedRequest = ref(
    `https://jomon.trap.jp/requests/${transaction.request}` ?? ''
  )

  const settle = async (emit: (e: 'settle', value: Transaction) => void) => {
    let tags: Tag[]
    try {
      tags = await tagStore.createTagIfNotExist(editedValue.value.tags)
    } catch {
      return
    }
    const willPutTransaction = {
      ...editedValue.value,
      amount:
        moneyDirection.value === 'toTraP'
          ? editedValue.value.amount
          : -editedValue.value.amount,
      tags: tags.map(tag => tag.id)
    }
    try {
      const response = (
        await apis.putTransactionDetail(transaction.id, willPutTransaction)
      ).data
      const nextTransaction = convertTransaction(response)
      emit('settle', nextTransaction)
    } catch {
      toast.error('入出金記録の修正に失敗しました')
    }
  }

  //TODO:サーバーで上書きしてもらう
  const updateLinkedRequest = async (
    requestURL: string,
    emit: (e: 'settle', value: Transaction) => void
  ) => {
    const requestID = requestURL.split('/').pop() ?? ''
    try {
      await apis.getRequestDetail(requestID)
    } catch {
      toast.error('URLが不正です')
      return
    }
    if (
      !/^https:\/\/jomon.trap.jp\/requests\/[a-f0-9-]{36}$/.test(requestURL)
    ) {
      toast.error('URLが不正です')
      return
    }
    const result = confirm(
      '紐づけている申請を変更すると、入出金記録の情報が新たに紐づける申請の情報で上書きされます。よろしいですか？'
    )
    if (!result) return
    try {
      const willPutTransaction = {
        amount: transaction.amount,
        target: transaction.target,
        request: transaction.request,
        tags: transaction.tags.map(tag => tag.id),
        group: transaction.group.id
      }
      const response = (
        await apis.putTransactionDetail(transaction.id, {
          ...willPutTransaction,
          request: requestID
        })
      ).data
      const nextTransaction = convertTransaction(response)
      emit('settle', nextTransaction)
    } catch {
      toast.error('紐づいている申請の更新に失敗しました')
    }
  }

  const unlinkRequest = async (
    emit: (e: 'settle', value: Transaction) => void
  ) => {
    const result = confirm('本当に申請との紐づけを解除しますか？')
    if (!result) return
    try {
      const willPutTransaction = {
        amount: transaction.amount,
        target: transaction.target,
        request: transaction.request,
        tags: transaction.tags.map(tag => tag.id),
        group: transaction.group.id
      }
      const response = (
        await apis.putTransactionDetail(transaction.id, {
          ...willPutTransaction,
          request: null
        })
      ).data
      const nextTransaction = convertTransaction(response)
      emit('settle', nextTransaction)
    } catch {
      toast.error('紐づけの解除に失敗しました')
    }
  }

  return {
    editedValue,
    moneyDirection,
    linkedRequest,
    settle,
    updateLinkedRequest,
    unlinkRequest
  }
}