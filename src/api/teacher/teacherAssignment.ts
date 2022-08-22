import { TFHttpSend } from "src/typings/getRequest";
const type = 1
export default {
  addAssignment: {url: `/api/v1/question/exams?type=${type}`, method: "POST",dataType: 'json'}, // 添加考试
  assignmentList: {url: `/api/v1/question/exams`, method: "GET"}, // 列表
  publishAssignment: {url: `/api/v1/question/exams/{ID}/publish?type=${type}`, method: "PUT"}, // 发布
  unpublishAssignment: {url: `/api/v1/question/exams/{ID}/unpublished?type=${type}`, method: "PUT"}, // 撤销发布
  delAssignment: {url: `/api/v1/question/exams/{ID}?type=${type}`, method: "DELETE"}, // 删除
  questionsMaxLimit: {url: ` /api/v1/question/exams/questions/max-limit`, method: "GET"}, // 随机创建-各类型题可选题目数
  assignmentDetail: {url: `/api/v1/question/exams/{ID}?type=${type}`, method: "GET"}, // 详情
  editAssignment: {url: `/api/v1/question/exams/{ID}?type=${type}`, method: "PUT",dataType: 'json'}, // 编辑
  exportPaper: {url: `/api/v1/question/exams/{ID}/export-paper?type=${type}`, method: "GET"}, // 导出
  studentsScores: {url: `/api/v1/question/exams/{exam}/students/scores`, method: "GET"}, // 成绩列表
  simSearch: {url: ` /api/v1/question/exams/{ID}/sim`, method: "GET"}, // 代码查重
}

export interface ITeacherAssignment {
  addAssignment: TFHttpSend;
  assignmentList: TFHttpSend;
  publishAssignment: TFHttpSend;
  unpublishAssignment: TFHttpSend;
  delAssignment: TFHttpSend;
  questionsMaxLimit: TFHttpSend;
  assignmentDetail:TFHttpSend;
  editAssignment: TFHttpSend;
  exportPaper: TFHttpSend;
  studentsScores: TFHttpSend;
  simSearch: TFHttpSend;
}