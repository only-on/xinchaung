import { TFHttpSend } from "src/typings/getRequest";

export default {
  // 课程列表
  
  getCourseList:{ url: `/api/course/courses`, method: "GET"},
  // 创建课程相关
  createCourseBaseApi: {  url: "/api/course/courses", method: "POST", dataType: "json"},
  // 获取课程方向  职业方向
  courseCategory:{ url: `/api/category/课程方向/tags`, method: "GET"},
  vocationDirection:{ url: `/api/category/职业方向/tags`, method: "GET"},

  //课程章节列表
  getChaptersTree:{ url: `/api/course/courses/{courseId}/chapters/tree`, method: "GET"},

  //创建章节
  createChapter:{ url: `/api/course/courses/{courseId}/chapters`, method: "POST",dataType: "json"},
  // 编辑章节名称  
  EditCreateChapterName:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}`, method: "put",dataType: "json"},
  //                            api/course/courses/500073/chapters/500136
  // 删除章节  
  DeleteCourseChapter:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}`, method: "DELETE",dataType: "json"},

  // 保存/更新实验到章节  
  addCoursesChapter:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}/content`, method: "POST",dataType: "json"},
  // 获取章节的实验指导  使用的实验详情接口
  getExperimentGuide:{ url: `/api/xinchuang/content/content/{experimentId}`, method: "GET" },
  // 保存教辅资料到章节
  addCoursesChapterAids:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}/dataset`, method: "POST",dataType: "json"},
  // 删除章节下实验   
  // DeleteCourseChapterContent:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}`, method: "DELETE",dataType: "json"},
  // 删除章节下教辅
  DeleteChapterAids:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}/dataset/{itemId}`, method: "DELETE",dataType: "json"},


  //  创建课程选择的学生列表  
  getCourseStudent:{ url: `/api/arrange/students/search`, method: "GET",dataType: "json"},
  // 获取全部学生列表  
  getAllCourseStudent:{ url: `/api/arrange/students`, method: "GET",dataType: "json"},
  // 保存学生到课程
  saveCourseStudentt:{ url: `/api/arrange/students`, method: "POST",dataType: "json"},
  // 新建课程  已选择学生移除
  deleteScheduleStu: { url: '/api/arrange/students/{id}', method: "DELETE" },
  // 新建课程 已选择学生初始化密码
  resetPassWord: { url: 'api/course/courses/reset-student-password/{studentId}', method: "put" },
  //新建课程批量删除课程下学生
  deleteScheduleStuMany: { url: '/api/arrange/students/delete', method: "POST" },

  // 课程封面上传
  courseCoverUpload:{ url: `/api/course/courses/upload`, method: "POST",dataType: "formdata"},

  // 课程详情
  courseDetail:{ url: `/api/course/courses/{courseId}`, method: "GET",dataType: "json"},
  // 课程相关实验推荐
  courseExperimentRecommend:{ url: `/api/course/courses/{courseId}/contents/recommend`, method: "GET"},
  // 当前课程知识点
  courseknowledge:{ url: `/api/course/courses/{courseId}/knowledge-points`, method: "GET"},
  // 学习进度排行榜
  courseRankList:{ url: `/api/course/courses/{courseId}/study/leaderboard`, method: "GET"},
  
  // 课程复用  
  multiplexing:{ url: `/api/course/courses/{courseId}/replicate`, method: "put"},
  

  // 删除课程
  deleteCourseItem: { url: '/api/course/courses/{courseId}', method: "DELETE" },
  // 课程复用
  // multiplexing: { url: '/api/course/courses/{course_id}/replicate', method: "PUT" }, // 现在的复用是编辑
  //  更新课程基本信息
  UploadCourse:{ url: `/api/course/courses/{courseId}`, method: "put",dataType: "json"},
  // 课程设置  
  CourseSteup:{ url: `/api/course/courses/{courseId}/setting`, method: "put",dataType: "json"},
  // 获取课程设置
  getCourseSetup:{ url: `/api/course/courses/{courseId}/setting`, method: "GET",dataType: "json"},
  
  // 知识点
  getKnowledgeList: {
    url:'/api/xinchuang/content/knowledges/index',
    method: 'GET',
  },

  // 热门课程推荐
  hotCourseRecommend:{ url: `/api/course/courses/hot/recommend`, method: "GET",},

  // 教师评价-成绩列表
  getTeacherEvaluatesApi: {
    url:'/api/operate/teacherEvaluates',
    method: 'GET',
  },

  // 评阅权重展示
  getWeightApi:{url:"/api/operate/teacherEvaluates/proportion/{taskId}",method:"GET"},
  // 权重保存
  saveWeightApi:{url:"/api/operate/teacherEvaluates/setting/{taskId}",method:"POST",dataType: "json"},
  // 权重应用到课程
  applyWeightApi:{url:"/api/operate/teacherEvaluates/resuse/{taskId}",method:"POST",dataType: "json"},
  // 一键评分
  autoReviewApi:{url:"/api/operate/teacherEvaluates/review/{taskId}",method:"POST"},
  // 获取学习记录打分
  getScoreApi:{url:"/api/operate/teacherEvaluates/score/{id}",method:"GET"},
  // 手动打分
  setScoreApi:{url:"/api/operate/teacherEvaluates/{id}",method:"PUT",dataType:"json"},
  // 获取课程实验报告、录屏
  getCourseExperimentReportVideoApi:{url:"/api/operate/teacherEvaluates/show",method:"GET"},
  // 成绩导出
  exportScoreApi:{url:"/api/operate/teacherExports/export",method:"GET"},
  // 报告评分
  setReportScoreApi:{url:"/api/yii/report/record/teacher-update",method:"POST",dataType:"formdata"},

  // 课程 环境管理
  getCourseEnvirment: {url: `/api/operate/preCreates/list`, method:"GET" },
  getOpenEnvirmentLimit: {url: `/api/operate/preCreates/list`, method:"GET" },
  openEnvirment: {url: `/api/operate/preCreates/create`, method:"POST", dataType:"json" },
  canAccessVm: {url: '/api/operate/envirments/can-access-vm', method: 'POST', dataType: 'json'},
  maxLimit: {url: `/api/operate/preCreates/max-limit`, method:"GET" },

  // 课程树
  coursesChaptersTree: { url: `  /api/course/courses/chapters/tree`, method: "GET" },
}

export interface ITeacherCourseApis {
  createCourseBaseApi:TFHttpSend
  courseCategory:TFHttpSend
  vocationDirection:TFHttpSend
  getChaptersTree:TFHttpSend
  createChapter:TFHttpSend
  addCoursesChapter:TFHttpSend
  courseCoverUpload:TFHttpSend
  EditCreateChapterName:TFHttpSend
  DeleteCreateChapterName:TFHttpSend
  getCourseStudent:TFHttpSend
  getAllCourseStudent:TFHttpSend
  saveCourseStudentt:TFHttpSend
  getKnowledgeList:TFHttpSend

  hotCourseRecommend:TFHttpSend
  getTeacherEvaluatesApi:TFHttpSend
  UploadCourse:TFHttpSend
  getWeightApi:TFHttpSend
  saveWeightApi:TFHttpSend
  applyWeightApi:TFHttpSend
  autoReviewApi:TFHttpSend
  getScoreApi:TFHttpSend
  getCourseExperimentReportVideoApi:TFHttpSend
  setScoreApi:TFHttpSend
  exportScoreApi:TFHttpSend
  setReportScoreApi:TFHttpSend

  getCourseEnvirmentList: TFHttpSend
  getOpenEnvirmentLimit: TFHttpSend
  openEnvirment: TFHttpSend
  canAccessVm: TFHttpSend
  maxLimit: TFHttpSend
  coursesChaptersTree: TFHttpSend
}