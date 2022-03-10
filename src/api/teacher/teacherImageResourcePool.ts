import { TFHttpSend } from "src/typings/getRequest";

export default {
  imagesList: { url: `/api/env/images`, method: "GET" },
  imgCopy: { url: `/api/env/images/{imageID}/copy`, method: "POST" },
  deleteImg: { url: `/api/env/images/{imageID}`, method: "DELETE" },
  editMyImage: { url: `/api/env/images/{imageID}`, method: "put" },
};

export interface ITeacherImageResourcePool {
  imagesList:TFHttpSend
  imgCopy:TFHttpSend
  editMyImage:TFHttpSend
}

export const MODULE_NAME = "teacherImageResourcePool";
