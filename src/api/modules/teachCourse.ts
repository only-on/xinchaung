import { TFHttpSend } from "src/typings/getRequest";

export default {
  getPre: {
    url: `/base-study/get-pre-topoinst`,
    method: 'POST',
    dataType: 'json'
  },
  vmOpen: {
    url: '/base-study/start',
    method: 'POST',
    dataType: 'json'
  },
  vmClose: {
    url: '/base-study/close',
    method: 'POST',
    dataType: 'json'
  },
  vmRevert: {
    url: '/base-study/revert',
    method: 'POST',
    dataType: 'json'
  },
  vmReset: {
    url: '/base-study/reset',
    method: 'POST',
    dataType: 'json'
  },
  preLimit: {
    url: '/base-study/pre-create-limit',
    method: 'POST',
    dataType: 'json'
  },
  saveTopoinst: {
    url: '/base-study/pre-save-topoinst',
    method: 'POST',
    dataType: 'json'
  },
  getTreeList: {
    url: 'api/course/courses/{courseId}/chapters/tree',
    method: 'GET',
  },
  canAccessVm: {
    url: '/teacher-course/can-access-vm',
    method: 'POST',
    dataType: 'json'
  },
  // 课程评价
  getResultInfo: {
    url: '/classic/exercises-teacher/quest-result-info',
    method: 'GET',
  },
  studentCount: {
    url: '/classic/exercises-teacher/quest-student-count',
    method: 'GET'
  },
  resultCount: {
    url: '/classic/exercises-teacher/quest-result-count',
    method: 'GET'
  },
  resultCreate: {
    url: '/course-export-task/create',
    method: 'POST'
  },
  exportTaskView: {
    url: '/course-export-task/view',
    method: 'GET'
  },
  getSocre: {
    url: '/teacher-course/get-score',
    method: 'POST'
  },
  changeEvaluate: {
    url: '/teacher-course/change-evaluate',
    method: 'POST'
  },
  allClasses: {
    url: '/teacher-course/all-classes',
    method: 'GET'
  },
  evaluteProject: {
    url: '/teacher-course/evalute-project',
    method: 'POST'
  },
  showNotes: {
    url: '/teacher-course/show-notes',
    method: 'POST'
  },
  reportAnnotate: {
    url: '/report/record/teacher-update',
    method: 'POST'
  }
}

export interface ITeacherCourseApis {
  getPre: TFHttpSend,
  vmOpen: TFHttpSend,
  vmClose: TFHttpSend,
  vmRevert: TFHttpSend,
  vmReset: TFHttpSend,
  preLimit: TFHttpSend,
  saveTopoinst: TFHttpSend,
  getTreeList: TFHttpSend,
  canAccessVm: TFHttpSend,
  getResultInfo: TFHttpSend,
  studentCount: TFHttpSend,
  resultCount: TFHttpSend,
  resultCreate: TFHttpSend,
  exportTaskView: TFHttpSend,
  getSocre: TFHttpSend,
  changeEvaluate: TFHttpSend,
  allClasses: TFHttpSend,
  evaluteProject: TFHttpSend,
  showNotes: TFHttpSend,
  reportAnnotate: TFHttpSend
}