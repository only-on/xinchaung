import { TFHttpSend } from "src/typings/getRequest";
export default{
   //  管理镜像列表
   list:{url:`/api/env/admin/images`,method:'get',dataType: 'json'},
}
export interface ITeachingResourceManagement{
    list:TFHttpSend
}
export const MODULE_NAME = 'TeachingResourceManagement'