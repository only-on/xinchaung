import { TFHttpSend } from "src/typings/getRequest";

export default {
  getConfigApi: { url: `/api/env/images/config`, method: "GET"},
  imagesList: { url: `/api/env/images`, method: "GET"},
  imgCopy: { url: `/api/env/images/copy/{imageID}`, method: "POST" },
  deleteImg: { url: `/api/env/images/{imageID}`, method: "DELETE" },
  editMyImage: { url: `/api/env/images/{imageID}`, method: "put" ,dataType: 'json'},
  getWorkBenchList: { url: `/api/env/workbenchs`, method: "GET" },
  createWorkbenchApi:{ url: `/api/env/workbenchs`, method: "POST" ,dataType: 'json'},
  GenerateImage:{ url: `/api/env/workbenchs/image/{imageID}`, method: "POST" ,dataType: 'json'},
  deleteWorkbenchApi: { url: `/api/env/workbenchs/{imageID}`, method: "DELETE" },
  getWorkbenchInfoApi:{ url: `/api/env/workbenchs/info/{imageID}`, method: "GET" },

  createMirrorApi: { url: `/api/env/images`, method: "POST",dataType: 'json' },

  getImgTag:{ url: `/api/category/镜像标签/tags`, method: "GET"},

  getWorkbenchStatusApi: { url: "/api/env/workbenchs/vms", method: "GET" },//获取工作台状态
  openWorkbenchApi: { url: "/api/env/workbenchs/start/{id}", method: "POST" },//开启工作台
};

export interface ITeacherImageResourcePool {
  getConfigApi:TFHttpSend
  imagesList:TFHttpSend
  imgCopy:TFHttpSend
  editMyImage:TFHttpSend
  getWorkBenchList:TFHttpSend
  createWorkbenchApi:TFHttpSend
  deleteWorkbenchApi:TFHttpSend

  getImgTag:TFHttpSend

  getWorkbenchStatusApi:TFHttpSend
  openWorkbenchApi:TFHttpSend
}

export const MODULE_NAME = "teacherImageResourcePool";
