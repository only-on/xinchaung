import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 系统日志列表
    systemLogList: { url: '/log/index', method: "POST", dataType: 'json' },
    // 系统警告
    systemAlarmList: { url: '/env/warn', method: "POST", dataType: 'formdata' },
    //设备管理
    systemDeviceList: { url: '/api/system/nodes', method: "GET" },
    //设备管理中一键关机
    simJetSoft: { url: '/api/system/nodes/close', method: "POST" },
    // 设备节点操作
    deviceNodeOperation: { url: '/api/system/nodes/control', method: "POST" }
}
export interface ITeacherTrainAps {
    systemLogList: TFHttpSend
    systemAlarmList: TFHttpSend
    systemDeviceList: TFHttpSend
    simJetSoft: TFHttpSend
    deviceNodeOperation: TFHttpSend
}