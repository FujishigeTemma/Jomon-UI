<script setup lang="ts">
import { useToast } from 'vue-toastification'

defineProps<{ files: string[] }>()
const toast = useToast()

const handleFileUpload = async () => {
  try {
    toast.success('ファイルを追加しました')
  } catch {
    toast.error('ファイルの追加に失敗しました')
  }
}
</script>

<template>
  <div class="m-3 overflow-auto">
    <div class="flex gap-3">
      <div v-for="file in files" :key="file">
        <a :href="'/files/' + file" :download="file">
          <div
            class="bg-surface-secondary h-36 w-32 overflow-hidden rounded"
            :model-value="file">
            <img
              v-if="file === 'image'"
              :alt="file"
              class="object-cover w-full"
              :src="'/files/' + file" />
          </div>
        </a>
        <p class="mt-2 text-center">{{ file }}</p>
      </div>
    </div>
    <div class="flex gap-3 mt-3">
      <div v-for="file in files" :key="file">
        <a :href="'/files/' + file" :download="file">
          <div
            class="bg-surface-secondary h-60 w-96 overflow-hidden rounded"
            :model-value="file">
            <img
              v-if="file === 'image'"
              :alt="file"
              class="object-cover w-full"
              :src="'/files/' + file" />
          </div>
        </a>
        <p class="mt-2">{{ file }}</p>
      </div>
    </div>
  </div>
  <div class="flex justify-end">
    <label
      class="flex items-center rounded-md border py-2 px-4 hover:bg-hover-primary border-surface-secondary cursor-pointer"
      for="file_upload">
      添付ファイルを追加
      <input
        id="file_upload"
        class="hidden"
        type="file"
        @change="handleFileUpload" />
    </label>
  </div>
</template>
