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
  getStudent:{url:`/api/v1/question/exams/users`,method: "GET"},
  getClass:{url:`/api/v1/question/exams/classes`,method: "GET"},
  appointment:{url:`/api/v1/question/exams/booking/list`,method: "GET"},
  examsDateTesting:{url:`/api/v1/question/exams/booking/date-check`,method: "POST"},
  submit:{url:`/api/v1/question/exams`,method:'POST',dataType:'json'},
  editSubmit:{url:`/api/v1/question/exams/{editId}`,method: "PUT",dataType:'json'},
  getClassDetaileList:{url:`/api/v1/question/exams/classes/detail`,method:'GET',},
  initialization:{url:`api/v1/question/exams/users/reset-password`,method:'PUT',},
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
  appointment: TFHttpSend;
  examsDateTesting: TFHttpSend;
  submit: TFHttpSend;
  editSubmit: TFHttpSend;
  getClassDetaileList: TFHttpSend;
  initialization: TFHttpSend;
}

export const MODULE_NAME = 'teacherExam'