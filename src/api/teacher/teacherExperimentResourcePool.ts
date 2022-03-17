import { TFHttpSend } from "src/typings/getRequest";

export default {
  //创建实验
  // 桌面
  createVnc:{ url: `/api/xinchuang/content/vnc/create_vnc`, method: "POST" ,dataType: 'json'},
  // Jupyter实验
  createJupyter:{ url: `/api/xinchuang/content/jupyter/create_jupyter`, method: "POST" ,dataType: 'json'},
  // 任务制实验
  createTask:{ url: `/api/xinchuang/content/create_vnc`, method: "POST" ,dataType: 'json'},
  // 文档实验
  createText:{ url: `/api/xinchuang/content/create_vnc`, method: "POST" ,dataType: 'json'},
  // 视频实验
  createVideo:{ url: `/api/xinchuang/content/create_vnc`, method: "POST" ,dataType: 'json'},
  
  getTemplateList:{ url: `/api/xinchuang/report/templates`, method: "GET"},

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
}

export const MODULE_NAME = "teacherExperimentResourcePool";
