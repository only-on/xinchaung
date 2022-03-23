import { TFHttpSend } from "src/typings/getRequest";

export default {
  dataSets: { url: `/api/resource/data`, method: "GET" },
  getTypeList: { url: `/api/category/素材类型/tags`, method: "GET" },
  getLabelsList: { url: `/api/category/素材标签/tags`, method: "GET" },
  create: { url: `/api/resource/data`, method: "POST" ,dataType: 'formdata' },
  getSelectResourceList: { url: `/api/resource/data/select/type/{typeID}`, method: "GET" },

  // 详情
  getDetail:{url:`/api/resource/data/{editId}`,method: "GET",},
  getDetailFile:{url:`/api/resource/data/{editId}/files`,method: "GET",},
};

export interface ITeacherMaterialResource {
  dataSets: TFHttpSend;
  getTypeList: TFHttpSend;
  getLabelsList: TFHttpSend;
  create: TFHttpSend;
  getSelectResourceList: TFHttpSend;

  getDetail: TFHttpSend;
  getDetailFile: TFHttpSend;
}

export const MODULE_NAME = "teacherMaterialResource";
