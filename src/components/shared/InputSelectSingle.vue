<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueValue = Record<string, any> | string | null

interface Value {
  key: string
  value: ValueValue
}

interface Props {
  modelValue: ValueValue
  placeholder?: string
  options: Value[]
  disabled?: boolean
  isDropdownAbove?: boolean
  uniqKeys?: [string, string]
  id?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  isDropdownAbove: false,
  uniqKeys: () => ['id', 'id'],
  class: ''
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: ValueValue): void
  (e: 'close'): void
}>()

const inputSelectRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)
const listItemRefs = ref<HTMLLIElement[] | null>(null)
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const selectedValue = computed(() =>
  props.options.find(
    option =>
      convertValue(option.value, props.uniqKeys[0]) ===
      convertValue(props.modelValue, props.uniqKeys[1])
  )
)
const focusingListItemIndex = ref(-1)
const dropdownHeight = ref(0)

const convertValue = (value: ValueValue, key: string) => {
  if (typeof value === 'string') {
    return value
  }
  if (value === null) return undefined
  return value[key]
}

const selectValue = (selectedOption: Value) => {
  //remove
  if (selectedValue.value !== undefined) {
    if (
      convertValue(selectedValue.value?.value, props.uniqKeys[0]) ===
      convertValue(selectedOption.value, props.uniqKeys[1])
    ) {
      removeValue()
      return
    }
  }
  // add
  emit('update:modelValue', selectedOption.value)
  if (inputRef.value === null) return
  isDropdownOpen.value = false
  emit('close')
  searchQuery.value = ''
}
const removeValue = () => {
  setTimeout(() => {
    emit('update:modelValue', null)
  }, 10)
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (inputSelectRef.value === null || !isDropdownOpen.value) return
  if (!inputSelectRef.value.contains(target)) {
    isDropdownOpen.value = false
    emit('close')
  }
}

const searchedOptions = computed(() => {
  return props.options.filter(option => {
    const regexp = new RegExp(searchQuery.value, 'i')
    return regexp.test(option.key)
  })
})
const openDropdown = () => {
  isDropdownOpen.value = true
  if (inputRef.value === null) return
  inputRef.value.focus()
}
const handleKeydown = (e: KeyboardEvent) => {
  if (listItemRefs.value === null) return
  if (e.key === 'Tab') {
    isDropdownOpen.value = false
    emit('close')
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusingListItemIndex.value =
      (focusingListItemIndex.value + 1) % listItemRefs.value.length
    const buttonEl = listItemRefs.value[focusingListItemIndex.value]
      .firstChild as HTMLButtonElement
    buttonEl.focus({ preventScroll: false })
    if (listRef.value === null) return
    if (focusingListItemIndex.value > 3) {
      listRef.value.scrollBy({
        top: 12,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusingListItemIndex.value =
      (focusingListItemIndex.value - 1 + listItemRefs.value.length) %
      listItemRefs.value.length
    const buttonEl = listItemRefs.value[focusingListItemIndex.value]
      .firstChild as HTMLButtonElement
    buttonEl.focus({ preventScroll: false })
    if (listRef.value === null) return
    const length =
      searchQuery.value !== ''
        ? searchedOptions.value.length
        : props.options.length
    if (focusingListItemIndex.value < length - 3) {
      listRef.value.scrollBy({
        top: -12,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}

const updateHeight = () => {
  if (listRef.value === null) return
  dropdownHeight.value = listRef.value.offsetHeight / 4
}
const resizeObserver = new ResizeObserver(updateHeight)
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  if (listRef.value === null) return
  resizeObserver.observe(listRef.value)
})
watch([listRef], () => {
  if (listRef.value === null) return
  resizeObserver.observe(listRef.value)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  resizeObserver.disconnect()
})
</script>

<template>
  <div
    ref="inputSelectRef"
    :class="`relative ${disabled && 'cursor-not-allowed'}`">
    <div
      role="button"
      tabindex="0"
      class="flex w-full cursor-text items-center gap-1 rounded border border-surface-secondary py-1 pr-1"
      :class="`${disabled && 'pointer-events-none'}`"
      @click="openDropdown"
      @keydown.enter="openDropdown"
      @keydown.space="openDropdown">
      <div class="relative left-2 flex w-full">
        <span
          v-if="selectedValue"
          :class="`flex items-center ${
            isDropdownOpen && 'absolute text-text-secondary'
          }`">
          {{ selectedValue.key }}
        </span>
        <input
          :id="props.id"
          ref="inputRef"
          v-model="searchQuery"
          class="flex-grow bg-transparent focus:outline-none"
          :placeholder="selectedValue === undefined ? placeholder : ''"
          @focus="isDropdownOpen = true"
          @keydown="handleKeydown" />
      </div>
      <button v-if="selectedValue" type="button" @click="removeValue">×</button>
      <ChevronDownIcon class="h-4 w-4" />
    </div>
    <ul
      v-if="isDropdownOpen && searchedOptions.length > 0"
      ref="listRef"
      class="absolute z-10 max-h-40 w-full border border-surface-tertiary bg-white shadow-lg"
      :class="`${
        isDropdownAbove ? `-top-${dropdownHeight} rounded-t-lg` : 'rounded-b-lg'
      } ${
        ((searchQuery === '' && options.length > 4) ||
          (searchQuery !== '' && searchedOptions.length > 4)) &&
        'overflow-y-scroll'
      }`">
      <li
        v-for="option in searchQuery !== '' ? searchedOptions : options"
        :key="option.key"
        ref="listItemRefs"
        :class="`last:not-first:rounded-b-md focus-within:bg-hover-secondary hover:bg-hover-secondary ${
          selectedValue?.value === option.value &&
          'bg-hover-primary hover:bg-hover-primary'
        }`">
        <button
          class="h-full w-full px-4 py-1 text-left focus:outline-none"
          type="button"
          @click="selectValue(option)"
          @keydown="handleKeydown">
          {{ option.key }}
        </button>
      </li>
    </ul>
  </div>
</template>
