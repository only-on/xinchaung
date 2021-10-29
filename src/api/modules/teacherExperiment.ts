import { TFHttpSend } from "src/typings/getRequest";
export default {
  getExpeTreeList: {url:`/api/content/category`, method: "GET",},
  addChapter: {url: `/api/content/category`, method: 'POST', dataType:'json'},
  updateChapter: {url: `/api/content/category/{id}`, method: 'PUT', dataType:'json'},
  deleteChapter: {url: `/api/content/category/{id}`, method: "DELETE"},
  shareChapter: {url: `/api/content/category/share`, method: 'POST', dataType:'json'},
  saveToContentAll: {url: `/api/content/category/clone`, method: 'POST', dataType:'json'},
  getSearchInfo: {url: `/api/content/content/search`, method: "GET"},
  getExperimentList: {url: `/api/content/content`, method: "GET"},
  sortExperimental: {url: `/api/content/content/sortby`, method: 'POST', dataType:'json'},
  shareExperimental: {url: `/api/content/content/share`, method: 'POST', dataType:'json'},
  deleteExperimental: {url: `/api/content/content/{id}`, method: 'DELETE'},
  saveToContent: {url: `/api/content/content/saved_my_content`, method: 'POST', dataType:'json'},
  // 镜像
  getConfigs: {url: `/api/env/images/config`, method: 'GET'},
  getMeImage: {url: `/api/env/containers`, method: 'GET'},
  // 同屏
  getSameScreenInfo: {url: `/api/content/content/template`, method: 'POST', dataType:'json'},
  getTopoVmInfo: {url: `/api/content/content/topoInfo`, method: 'POST', dataType:'json'},
  deleteTopo: {url: `/api/content/jupyter/upload_taskfile`, method: 'POST', dataType:'json'},
  // 上传任务
  uploadTaskFile: {url: `/api/content/jupyter/upload_taskfile`, method: 'POST', dataType: 'formdata'},
  // 创建实验
  createVnc: {url: `/api/content/vnc/create_vnc`, method: 'POST', dataType:'json'},
  createJupyter: {url: `/api/content/jupyter/create_jupyter`, method: 'POST', dataType:'json'},
}

export interface ITeacherExperAps {
  getExpeTreeList: TFHttpSend;
  addChapter: TFHttpSend;
  updateChapter: TFHttpSend;
  deleteChapter: TFHttpSend;
  shareChapter: TFHttpSend;
  saveToContentAll: TFHttpSend;
  getSearchInfo: TFHttpSend;
  getExperimentList: TFHttpSend;
  sortExperimental: TFHttpSend;
  shareExperimental: TFHttpSend;
  deleteExperimental: TFHttpSend;
  saveToContent: TFHttpSend;
  getConfigs: TFHttpSend;
  getMeImage: TFHttpSend;
  getSameScreenInfo: TFHttpSend;
  getTopoVmInfo: TFHttpSend;
  deleteTopo: TFHttpSend;
  uploadTaskFile: TFHttpSend;
  createVnc: TFHttpSend;
  createJupyter: TFHttpSend;
}

export const MODULE_NAME = 'teacherExperiment'