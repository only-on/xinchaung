import { TFHttpSend } from "src/typings/getRequest";

export default {
  // 文件夹目录
  getDirectoryFirst: { url: ` /api/v1/xinchuang/question/directories`, method: "GET" },
  getDirectoryChidren: { url: `api/v1/xinchuang/question/directories/{directory_id}/children`, method: "GET" },
}

export interface IQuestionBank {
  getDirectoryFirst: TFHttpSend
  getDirectoryChidren: TFHttpSend
}