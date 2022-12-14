import { TFHttpSend } from "src/typings/getRequest";

export default {
  //创建实验
  // 桌面
  createVnc:{ url: `/api/xinchuang/content/vnc/create_vnc`, method: "POST" ,dataType: 'json'},
  // Jupyter实验
  createJupyter:{ url: `/api/xinchuang/content/jupyter/create_jupyter`, method: "POST" ,dataType: 'json'},
  // 任务制实验
  createTask:{ url: `/api/xinchuang/content/taskstep/create`, method: "POST" ,dataType: 'json'},
  // 文档实验
  createText:{ url: `/api/xinchuang/content/document/create`, method: "POST" ,dataType: 'json'},
  // 视频实验
  createVideo:{ url: `/api/xinchuang/content/video/create`, method: "POST" ,dataType: 'json'},
                    //    /api/xinchuang/report/templates
  getTemplateList:{ url: `/api/simple/report/templates`, method: "GET"},
                        // /api/xinchuang/report/templates
  upLoadExperimentReport:{ url: `/api/simple/report/templates/import-template`, method: "POST",dataType: 'formdata'},

  // 实验技术方向
  getDirection: { url: `/api/category/技术方向/tags`, method: "GET" },
  // 删除实验报告模板
  deleteTemplate:{ url: `/api/simple/report/templates/{id}`, method: "DELETE" ,},
  // 实验报告模板详情
  detailTemplate:{ url: `/api/simple/report/templates/{id}`, method: "GET" ,},

  // 同屏
  removeTopo: {url: '/api/env/topos/remove', method: "POST" , dataType: 'json'},
  getSameScreenInfo: {
    url: `/api/env/topos/templates`,
    method: "POST",
    dataType: "json",
  },
  getTopoVmInfo: {
    url: `/api/instance/topoInstances/info/{id}`,
    method: "GET",
    dataType: "json",
  },
  deleteTopo: {
    url: `/api/instance/topoInstances/{id}`,
    method: "DELETE",
    dataType: "json",
  },

  // 上传任务
  uploadTaskFile: {
    // url: `/api/xinchuang/content/jupyter/upload_taskfile`,
    url: `/api/xinchuang/content/jupyter/contents/guidebook/upload`,
    method: "POST",
    dataType: "formdata",
  },

    //  文档 视频列表  /api/resource/data/{id}/files
  // DocList:{ url: `/api/xinchaung/content/document/list`, method: "GET"},
  // Mp4List:{ url: `/api/xinchaung/content/video/list`, method: "GET"},
  // 实验选择资源 文档或视频
  getFileList:{ url: `/api/resource/data/{dataId}/files`, method: "GET"},
  // 上传文档 视频
  uploadDocFile:{url:`/api/xinchuang/content/document/upload_file`,method: "POST",dataType: "formdata"},
  uploadMp4File:{url:`/api/xinchuang/content/video/upload_file`,method: "POST",dataType: "formdata"},

  //  获取文件目录
  getCatalogueList:{url:`/api/resource/data/select/type/{typeId}`, method: "GET"},

  // 实验列表
  getExperimentList: { url: `/api/xinchuang/content/content`, method: "GET" },
  experimentShare: { url: `/api/xinchuang/content/content/share`, method: "POST", dataType: "json" },
  deleteExperiment: { url: `/api/xinchuang/content/content/{id}`, method: "DELETE"},
  getExperimentDetail: { url: `/api/xinchuang/content/content/{id}`, method: "GET" },
  updateBaseInfo: { url: `/api/xinchuang/content/content/save_base/{id}`, method: "POST", dataType: "json" },
  updateVncGuide: { url: `/api/xinchuang/content/vnc/contents/{content_id}/guidebook`, method: "PUT", dataType: "json" },
  uploadJuptyFile: { url: `/api/xinchuang/content/jupyter/contents/guidebook/upload`, method: "POST",dataType: "formdata" },
  updateJupyterGuide: { url: `/api/xinchuang/content/jupyter/contents/{content_id}/guidebook`, method: "PUT", dataType: "json" },
  updateTaskGuide: { url: ` /api/xinchuang/content/task/contents/{content_id}/tasks`, method: "POST", dataType: "json" },
  deleteDocument: { url: `/api/xinchuang/content/document/remove/{content_id}`, method: "DELETE" },
  updateDocumentGuide: { url: `/api/xinchuang/content/document/{content_id}/guidebook`, method: "PUT", dataType: "json" },
  deleteVideo: { url: `/api/xinchuang/content/video/remove/{content_id}`, method: "DELETE"},
  updateVideoGuide: { url: `/api/xinchuang/content/video/{content_id}/guidebook`, method: "PUT", dataType: "json" },
  updateReport: { url: `/api/xinchuang/content/content/update_report/{id}`, method: "POST", dataType: "json" },
  // 课程里章节选择实验列表
  getExperimentList2: { url: `/api/course/contents/list`, method: "GET" },
  // 保存到我的
  savedMycontent: { url: `/api/xinchuang/content/content/saved_my_content`, method: "POST" },
};

export interface ITeacherExperimentResourcePool {
  // create:TFHttpSend
  createVnc:TFHttpSend
  createJupyter:TFHttpSend
  createTask:TFHttpSend
  createText:TFHttpSend
  createVideo:TFHttpSend

  getTemplateList: TFHttpSend;
  getDirection: TFHttpSend;
  upLoadExperimentReport:TFHttpSend
  deleteTemplate:TFHttpSend;
  detailTemplate:TFHttpSend;

  removeTopo: TFHttpSend;
  getSameScreenInfo: TFHttpSend;
  getTopoVmInfo: TFHttpSend;
  deleteTopo: TFHttpSend;

  uploadTaskFile: TFHttpSend;

  DocList: TFHttpSend;
  Mp4List: TFHttpSend;
  getFileList: TFHttpSend;
  getCatalogueList: TFHttpSend;

  uploadDocFile: TFHttpSend;
  uploadMp4File: TFHttpSend;

  getExperimentList: TFHttpSend;
  experimentShare: TFHttpSend;
  deleteExperiment: TFHttpSend;
  getExperimentDetail: TFHttpSend;
  updateBaseInfo: TFHttpSend;
  updateVncGuide: TFHttpSend;
  uploadJuptyFile: TFHttpSend;
  updateJupyterGuide: TFHttpSend;
  updateTaskGuide: TFHttpSend;
  deleteDocument: TFHttpSend;
  updateDocumentGuide: TFHttpSend;
  deleteVideo: TFHttpSend;
  updateVideoGuide: TFHttpSend;
  updateReport: TFHttpSend;
  savedMycontent: TFHttpSend
}

export const MODULE_NAME = "teacherExperimentResourcePool";
