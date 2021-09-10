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
  }
}

export interface ITeacherCourseAnalysisApis {
  getContentList: TFHttpSend,
  getContentScore: TFHttpSend,
  getCourseDetail: TFHttpSend,
  getReportTemplate: TFHttpSend,
  saveReportTemplate: TFHttpSend,
}