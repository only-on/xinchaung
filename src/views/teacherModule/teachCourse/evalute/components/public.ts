export const options = [
  { label: '不合格', value: '1' },
  { label: '合格', value: '2' },
  { label: '良好', value: '3' },
  { label: '优秀', value: '4' },
];
export const typeList = [
  {
    value: 'score',
    text: '成绩明细'
  },
  {
    value: 'notes',
    text: '实验笔记'
  },
  {
    value: 'video',
    text: '操作视频'
  },
  {
    value: 'report',
    text: '实验报告'
  },
  {
    value: 'exam',
    text: '实验习题'
  },
  {
    value: 'evalute',
    text: '教师评价'
  }
]
export interface Iform{
  classId: string,
  username: string,
  name: string,
  page: number,
  pageSize: number
}