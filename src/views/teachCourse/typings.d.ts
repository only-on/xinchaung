export interface ICourseInfo {
  type: string,
  courseId: number
  courseType: number
}
interface IteachCourse {
  getPre: Function
  preLimit: Function
  saveTopoinst: Function 
  getTreeList: Function
  vmOpen: Function
  vmClose: Function
  vmRevert: Function
  vmReset: Function
  canAccessVm: Function
  getResultInfo: Function
  studentCount: Function
  resultCount: Function
  resultCreate: Function
  exportTaskView: Function
  getSocre: Function
  changeEvaluate: Function
  allClasses: Function
  evaluteProject: Function
  showNotes: Function
  reportAnnotate: Function
  reportView: Function
  evaluteContent: Function
  showQuestions: Function
  showVideos: Function
}
interface IcourseTree {
  getTreeList: Function
  chapterSort: Function
  contentSort: Function
  editNode: Function
  deleteNode: Function
}
export interface Ihttp {
  teachCourse: IteachCourse,
}
export interface ITreeHttp {
  courseTree: IcourseTree
}