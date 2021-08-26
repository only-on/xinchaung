import { TFHttpSend } from "src/typings/getRequest";
export default{
  getLatelyCourseList:{url:`/student-course/latest`,method: "GET",}
}
export interface IStudentCourseAps {
  getLatelyCourseList: TFHttpSend;
  
}

export const MODULE_NAME = 'studentCourse'