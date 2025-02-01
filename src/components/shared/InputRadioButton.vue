<script lang="ts" setup>
interface Props {
  options: Option[]
}
interface Option {
  key: string
  value: string
}
const model = defineModel<string>({ required: true })
const props = defineProps<Props>()
</script>

<template>
  <div class="flex gap-4">
    <label
      v-for="option in props.options"
      :key="option.key"
      class="cursor-pointer">
      <input v-model="model" type="radio" :value="option.value" />
      {{ option.key }}
    </label>
  </div>
</template>
