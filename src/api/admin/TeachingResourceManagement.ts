import { TFHttpSend } from "src/typings/getRequest";
export default{
   //  管理镜像列表
   imageslist:{url:`/api/env/admin/images`,method:'get',dataType: 'json'},
   //  课程列表
   courselist:{url:`/api/course/admin/courses/list`,method:'get',dataType: 'json'},

   //实验管理列表
   experList:{url:`/api/course/admin/courses/contents`,method:'get',dataType: 'json'},
   
   //实验模版列表
   experTemplateList:{url:`/api/course/admin/courses/content-templates`,method:'get',dataType: 'json'}
}
export interface ITeachingResourceManagement{
    imageslist:TFHttpSend
    courselist:TFHttpSend
    experList:TFHttpSend
    experTemplateList:TFHttpSend
}
export const MODULE_NAME = 'TeachingResourceManagement'