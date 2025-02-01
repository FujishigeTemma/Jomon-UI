<script lang="ts" setup>
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  XCircleIcon
} from '@heroicons/vue/24/solid';
import { computed } from 'vue';

import type { RequestStatus } from '/@/features/requestStatus/model';

interface Props {
  status: RequestStatus
  hasText?: boolean
  hasMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasText: false,
  hasMenu: false
})

const statusToJpn = computed(() => (status: RequestStatus) => {
  switch (status) {
    case 'submitted':
      return '承認待ち'
    case 'fix_required':
      return '要修正'
    case 'accepted':
      return '承認済み'
    case 'completed':
      return '返済完了'
    case 'rejected':
      return '却下'
    default:
      return 'ERROR'
  }
})

const backgroundColor = computed(() => (status: RequestStatus) => {
  switch (status) {
    case 'submitted':
      return 'bg-status-submitted'
    case 'fix_required':
      return 'bg-status-fix-required'
    case 'accepted':
      return 'bg-status-accepted'
    case 'completed':
      return 'bg-status-completed'
    case 'rejected':
      return 'bg-status-rejected'
    default:
      return 'bg-status-rejected'
  }
})
</script>

<template>
  <div
    :class="`inline flex items-center rounded-3xl px-2 py-2 gap-2 text-white ${backgroundColor(
      status
    )}${hasMenu ? ' cursor-pointer' : ''}`"
    :title="statusToJpn(status)">
    <CheckCircleIcon v-if="status === 'accepted'" class="w-6" />
    <ExclamationTriangleIcon v-else-if="status === 'submitted'" class="w-6" />
    <XCircleIcon v-else-if="status === 'fix_required'" class="w-6" />
    <CloudArrowUpIcon v-else-if="status === 'rejected'" class="w-6" />
    <HandThumbUpIcon v-else-if="status === 'completed'" class="w-6" />
    <!-- todo:アイコン考える。別のアイコンライブラリ使うのもありかも -->
    <span v-if="props.hasText">
      {{ statusToJpn(status) }}
    </span>
    <div v-if="hasMenu">
      <ChevronDownIcon class="w-4" />
    </div>
  </div>
</template>
