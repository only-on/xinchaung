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
}

export interface IQuestionBank {
  getDirectoryFirst: TFHttpSend
  getDirectoryChidren: TFHttpSend
  createDirectory: TFHttpSend
  getKnowledgeFirst: TFHttpSend
  getKnowledgeSub: TFHttpSend
  getMyQuestionsList: TFHttpSend
  getPublicQuestionsList: TFHttpSend
}