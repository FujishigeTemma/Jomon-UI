<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parseQueryParams'

import RequestLogs from '/@/components/requestDetail/RequestLogs.vue'
import RequestSidebar from '/@/components/requestDetail/RequestSidebar.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import RequestHeader from '/@/components/requestDetail/RequestHeader.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()
const requestDetailStore = useRequestDetailStore()
const { isUserFetched } = storeToRefs(userStore)
const { isGroupFetched } = storeToRefs(groupStore)
const { isTagFetched } = storeToRefs(tagStore)
const { useRequest } = requestDetailStore

const request = await useRequest(id)

if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
if (!isTagFetched.value) {
  await useFetchTagsUsecase()
}
</script>

<template>
  <div
    v-if="request !== undefined"
    class="mx-auto w-4/5 pt-5 pb-20 flex flex-col gap-5">
    <RequestHeader :request="request" />
    <div class="h-px bg-[#e5e7eb]" />
    <div class="flex justify-between gap-20">
      <RequestLogs class="basis-2/3 max-w-[75%]" :request="request" />
      <RequestSidebar class="basis-1/3" :request="request" />
    </div>
  </div>
</template>
