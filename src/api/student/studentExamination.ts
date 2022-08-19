import { TFHttpSend } from "src/typings/getRequest";

export default {
    // 学生考试作业列表 type 1：作业 2：考试
    studentExamList:{url:`/api/v1/question/students/exams`, method: "GET"}
}

export interface IStudentExamination {
    studentExamList:TFHttpSend
}