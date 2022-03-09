import { TFHttpSend } from "src/typings/getRequest";

export default {
  courseDetail: {url:``,method:'GET'},
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
  // saveTopoinst: {
  //   url: '/base-study/pre-save-topoinst',
  //   method: 'POST',
  //   dataType: 'json'
  // },
  saveTopoinst: {
    url: '/api/operate/preCreates/create',
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
    url: '/knowledge-map1/get-knowledge-map-list',
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
    method: 'GET'
  },
  showVideos: {
    url: '/teacher-course/get-videos',
    method: 'POST'
  },
  getDirectionsApi: {
    url: "/api/course/courses/directions",
    method: "GET"
  },
  getCategoryApi: {
    url: "/api/course/courses/categories",
    method: "GET"
  },
  getCourseListApi: {
    url: `/api/course/courses`,
    method: 'GET',
  },
  settingGuideStateApi: {
    url: "/teacher-course/change-status",
    method: "POST"
  },
  copyCourseApi: {
    url: "/api/course/courses/{course_id}/replicate",
    method: "PUT"
  },
  deleteCourseApi: {
    url: "/api/course/courses/{id}",
    method: "DELETE"
  },
  getTestPaperListApi: {
    url: "/api/v1/question/papers",
    method: "GET"
  },
  getStudentListApi: {
    url: "/classtest/default/get_student_list",
    method: "GET"
  },
  updateStudentSelectApi: {
    url: "/classtest/default/edit_student",
    method: "POST",
    dataType: "json"
  },
  deleteFollowApi: {
    url: "/api/v1/question/papers/{paper_id}",
    method: "DELETE",
  },
  getDefaultPaperInfoApi: {
    url: "/api/v1/question/tests/{test_id}/score-analysis",
    method: "GET"
  },
  getAchievStatisApi: {
    url: `/api/v1/question/tests/{test_id}/scores`,
    method: "GET"
  },
  getTestPaperAccuracyApi:{
    url:"/api/v1/question/tests/{test_id}/correct-rate",
    method: "GET"
  },
  editQuestionApi: {
    url: "/api/v1/question/record/{record_id}",
    method: "PUT",
    dataType: 'json'
  },
  saveToCourseApi: {
    url: "/teacher-course/save-to-course",
    method: "POST",
  },
  getCourseDetailApi: {
    url: "/api/course/courses/{course_id}",
    method: "GET"
  },
  updateCourseBaseApi: {
    url: "/api/course/courses/{course_id}",
    method: "PUT",
    dataType: "json"
  },
  getCourseTreeApi: {
    url: "/api/course/courses/{course_id}/chapters/tree",
    method: "GET"
  },
  updateChapterApi: {
    url: "/api/course/courses/{course_id}/chapters/{chapter_id}",
    method: "PUT"
  },
  getChapterDetailApi: {
    url: "/api/course/courses/{course_id}/chapters/{chapter_id}",
    method: "GET"
  },
  saveChapterIntroApi: {
    url: "/api/course/courses/{course_id}/chapters/{chapter_id}",
    method: "PUT",
    dataType: "json"
  },
  getPreparingDataApi1: {
    url: "/classic/course-dataset/preparation-materials",
    method: "POST",
    dataType: "json"
  },
  getPreparingDataApi: {
    url: "/api/operate/preCreates/list",
    method: "GET",
    dataType: "json"
  },
  getDataSetListApi: {
    url: "/classic/data/dataset-select",
    method: "GET"
  },
  getDataSetFileApi: {
    url: "/classic/data/item-list",
    method: "GET"
  },
  savePrepareLessonsFileApi: {
    url: "/classic/course-dataset/save-item",
    method: "POST",
    dataType: "json"
  },
  removePrepareLessonsFileApi: {
    url: "/classic/course-dataset/remove",
    method: "POST",
    dataType: "json"
  },
  uploadFileApi: {
    url: "/dataset/data/upload-file",
    method: "POST",
    dataType: "formdata"
  },
  addDataSetFileApi: {
    url: "/classic/data/add-items",
    method: 'POST',
    dataType: 'formdata'
  },
  getDataSetGuideApi: {
    url: "/classic/course-dataset/guide",
    method: "POST",
    dataType: "json"
  },
  getChapterExerciseApi: {
    url: "/api/v1/question/chapters/{chapter_id}/questions",
    method: "GET"
  },
  getExercisesMapApi: {
    url: "/api/v1/question/pools",
    method: "GET"
  },
  getQuestionTypesApi: {
    url: "/api/v1/question/types",
    method: "GET"
  },
  getPoolsExerciseListApi: {
    url: "/api/v1/question/pools/{pool_id}/questions",
    method: "GET",
    dataType: "json"
  },
  createCourseChapterApi: {
    url: "/api/course/courses/{course_id}/chapters",
    method: "POST",
    dataType: "json"
  },
  chapterAddExerciseApi: {
    url: "/api/v1/question/chapters/{chapter_id}/relationships/questions",
    method: "POST",
    dataType: "json"
  },
  deleteChapterExerciseApi: {
    url: "/api/v1/question/chapters/relationships/questions",
    method: "DELETE",
    dataType: "json"
  },
  getChapterExerciseAnalysisApi: {
    url: "/api/v1/question/chapters/{chapter_id}/question-analysis",
    method: "GET"
  },
  getAllChapterListApi: {
    url: "/api/course/courses/{course_id}/chapters",
    method: "GET"
  },
  saveChapterToCourseApi: {
    url: "/api/course/chapter/course",
    method: "POST",
    dataType: "json"
  },
  saveContentToChapterApi: {
    url: "/api/course/courses/{course_id}/chapters/{chapter_id}/content",
    method: "POST",
    dataType: "json"
  },
  deleteChapterApi: {
    url: "/api/course/courses/{course_id}/chapters/{chapter_id}",
    method: "DELETE",
  },
  getContentListApi: {
    url: "/api/course/contents/list",
    method: "GET"
  },
  getTrainListApi: {
    url: "/api/course/trains/list",
    method: "GET"
  },
  getVideosListApi: {
    url: "/api/course/videos/list",
    method: "GET"
  },
  getDocumentsListApi: {
    url: "/api/course/documents/list",
    method: "GET"
  },
  getDataSetCatalogApi: {
    url: "/classic/data/dataset-select",
    method: "GET"
  },
  getContentDetailApi: {
    url: "/api/course/contents/detail",
    method: "GET"
  },
  isDisparkApi: {
    url: "/api/course/courses/{course_id}/chapters/{experiment_id}",
    method: "PUT",
    dataType: "json"
  },
  getExperimentReportApi: {
    url: "/report/templatable/view",
    method: "POST",
    dataType: "formdata"
  },
  getContentExerciseApi: {
    url: "/api/v1/question/contents/{content_id}/questions",
    method: "GET"
  },
  getContentExerciseAnalysisApi: {
    url: "/api/v1/question/contents/{content_id}/question-analysis",
    method: "GET"
  },
  contentAddExerciseApi: {
    url: "/api/v1/question/contents/{content_id}/relationships/questions",
    method: "POST",
    dataType: "json"
  },
  deleteContentExerciseApi: {
    url: "/api/v1/question/contents/relationships/questions",
    method: "DELETE",
    dataType: "json"
  },
  getReportListApi: {
    url: "/report/templatable/index",
    method: "GET"
  },
  saveReportTemplateApi: {
    url: "/report/templatable/save",
    method: "POST",
    dataType: "json"
  },
  createCourseBaseApi: {
    url: "/api/course/courses",
    method: "POST",
    dataType: "formdata"
  },
  deleteQuestionPaperApi: {
    url: "/api/v1/question/{entity_type}/{entity_id}/relationships/questions",
    method: "PUT",
    dataType: "json"
  },
  getPaperDetailApi: {
    url: "/api/v1/question/papers/{paper_id}",
    method: "GET"
  },
  updatePaperBaseApi: {
    url: "/api/v1/question/papers/{paper_id}",
    method: "PUT",
  },
  // 排课
  getLeftTime: {
    url: "/timetable/timetable-set/time-table",
    method: "GET"
  },
  getTimeTable: {
    url: "/timetable/timetable/index",
    method: "GET"
  }, 
  getStudentList: {
    url: "/timetable/timetable/students",
    method: "POST",
    dataType: "json"
  },
  getClassestList: {
    url: "/timetable/timetable/classes",
    method: "POST",
    dataType: "json"
  },
  classStuIntersect: {
    url: "/timetable/timetable/class-stu-intersect",
    method: "POST",
    dataType: "json"
  },
  createSchedule: {
    url: "/timetable/timetable/create",
    method: "POST",
    dataType: "json"
  },
  scheduleDetail: {
    url: "/timetable/timetable/view",
    method: "GET",
    dataType: "json"
  },
  scheduleUpdate: {
    url: "/timetable/timetable/update",
    method: "POST",
    dataType: "json"
  },
  scheduleDelete: {
    url: "/timetable/timetable/delete",
    method: "POST",
    dataType: "json"
  },
  setTimeTable: {
    url: "/timetable/timetable-set/set",
    method: "POST",
    dataType: 'json'
  },
  updateTimeTable: {
    url: "/timetable/timetable-set/update",
    method: "POST",
    dataType: 'json'
  },
  deleteTimeTable: {
    url: "/timetable/timetable-set/delete/",
    method: "POST",
    dataType: 'json'
  },
  envMonitoringList: {
    url: "/timetable/online-resource/index",
    method: "POST",
    dataType: 'json'
  },
  forbiddenUser: {
    url: "/timetable/online-resource/disable",
    method: "POST",
    dataType: 'json'
  },
  setArchiveCourseApi: {
    url: "/teacher-course/mycourse-archive",
    method: "POST",
    dataType: 'json'
  },
  chapterSortApi:{
    url: `/api/course/courses/{course_id}/chapters/tree`,
    method: "PUT",
    dataType: 'json'
  },
  experimentSortApi:{
    url: `/api/course/courses/{course_id}/contents/tree`,
    method: "PUT",
    dataType: 'json'
  },
  // 热门课程推荐
  hotCourseRecommend:{ url: `/api/course/courses/hot/recommend`, method: "GET",},
}

