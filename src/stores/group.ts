import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Group, PostGroup } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>()
  const group = ref<Group>()
  const isGroupFetched = ref(false)

  const fetchGroups = async () => {
    groups.value = (await apis.getGroups()).data
    isGroupFetched.value = true
  }
  const postGroup = async (group: PostGroup) => {
    const res = (await apis.postGroup(group)).data
    groups.value = [...groups.value!, res]
    return res
  }
  const putGroup = async (group: PostGroup, id: string) => {
    await apis.putGroupDetail(id, group)
  }
  const deleteGroup = async (id: string) => {
    await apis.deleteGroup(id)
    groups.value = groups.value?.filter(group => group.id !== id)
  }
  const postGroupMember = async (id: string, members: string[]) => {
    await apis.postGroupMembers(id, members)
  }
  const postGroupOwner = async (id: string, owners: string[]) => {
    await apis.postGroupOwners(id, owners)
  }
  const deleteGroupMember = async (id: string, members: string[]) => {
    await apis.deleteGroupMembers(id, members)
  }
  const deleteGroupOwner = async (id: string, owners: string[]) => {
    await apis.deleteGroupOwners(id, owners)
  }

  return {
    groups,
    group,
    isGroupFetched,
    fetchGroups,
    postGroup,
    putGroup,
    deleteGroup,
    postGroupOwner,
    postGroupMember,
    deleteGroupMember,
    deleteGroupOwner
  }
})
