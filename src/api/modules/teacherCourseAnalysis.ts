import { TFHttpSend } from "src/typings/getRequest";

export default {
  getContentList: {
    url: `/teacher-course/content-list`,
    method: 'POST',
    dataType: 'json'
  },
  getContentScore: {
    url: `/teacher-course/content-score`,
    method: 'POST',
    dataType: 'json'
  },
  getCourseDetail: {
    url: `/api/course/courses/{courseId}`,
  },
  getReportTemplate: {
    url: '/report/templatable/index'
  },
  saveReportTemplate: {
    url: '/report/templatable/save',
    method: 'POST',
    dataType: 'json'
  },
  getCourseDirections: {
    url: `/api/course/courses/directions`,
  },
  getCourseCategories: {
    url: `/api/course/courses/categories`,
  },
  uploadImg: {
    url: `/api/course/courses/upload`,
    method: 'POST',
    dataType: 'formdata'
  },
  editCourse: {
    url: `/api/course/courses/{courseId}`,
    method: 'PUT',
    dataType: 'json'
  },
  
}

export interface ITeacherCourseAnalysisApis {
  getContentList: TFHttpSend,
  getContentScore: TFHttpSend,
  getCourseDetail: TFHttpSend,
  getReportTemplate: TFHttpSend,
  saveReportTemplate: TFHttpSend,
  getCourseDirections: TFHttpSend,
  getCourseCategories: TFHttpSend,
  uploadImg: TFHttpSend,
  editCourse: TFHttpSend,
}