import { TFHttpSend } from "src/typings/getRequest";
export default {
    allScoreList: {url: '/api/operate/studentScore/index', method: "GET" },//成绩列表
}

export interface ITeacherTrainAps {
    allScoreList:TFHttpSend
}

export const MODULE_NAME = 'studentScore'