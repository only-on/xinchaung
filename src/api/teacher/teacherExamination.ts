import { TFHttpSend } from "src/typings/getRequest";

export default {
  examsList: {url: `/api/v1/question/exams`, method: "GET"}, // 列表
  setCheat: {url: `/api/v1/question/exams/{ID}/set/cheat`, method: "POST",dataType: 'json'}, // 考试防作弊设置
  delExam: {url: `api/v1/question/exams/{ID}`, method: "DELETE"}, // 删除
}

export interface ITeacherExamination {
  examsList: TFHttpSend;
  setCheat: TFHttpSend;
  delExam: TFHttpSend;
}