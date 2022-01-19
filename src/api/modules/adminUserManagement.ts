import { TFHttpSend } from "src/typings/getRequest";
export default{
   //  教师
  teacherList:{url:`/teacher/index`,method:'POST',dataType: 'json'},
  teacherUserDelete:{url:`/teacher/delete?id={id}`,method:'POST'},
  teacherUserBatchDelete:{url:`/teacher/delall`,method:'POST',dataType:'json'},
  createTeacher:{url:`/teacher/create`,method:'POST',dataType: 'json'},
  editTeacher:{url:`/teacher/update?id={id}`,method:'POST',dataType: 'json'},
  viewTeacher:{url:`/teacher/view?id={id}`,method:'POST',dataType: 'json'},
  //  学生
  studentList:{url:`/student/index`,method:'POST',dataType: 'json'},
  studentUserDelete:{url:`/student/delete?id={id}`,method:'POST'},
  studentUserBatchDelete:{url:`/student/delall`,method:'POST',dataType:'json'},
  studentCreate:{url:`/student/create`,method:'POST',dataType: 'json'},
  editStudent:{url:`/student/update?id={id}`,method:'POST',dataType: 'json'},
  viewStudent:{url:`/student/view?id={id}`,method:'POST',dataType: 'json'},
  BatchImport:{url:`/student/importtpl`,method:'POST',dataType: 'formdata'},
  // 班级
  classList:{url:`/api/course/classes`,method:'GET'},
  classUserDelete:{url:`api/course/classes/{class_id}`,method:'DELETE'},
  classUserBatchDelete:{url:`/api/course/classes/multiple-delete`,method:'DELETE',dataType:'json'},
  classCreate:{url:`/api/course/classes`,method:'POST',dataType: 'json'},
  editClass:{url:`/api/course/classes/{class_id}`,method:'PUT',dataType: 'json'},
  //  班级编辑
  classBelongingDetail:{url:`/api/course/classes/{class_id}`,method:'GET'},
  classBelongingList:{url:`/api/course/classes/{class_id}/students`,method:'GET'},
  deleteClassStudent:{url:`/api/course/classes/{class_id}/students`,method:'DELETE',dataType:'json'},
  classStudentList:{url:`/api/course/students`,method:'GET'},


  //  助教
  
  assistantList:{url:`/assistant/index`,method:'POST',dataType: 'json'},
  changeStatus: { url: `/assistant/teacher-bind`, method: "POST", dataType: 'json' },
  addAssistant: { url: `/assistant/create`, method: "POST", dataType: 'json' },
  updateAssistant: { url: `/assistant/update?id={id}`, method: "POST", dataType: 'json' },
  getAssistantDetail: { url: `/assistant/view?id={id}`, method: 'GET', dataType: 'json' },
  AssistantDelete:{url:`/assistant/delete?id={id}`,method:'POST'},
  AssistantBatchDelete: { url: `/assistant/delall`,method:'POST',dataType:'json' },
  AssistantBatchDisable: { url: `/assistant/disabled`,method:'POST',dataType:'json' },
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
  classUserBatchDelete:TFHttpSend
  // classList:TFHttpSend


  classBelongingDetail:TFHttpSend
  classBelongingList:TFHttpSend
  deleteClassStudent:TFHttpSend
  classStudentList:TFHttpSend



  assistantList:TFHttpSend
  changeStatus:TFHttpSend
  addAssistant:TFHttpSend
  updateAssistant:TFHttpSend
  getAssistantDetail:TFHttpSend
  AssistantBatchDelete:TFHttpSend
  AssistantDelete:TFHttpSend
  AssistantBatchDisable:TFHttpSend

}
export const MODULE_NAME = 'adminUserManagement'