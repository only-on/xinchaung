import { TFHttpSend } from "src/typings/getRequest";
export default{
  //  管理镜像列表
  imageslist:{url:`/api/env/admin/images`,method:'get',dataType: 'json'},
  // 镜像批量删除
  imageBatchDelete:{url: `/api/course/admin/courses/images/multiple-deletes`, method: 'PUT',dataType: 'json'},
  //  课程列表
  courselist:{url:`/api/course/admin/courses/list`,method:'get',dataType: 'json'},

  //实验管理列表
  experList:{url:`/api/course/admin/courses/contents`,method:'get',dataType: 'json'},
  
  //实验模版列表
  experTemplateList:{url:`/api/course/admin/courses/content-templates`,method:'get',dataType: 'json'},

   //素材资源 统计
   resourceStatistics:{url:`/api/admin/resource/data/statistics`,method:'get'},
   // 素材资批量删除
   resourceBatchDelete:{url: `/api/admin/resource/data`, method: 'DELETE',dataType: 'json'},

   //在线模版
   viewTemplate: {url: ` /api/simple/report/templates/{id}`, method: 'GET'},

    //实验批量删除
    experDelete:{url: `/api/course/admin/courses/contents/multiple-deletes`, method: 'PUT',dataType: 'json'},
  //实验模版批量删除
    experTemplateDelete:{url: `/api/course/admin/courses/content-templates/multiple-deletes`, method: 'PUT',dataType: 'json'},
  // 知识图谱列表
  knowledgesList: {url: `/api/service/knowledges`, method: 'GET'},
  //创建知识点
  addKnowledgeMap: {url: `/api/service/knowledges`, method: 'post'},
  //修改知识点
  editKnowledgeMap: {url: `/api/service/knowledges/{nodeID}`, method: 'put'},
  //删除知识点
  delKnowledgeMap: {url: `/api/service/knowledges/{nodeID}`, method: 'delete'},
  // 获取知识点对应的实验
  getContentlist: {url: `/api/service/knowledges/{nodeID}/contents`, method: 'get'}
}
export interface ITeachingResourceManagement{
    imageslist:TFHttpSend
    courselist:TFHttpSend
    experList:TFHttpSend
    experTemplateList:TFHttpSend
    viewTemplate:TFHttpSend
    experDelete:TFHttpSend
    experTemplateDelete:TFHttpSend
    knowledgesList: TFHttpSend
    addKnowledgeMap: TFHttpSend
    editKnowledgeMap: TFHttpSend
    delKnowledgeMap: TFHttpSend
    getContentlist: TFHttpSend
}
export const MODULE_NAME = 'TeachingResourceManagement'