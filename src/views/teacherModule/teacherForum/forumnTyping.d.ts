export interface IForumSearch {
  title: string;
  type: number;
  page?: number;
  pageSize?: number;
}
export interface IForumnList {
  id: number;
  title: string;
  desc: string;
  content: string;
  user_name: string;
  avatar: string;
  createTime: string;
  views: number;
  reply_number_count: number
  isAllText: boolean;
}
export interface ILabel {
  value: number;
  name: string;
}

export interface ILabelList {
  id: number
  name: string
  count: number
}
export interface ITagList {
  id?: number
  name: string
  value?: string
}
export interface IReplyList {
  id: number
  content: string
  user_id: number
  level: number
  pid: number
  forum_id: number
  user_name: string
  avatar: string
  created_at: number
  updated_at: number
  deleted_at: null
}
