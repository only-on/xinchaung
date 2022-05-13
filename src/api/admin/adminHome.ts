import { TFHttpSend } from "src/typings/getRequest";
export default{
    //所有数据默认
   statisData:{url:`/api/system/admin/index`,method:'get'},
    //用户活跃度查询接口
    userActive:{url:'api/system/user-activity-lis',method:'POST'}
}
export interface IadminHome{
    statisData:TFHttpSend
    userActive:TFHttpSend
}
export const MODULE_NAME = 'adminHome'