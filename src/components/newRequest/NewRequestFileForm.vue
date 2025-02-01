<script lang="ts" setup>
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

import { isImageByType } from '/@/lib/checkFileType'

import type { FileSeed } from '/@/features/file/model'

interface Props {
  files: FileSeed[]
}

const props = defineProps<Props>()
const emit = defineEmits<(e: 'input', value: FileSeed[]) => void>()

const inputRef = ref()

function handleFileChange(e: Event) {
  if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
    return
  }
  for (const file of Array.from(e.target.files)) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      emit('input', [
        ...props.files,
        { name: file.name, src: reader.result as string, type: file.type }
      ])
    }
  }
  if (inputRef.value) {
    inputRef.value.value = null
  }
}

function removeFile(index: number) {
  emit(
    'input',
    props.files.filter((_, i) => index !== i)
  )
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium" for="image">画像</label>
    <input
      id="image"
      ref="inputRef"
      multiple
      type="file"
      @change="handleFileChange" />
  </div>
  <div>
    <div v-if="files.length === 0" class="text-sm font-medium">
      画像プレビュー
    </div>
    <div v-if="files.length !== 0" class="flex flex-wrap">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="not-first:ml-2 relative flex flex-col items-center">
        <img
          v-if="isImageByType(file.type)"
          :alt="file.name"
          class="h-32"
          :src="file.src" />
        <DocumentIcon v-else class="h-32" />
        <button
          aria-label="ファイルを削除"
          class="absolute top-0 right-0 h-6 w-6"
          type="button"
          @click="removeFile(index)">
          <XCircleIcon />
        </button>
        <span>{{ file.name }}</span>
      </div>
    </div>
  </div>
</template>
