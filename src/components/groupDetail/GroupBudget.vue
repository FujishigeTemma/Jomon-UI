<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupDetailStore } from '/@/stores/groupDetail'

const groupDetailStore = useGroupDetailStore()

const { group } = storeToRefs(groupDetailStore)
</script>

<template>
  <div v-if="group" class="flex flex-col">
    <label class="text-xl">予算</label>
    <p class="mt-3">{{ group?.budget }} 円</p>
  </div>
</template>
