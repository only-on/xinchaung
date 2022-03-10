import { TFHttpSend } from "src/typings/getRequest";

export default {
  imagesList: { url: `/api/env/images`, method: "GET" },
  imgCopy: { url: `/api/env/images/{imageID}/copy`, method: "POST" },
  deleteImg: { url: `/api/env/images/{imageID}`, method: "DELETE" },
  editMyImage: { url: `/api/env/images/{imageID}`, method: "put" },
  getWorkBenchList: { url: `/api/env/workbenchs`, method: "GET" },
  createWorkbenchApi:{ url: `/api/env/workbenchs`, method: "GET" },
  GenerateImage:{ url: `/api/env/workbenchs/image/{imageID}`, method: "GET" },
  deleteWorkbenchApi: { url: `/api/env/workbenchs/{imageID}`, method: "DELETE" },
  getWorkbenchInfoApi:{ url: `/api/env/workbenchs/info/{imageID}`, method: "GET" },
};

export interface ITeacherImageResourcePool {
  imagesList:TFHttpSend
  imgCopy:TFHttpSend
  editMyImage:TFHttpSend
  getWorkBenchList:TFHttpSend
  createWorkbenchApi:TFHttpSend
  deleteWorkbenchApi:TFHttpSend
}

export const MODULE_NAME = "teacherImageResourcePool";
