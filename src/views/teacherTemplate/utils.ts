export const initialWidgetThumb: Array<any> = [
  {
    title: '报告标题',
    widget: [
      {
        type: 'w1',
      },
    ],
  },
  {
    title: '文本框',
    widget: [
      {
        type: 'w2',
      },
      {
        type: 'w3',
      },
      {
        type: 'w4',
      },
    ],
  },
  {
    title: '文本域',
    widget: [
      {
        type: 'w5',
      },
      {
        type: 'w6',
      },
    ],
  },
  {
    title: 'markdown',
    widget: [
      {
        type: 'w7',
      },
      {
        type: 'w8',
      },
    ],
  },
]
export const genFieldName = (type: string, kind: string, key: number): string => `${type}_${kind}_${key}`
export const splitFieldName = (name: string): Array<string> => name?.split('_')