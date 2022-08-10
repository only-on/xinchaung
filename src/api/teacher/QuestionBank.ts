import { TFHttpSend } from "src/typings/getRequest";

export default {
  // 文件夹目录
  getDirectoryFirst: { url: `/api/v1/xinchuang/question/directories`, method: "GET" },
  getDirectoryChidren: { url: `/api/v1/xinchuang/question/directories/{directory_id}/children`, method: "GET" },
  createDirectory: { url: `/api/v1/xinchuang/question/directories`, method: "POST", dataType: "json" },
  updateDirectory: { url: `/api/v1/xinchuang/question/directories/{directory_id}`, method: "PUT", dataType: "json" },
  deleteDirectory: { url: `/api/v1/xinchuang/question/directories/{directory_id}`, method: "DELETE" },
  moveBeforeDirectory: { url: `/api/v1/xinchuang/question/directories/{original_directory_id}/move/{destination_directory_id}/before`, method: "PUT", dataType: "json" },
  moveAfterDirectory: { url: `/api/v1/xinchuang/question/directories/{original_directory_id}/move/{destination_directory_id}/after`, method: "PUT", dataType: "json" },

  // 知识图谱
  getKnowledgeFirst: { url: `/api/service/knowledge_map/first_level`, method: "GET" },
  getKnowledgeSub: { url: `/api/service/knowledge_map/sub_level?id={id}`, method: "GET" },

  // 习题
  getMyQuestionsList: { url: `/api/v1/xinchuang/question/myQuestions`, method: "GET" },
  getPublicQuestionsList: { url: `/api/v1/xinchuang/question/publicQuestions`, method: "GET" },
  // 创建习题
  choiceQues: { url: `/api/v1/xinchuang/question/choice_question`, method: "POST", dataType: "json" },
  judgeQues:{url: `/api/v1/xinchuang/question/judge_questions`, method: "POST", dataType: "json"},
  complateQues:{url:` /api/v1/xinchuang/question/blank_questions`,method: "POST", dataType: "json"},
  solutionQues:{url:`/api/v1/xinchuang/question/short_answer_question`,method: "POST", dataType: "json"},
  programQues:{url:`/api/v1/xinchuang/question/program-questions`,method: "POST", dataType: "json"},
  modelQues:{url:`/api/v1/xinchuang/question/model-questions`,method: "POST", dataType: "json"},

  // 习题详情
  choiceDetail:{url: `/api/v1/xinchuang/question/choice_question`, method: "GET"},
  judgeDetail:{url:`/api/v1/xinchuang/question/judge_questions/{questionId}`, method: "GET"},
  complateDetail:{url:`/api/v1/xinchuang/question/blank_questions/{questionId}`, method: "GET"},
  solutionDetail:{url:`/api/v1/xinchuang/question/blank_questions/{questionId}`, method: "GET"},
  programDetail:{url:`/api/v1/xinchuang/question/program-questions/{ID}`,method: "GET"},
  modelDeatil:{url:` /api/v1/xinchuang/question/model-questions/{questionId}`,method: "GET"},

  // 编辑习题
  editChoice:{url:`/api/v1/xinchuang/question/choice_question/{questionId}`,method: "PUT"},
  editJudge:{url:` /api/v1/xinchuang/question/judge_questions/{questionId}`,method: "PUT"},
  editComplate:{url:`/api/v1/xinchuang/question/blank_questions/{questionId}`,method: "PUT"},
  editSolution:{url:`/api/v1/xinchuang/question/short_answer_question/{questionId}`,method: "PUT"},
  editProgram:{url:`/api/v1/xinchuang/question/program-questions/{ID}`,method: "PUT"},
  editModel:{url:`/api/v1/xinchuang/question/model-questions/{questionId}`,method: "PUT"},

  // 试用编程题
  ojConfig:{url:`/api/v1/oj/config`,method: "GET"},
  submitProgramQuestion:{url:`/api/v1/xinchuang/question/program-questions/{ID}/submit`,method: "POST", dataType: "json"},
  solutionSatus:{url:` /api/v1/xinchuang/question/program-questions/{ID}/solution/{solution_id}/status`,method: "GET"},
  // 试用模型题
  runModelQuestions:{url:`/api/v1/xinchuang/question/model-questions/run/{questionId}`,method: "POST", dataType: "json"},

}

export interface IQuestionBank {
  getDirectoryFirst: TFHttpSend
  getDirectoryChidren: TFHttpSend
  createDirectory: TFHttpSend
  updateDirectory: TFHttpSend
  deleteDirectory: TFHttpSend
  moveBeforeDirectory: TFHttpSend
  moveAfterDirectory: TFHttpSend
  getKnowledgeFirst: TFHttpSend
  getKnowledgeSub: TFHttpSend
  getMyQuestionsList: TFHttpSend
  getPublicQuestionsList: TFHttpSend

  // 创建习题
  choiceQues:TFHttpSend
  judgeQues:TFHttpSend
  complateQues:TFHttpSend
  solutionQues:TFHttpSend
  programQues:TFHttpSend
  modelQues:TFHttpSend

  // 习题详情
  choiceDetail:TFHttpSend
  judgeDetail:TFHttpSend
  complateDetail:TFHttpSend
  solutionDetail:TFHttpSend
  programDetail:TFHttpSend
  modelDeatil:TFHttpSend

  // 编辑习题
  editChoice:TFHttpSend
  editJudge:TFHttpSend
  editComplate:TFHttpSend
  editSolution:TFHttpSend
  editProgram:TFHttpSend
  editModel:TFHttpSend

  // 试用编程题
  ojConfig: TFHttpSend
  submitProgramQuestion:TFHttpSend
  solutionSatus: TFHttpSend
  // 试用模型题
  runModelQuestions: TFHttpSend
}