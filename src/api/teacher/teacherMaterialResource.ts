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
  editMyImage:{url:`/api/resource/data/{editId}`,method: "POST",dataType: 'formdata'},
  deleteImages:{url:`/api/resource/data/{editId}`,method: "DELETE",},
  SaveFile:{url:`/api/resource/data/{editId}/files`,method: "POST",dataType: 'json'},
  deleteFile: { url: `/api/resource/data/{editId}/files/{fileId}`, method: "DELETE" },
  downLoadAll: { url: `/api/resource/data/{editId}/files-download`, method: "GET" },


  //  数据集部分单独
  detailed:{url:`/dmc/v1.0/dataset`,method:'GET'},
  getDataFileList:{url:`/dmc/v1.0/datafile`,method:'GET'},
  deleteDataSet:{url:`/dmc/v1.0/dataset?{deleteParam}`,method:'DELETE'},
  editInfo:{url:`/dmc/v1.0/dataset`,method:'PATCH',dataType: 'json'},
  editDoc:{url:`/dmc/v1.0/update_doc`,method:'PATCH',dataType: 'json'},
  download:{url:`/dmc/v1.0/download`,method:'GET'},
  deleteItemFile:{url:`/dmc/v1.0/datafile`,method:'DELETE'},
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
  downLoadAll: TFHttpSend;

  detailed: TFHttpSend;
  getDataFileList: TFHttpSend;
  deleteDataSet: TFHttpSend;
  editInfo: TFHttpSend;
  editDoc: TFHttpSend;
  download: TFHttpSend;
  deleteItemFile: TFHttpSend;
}

export const MODULE_NAME = "teacherMaterialResource";
