<script lang="ts" setup>
import { computed } from 'vue'

import { formatDate } from '/@/lib/date'

import { ArrowLongRightIcon } from '@heroicons/vue/24/outline'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Transaction } from '/@/features/transaction/model'

interface Props {
  transaction: Transaction
}
const props = defineProps<Props>()

const formattedDate = computed(() => formatDate(props.transaction.createdAt))
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">年月日</h2>
      <p>{{ formattedDate }}</p>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">入出金</h2>
      <div>
        <p>{{ Math.abs(transaction.amount) }}円</p>
        <div
          :class="`flex items-center gap-4 ${
            transaction.amount < 0 ? 'flex-row-reverse justify-end' : 'flex-row'
          }`">
          traP
          <ArrowLongRightIcon class="w-8" />
          {{ transaction.target }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">取引グループ</h2>
      <p>{{ transaction.group ? transaction.group.name : 'なし' }}</p>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">タグ</h2>
      <TagsGroup :tags="transaction.tags" />
    </div>
  </div>
</template>
