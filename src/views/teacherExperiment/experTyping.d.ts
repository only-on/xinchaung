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