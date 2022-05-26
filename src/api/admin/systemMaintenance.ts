import { TFHttpSend } from "src/typings/getRequest";
export default{
    //所有数据默认
    systemLogList:{url:`/api/system/user-logs`,method:'get'},
    // 个性化设置
    systemPersonalSet: {url:`/api/system/setting/set`,method:'post'},
    // 获取个性化设置
    systemPersonalShow: {url:`/api/system/setting/show`,method:'get'}
}
export interface IsystemMaintenance{
    systemLogList:TFHttpSend,
    systemPersonalSet: TFHttpSend,
    systemPersonalShow: TFHttpSend
}
export const MODULE_NAME = 'IsystemMaintenance'