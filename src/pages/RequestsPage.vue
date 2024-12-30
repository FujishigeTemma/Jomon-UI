<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toPage } from '/@/lib/parseQueryParams'

import RequestFilters from '/@/components/requests/RequestFilters.vue'
import RequestItem from '/@/components/requests/RequestItem.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { useFetchRequestsUsecase } from '/@/features/request/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

const route = useRoute()
const page = ref(toPage(route.query.page))

const requestStore = useRequestStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { requests } = storeToRefs(requestStore)
const { isRequestFetched } = storeToRefs(requestStore)
const { isTagFetched } = storeToRefs(tagStore)
const { isGroupFetched } = storeToRefs(groupStore)
const { isUserFetched } = storeToRefs(userStore)

const sliceRequestsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return requests.value?.slice(start, end) ?? []
}

if (!isRequestFetched.value) {
  useFetchRequestsUsecase()
}
if (!isTagFetched.value) {
  useFetchTagsUsecase()
}
if (!isGroupFetched.value) {
  useFetchGroupsUsecase()
}
if (!isUserFetched.value) {
  useFetchUsersUsecase()
}

watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div class="relative flex w-full items-center justify-center pb-8">
    <h1 class="text-center text-3xl">申請一覧</h1>
    <div class="absolute right-0">
      <RouterLink to="/requests/new">
        <SimpleButton font-size="lg" padding="md">
          申請の新規作成
        </SimpleButton>
      </RouterLink>
    </div>
  </div>
  <RequestFilters />
  <div class="min-h-[480px]">
    <div class="mt-4 rounded-xl shadow">
      <ul>
        <li
          v-for="request in sliceRequestsAt(page, 7)"
          :key="request.id"
          class="hover:bg-hover-secondary first:hover:rounded-t-xl last:hover:rounded-b-xl">
          <RequestItem :request="request" />
        </li>
      </ul>
    </div>
  </div>
  <PaginationBar
    v-if="requests.length > 0"
    class="mt-4"
    :current-page="page"
    path="/requests"
    :total-pages="Math.ceil(requests.length / 7)" />
</template>
