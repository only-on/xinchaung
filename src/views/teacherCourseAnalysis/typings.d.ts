export interface ICourseInfo {
  type: string,
  courseId: number
  courseType: number
}
interface IcourseTree {
  getTreeList: Function
  chapterSort: Function
  contentSort: Function
  editNode: Function
  deleteNode: Function
}
export interface ITreeHttp {
  courseTree: IcourseTree
}
interface ICourseAnalysis{
  getContentList: Function
  getContentScore: Function
  getCourseDetail: Function
  saveReportTemplate: Function
  getReportTemplate: Function
}
export interface ICourseAnalysisHttp {
  teacherCourseAnalysis: ICourseAnalysis
}

interface Isolts {
  icon: string
}
export interface ITreeDataItem {
  id: number
  name: string
  sort: number
  type?: string
  is_high?: boolean
  contents: ITreeDataItem[]
}
export interface ITreeData {
  data: ITreeDataItem[],
  experimentList: ITreeDataItem[],
}