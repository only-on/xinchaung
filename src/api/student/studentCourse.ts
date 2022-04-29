import { TFHttpSend } from "src/typings/getRequest";

export default {
  getCourseList: {url: `/api/operate/operates/my`, method: "GET",dataType: 'json'},
  courseDetail:{url: `/api/operate/operates/study/{courseId}`, method: "GET"},
  // /api/operate/operates/left-tree/{course_student_id}
  StudentChaptersTree:{url:`/api/operate/operates/left-tree/{course_student_id}`, method: "GET"}
}

export interface IStudentCourse {
     getCourseList: TFHttpSend;
     courseDetail: TFHttpSend;
     StudentChaptersTree:TFHttpSend;
}