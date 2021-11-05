/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface ErrorMessage {
  msg: string
}

export interface ResultModel {
  msg: string
  data: any
  error: ErrorMessage
  status: number
  code?: number
  message?: string
}

export type StringKeyObject = {
  [key: string]: any
}

// create a new type HTMLElementEvent that has a target of type you pass
// type T must be a HTMLElement (e.g. HTMLTextAreaElement extends HTMLElement)
export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T
  // probably you might want to add the currentTarget as well
  // currentTarget: T;
}

export type IdentValue = {
  id: number
  value: string
}

// 是否是公开
export enum ResourceOwnership {
  public = 1 as number,
  private = 0 as number,
}

// 后端返回数据的类型
export type DataModel<T> = T

// 后端接口返回数据的格式
export type APIModel<T> = {
  code?: number
  message?: string
  data: DataModel<T>
}

// 后端接口返回分页信息格式
export type ResPagerModel = {
  totalCount?: number
  pageCount?: number
  currentPage?: number
  perPage?: number
}
