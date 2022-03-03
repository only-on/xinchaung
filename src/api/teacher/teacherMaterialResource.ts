import { TFHttpSend } from "src/typings/getRequest";

export default {
  dataSets: { url: `/dmc/v1.0/datasets`, method: "GET" },
  uploadExplain: {
    url: `/dmc/v1.0/upload_doc`,
    method: "POST",
    dataType: "formdata",
  },
  upLoadCover: {
    url: `/dmc/v1.0/upload_image`,
    method: "POST",
    dataType: "formdata",
  },
};

export interface ITeacherMaterialResource {
  dataSets: TFHttpSend;
  uploadExplain: TFHttpSend;
  upLoadCover: TFHttpSend;
}

export const MODULE_NAME = "teacherMaterialResource";
