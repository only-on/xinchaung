import { TFHttpSend } from "src/typings/getRequest";
export default{
   //  教师
  teacherList:{url:`/api/yii/teacher/index`,method:'POST',dataType: 'json'},
  teacherUserDelete:{url:`/api/yii/teacher/delete?id={id}`,method:'POST'},
  teacherUserBatchDelete:{url:`/api/yii/teacher/delall`,method:'POST',dataType:'json'},
  createTeacher:{url:`/api/yii/teacher/create`,method:'POST',dataType: 'json'},
  editTeacher:{url:`/api/yii/teacher/update?id={id}`,method:'POST',dataType: 'json'},
  viewTeacher:{url:`/api/yii/teacher/view?id={id}`,method:'POST',dataType: 'json'},
  batchResetTpassword:{url:'/api/yii/teacher/batch-init-password',method:'POST',dataType: 'json'},
  closeOrOpenTea:{url:'/api/yii/teacher/change-status',method:'POST',dataType: 'json'},
  //  学生
  studentList:{url:`/api/yii/student/index`,method:'POST',dataType: 'json'},
  studentUserDelete:{url:`/api/yii/student/delete?id={id}`,method:'POST'},
  studentUserBatchDelete:{url:`/api/yii/student/delall`,method:'POST',dataType:'json'},
  studentCreate:{url:`/api/yii/student/create`,method:'POST',dataType: 'json'},
  editStudent:{url:`/api/yii/student/update?id={id}`,method:'POST',dataType: 'json'},
  viewStudent:{url:`/api/yii/student/view?id={id}`,method:'POST',dataType: 'json'},
  BatchImport:{url:`/api/yii/student/importtpl`,method:'POST',dataType: 'formdata'},
  BatchImportTeacher:{url:`/api/yii/teacher/importtpl`,method:'POST',dataType: 'formdata'},
  batchResetSpassword:{url:'/api/yii/student/batch-init-password',method:'POST',dataType: 'json'},
  closeOrOpenStu:{url:'/api/yii/student/change-status',method:'POST',dataType: 'json'},
}
export interface IAdminUserManagement{
  teacherList:TFHttpSend
  teacherUserDelete:TFHttpSend
  teacherUserBatchDelete:TFHttpSend
  createTeacher:TFHttpSend
  editTeacher:TFHttpSend
  viewTeacher:TFHttpSend
  batchResetTpassword:TFHttpSend
  closeOrOpenTea:TFHttpSend

  studentList:TFHttpSend
  studentUserDelete:TFHttpSend
  studentUserBatchDelete:TFHttpSend
  studentCreate:TFHttpSend
  editStudent:TFHttpSend
  viewStudent:TFHttpSend
  BatchImport:TFHttpSend
  BatchImportTeacher:TFHttpSend
  batchResetSpassword:TFHttpSend
  closeOrOpenStu:TFHttpSend

}
export const MODULE_NAME = 'adminUserManagement'