<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useUserStore } from '/@/stores/user'

import { formatDate } from '/@/lib/date'

import StatusChip from '/@/components/shared/StatusChip.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Request } from '/@/features/request/model'

interface Props {
  request: Request
}

const props = defineProps<Props>()

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)

const formattedDate = formatDate(props.request.createdAt)

const totalAmount = computed(
  () => props.request.targets.reduce((a, target) => a + target.amount, 0) ?? 0
)
</script>

<template>
  <RouterLink class="flex p-2" :to="'/requests/' + request.id">
    <div class="mx-2 flex items-center justify-center">
      <StatusChip :status="request.status" />
    </div>
    <div class="flex-grow flex flex-col gap-2">
      <span class="text-xl">{{ request.title }}</span>
      <TagsGroup :tags="request.tags" />
    </div>
    <div>
      <div class="flex gap-4">
        <span v-if="request.group"> グループ：{{ request.group.name }} </span>
        <span>申請者：{{ userMap[request.createdBy] }}</span>
        <span>申請日：{{ formattedDate }}</span>
      </div>
      <div class="text-right text-3xl">{{ totalAmount }}円</div>
    </div>
  </RouterLink>
</template>
