import { TFHttpSend } from "src/typings/getRequest";
export default {
  allstudentlist: { url: '/api/arrange/students', method: "GET" },//待选的学生列表 
  coursestudentlist:{url: '/api/arrange/students/search', method: "GET"},//课程已经选择的学生
  addStudentToCourse:{url: '/api/arrange/students', method: "POST"},//添加学生到课程
  deleteStudentCourse:{url:'/api/arrange/students/delete',method:"POST",dataType: 'json'},//删除课程里学生
  // initializationPassword:{url:'teacher-train/reset-student-pwd',method:''}//初始化密码
}

export interface ITeacherTrainAps {
    allstudentlist:TFHttpSend
    coursestudentlist:TFHttpSend
    addStudentToCourse:TFHttpSend
    deleteStudentCourse:TFHttpSend
    // initializationPassword:TFHttpSend
}

export const MODULE_NAME = 'teacherMemberManage'