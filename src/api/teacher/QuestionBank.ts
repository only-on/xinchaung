import { TFHttpSend } from "src/typings/getRequest";

export default {
  // 文件夹目录
  getDirectoryFirst: { url: `/api/v1/xinchuang/question/directories`, method: "GET" },
  getDirectoryChidren: { url: `api/v1/xinchuang/question/directories/{directory_id}/children`, method: "GET" },
  createDirectory: { url: `/api/v1/xinchuang/question/directories`, method: "POST", dataType: "json" },

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
}

export interface IQuestionBank {
  getDirectoryFirst: TFHttpSend
  getDirectoryChidren: TFHttpSend
  createDirectory: TFHttpSend
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
}