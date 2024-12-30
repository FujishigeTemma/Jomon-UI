<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useAdminStore } from '/@/stores/admin'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchAdminsUsecase } from '/@/features/admin/usecase'
import { deleteTagsUsecase, useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

import { useAdmin } from './composables/useAdmin'

const adminStore = useAdminStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const toast = useToast()

const { isAdminFetched, admins, adminOptions } = storeToRefs(adminStore)
const { me, isUserFetched, isAdmin, userMap } = storeToRefs(userStore)
const { isTagFetched, tagIdOptions } = storeToRefs(tagStore)

const addList = ref<string[]>([])
const removeList = ref<string[]>([])
const deleteTagList = ref<string[]>([])
const { absentMembers, isSending, addAdmins, removeAdmins } = useAdmin()

const handleDeleteTags = async () => {
  isSending.value = true
  try {
    await deleteTagsUsecase(deleteTagList.value)
    toast.success('タグを削除しました')
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
  isSending.value = false
}

if (me.value?.admin) {
  if (!isAdminFetched.value) {
    await useFetchAdminsUsecase()
  }
  if (!isUserFetched.value) {
    await useFetchUsersUsecase()
  }
  if (!isTagFetched.value) {
    await useFetchTagsUsecase()
  }
}
</script>

<template>
  <div v-if="!isAdmin" class="p-2">権限がありません。</div>
  <div v-else>
    <h1 class="text-2xl">管理</h1>
    <div class="mt-6">
      <label class="text-base font-medium">管理者</label>
      <ul class="flex gap-3 mt-3">
        <li v-for="admin in admins" :key="admin">
          <div class="border-text-primary rounded border px-2 text-center">
            {{ userMap[admin] }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-4">
      <label class="text-base font-medium">管理者の操作</label>
      <div class="flex flex-wrap gap-3 mt-3">
        <InputSelectMultiple
          v-model="addList"
          class="flex-grow w-auto"
          :options="absentMembers"
          placeholder="追加する管理者を選択" />
        <SimpleButton
          :disabled="isSending"
          font-size="lg"
          padding="sm"
          @click.stop="addAdmins(addList)">
          選択した管理者を追加
        </SimpleButton>
      </div>
      <div class="flex flex-wrap gap-3 mt-3">
        <InputSelectMultiple
          v-model="removeList"
          class="flex-grow w-auto"
          :options="adminOptions"
          placeholder="削除する管理者を選択" />
        <SimpleButton
          :disabled="isSending"
          font-size="lg"
          padding="sm"
          @click.stop="removeAdmins(removeList)">
          選択した管理者を削除
        </SimpleButton>
      </div>
    </div>
    <div class="mt-6">
      <label class="text-base font-medium">その他の操作</label>
      <div class="flex flex-wrap gap-3 mt-3">
        <InputSelectMultiple
          v-model="deleteTagList"
          class="flex-grow w-auto"
          :options="tagIdOptions"
          placeholder="削除するタグを選択" />
        <SimpleButton
          :disabled="deleteTagList.length === 0 || isSending"
          font-size="lg"
          padding="sm"
          @click.stop="handleDeleteTags">
          選択したタグを削除
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
