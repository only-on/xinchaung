import { TFHttpSend } from "src/typings/getRequest";

export default {
  // 课程列表
  
  getCourseListt:{ url: `/api/course/courses`, method: "GET"},
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
  resetPassWord: { url: '/teacher-train/reset-student-pwd', method: "POST" },
  //新建课程批量删除课程下学生
  deleteScheduleStuMany: { url: '/api/arrange/students/delete', method: "POST" },

  // 课程封面上传
  courseCoverUpload:{ url: `/api/course/courses/upload`, method: "POST",dataType: "formdata"},

  // 课程详情
  courseDetail:{ url: `/api/course/courses/{courseId}`, method: "GET",dataType: "json"},

  // 删除课程
  deleteCourseItem: { url: '/api/course/courses/{courseId}', method: "DELETE" },
  // 课程复用
  // multiplexing: { url: '/api/course/courses/{course_id}/replicate', method: "PUT" }, // 现在的复用是编辑
  
  // 知识点
  getKnowledgeList: {
    url:'/api/xinchuang/content/knowledges/index',
    method: 'GET',
  },

  // 热门课程推荐
  hotCourseRecommend:{ url: `/api/course/courses/hot/recommend`, method: "GET",},

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
}