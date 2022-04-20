import { TFHttpSend } from "src/typings/getRequest";
export default {
  allstudentlist: { url: '/api/arrange/students', method: "GET" },//待选的学生列表 
  coursestudentlist:{url: '/api/arrange/students/search', method: "GET"},//课程已经选择的学生
  addStudentToCourse:{url: '/api/arrange/students', method: "POST"},//添加学生到课程
  deleteStudentCourse:{url:'/api/arrange/students/delete',method:"POST",dataType: 'json'},//删除课程里学生
  // initializationPassword:{url:'teacher-train/reset-student-pwd',method:''}//初始化密码
  grouplist:{url:'/api/arrange/groups',method:'GET'},
  automaticGroup: { url: '/api/arrange/groups/auto', method: "POST", dataType: 'json' }, // 自动分组
  deleteGroup:{url:'/api/arrange/groups/{group}',method:'DELETE'}, //删除分组
  unGroupstuList:{url:'/api/arrange/groups/search',method:'GET'} ,  //获取未分组学生
  handGroup:{url:'/api/arrange/groups',method:'POST',dataType: 'json'},//手动分组
  groupNumberList:{url:'/api/arrange/groups/{group}',method:'GET'},//分组详情
  editGroup:{url:'/api/arrange/groups/{group}',method:'PUT',dataType: 'json'}, //编辑分组

  // 助教
  assistantList:{url:'/api/yii/assistant/index',method:'POST',dataType: 'json'},
  addAssistanter:{url:'/api/yii/assistant/create',method:'POST',dataType: 'json'},
  deleteAssistant:{url:'/api/yii/assistant/delall',method:'POST',dataType: 'json'}
}

export interface ITeacherTrainAps {
    allstudentlist:TFHttpSend
    coursestudentlist:TFHttpSend
    addStudentToCourse:TFHttpSend
    deleteStudentCourse:TFHttpSend
    // initializationPassword:TFHttpSend
    grouplist:TFHttpSend
    automaticGroup:TFHttpSend
    deleteGroup:TFHttpSend
    unGroupstuList:TFHttpSend
    handGroup:TFHttpSend
    groupNumberList:TFHttpSend
    editGroup:TFHttpSend
    assistantList:TFHttpSend
    addAssistanter:TFHttpSend
    deleteAssistant:TFHttpSend
}

export const MODULE_NAME = 'teacherMemberManage'