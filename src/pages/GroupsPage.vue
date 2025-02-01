<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

import { toPage } from '/@/lib/parseQueryParams'

import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'

const route = useRoute()
const page = ref(toPage(route.query.page))

const userStore = useUserStore()
const groupStore = useGroupStore()
const { groups, isGroupFetched } = storeToRefs(groupStore)
const { isAdmin } = storeToRefs(userStore)

const sliceGroupsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return groups.value.slice(start, end) ?? []
}

if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}

watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="relative flex flex-wrap gap-x-7 gap-y-2 w-full items-center">
    <h1 class="text-2xl">グループ一覧</h1>
    <div v-if="isAdmin">
      <RouterLink to="/groups/new">
        <SimpleButton font-size="lg" padding="md">
          グループを作成
        </SimpleButton>
      </RouterLink>
    </div>
  </div>

  <div class="grid grid-cols-[2fr_3fr_2fr] divide-y my-7">
    <div
      class="grid grid-cols-subgrid col-span-3 bg-surface-tertiary gap-x-2 px-6 py-4 whitespace-nowrap">
      <div>グループ名</div>
      <div>詳細</div>
      <div>予算</div>
    </div>
    <RouterLink
      v-for="group in sliceGroupsAt(page, 10)"
      :key="group.id"
      class="grid grid-cols-subgrid col-span-3 hover:bg-hover-secondary gap-x-2 px-6 py-4"
      :to="`/groups/${group.id}`">
      <div>{{ group.name }}</div>
      <div class="truncate">{{ group.description }}</div>
      <div>{{ group.budget }}</div>
    </RouterLink>
  </div>
  <PaginationBar
    v-if="groups.length > 0"
    :current-page="page"
    path="/groups"
    :total-pages="Math.ceil(groups.length / 10)" />
  </div>
</template>
