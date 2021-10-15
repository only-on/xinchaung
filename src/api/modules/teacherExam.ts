import { TFHttpSend } from "src/typings/getRequest";
export default{
  getTestPaperList:{url:`/api/v1/question/papers`,method: "GET",},
  TestPaperDetele:{url:`/api/v1/question/papers/{paper_id}`,method: "delete",},
  copy:{url:`/api/v1/question/papers/{paper_id}/replicate`,method: "GET"},
  getQuestions:{url:`/api/v1/question/papers/questions`,method: "GET"},
  pools:{url:`/api/v1/question/pools`,method: "GET"},
  submitPaper:{url:`/api/v1/question/papers`,method:"POST",dataType:'json'},
  ExaminationEnter:{url:`/api/v1/question/exams`,method:'GET',},
  examinationDetele:{url:`/api/v1/question/exams/{exam_id}`,method:'delete',},
  publish:{url:`/api/v1/question/exams/{exam_id}/publish`,method:'PUT',},
  unpublished:{url:`/api/v1/question/exams/{exam_id}/unpublished`,method:'PUT',},
  getExaminationDetail:{url:`/api/v1/question/exams/{exam_id}`,method: "GET"},
  CreatedExamination:{url:`/api/v1/question/exams`,method:"POST",dataType:'json'},
  getStudent:{url:`/api/v1/question/exams/{exam_id}/users`,method: "GET"},
  getClass:{url:`/api/v1/question/exams/{exam_id}/classes`,method: "GET"},
}

export interface ITeacherExamlAps {
  getTestPaperList: TFHttpSend;
  TestPaperDetele: TFHttpSend;
  copy: TFHttpSend;
  getQuestions: TFHttpSend;
  pools: TFHttpSend;
  submitPaper: TFHttpSend;
  examinationDetele: TFHttpSend;
  publish: TFHttpSend;
  unpublished: TFHttpSend;
  getExaminationDetail: TFHttpSend;
  CreatedExamination: TFHttpSend;
  getStudent: TFHttpSend;
  getClass: TFHttpSend;
}

export const MODULE_NAME = 'teacherExam'