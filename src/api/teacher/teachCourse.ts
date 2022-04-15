import { TFHttpSend } from "src/typings/getRequest";

export default {
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
  // 删除章节  
  DeleteCourseChapter:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}`, method: "DELETE",dataType: "json"},

  // 保存/更新实验到章节  
  addCoursesChapter:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}/content`, method: "POST",dataType: "json"},

  //  创建课程选择的学生列表  
  getCourseStudent:{ url: `/api/arrange/students/search`, method: "GET",dataType: "json"},
  // 获取全部学生列表  
  getAllCourseStudent:{ url: `/api/arrange/students`, method: "GET",dataType: "json"},
  // 保存学生到课程
  saveCourseStudentt:{ url: `/api/arrange/students`, method: "POST",dataType: "json"},

  deleteScheduleStu: { url: '/api/arrange/students/{id}', method: "DELETE" },//删除学生排课
  resetPassWord: { url: '/teacher-train/reset-student-pwd', method: "POST" },//初始化密码
  deleteScheduleStuMany: { url: '/api/arrange/students/delete', method: "POST" },//批量删除学生排课

  // 课程封面上传
  courseCoverUpload:{ url: `/api/course/courses/upload`, method: "POST",dataType: "formdata"},


  // 知识点
  getKnowledgeList: {
    url:'/api/xinchuang/content/knowledges/index',
    method: 'GET',
  }
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
}