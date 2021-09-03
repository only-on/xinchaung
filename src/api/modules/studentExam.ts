import { TFHttpSend } from "src/typings/getRequest";

export default{
    studentExaminationlList:{url:'/api/question/students/{student_id}/papers',method:'GET'},
    studentExamResult:{url:"/api/question/students/{student_id}/papers/{paper_id}/scored-analysis",method:'GET'},
    startExam:{url:"/api/question/students/{student_id}/exams/latest",method:'GET'},
    startedExam:{url:"api/question/students/{student_id}/exams/{exam_id}/started",method:"POST"}
}

export interface IstudentExam{
  studentExaminationlList:TFHttpSend
  studentExamResult:TFHttpSend
  startExam:TFHttpSend
  startedExam:TFHttpSend
}


export const MODULE_NAME = 'studentExam'