<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupDetailStore } from '/@/stores/groupDetail'

const groupDetailStore = useGroupDetailStore()
const { group } = storeToRefs(groupDetailStore)
</script>

<template>
  <div v-if="group">
    <p class="text-xl">詳細</p>
    <div class="flex w-full mt-3">
      <p class="min-h-32 w-full rounded border border-surface-secondary p-2">
        {{ group.description }}
      </p>
    </div>
  </div>
</template>
