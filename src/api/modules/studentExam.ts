import { TFHttpSend } from "src/typings/getRequest";

export default{
    studentExaminationlList:{url:'/api/question/students/{student_id}/paper-exams',method:'GET'},
}

export interface IstudentExam{
  studentExaminationlList:TFHttpSend
}


export const MODULE_NAME = 'studentExam'