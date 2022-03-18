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
  getTemplateList:{ url: `/api/xinchuang/report/templates`, method: "GET"},
                        // /api/xinchuang/report/templates
  upLoadExperimentReport:{ url: `/api/xinchuang/report/templates/import-template`, method: "POST",dataType: 'formdata'},

  // 实验技术方向
  getDirection: { url: `/api/category/技术方向/tags`, method: "GET" },
  // 删除实验报告模板
  deleteTemplate:{ url: `/api/xinchuang/report/templates/{id}`, method: "DELETE" ,},

  // 同屏
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
    url: `/api/xinchuang/content/jupyter/upload_taskfile`,
    method: "POST",
    dataType: "formdata",
  },

  //  文档 视频列表
  DocList:{ url: `/api/xinchaung/content/document/list`, method: "GET"},
  Mp4List:{ url: `/api/xinchaung/content/video/list`, method: "GET"},
  // 上传文档 视频
  uploadDocFile:{url:`/api/xinchuang/content/document/upload_file`,method: "POST",dataType: "formdata"},
  uploadMp4File:{url:`/api/xinchuang/content/video/upload_file`,method: "POST",dataType: "formdata"},
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

  getSameScreenInfo: TFHttpSend;
  getTopoVmInfo: TFHttpSend;
  deleteTopo: TFHttpSend;

  uploadTaskFile: TFHttpSend;

  DocList: TFHttpSend;
  Mp4List: TFHttpSend;

  uploadDocFile: TFHttpSend;
  uploadMp4File: TFHttpSend;
}

export const MODULE_NAME = "teacherExperimentResourcePool";
