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
}
export interface Ihttp {
  teachCourse: IteachCourse
}