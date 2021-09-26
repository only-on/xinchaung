interface ITeacherExperimental {
  releaseScore: Function
  exportScore: Function
  showExperimentalNote: Function
  delResource: Function
  uploadResource: Function
  resetExperimentalServer: Function
  setExperimentalScore: Function
  trainList: Function
  changeStatus: Function
  trainComplex: Function
  trainArchived: Function
  trainDeleted: Function
}
export interface ITeacherExperimentalHttp {
  teacherExperimental: ITeacherExperimental
}