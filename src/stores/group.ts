import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Group } from '/@/features/group/model'

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>([])

  const isGroupFetched = ref(false)

  const groupOptions = computed(() =>
    groups.value.map(group => ({
      key: group.name,
      value: group.id
    }))
  )

  return {
    groups,
    groupOptions,
    isGroupFetched
  }
})
