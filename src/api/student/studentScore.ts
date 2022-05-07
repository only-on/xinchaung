import { TFHttpSend } from "src/typings/getRequest";
export default {
    allScoreList: {url: '/api/operate/studentScore/index', method: "GET" },//成绩列表
    statisTicChart:{url:'/api/operate/studentScore/efficiency',method: "GET" } //学习效率
}

export interface ITeacherTrainAps {
    allScoreList:TFHttpSend
    statisTicChart:TFHttpSend
}

export const MODULE_NAME = 'studentScore'