import { TFHttpSend } from "src/typings/getRequest";

export default {
  //创建实验
  create:{ url: `/api/experiment/create`, method: "POST" ,dataType: 'json'},
  getTemplateList:{ url: `/api/xinchuang/report/templates`, method: "GET"},


  upLoadTemple: { url: `/report/template/upload`, method: "POST" },


  upLoadExperimentReport:{ url: `/api/xinchuang/report/templates/import-template`, method: "POST",dataType: 'formdata'},


  // 删除实验报告模板
  deleteTemplate:{ url: `/api/xinchuang/report/template/delete`, method: "POST" ,dataType: 'json'},

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
    url: `/api/content/jupyter/upload_taskfile`,
    method: "POST",
    dataType: "formdata",
  },
};

export interface ITeacherExperimentResourcePool {
  create:TFHttpSend

  getTemplateList: TFHttpSend;
  upLoadTemple:TFHttpSend;

  upLoadExperimentReport:TFHttpSend
  deleteTemplate:TFHttpSend;

  getSameScreenInfo: TFHttpSend;
  getTopoVmInfo: TFHttpSend;
  deleteTopo: TFHttpSend;

  uploadTaskFile: TFHttpSend;
}

export const MODULE_NAME = "teacherExperimentResourcePool";
