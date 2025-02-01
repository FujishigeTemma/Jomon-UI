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
import GroupTable from '../components/groups/GroupTable.vue'

const route = useRoute()
const page = ref(toPage(route.query.page))

const userStore = useUserStore()
const groupStore = useGroupStore()
const { groups, isGroupFetched } = storeToRefs(groupStore)
const { isAdmin } = storeToRefs(userStore)

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

    <GroupTable :page="page" :groups="groups" />

    <PaginationBar
      v-if="groups.length > 0"
      :current-page="page"
      path="/groups"
      :total-pages="Math.ceil(groups.length / 10)" />
  </div>
</template>
