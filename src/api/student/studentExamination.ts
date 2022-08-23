import { TFHttpSend } from "src/typings/getRequest";

export default {
    // 学生考试作业列表 type 1：作业 2：考试
    studentExamList:{url:`/api/v1/question/students/exams`, method: "GET"},
    //  学生答题  基础题  提交答案
    submitAnswers:{url:`/api/v1/question/students/{user}/answer`, method: "POST",dataType: 'json'},
}

export interface IStudentExamination {
    studentExamList:TFHttpSend
    submitAnswers:TFHttpSend
}