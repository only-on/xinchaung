import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 我的实训列表
    trainList: { url: '/api/train/trains', method: "GET" },
    // 内置实训列表
    builtTrainList: { url: '/api/train/trains/init', method: 'GET' },
    // 归档实训列表
    archiveTrainList: { url: '/api/train/trains/archive', method: 'GET' },
    // 删除实训
    deleteTrain: { url: '/api/train/trains/{train}', method: 'POST' }
}
export interface ITeacherTrainAps {
    trainList: TFHttpSend;
    builtTrainList: TFHttpSend;
    archiveTrainList: TFHttpSend;
    deleteTrain: TFHttpSend;
}
