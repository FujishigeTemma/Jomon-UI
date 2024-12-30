<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import { useGroupOwner } from './composables/useGroupOwner'

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()
const { canEditGroup } = groupDetailStore
const { group } = storeToRefs(groupDetailStore)
const { me, userMap } = storeToRefs(userStore)

const ownersToBeAdded = ref<string[]>([])
const hasAuthority = canEditGroup(me.value)
const { absentOwnerOptions, isSending, addOwners, removeOwner } =
  useGroupOwner()
</script>

<template>
  <div v-if="group" class="relative flex flex-col justify-between">
    <p class="text-xl">グループオーナー</p>
    <div class="mt-3 border border-surface-secondary">
      <ul class="flex flex-col gap-2 px-4 py-3 overflow-y-auto max-h-[50dvh]">
        <li
          v-for="owner in group.owners"
          :key="owner"
          class="flex items-center justify-between">
          <div class="flex items-center">
            <UserIcon class="w-12" :name="userMap[owner]" />
            <p class="mx-1 break-all">{{ userMap[owner] }}</p>
          </div>
          <button
            v-if="hasAuthority"
            class="flex items-center rounded-full p-1 hover:bg-surface-secondary"
            :disabled="isSending"
            @click="removeOwner(owner)">
            <MinusIcon class="w-6" />
          </button>
        </li>
      </ul>
      <div v-if="hasAuthority" class="flex p-2 gap-2">
        <InputSelectMultiple
          v-model="ownersToBeAdded"
          class="flex-grow w-1"
          :options="absentOwnerOptions"
          placeholder="追加するオーナーを選択" />
        <button
          class="flex items-center rounded-full p-1 hover:bg-surface-secondary"
          :disabled="ownersToBeAdded.length === 0 || isSending"
          @click="addOwners(ownersToBeAdded)">
          <PlusIcon class="w-6" />
        </button>
      </div>
    </div>
  </div>
</template>
