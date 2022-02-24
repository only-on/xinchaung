import { TFHttpSend } from "src/typings/getRequest";

export default {
  getTemplateList: { url: `/report/template/mine`, method: "POST" },
  upLoadTemple: { url: `/report/template/upload`, method: "POST" },

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
  getTemplateList: TFHttpSend;
  upLoadTemple: TFHttpSend;

  getSameScreenInfo: TFHttpSend;
  getTopoVmInfo: TFHttpSend;
  deleteTopo: TFHttpSend;

  uploadTaskFile: TFHttpSend;
}

export const MODULE_NAME = "teacherExperimentResourcePool";
