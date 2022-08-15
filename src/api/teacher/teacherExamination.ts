import { TFArgTHljsCssRString } from "@xianfe/antdv-markdown";
import { TFHttpSend } from "src/typings/getRequest";
// type:1 ---作业  type:2---考试
export default {
  examsList: {url: `/api/v1/question/exams`, method: "GET"}, // 列表
  publishExam: {url: `/api/v1/question/exams/{ID}/publish`, method: "PUT"}, // 发布
  unpublishExam: {url: `/api/v1/question/exams/{ID}/unpublished`, method: "PUT"}, // 撤销发布
  setCheat: {url: `/api/v1/question/exams/{ID}/set/cheat`, method: "POST",dataType: 'json'}, // 考试防作弊设置
  delExam: {url: `/api/v1/question/exams/{ID}`, method: "DELETE"}, // 删除
  examsUserList: {url: `/api/v1/question/exams/users`, method: "GET"}, // 选择学生列表弹框
  questionsMaxLimit: {url: ` /api/v1/question/exams/questions/max-limit`, method: "GET"}, // 随机创建-各类型题可选题目数
  addExam: {url: `/api/v1/question/exams?type=2`, method: "POST",dataType: 'json'}, // 添加考试
  examDetail: {url: `/api/v1/question/exams/{ID}`, method: "GET"}, // 详情
  editExam: {url: `/api/v1/question/exams/{ID}`, method: "PUT",dataType: 'json'}, // 编辑


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
  // questionsScore: TFHttpSend;
  // questionsBatchScore: TFHttpSend;
}