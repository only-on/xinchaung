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
  id: number
  name: string
}
