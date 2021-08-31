import { TFHttpSend } from "src/typings/getRequest";

export default{
    studentExaminationlList:{url:'/api/question/students/{student_id}/paper-exams',method:'GET'},
    studentExamResult:{url:"/api/question/students/{student_id}/papers/{paper_id}/analysis",method:'GET'}
}

export interface IstudentExam{
  studentExaminationlList:TFHttpSend
  studentExamResult:TFHttpSend
}


export const MODULE_NAME = 'studentExam'