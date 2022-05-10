import { TFHttpSend } from "src/typings/getRequest";
export default{
   //  教师
  teacherList:{url:`/api/yii/teacher/index`,method:'POST',dataType: 'json'},
  teacherUserDelete:{url:`/teacher/delete?id={id}`,method:'POST'},
  teacherUserBatchDelete:{url:`/teacher/delall`,method:'POST',dataType:'json'},
  createTeacher:{url:`/teacher/create`,method:'POST',dataType: 'json'},
  editTeacher:{url:`/teacher/update?id={id}`,method:'POST',dataType: 'json'},
  viewTeacher:{url:`/teacher/view?id={id}`,method:'POST',dataType: 'json'},
  //  学生
  studentList:{url:`/api/yii/student/index`,method:'POST',dataType: 'json'},
  studentUserDelete:{url:`/student/delete?id={id}`,method:'POST'},
  studentUserBatchDelete:{url:`/student/delall`,method:'POST',dataType:'json'},
  studentCreate:{url:`/student/create`,method:'POST',dataType: 'json'},
  editStudent:{url:`/student/update?id={id}`,method:'POST',dataType: 'json'},
  viewStudent:{url:`/student/view?id={id}`,method:'POST',dataType: 'json'},
  BatchImport:{url:`/student/importtpl`,method:'POST',dataType: 'formdata'}
}
export interface IAdminUserManagement{
  teacherList:TFHttpSend
  teacherUserDelete:TFHttpSend
  teacherUserBatchDelete:TFHttpSend
  createTeacher:TFHttpSend
  editTeacher:TFHttpSend
  viewTeacher:TFHttpSend

  studentList:TFHttpSend
  studentUserDelete:TFHttpSend
  studentUserBatchDelete:TFHttpSend
  studentCreate:TFHttpSend
  editStudent:TFHttpSend
  viewStudent:TFHttpSend
  BatchImport:TFHttpSend

}
export const MODULE_NAME = 'adminUserManagement'