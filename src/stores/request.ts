import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Request } from '/@/lib/apis'
import apis from '/@/lib/apis'

export interface Params {
  sort: string
  currentStatus: string | null
  target: string | null
  since: string
  until: string
  tag:
    | {
        id: string
        name: string
        created_at: string
        updated_at: string
      }[]
    | null
  group: string | null
}

const defaultParams: Params = {
  sort: 'created_at',
  currentStatus: null,
  target: null,
  since: '',
  until: '',
  tag: null,
  group: null
}

export const useRequestStore = defineStore('request', () => {
  const requests = ref<Request[]>(
    Array(100).fill({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      status: 'submitted',
      created_at: '2022-01-25T13:29:19.918Z',
      updated_at: '2022-01-25T13:29:19.918Z',
      created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      amount: 1200,
      title: 'SysAd講習会の開催費用',
      tags: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2021講習会',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2022講習会',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z'
        }
      ],
      group: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'SysAd',
        description: 'SysAd班',
        budget: 250000,
        created_at: '2022-01-25T13:29:19.918Z',
        updated_at: '2022-01-25T13:29:19.918Z'
      }
    })
  )
  const tagList = ref<string[]>([])
  const isRequestFetched = ref(false)

  const fetchRequests = async (tmpParams: Params = defaultParams) => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    const params = { ...tmpParams, tag: '' }
    if (
      (tmpParams.since && !rule.test(tmpParams.since)) ||
      (tmpParams.until && !rule.test(tmpParams.until))
    ) {
      alert('日付が不正です')
      return
    }
    const tmpTagList = tmpParams.tag?.slice() || []
    params.tag = tmpTagList.map(tag => tag.id).join(',')
    try {
      requests.value = (
        await apis.getRequests(
          params.sort,
          params.currentStatus || '',
          params.target || '',
          params.since,
          params.until,
          params.tag || '',
          params.group || ''
        )
      ).data
    } catch (err: any) {
      alert(err.message)
    }
  }
  return { requests, isRequestFetched, fetchRequests, tagList }
})
