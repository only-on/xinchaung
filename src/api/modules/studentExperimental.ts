import { TFHttpSend } from "src/typings/getRequest";
export default {
  // 学生端-最近实训列表
  getLatelyExperimentalList: { url: `/api/operate/operates/recentTrain`, method: "GET", },
  getMyExperimentalList: { url: `/api/operate/operates/myTrain`, method: "GET", }
}

export interface IStudentExperimentalAps {
  getLatelyExperimentalList: TFHttpSend;
  getMyExperimentalList: TFHttpSend;
}

export const MODULE_NAME = 'studentExperimental'