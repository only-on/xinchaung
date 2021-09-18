interface ITeacherExperimental {
  releaseScore: Function
  exportScore: Function
  showExperimentalNote: Function
  delResource: Function
  uploadResource: Function
}
export interface ITeacherExperimentalHttp {
  teacherExperimental: ITeacherExperimental
}