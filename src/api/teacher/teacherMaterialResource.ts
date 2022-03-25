import { TFHttpSend } from "src/typings/getRequest";

export default {
  dataSets: { url: `/api/resource/data`, method: "GET" },
  getTypeList: { url: `/api/category/素材类型/tags`, method: "GET" },
  getLabelsList: { url: `/api/category/素材标签/tags`, method: "GET" },
  create: { url: `/api/resource/data`, method: "POST" ,dataType: 'formdata' },
  getSelectResourceList: { url: `/api/resource/data/select/type/{typeID}`, method: "GET" },
  getMountInfo: { url: `/api/resource/get-mount-info`, method: "GET" },

  // 详情   
  getDetail:{url:`/api/resource/data/{editId}`,method: "GET",},
  getDetailFile:{url:`/api/resource/data/{editId}/files`,method: "GET"},
  editMyImage:{url:`/api/resource/data/{editId}`,method: "PUT",dataType: 'formdata'},
  deleteImages:{url:`/api/resource/data/{editId}`,method: "DELETE",},
  SaveFile:{url:`/api/resource/data/{editId}/files`,method: "POST",dataType: 'json'},
  downLoadFile: { url: `/api/resource/data/files/{fileId}/download`, method: "GET" },
  downLoadAll: { url: `/api/resource/data/{editId}/files-download`, method: "GET" },
};

export interface ITeacherMaterialResource {
  dataSets: TFHttpSend;
  getTypeList: TFHttpSend;
  getLabelsList: TFHttpSend;
  create: TFHttpSend;
  getSelectResourceList: TFHttpSend;
  getMountInfo: TFHttpSend;

  getDetail: TFHttpSend;
  getDetailFile: TFHttpSend;
  editMyImage: TFHttpSend;
  deleteImages: TFHttpSend;
  SaveFile: TFHttpSend;
  downLoadFile: TFHttpSend;
  downLoadAll: TFHttpSend;
}

export const MODULE_NAME = "teacherMaterialResource";
