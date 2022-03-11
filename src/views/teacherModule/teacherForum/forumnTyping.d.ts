export interface IForumSearch {
  title: string;
  type: string;
  page?: number;
  pageSize?: number;
}
interface IUser {
  id: number
  username: string
}
export interface IForumnList {
  id: number;
  title: string;
  desc: string;
  content: string;
  user_name: string;
  avatar: string;
  created_at: number;
  views: number;
  reply_number_count: number
  isAllText: boolean;
  user: IUser
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
  second_reply_number_count: number
  created_at: number
  updated_at: number
  deleted_at: null
}
