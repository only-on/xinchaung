import { TFHttpSend } from "src/typings/getRequest";
export default{
  getLatelyCourseList:{url:`/student-course/latest`,method: "GET"},
  getMyCourseList:{url:`/student-course/my`,method: "GET"},
  courseDirection:{url:`api/course/courses/categories`,method: "GET"},
  // courseDirection
}
export interface IStudentCourseAps {
  getLatelyCourseList: TFHttpSend;
  getMyCourseList: TFHttpSend;
  courseDirection: TFHttpSend;
}

export const MODULE_NAME = 'studentCourse'