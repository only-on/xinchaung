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
  // 删除章节  /api/course/courses/{courseId}/chapters/{chapterId}
  DeleteCreateChapterName:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}`, method: "put",dataType: "json"},

  // 保存/更新实验|实训|视频|文档到章节  
  // "content_ids":[500006,500009,500016,500098,500150,500151,500152,500192,500195,500202,500230],
  //   "type":1 // 1-为实验, 2-实训, 3-视频, 4-文档]
  addCoursesChapter:{ url: `/api/course/courses/{courseId}/chapters/{chapterId}/content`, method: "POST",dataType: "json"},

  // 课程封面上传
  courseCoverUpload:{ url: `/api/course/courses/upload`, method: "POST",dataType: "formdata"},
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
}