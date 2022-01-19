import { TFHttpSend } from "src/typings/getRequest";
export default {
  // TeacherExperimentManage
  teacherManageList:{url:`/api/content/category/teacher`,method:'GET'},
  deleteCategory:{url:`/api/content/category/deletes`,method:'POST',dataType:'json'},
  ExperimentList:{url:`/api/content/category/contents`,method:'GET'},

  basicsManageList:{url:`/api/content/category/init`,method:'GET'},


  shareManageList:{url:`/api/content/category/share`,method:'GET'},


  TechnicalDirection:{url:`/api/content/category/category`,method:'GET'},
  ChapterList:{url:`/api/content/category/chapters`,method:'GET'},
}

export interface IAdminExperimentManage {
  teacherManageList:TFHttpSend
  deleteCategory:TFHttpSend
  ExperimentList:TFHttpSend


  basicsManageList:TFHttpSend



  shareManageList:TFHttpSend



  TechnicalDirection:TFHttpSend
  ChapterList:TFHttpSend
}
export const MODULE_NAME = 'adminExperimentManage'