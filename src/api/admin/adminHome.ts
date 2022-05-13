import { TFHttpSend } from "src/typings/getRequest";
export default{
    //所有数据默认
   statisData:{url:`/api/system/admin/index`,method:'get'},
    //用户活跃度查询接口
    userActive:{url:'/api/system/user-activity-list',method:'get'},
    //资源历史使用概览
    resourceSearch:{url:'/api/system/history-resource',method:'get'},
    serveStatus:{url:'/api/system/nodes-resource',method:'get'}
}
export interface IadminHome{
    statisData:TFHttpSend
    userActive:TFHttpSend
    resourceSearch:TFHttpSend
    serveStatus:TFHttpSend
}
export const MODULE_NAME = 'adminHome'