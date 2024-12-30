import apis from '/@/lib/apis'

import {
  convertRequestDetailFromData,
  convertRequestFromData
} from '/@/features/request/converter'
import { convertRequestCommentFromData } from '/@/features/requestComment/converter'
import type { RequestComment } from '/@/features/requestComment/model'
import { convertRequestStatusFromData } from '/@/features/requestStatus/converter'
import type {
  RequestStatusDetail,
  RequestStatus
} from '/@/features/requestStatus/model'

import type {
  Request,
  RequestDetail,
  RequestQuerySeed,
  RequestSeed
} from './model'

export const useRequestRepository = () => {
  return createRequestRepository()
}

const createRequestRepository = () => ({
  fetchRequests: async (querySeed: RequestQuerySeed): Promise<Request[]> => {
    const { data } = await apis.getRequests(
      querySeed.sort,
      querySeed.currentStatus !== '' ? querySeed.currentStatus : undefined,
      querySeed.target,
      querySeed.since,
      querySeed.until,
      querySeed.tags.join(','),
      querySeed.group
    )

    return data.map(convertRequestFromData)
  },

  fetchRequest: async (id: string): Promise<RequestDetail> => {
    const { data } = await apis.getRequestDetail(id)

    return convertRequestDetailFromData(data)
  },

  createRequest: async (request: RequestSeed): Promise<RequestDetail> => {
    const requestData = {
      title: request.title,
      content: request.content,
      targets: request.targets,
      tags: request.tags.map(tag => tag.id),
      group: request.group,
      created_by: request.createdBy
    }
    const { data } = await apis.postRequest(requestData)

    return convertRequestDetailFromData(data)
  },

  editRequest: async (
    id: string,
    request: RequestSeed
  ): Promise<RequestDetail> => {
    const requestData = {
      title: request.title,
      content: request.content,
      targets: request.targets,
      tags: request.tags.map(tag => tag.id),
      group: request.group,
      created_by: request.createdBy
    }
    const { data } = await apis.putRequestDetail(id, requestData)

    return convertRequestDetailFromData(data)
  },

  createComment: async (
    id: string,
    comment: string
  ): Promise<RequestComment> => {
    const commentData = {
      comment
    }
    const { data } = await apis.postComment(id, commentData)

    return convertRequestCommentFromData(data)
  },

  editStatus: async (
    id: string,
    status: RequestStatus,
    comment: string
  ): Promise<RequestStatusDetail> => {
    const statusData = {
      status,
      comment
    }
    const { data } = await apis.putStatus(id, statusData)

    return convertRequestStatusFromData(data)
  }
})
