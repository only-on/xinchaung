import { TFHttpSend } from "src/typings/getRequest";
export default{
    //所有数据默认
    systemLogList:{url:`/api/system/user-logs`,method:'get'}
}
export interface IsystemMaintenance{
    systemLogList:TFHttpSend
}
export const MODULE_NAME = 'IsystemMaintenance'