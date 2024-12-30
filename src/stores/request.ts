import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Request, RequestQuerySeed } from '/@/features/request/model'

const defaultParams: RequestQuerySeed = {
  sort: 'created_at',
  currentStatus: '',
  target: '',
  since: '',
  until: '',
  tags: [],
  group: ''
}

export const useRequestStore = defineStore('request', () => {
  const requests = ref<Request[]>([])
  const isRequestFetched = ref(false)

  const filterParams = ref<RequestQuerySeed>(defaultParams)

  return { requests, isRequestFetched, filterParams }
})
