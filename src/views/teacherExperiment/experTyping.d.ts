interface ITeacherExperApi {
  getExpeTreeList: Function
  addChapter: Function
  updateChapter: Function
  shareChapter: Function
  deleteChapter: Function
  saveToContentAll: Function
  getSearchInfo: Function
  getExperimentList: Function
  sortExperimental: Function
  shareExperimental: Function
  deleteExperimental: Function
  saveToContent: Function
  getSameScreenInfo: Function
  getTopoVmInfo: Function
  deleteTopo: Function
  uploadTaskFile: Function
  createVnc: Function
  createJupyter: Function
  mineTemplateList: Function
  initTemplateList: Function
  sharedTemplateList: Function
  teachersTemplateList: Function
  deleteTemplate: Function
  copyTemplate: Function
  shareTemplate: Function
  unshareTemplate: Function
}
export interface ITeacherExperHttp {
  teacherExperiment: ITeacherExperApi
}
export interface ITreeList {
  contents_share_count: number
  contents_count: number
  id: number
  name: string 
  children: ITreeList[]
}
interface IEnvirment {
  cpu: number
  ram: number
  disk: number
}
export interface IExporimentList {
  id: number
  task_type: number
  name: string
  class_cnt: number
  envirment: IEnvirment
  is_share: number
  is_final_share: number
}
export interface IListSearchInfo {
  experimentKeyWord: string
  page: number
  pageSize: number
  total: number
  experimentalDataList: IExporimentList[],
  loading: boolean
}
interface Iimage {
  name: string
  tag: []
}
interface Icongig {
  cpu_text: string
  disk_text: string
  ram_text: string
  swap: string
}
export interface IimageData {
  id: number
  isSelect: boolean
  image: Iimage
  config: Icongig
}