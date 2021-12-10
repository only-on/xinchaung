import { TFHttpSend } from "src/typings/getRequest";
export default{
  teacherList:{url:`/teacher/index`,method:'POST',dataType: 'json'},
  teacherUserDelete:{url:`/teacher/delete?id={id}`,method:'POST'},
  teacherUserBatchDelete:{url:`/teacher/delall`,method:'POST',dataType:'json'},
  createTeacher:{url:`/teacher/create`,method:'POST',dataType: 'json'},
  editTeacher:{url:`/teacher/update?id={id}`,method:'POST',dataType: 'json'},
  viewTeacher:{url:`/teacher/view?id={id}`,method:'POST',dataType: 'json'},

  studentList:{url:`/student/index`,method:'POST',dataType: 'json'},
  studentUserDelete:{url:`/student/delete?id={id}`,method:'POST'},
  studentUserBatchDelete:{url:`/teacher/delall`,method:'POST',dataType:'json'},
  studentCreate:{url:`/student/create`,method:'POST',dataType: 'json'},
  editStudent:{url:`/student/update?id={id}`,method:'POST',dataType: 'json'},
  viewStudent:{url:`/student/view?id={id}`,method:'POST',dataType: 'json'},
  BatchImport:{url:`/student/importtpl`,method:'POST',dataType: 'formdata'},

  classList:{url:`/api/course/classes`,method:'GET'},
  // creat
  classUserDelete:{url:`api/course/classes/{class_id}`,method:'DELETE'},
  // studentUserBatchDelete:{url:`/teacher/delall`,method:'POST',dataType:'json'},
  classCreate:{url:`/api/course/classes`,method:'POST',dataType: 'json'},
  editClass:{url:`/api/course/classes/{class_id}`,method:'PUT',dataType: 'json'},
  // viewStudent:{url:`/student/view?id={id}`,method:'POST',dataType: 'json'},
  // BatchImport:{url:`/student/importtpl`,method:'POST',dataType: 'formdata'},
  // /student/create


  // api/course/classes/{class_id}
  classBelongingDetail:{url:`/api/course/classes/{class_id}`,method:'GET'},
  classBelongingList:{url:`/api/course/classes/{class_id}/students`,method:'GET'},

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

  classList:TFHttpSend
  classCreate:TFHttpSend
  editClass:TFHttpSend
  classUserDelete:TFHttpSend
  // classList:TFHttpSend
  // classList:TFHttpSend


  classBelongingDetail:TFHttpSend
  classBelongingList:TFHttpSend

}
export const MODULE_NAME = 'adminUserManagement'