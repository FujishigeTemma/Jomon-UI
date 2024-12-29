import type { DateTime } from 'luxon'

import type { Group } from '/@/features/group/model'
import type { RequestComment } from '/@/features/requestComment/model'
import type {
  RequestStatus,
  RequestStatusDetail
} from '/@/features/requestStatus/model'
import type {
  RequestTarget,
  RequestTargetDetail
} from '/@/features/requestTarget/model'
import type { Tag } from '/@/features/tag/model'

export interface Request {
  id: string
  status: RequestStatus
  createdBy: string
  title: string
  content: string
  targets: RequestTargetDetail[]
  tags: Tag[]
  group: Group | null
  createdAt: DateTime
}

export interface RequestQuerySeed {
  sort: string
  currentStatus: RequestStatus | ''
  target: string
  since: string
  until: string
  limit: number
  offset: number
  tags: string[]
  group: string
}

export interface RequestDetail extends Request {
  files: string[]
  comments: RequestComment[]
  statuses: RequestStatusDetail[]
}

export interface RequestSeed {
  createdBy: string
  title: string
  content: string
  targets: RequestTarget[]
  tags: Tag[]
  group: string | null
}
