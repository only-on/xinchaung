import { TFHttpSend } from "src/typings/getRequest";

export default{
    studentExaminationlList:{url:'/api/v1/question/students/{student_id}/exams',method:'GET'},
    studentExamResult:{url:"/api/v1/question/students/{student_id}/exams/{paper_id}/scored-analysis",method:'GET'},
    startExam:{url:"/api/v1/question/students/{student_id}/exams/latest",method:'GET'},
    startedExam:{url:"/api/v1/question/students/{student_id}/exams/{exam_id}/started",method:"POST"},
    submitAnswer:{url:"/api/v1/question/students/{student_id}/exams/{exam_id}/answer",method:"POST",dataType:"json"},
    endAnswer:{url:"/api/v1/question/students/{student_id}/exams/{exam_id}/closed",method:'PUT'},
    getExamListApi:{url:"/api/v1/question/papers",method:'GET'}, // 获取试卷列表
    getQuestionsListApi:{url:"/api/v1/question/{entity_type}/{entity_id}/questions",method:'GET'}, // 教师端-试卷-实体习题列表
    submitAnswerApi:{url:"/api/v1/question/answers",method:"POST",dataType:"json"},
    getExperimentStatusApi :{url:"/api/v1/question/{entity_type}/{entity_id}/questions/has-submit-answer",method:"get"}, // 获取习题提交状态
    getExamQuestionListApi:{url:"/api/v1/question/exams/{exam_id}/questions",method:"GET"}
}

export interface IstudentExam{
  studentExaminationlList:TFHttpSend
  studentExamResult:TFHttpSend
  startExam:TFHttpSend
  startedExam:TFHttpSend
  submitAnswer:TFHttpSend
  endAnswer:TFHttpSend
  getExamListApi:TFHttpSend
  getQuestionsListApi:TFHttpSend
  submitAnswerApi:TFHttpSend
  getExperimentStatusApi:TFHttpSend
  getExamQuestionListApi:TFHttpSend
}


export const MODULE_NAME = 'studentExam'