import { TFHttpSend } from "src/typings/getRequest";
export default{
   //  管理镜像列表
   imageslist:{url:`/api/env/admin/images`,method:'get',dataType: 'json'},
   //  课程列表
   courselist:{url:`/api/course/admin/courses/list`,method:'get',dataType: 'json'},

   //实验管理列表
   experList:{url:`/api/course/admin/courses/contents`,method:'get',dataType: 'json'},
   
   //实验模版列表
   experTemplateList:{url:`/api/course/admin/courses/content-templates`,method:'get',dataType: 'json'},

   //素材资源
//    resourceslist:{url:`/api/env/admin/images`,method:'get',dataType: 'json'},

   //在线模版
   viewTemplate: {url: ` /api/simple/report/templates/{id}`, method: 'GET'},

    //实验批量删除
    experDelete:{url: `/api/course/admin/courses/contents/multiple-deletes`, method: 'PUT'},

    // 实验模版批量删除
    experTemplateDelete:{url: `/api/course/admin/courses/contents/multiple-deletes`, method: 'PUT'}

}
export interface ITeachingResourceManagement{
    imageslist:TFHttpSend
    courselist:TFHttpSend
    experList:TFHttpSend
    experTemplateList:TFHttpSend
    viewTemplate:TFHttpSend
    experDelete:TFHttpSend
    experTemplateDelete:TFHttpSend
}
export const MODULE_NAME = 'TeachingResourceManagement'