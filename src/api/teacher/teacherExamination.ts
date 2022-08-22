import { TFArgTHljsCssRString } from "@xianfe/antdv-markdown";
import { TFHttpSend } from "src/typings/getRequest";
// type:1 ---作业  type:2---考试
const type = 2
export default {
  examsList: {url: `/api/v1/question/exams`, method: "GET"}, // 列表
  publishExam: {url: `/api/v1/question/exams/{ID}/publish?type=${type}`, method: "PUT"}, // 发布
  unpublishExam: {url: `/api/v1/question/exams/{ID}/unpublished?type=${type}`, method: "PUT"}, // 撤销发布
  setCheat: {url: `/api/v1/question/exams/{ID}/set/cheat`, method: "POST",dataType: 'json'}, // 考试防作弊设置
  delExam: {url: `/api/v1/question/exams/{ID}?type=${type}`, method: "DELETE"}, // 删除
  examsUserList: {url: `/api/v1/question/exams/users`, method: "GET"}, // 选择学生列表弹框
  questionsMaxLimit: {url: ` /api/v1/question/exams/questions/max-limit`, method: "GET"}, // 随机创建-各类型题可选题目数
  addExam: {url: `/api/v1/question/exams?type=${type}`, method: "POST",dataType: 'json'}, // 添加考试
  examDetail: {url: `/api/v1/question/exams/{ID}?type={type}`, method: "GET"}, // 详情
  editExam: {url: `/api/v1/question/exams/{ID}?type=${type}`, method: "PUT",dataType: 'json'}, // 编辑
  exportPaper: {url: `/api/v1/question/exams/{ID}/export-paper?type=${type}`, method: "GET"}, // 导出
  studentsScores: {url: `/api/v1/question/exams/{exam}/students/scores`, method: "GET"}, // 成绩列表
  simSearch: {url: `/api/v1/question/exams/{ID}/sim`, method: "GET"}, // 代码查重
  studentScoreExport: {url: `/api/v1/xinchuang/question/exams/student-exam-score/export`, method: "GET"}, // 成绩导出


  // 考试成绩
  examResult: {url: `/api/v1/xinchuang/question/exam-result/{examResultId}`, method: "GET"},
  //设置题目分数
  // questionsScore:{url: `/api/v1/question/exams/{examsId}/questions/{questionsId}/score?type={type}`, method: "PUT",dataType: 'json'},
  //批量设置题目分数
  // questionsBatchScore:{url: ` /api/v1/question/exams/{examsId}/questions/batch-score?type={type}`, method: "PUT",dataType: 'json'}
}

export interface ITeacherExamination {
  examsList: TFHttpSend;
  publishExam: TFHttpSend;
  unpublishExam: TFHttpSend;
  setCheat: TFHttpSend;
  delExam: TFHttpSend;
  examsUserList: TFHttpSend;
  questionsMaxLimit: TFHttpSend;
  addExam: TFHttpSend;
  examDetail:TFHttpSend;
  editExam: TFHttpSend;
  exportPaper: TFHttpSend;
  studentsScores: TFHttpSend;
  simSearch: TFHttpSend;
  studentScoreExport: TFHttpSend;
  examResult: TFHttpSend;
  // questionsScore: TFHttpSend;
  // questionsBatchScore: TFHttpSend;
}