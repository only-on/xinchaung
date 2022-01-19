import { TFHttpSend } from "src/typings/getRequest";
export default {
  courseList:{
    url: '/teacher-env/index',
    method: 'GET'
  },
  courseData:{
    url: '/teacher-env/course-data',
    method: 'POST'
  }
}
export interface ITeacherHome{
  courseList: TFHttpSend
  courseData: TFHttpSend
}