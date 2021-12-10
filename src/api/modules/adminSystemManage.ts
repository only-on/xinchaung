import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 系统日志列表
    systemLogList: { url: '/log/index', method: "GET" },
}
export interface ITeacherTrainAps {
    systemLogList: TFHttpSend
}