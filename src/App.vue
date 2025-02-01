<script lang="ts" setup>
import { watch } from 'vue'

import { useFetchMeUsecase } from '/@/features/user/usecase'

import JomonHeader from './components/navigation/JomonHeader.vue'
import './styles/main.css'
import './styles/scrollbar.css'
import './styles/toast.css'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.fullPath,
  async () => {
    try {
      await useFetchMeUsecase()
    } catch {
      document.location = 'https://jomon-dev.trapti.tech/api/auth/genpkce'
    }
  }
)
</script>

<template>
  <JomonHeader />
  <main class="text-text-primary bg-surface-primary pt-12">
    <div class="md:w-2/3 w-5/6 mx-auto mt-8 pb-32">
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <div>loading...</div>
            </template>
          </suspense>
        </template>
      </router-view>
    </div>
  </main>
</template>

<style>
.modal-container {
  cursor: default;
  z-index: 20;
}
</style>
