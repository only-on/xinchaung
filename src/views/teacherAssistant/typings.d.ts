export interface ITableList {
  id?: number
  username: string
  name: string
  gender: string
  email?: string
  status?: number
  phone?: string
  teacher_name?: string
  passWord?: string
  submitPass?: string
  createTime?: string
  updateTime?: string
  bind_status: string
}
interface ISearchInfo {
  name: string
  username: string
}
export interface IPage {
  page: any
  pageSize: any
  total: number
}
export interface IData {
  searchInfo: ISearchInfo,
  tableList: ITableList[],
  page: IPage,
  selectedRows: ITableList[]
}

interface ITeacherAssistant {
  getAssistantList: Function
  getAssistantDetail: Function
  delAssistant: Function
  changeStatus: Function
  addAssistant: Function
  updateAssistant: Function
}
export interface IHttp {
  teacherAssistant: ITeacherAssistant
}