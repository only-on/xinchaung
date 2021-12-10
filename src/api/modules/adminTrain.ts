import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 我的实训列表
    trainList: { url: '/api/train/trains', method: "GET" },
    // 内置实训列表
    builtTrainList: { url: '/api/train/trains/init', method: 'GET' },
    // 归档实训列表
    archiveTrainList: { url: '/api/train/trains/archive', method: 'GET' },
    // 删除实训
    deleteTrain: { url: '/api/train/trains/deletes', method: 'POST' },
    // 批量释放实训录屏
    batchReleaseScreen: { url: '/api/train/trains/cleans', method: 'POST' }
}
export interface ITeacherTrainAps {
    trainList: TFHttpSend;
    builtTrainList: TFHttpSend;
    archiveTrainList: TFHttpSend;
    deleteTrain: TFHttpSend;
    batchReleaseScreen: TFHttpSend;
}
