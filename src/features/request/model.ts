import type { DateTime } from 'luxon'

import type { Group } from '/@/features/group/model'
import type { RequestComment } from '/@/features/requestComment/model'
import type {
  RequestStatusDetail,
  RequestStatus
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
  tags: string[]
  group: string
}

export interface RequestDetail extends Request {
  files: File[]
  comments: RequestComment[]
  statuses: RequestStatusDetail[]
}

interface File {
  name: string
  type: string
  url: string
  alt: string
}

export interface RequestSeed {
  createdBy: string
  title: string
  content: string
  targets: RequestTarget[]
  tags: Tag[]
  group: string | null
}
