<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toPage } from '/@/lib/parseQueryParams'

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
  <div class="max-w-6xl mx-auto p-3 sm:p-8 flex flex-col gap-7">
    <div class="flex flex-col">
      <div class="relative flex w-full items-center justify-start gap-7">
        <h1 class="text-center text-3xl">申請一覧</h1>
        <div>
          <RouterLink to="/requests/new">
            <SimpleButton font-size="lg" padding="md">
              申請を作成
            </SimpleButton>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="min-h-120">
      <div class="mx-auto rounded-xl shadow">
        <ul>
          <li
            v-for="request in sliceRequestsAt(page, 7)"
            :key="request.id"
            class="hover:bg-hover-secondary">
            <RequestItem :request="request" />
          </li>
        </ul>
      </div>
    </div>
    <PaginationBar
      v-if="requests.length > 0"
      :current-page="page"
      path="/requests"
      :total-pages="Math.ceil(requests.length / 7)" />
  </div>
</template>
