import { TFHttpSend } from "src/typings/getRequest";

export default {
    // 作业考试  提交答案
    submitAnswers:{url: ``, method: "post",dataType: 'json'},
    //获取作业考试题目列表  带答案
    getQuestionAnswers:{url: ``, method: "get",dataType: 'json'},
}

export interface IStudentAssignment {
    submitAnswers: TFHttpSend;
    getQuestionAnswers: TFHttpSend;
}