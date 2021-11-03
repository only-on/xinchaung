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
    url: '/api/course/courses/{courseId}/chapters/tree',
    method: 'GET',
  },
  canAccessVm: {
    url: '/teacher-course/can-access-vm',
    method: 'POST',
    dataType: 'json'
  },
  // 创建测试卷
  getCatalogueList: {
    url: '/api/v1/question/pools',
    method: 'GET'
  },
  addCatalogue: {
    url: '/api/v1/question/pools',
    method: 'POST'
  },
  getLevelList: {
    url: '/api/v1/question/levels'
  },
  getPaperTypeList: {
    url: '/api/v1/question/types'
  },
  getQuestionList: {
    url: '/api/v1/question/pools/{poolId}/questions',
    method: 'GET',
    dataType: 'json'
  },
  createQuestion: {
    url: '/api/v1/question/pools/{poolId}/questions',
    method: 'POST',
    dataType: 'json'
  },
  getKnowledgeList: {
    url: '/knowledge-map/get-knowledge-map-list',
    method: 'GET',
    dataType: 'json'
  },
  createPaper: {
    url: '/api/v1/question/papers',
    method: 'POST',
    dataType: 'json'
  },
  relationQuest: {
    url: '/api/v1/question/{entity_type}/{entity_id}/relationships/questions',
    method: 'POST',
    dataType: 'json'
  },
  getPaperList: {
    url: '/api/v1/question/papers'
  },
  
  // 课程评价
  getResultInfo: {
    url: '/api/v1/question/chapter/{chapter_id}/scored-analysis',
    method: 'GET',
  },
  studentCount: {
    url: '/api/v1/question/chapter/{chapter_id}/student-scores',
    method: 'GET'
  },
  resultCount: {
    url: '/api/v1/question/chapter/{chapter_id}/question-correct-rate',
    method: 'GET'
  },
  resultCreate: {
    url: '/course-export-task/create',
    method: 'POST',
    dataType: 'json'
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
  evaluteContent: {
    url: '/teacher-course/evalute-content',
    method: 'POST'
  },
  showNotes: {
    url: '/teacher-course/get-note-detail',
    method: 'GET'
  },
  reportAnnotate: {
    url: '/report/record/teacher-update',
    method: 'POST'
  },
  reportView: {
    url: '/report/record/view',
    method: 'GET'
  },
  showQuestions: {
    url: '/api/v1/question/contents/{content_id}/students/{student_id}/questions',
    method: 'POST'
  },
  showVideos: {
    url: '/teacher-course/get-videos',
    method: 'POST'
  },
  getDirectionsApi:{
    url:"/api/course/courses/directions",
    method:"GET"
  },
  getCategoryApi:{
    url:"/api/course/courses/categories",
    method:"GET"
  },
  getCourseListApi: {
    url: `/api/course/courses`,
    method: 'GET',
  },
  settingGuideStateApi:{
    url:"/teacher-course/change-status",
    method:"POST"
  },
  copyCourseApi:{
    url:"/teacher-course/repeat",
    method:"POST"
  },
  deleteCourseApi:{
    url:"/api/course/courses/{id}",
    method:"DELETE"
  },
  getTestPaperListApi:{
    url:"/classtest/default/paper_list",
    method:"GET"
  },
  getStudentListApi:{
    url:"/classtest/default/get_student_list",
    method:"GET"
  },
  updateStudentSelectApi:{
    url:"/classtest/default/edit_student",
    method:"POST",
    dataType:"formdata"
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
  reportAnnotate: TFHttpSend,
  reportView: TFHttpSend
  getCatalogueList: TFHttpSend,
  addCatalogue: TFHttpSend
  getLevelList: TFHttpSend
  getPaperTypeList: TFHttpSend
  getQuestionList: TFHttpSend
  createQuestion: TFHttpSend
  getKnowledgeList: TFHttpSend
  createPaper: TFHttpSend
  relationQuest: TFHttpSend
  getPaperList: TFHttpSend
  evaluteContent: TFHttpSend,
  showQuestions: TFHttpSend,
  showVideos: TFHttpSend
  getDirectionsApi:TFHttpSend
  getCategoryApi:TFHttpSend,
  getCourseListApi:TFHttpSend,
  settingGuideStateApi:TFHttpSend,
  copyCourseApi:TFHttpSend,
  deleteCourseApi:TFHttpSend
  getTestPaperListApi:TFHttpSend
  getStudentListApi:TFHttpSend
  updateStudentSelectApi:TFHttpSend
}