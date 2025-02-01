<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useUserStore } from '/@/stores/user'

import { formatDate } from '/@/lib/date'

import StatusChip from '/@/components/shared/StatusChip.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Request } from '/@/features/request/model'
import UserIcon from '/@/components/shared/UserIcon.vue'

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
  <RouterLink class="flex px-3 sm:px-6 py-4 gap-2 sm:gap-5" :to="'/requests/' + request.id">
    <div class="flex items-start justify-center">
      <StatusChip :status="request.status" />
    </div>
    <div class="flex flex-grow flex-wrap">
      <div class="flex-grow">
        <span class="text-xl">{{ request.title }}</span>
        <div class="mt-2">
          <TagsGroup :tags="request.tags" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-end gap-x-4 flex-wrap">
          <div class="flex items-center gap-1">
            <UserIcon class="max-w-7" :name="userMap[request.createdBy]" />
            <span>{{ userMap[request.createdBy] }}</span>
          </div>
          <span v-if="request.group"> {{ request.group.name }} </span>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="text-right font-bold font-sans text-2xl">
          {{ totalAmount }}円
        </div>
      </div>
    </div>
  </RouterLink>
</template>
