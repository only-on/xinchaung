export interface ITableList {
  id?: number
  username: string
  name: string
  sex: string
  email?: string
  status?: number
  phone?: string
  teacher?: string
  passWord?: string
  submitPass?: string
  createTime?: string
  updateTime?: string
}
interface ISearchInfo {
  name: string
  username: string
}
export interface IPage {
  page: number
  pageSize: number
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
  delAssistant: Function 
  changeStatus: Function
  addAssistant: Function
}
export interface IHttp {
  teacherAssistant: ITeacherAssistant
}