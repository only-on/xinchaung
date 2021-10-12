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
  getClassesList: Function
  getCourseDetail: Function
  saveReportTemplate: Function
  getReportTemplate: Function
  getCourseDirections: Function
  getCourseCategories: Function
  uploadImg: Function
  editCourse: Function
  
}
export interface ICourseAnalysisHttp {
  teacherCourseAnalysis: ICourseAnalysis
}

interface IExperimentList {
  labelName: string
  labelId: number
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
  experimentList: IExperimentList[],
}

interface IScoreList {
  time: number[]
  question: number[]
  step: number[]
  reports: number[]
}
export interface IExperimentScore {
  studentList: string[],
  scoreList: IScoreList
}