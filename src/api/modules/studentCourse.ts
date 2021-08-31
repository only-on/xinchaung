import { TFHttpSend } from "src/typings/getRequest";
export default{
  getLatelyCourseList:{url:`/student-course/latest`,method: "GET"},
  getMyCourseList:{url:`/student-course/my`,method: "GET"},
  courseDirection:{url:`/api/course/courses/categories`,method: "GET"},
  coursesInfo:{url:`/student-course/start-courses`,method: "GET"},
  questionsList:{url:`classic/exercises-student/course-student-questions-list`,method: "GET"},
  // classic/exercises-student/course-student-questions-list
  // courseDirection
}
export interface IStudentCourseAps {
  getLatelyCourseList: TFHttpSend;
  getMyCourseList: TFHttpSend;
  courseDirection: TFHttpSend;
  coursesInfo: TFHttpSend;
  questionsList: TFHttpSend;
}

export const MODULE_NAME = 'studentCourse'