interface ITeacherExperimental {
  releaseScore: Function
  exportScore: Function
  showExperimentalNote: Function
  delResource: Function
  uploadResource: Function
  resetExperimentalServer: Function
  setExperimentalScore: Function
}
export interface ITeacherExperimentalHttp {
  teacherExperimental: ITeacherExperimental
}