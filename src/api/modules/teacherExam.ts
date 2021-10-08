import { TFHttpSend } from "src/typings/getRequest";
export default{
  getTestPaperList:{url:`/api/v1/question/papers`,method: "GET",},
  TestPaperDetele:{url:`/api/v1/question/papers/{paper_id}`,method: "delete",},
  copy:{url:`/api/v1/question/papers/{paper_id}/replicate`,method: "GET"},
  getQuestions:{url:`/api/v1/question/papers/questions`,method: "GET"},
  pools:{url:`api/v1/question/pools`,method: "GET"},
  submitPaper:{url:`/api/v1/question/papers`,method:"POST",dataType:'json'}
}

export interface ITeacherExamlAps {
  getTestPaperList: TFHttpSend;
  TestPaperDetele: TFHttpSend;
  copy: TFHttpSend;
  getQuestions: TFHttpSend;
  pools: TFHttpSend;
  submitPaper: TFHttpSend;
}

export const MODULE_NAME = 'teacherExam'