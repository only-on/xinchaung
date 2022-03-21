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

  // 详情
  getDetail:{url:`/api/resource/data/{editId}`,method: "GET",},
  getDetailFile:{url:`/api/resource/data/{editId}/files`,method: "GET",},
};

export interface ITeacherMaterialResource {
  dataSets: TFHttpSend;
  uploadExplain: TFHttpSend;
  upLoadCover: TFHttpSend;

  getDetail: TFHttpSend;
  getDetailFile: TFHttpSend;
}

export const MODULE_NAME = "teacherMaterialResource";
