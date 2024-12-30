<script setup lang="ts">
const emit = defineEmits<{
  (e: 'closeModal'): void
}>()
</script>

<template>
  <teleport to="body">
    <div
      className="z-10 fixed top-0 left-0 h-full w-full bg-surface-secondary/50"
      @click.self="emit('closeModal')">
      <slot />
    </div>
  </teleport>
</template>