export interface ITeacherCourseApis {
  courseDetail: TFHttpSend,
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
  getDirectionsApi: TFHttpSend
  getCategoryApi: TFHttpSend,
  getCourseListApi: TFHttpSend,
  settingGuideStateApi: TFHttpSend,
  copyCourseApi: TFHttpSend,
  deleteCourseApi: TFHttpSend
  getTestPaperListApi: TFHttpSend
  getStudentListApi: TFHttpSend
  updateStudentSelectApi: TFHttpSend
  deleteFollowApi: TFHttpSend
  getDefaultPaperInfoApi: TFHttpSend
  getAchievStatisApi: TFHttpSend
  editQuestionApi: TFHttpSend
  saveToCourseApi: TFHttpSend
  getCourseDetailApi: TFHttpSend
  updateCourseBaseApi: TFHttpSend
  getCourseTreeApi: TFHttpSend
  updateChapterApi: TFHttpSend
  getChapterDetailApi: TFHttpSend
  saveChapterIntroApi: TFHttpSend
  getPreparingDataApi: TFHttpSend
  getPreparingDataApi1:TFHttpSend
  getDataSetListApi: TFHttpSend
  getDataSetFileApi: TFHttpSend
  savePrepareLessonsFileApi: TFHttpSend
  removePrepareLessonsFileApi: TFHttpSend
  uploadFileApi: TFHttpSend
  addDataSetFileApi: TFHttpSend
  getDataSetGuideApi: TFHttpSend
  getChapterExerciseApi: TFHttpSend
  getExercisesMapApi: TFHttpSend
  getQuestionTypesApi: TFHttpSend
  getPoolsExerciseListApi: TFHttpSend
  createCourseChapterApi: TFHttpSend
  chapterAddExerciseApi: TFHttpSend
  deleteChapterExerciseApi: TFHttpSend
  getAllChapterListApi: TFHttpSend
  saveChapterToCourseApi: TFHttpSend
  saveContentToChapterApi: TFHttpSend
  deleteChapterApi: TFHttpSend
  getContentListApi: TFHttpSend
  getTrainListApi: TFHttpSend
  getVideosListApi: TFHttpSend
  getDocumentsListApi: TFHttpSend
  getDataSetCatalogApi: TFHttpSend
  getContentDetailApi: TFHttpSend
  isDisparkApi: TFHttpSend
  getExperimentReportApi: TFHttpSend
  getContentExerciseApi: TFHttpSend
  getContentExerciseAnalysisApi: TFHttpSend
  contentAddExerciseApi: TFHttpSend
  deleteContentExerciseApi: TFHttpSend
  getChapterExerciseAnalysisApi: TFHttpSend
  getReportListApi: TFHttpSend
  saveReportTemplateApi: TFHttpSend
  createCourseBaseApi: TFHttpSend
  deleteQuestionPaperApi: TFHttpSend
  getPaperDetailApi: TFHttpSend
  updatePaperBaseApi: TFHttpSend
  getLeftTime: TFHttpSend
  getTimeTable: TFHttpSend
  getClassestList: TFHttpSend
  getStudentList: TFHttpSend
  classStuIntersect: TFHttpSend
  createSchedule: TFHttpSend
  scheduleDetail: TFHttpSend
  scheduleUpdate: TFHttpSend
  scheduleDelete: TFHttpSend
  envMonitoringList: TFHttpSend
  forbiddenUser: TFHttpSend
  setArchiveCourseApi:TFHttpSend
  getTestPaperAccuracyApi:TFHttpSend
  chapterSortApi:TFHttpSend
  experimentSortApi:TFHttpSend
  hotCourseRecommend: TFHttpSend
}