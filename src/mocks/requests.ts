import { rest } from 'msw'

export const requests = [
  rest.get('/api/requests', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        Array(100)
          .fill({})
          .map((_, i) => ({
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            status: [
              'submitted',
              'fix_required',
              'accepted',
              'completed',
              'rejected'
            ][i % 5],
            created_at: '2022-01-25T13:29:19.918Z',
            updated_at: '2022-01-25T13:29:19.918Z',
            created_by: 'mehm8128',
            amount: 1200,
            title: 'SysAd講習会の開催費用',
            tags: [
              {
                id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
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
                id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
                name: '2020講習会',
                created_at: '2022-01-25T13:29:19.918Z',
                updated_at: '2022-01-25T13:29:19.918Z'
              }
            ],
            group: {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
              name: 'SysAd',
              description: 'SysAd班',
              budget: 250000,
              created_at: '2022-04-05T14:02:15.431Z',
              updated_at: '2022-04-05T14:02:15.431Z'
            }
          }))
      )
    )
  }),
  rest.get('/api/requests/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        amount: 1200,
        title: 'SysAd講習会の開催費用',
        created_by: 'mehm8128',
        status: 'submitted',
        content: `# 目的
なろう講習会
## 内容
- サーバー代
  - Conoha
- 参考書代
  - マスタリングTCP/IP
  - リーダブルコード`,
        targets: [
          {
            id: 'mehm8128',
            amount: 1200,
            target: 'mehm8128',
            paid_at: '2020-01-01',
            created_at: '2020-01-01'
          },
          {
            id: 'nagatech',
            amount: 1500,
            target: 'nagatech',
            paid_at: '2020-01-02',
            created_at: '2020-01-02'
          }
        ],
        comments: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            user: 'mehm8128',
            comment:
              '**これも追加でお願いします**\n- お菓子 \n  - たけのこの里\n  - きのこの山\n- ジュース \n  - 三ツ矢サイダー',
            created_at: '2022-02-11T08:01:38.838Z',
            updated_at: '2022-02-11T08:01:38.838Z'
          },
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            user: 'mehm8128',
            comment: 'やっぱりきのこの山はなくて大丈夫です',
            created_at: '2022-02-14T08:01:38.838Z',
            updated_at: '2022-02-14T08:01:38.838Z'
          }
        ],
        files: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          //'3fa85f64-5717-4562-b3fc-2c963f66afb6',
          '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          '3fa85f64-5717-4562-b3fc-2c963f66afa8'
        ],
        statuses: [
          {
            created_by: 'mehm8128',
            status: 'submitted',
            created_at: '2022-02-12T08:01:37.838Z'
          },
          {
            created_by: 'mehm8128',
            status: 'fix_required',
            created_at: '2022-02-13T08:01:37.838Z'
          },
          {
            created_by: 'mehm8128',
            status: 'submitted',
            created_at: '2022-02-18T08:01:37.838Z'
          }
        ],
        tags: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
            name: '2020講習会',
            created_at: '2020-02-12T08:01:37.838Z',
            updated_at: '2020-02-12T08:01:37.838Z'
          },
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: '2021講習会',
            created_at: '2021-02-12T08:01:38.838Z',
            updated_at: '2021-02-12T08:01:38.838Z'
          },
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
            name: '2022講習会',
            created_at: '2022-02-12T08:01:39.838Z',
            updated_at: '2022-02-12T08:01:39.838Z'
          }
        ],
        group: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          name: 'SysAd',
          description: 'SysAd班',
          budget: 250000,
          created_at: '2022-04-05T14:02:15.431Z',
          updated_at: '2022-04-05T14:02:15.431Z'
        },
        created_at: '2022-02-12T08:01:37.838Z',
        updated_at: '2022-02-12T08:01:37.838Z'
      })
    )
  })
]
