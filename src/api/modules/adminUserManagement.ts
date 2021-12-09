import { TFHttpSend } from "src/typings/getRequest";
export default{
  teacherList:{url:`/teacher/index`,method:'POST',dataType: 'json'},
  teacherUserDelete:{url:`/teacher/delete?id={id}`,method:'POST'},
  teacherUserBatchDelete:{url:`/teacher/delall`,method:'POST',dataType:'json'},
  createTeacher:{url:`/teacher/create`,method:'POST',dataType: 'json'},
  editTeacher:{url:`/teacher/update?id={id}`,method:'POST',dataType: 'json'},
  viewTeacher:{url:`/teacher/view?id={id}`,method:'POST',dataType: 'json'},

  student:{url:`/student/index`,method:'POST',dataType: 'json'},
}
export interface IAdminUserManagement{
  teacherList:TFHttpSend
  teacherUserDelete:TFHttpSend
  teacherUserBatchDelete:TFHttpSend
  createTeacher:TFHttpSend
  editTeacher:TFHttpSend
  viewTeacher:TFHttpSend
}
export const MODULE_NAME = 'adminUserManagement'