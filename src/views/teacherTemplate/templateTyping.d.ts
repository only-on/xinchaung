interface ITeacherTemplateApi {
  mineTemplateList: Function
  initTemplateList: Function
  sharedTemplateList: Function
  teachersTemplateList: Function
  deleteTemplate: Function
  copyTemplate: Function
  shareTemplate: Function
  unshareTemplate: Function
}
export interface ITeacherTemplateHttp {
  teacherTemplate: ITeacherTemplateApi
}