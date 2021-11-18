interface ITeacherTemplateApi {
  mineTemplateList: Function
  initTemplateList: Function
  sharedTemplateList: Function
  teachersTemplateList: Function
  deleteTemplate: Function
  copyTemplate: Function
  shareTemplate: Function
  unshareTemplate: Function
  createTemplate: Function
  viewTemplate: Function
  updateTemplate: Function
}
export interface ITeacherTemplateHttp {
  teacherTemplate: ITeacherTemplateApi
}
// 报告模板数据模型
export interface TemplateModel {
  id?: number // 模板ID，整数类型
  type?: string // 模板类型， form => 在线模板， file => 离线模板
  name?: string // 模板名称， 格式字符串
  file_url?: string // 离线模板文件下载URL, URL格式
  pdf_url?: string // 离线模板文件下载URL, URL格式
  word_url?: string // 离线模板文件下载URL, URL格式
  is_shared?: boolean // 是否已分享, 格式布尔, true => 已分享, false => 未分享
  created_at?: string // 模板创建时间, 时间字符串
  can_shared?: boolean // 是否已分享, 格式布尔, true => 已分享, false => 未分享
  can_delete?: boolean // 是否可以删除, 格式布尔, true => 可以删除, false => 不可以删除
  can_edit?: false // 是否可以编辑, 格式布尔, true => 可以删除, false => 不可以删除
  can_copy?: false // 是否可以复制到我的模板, 格式布尔, true => 可以复制, false => 不可以复制
  can_download?: false // 是否可以下载, 格式布尔, true => 可以下载, false => 不可以下载
  json_content?: Array<WidgetModel> // 在线模板JSON内容 , json 字符串
  html_content?: string // 在线模板JSON内容
  file_name?: string //文件名称
  word_path?: string //文件下载路径
}

// 拖拽组件类型
export interface WidgetTypes {
  w1: string
  w2: string
  w3: string
  w4: string
  w5: string
  w6: string
  w7: string
  w8: string
}

export interface WidgetField {
  name: string
  value: string | number
  placeholder: string | void
  readonly: boolean
  align?: string
  colspan?: number
}

export interface WidgetModel {
  type: keyof WidgetTypes
  fields: Array<WidgetField>
  toolbar?: boolean
  onlyOne?: boolean
  id?: number
  children?: WidgetModel
}

export type WidgetDataModelMap = {
  [key in keyof WidgetTypes]: WidgetModel
}
export interface Iform{
  name: string,
  json_content: WidgetModel[],
  html_content: string,
  id?: string | number
}
