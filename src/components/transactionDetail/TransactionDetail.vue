<script lang="ts" setup>
import { ArrowLongRightIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

import { formatDate } from '/@/lib/date'

import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Transaction } from '/@/features/transaction/model'

interface Props {
  transaction: Transaction
}
const props = defineProps<Props>()

const formattedDate = computed(() => formatDate(props.transaction.createdAt))
</script>

<template>
  <div class="mb-4 space-y-2">
    <div>
      <p class="font-bold">年月日</p>
      <p>{{ formattedDate }}</p>
    </div>
    <div>
      <p class="font-bold">入出金</p>
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
    <div>
      <p class="font-bold">取引グループ</p>
      <p>{{ transaction.group ? transaction.group.name : 'なし' }}</p>
    </div>
    <div>
      <p class="font-bold">タグ</p>
      <div>
        <TagsGroup :tags="transaction.tags" />
      </div>
    </div>
  </div>
</template>
