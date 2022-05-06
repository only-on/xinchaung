import { TFHttpSend } from "src/typings/getRequest";
export default{
   //  管理镜像列表
   imageslist:{url:`/api/env/admin/images`,method:'get',dataType: 'json'},
   //  课程列表
   courselist:{url:`/api/course/admin/courses/list`,method:'get',dataType: 'json'},
}
export interface ITeachingResourceManagement{
    imageslist:TFHttpSend
    courselist:TFHttpSend
}
export const MODULE_NAME = 'TeachingResourceManagement'