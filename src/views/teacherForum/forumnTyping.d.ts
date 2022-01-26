export interface IForumSearch {
	title: string
	type: number
  page?: number
  pageSize?: number
}
export interface IForumnList {
  id: number
  title: string
  desc: string
  content: string
  userName: string
  userAvatar: string
  createTime: string
  replayNum: number
  isAllText: boolean
}
export interface ILabel {
  id: number
  name: string
}