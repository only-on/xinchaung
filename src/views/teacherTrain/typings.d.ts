interface ITeacherTrain {
  releaseScore: Function
  exportScore: Function
  showExperimentalNote: Function
  delResource: Function
  uploadResource: Function
  resetExperimentalServer: Function
  setExperimentalScore: Function
  trainList: Function
  builtTrainList: Function
  archiveTrainList: Function
  changeStatus: Function
  trainComplex: Function
  fileTrain: Function
  deleteTrain: Function
  trainArchived: Function
  trainDeleted: Function
  getResourceList: Function
  assessmentList: Function
  assessmentStatistic: Function
  uploadsFile:Function 
}
export interface ITeacherTrainHttp {
  teacherTrain: ITeacherTrain
}