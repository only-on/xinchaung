import { TFHttpSend } from "src/typings/getRequest";

export default {
  getCourseList: {url: `/api/operate/operates/my`, method: "GET",dataType: 'json'},
  courseDetail:{url: `/api/operate/operates/study/{courseId}`, method: "GET"},
}

export interface IStudentCourse {
     getCourseList: TFHttpSend;
     courseDetail: TFHttpSend;

}