import { TFHttpSend } from "src/typings/getRequest";

export default {
  getConfigApi: { url: `/api/env/images/config`, method: "GET" },
  imagesList: { url: `/api/env/images`, method: "GET" },
  imgCopy: { url: `/api/env/images/copy/{imageID}`, method: "POST" },
  deleteImg: { url: `/api/env/images/{imageID}`, method: "DELETE" },
  editMyImage: { url: `/api/env/images/{imageID}`, method: "put" },
  getWorkBenchList: { url: `/api/env/workbenchs`, method: "GET" },
  createWorkbenchApi:{ url: `/api/env/workbenchs`, method: "POST" ,dataType: 'json'},
  GenerateImage:{ url: `/api/env/workbenchs/image/{imageID}`, method: "GET" },
  deleteWorkbenchApi: { url: `/api/env/workbenchs/{imageID}`, method: "DELETE" },
  getWorkbenchInfoApi:{ url: `/api/env/workbenchs/info/{imageID}`, method: "GET" },

  createMirrorApi: { url: `/api/env/images`, method: "POST" },
};

export interface ITeacherImageResourcePool {
  getConfigApi:TFHttpSend
  imagesList:TFHttpSend
  imgCopy:TFHttpSend
  editMyImage:TFHttpSend
  getWorkBenchList:TFHttpSend
  createWorkbenchApi:TFHttpSend
  deleteWorkbenchApi:TFHttpSend
}

export const MODULE_NAME = "teacherImageResourcePool";
