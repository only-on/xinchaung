import { TFHttpSend } from "src/typings/getRequest";
export default{
  getLatelyCourseList:{url:`/student-course/latest`,method: "GET"},
  getMyCourseList:{url:`/student-course/my`,method: "GET"},
  courseDirection:{url:`/api/course/courses/categories`,method: "GET"},
  coursesInfo:{url:`/student-course/start-courses`,method: "GET"},
  questionsList:{url:`/classic/exercises-student/course-student-questions-list`,method: "GET"},
  submitQuest:{url:`/classic/exercises-student/submit-quest`,method: "POST",dataType:'json'},
  submitQuesAnswer:{url:`/classic/exercises-student/submit-answer`,method: "POST",dataType:'json'},
  experimentalNotes:{url:`/api/course/contents/detail`,method: "GET"},
  SaveExperContent:{url:`/student-course/setnote`,method: "POST",dataType:'json'},
  exportNote:{url:`/student-course/convert-as-pdf`,method: "GET"},
   // /student-course/setnote
}
export interface IStudentCourseAps {
  getLatelyCourseList: TFHttpSend;
  getMyCourseList: TFHttpSend;
  courseDirection: TFHttpSend;
  coursesInfo: TFHttpSend;
  questionsList: TFHttpSend;
  submitQuest: TFHttpSend;
  submitQuesAnswer: TFHttpSend;
  experimentalNotes: TFHttpSend;
  SaveExperContent: TFHttpSend;
  exportNote: TFHttpSend;
}

export const MODULE_NAME = 'studentCourse'