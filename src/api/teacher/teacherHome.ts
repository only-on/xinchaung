import { TFHttpSend } from "src/typings/getRequest";
export default {
  courseList:{
    url: '/teacher-env/index',
    method: 'GET'
  },
  courseData:{
    url: '/teacher-env/course-data',
    method: 'POST'
  },
  getHelpFinfoApi:{
    url: '/api/operate/teacherResults/questions',
    method: 'GET'
  },
  updateReadStatusApi:{url:"/api/operate/operates/handle",method:"POST",dataType: 'json'}
}
export interface ITeacherHome{
  courseList: TFHttpSend
  courseData: TFHttpSend
  getHelpFinfoApi:TFHttpSend
  updateReadStatusApi:TFHttpSend
}