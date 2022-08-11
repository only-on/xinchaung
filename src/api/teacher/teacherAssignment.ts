import { TFHttpSend } from "src/typings/getRequest";

export default {
  addAssignment: {url: `/api/v1/question/exams?type=1`, method: "POST",dataType: 'json'}, // 添加考试
}

export interface ITeacherAssignment {
  addAssignment: TFHttpSend
}