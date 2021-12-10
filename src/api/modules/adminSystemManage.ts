import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 系统日志列表
    systemLogList: { url: '/log/index', method: "POST", dataType: 'json' },
    // 系统警告
    systemAlarmList: { url: '/env/warn', method: "POST", dataType: 'formdata' },
}
export interface ITeacherTrainAps {
    systemLogList: TFHttpSend
    systemAlarmList: TFHttpSend
}