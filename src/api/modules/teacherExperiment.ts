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

  // 同屏
  getSameScreenInfo: {url: `/api/env/topos/templates`, method: 'POST', dataType:'json'},
  getTopoVmInfo: {url: `/api/instance/topoInstances/info/{id}`, method: 'GET', dataType:'json'},
  deleteTopo: {url: `/api/instance/topoInstances/{id}`, method: 'DELETE', dataType:'json'},
  // 上传任务
  uploadTaskFile: {url: `/api/content/jupyter/upload_taskfile`, method: 'POST', dataType: 'formdata'},
  // 创建实验 
  createVnc: {url: `/api/content/vnc/create_vnc`, method: 'POST', dataType:'json'},
  createJupyter: {url: `/api/content/jupyter/create_jupyter`, method: 'POST', dataType:'json'},
  getContentDetail: {url: `/api/content/content/show/{id}`, method: 'GET'},

  // 实验详情  编辑
  // /api/content/jupyter/update_base
  editBaseInfo:{url: `/api/content/jupyter/update_base`, method: 'POST', dataType:'json'},
  editEnvironmentInfo:{url: `/api/content/vnc/update_env`, method: 'POST', dataType:'json'},
  editDateSetInfo:{url: `/api/content/vnc/update_dataset`, method: 'POST', dataType:'json'},
  editGuideInfo:{url: `/api/content/vnc/update_detail`, method: 'POST', dataType:'json'},
  editTaskInfo:{url: `/api/content/jupyter/update_task`, method: 'POST', dataType:'json'},

  // 实验步骤详情
  taskStepDetail: {url: `/api/content/taskstep/show/{id}`, method: 'GET'},
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
  getSameScreenInfo: TFHttpSend;
  getTopoVmInfo: TFHttpSend;
  deleteTopo: TFHttpSend;
  uploadTaskFile: TFHttpSend;
  createVnc: TFHttpSend;
  createJupyter: TFHttpSend;
  getContentDetail: TFHttpSend;

  editBaseInfo: TFHttpSend;
  editEnvironmentInfo: TFHttpSend;
  editDateSetInfo: TFHttpSend;
  editGuideInfo: TFHttpSend;
  editTaskInfo: TFHttpSend;

  taskStepDetail: TFHttpSend;
}

export const MODULE_NAME = 'teacherExperiment'