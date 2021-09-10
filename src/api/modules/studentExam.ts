import { TFHttpSend } from "src/typings/getRequest";

export default{
    studentExaminationlList:{url:'/api/v1/question/students/{student_id}/exams',method:'GET'},
    studentExamResult:{url:"/api/v1/question/students/{student_id}/exams/{paper_id}/scored-analysis",method:'GET'},
    startExam:{url:"/api/v1/question/students/{student_id}/exams/latest",method:'GET'},
    startedExam:{url:"api/v1/question/students/{student_id}/exams/{exam_id}/started",method:"POST"},
    submitAnswer:{url:"/api/v1/question/students/{student_id}/exams/{exam_id}/answer",method:"POST",dataType:"json"},
    endAnswer:{url:"/api/v1/question/students/{student_id}/exams/{exam_id}/closed",method:'PUT'}
}

export interface IstudentExam{
  studentExaminationlList:TFHttpSend
  studentExamResult:TFHttpSend
  startExam:TFHttpSend
  startedExam:TFHttpSend
  submitAnswer:TFHttpSend
  endAnswer:TFHttpSend
}


export const MODULE_NAME = 'studentExam'