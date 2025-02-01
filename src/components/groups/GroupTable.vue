<script lang="ts" setup>
import type { Group } from '/@/features/group/model'
import router from '/@/router'

interface Props {
  page: number
  groups: Group[]
}
const props = defineProps<Props>()

const sliceGroupsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return props.groups.slice(start, end) ?? []
}

const navigateToGroup = (transactionId: string) => {
  router.push(`/groups/${transactionId}`)
}
</script>

<template>
  <table
    class="table-auto border-collapse w-full overflow-x-scroll rounded-xl shadow">
    <thead>
      <tr>
        <th
          v-for="key in ['グループ名', '詳細', '予算']"
          :key="key"
          scope="col"
          class="px-1 py-4 text-left font-normal bg-surface-tertiary first:pl-6 first:rounded-ss-xl last:pr-6 last:rounded-se-xl">
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="group in sliceGroupsAt(props.page, 10)"
        :key="group.id"
        tabindex="0"
        :aria-label="'View details for ' + group.id"
        class="cursor-pointer border-b hover:bg-hover-secondary"
        @click="navigateToGroup(group.id)"
        @keydown.enter="navigateToGroup(group.id)"
        @keydown.space.stop="navigateToGroup(group.id)">
        <td class="px-1 pl-6 py-4">
          {{ group.name }}
        </td>
        <td class="px-1 py-4 truncate">{{ group.description }}</td>
        <td class="px-1 pr-6 py-4">{{ group.budget }}円</td>
      </tr>
    </tbody>
  </table>
</template>
