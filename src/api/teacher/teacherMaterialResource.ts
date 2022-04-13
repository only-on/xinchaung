import { TFHttpSend } from "src/typings/getRequest";

export default {
  dataSets: { url: `/api/resource/data`, method: "GET" },
  getDatasetsUidList: { url: `/api/resource/datasets`, method: "GET" },
  getTypeList: { url: `/api/category/素材类型/tags`, method: "GET" },
  getLabelsList: { url: `/api/category/素材标签/tags`, method: "GET" },
  create: { url: `/api/resource/data`, method: "POST" ,dataType: 'formdata' },
  getSelectResourceList: { url: `/api/resource/data/select/type/{typeID}`, method: "GET" },
  getMountInfo: { url: `/api/resource/get-mount-info`, method: "GET" },
  createDatasets: { url: `/api/resource/datasets`, method: "POST" ,dataType: 'json' },

  // 详情   
  getDetail:{url:`/api/resource/data/{editId}`,method: "GET",},
  getDetailFile:{url:`/api/resource/data/{editId}/files`,method: "GET"},
  editMyImage:{url:`/api/resource/data/{editId}`,method: "POST",dataType: 'formdata'},
  deleteImages:{url:`/api/resource/data/{editId}`,method: "DELETE",},
  SaveFile:{url:`/api/resource/data/{editId}/files`,method: "POST",dataType: 'json'},
  deleteFile: { url: `/api/resource/data/{editId}/files/{fileId}`, method: "DELETE" },
  downLoadAll: { url: `/api/resource/data/{editId}/files-download`, method: "GET" },
  updateDataset: { url: `/api/resource/datasets/{datasetID}`, method: 'PUT', dataType: 'json'},
  deletDataset: { url: `/api/resource/datasets/{datasetID}`, method: "DELETE" },


  //  数据集部分单独
  detailed:{url:`/dmc/v1.0/dataset`,method:'GET'},
  getDataFileList:{url:`/dmc/v1.0/datafile`,method:'GET'},
  deleteDataSet:{url:`/dmc/v1.0/dataset?{deleteParam}`,method:'DELETE'},
  editInfo:{url:`/dmc/v1.0/dataset`,method:'PATCH',dataType: 'json'},
  editDoc:{url:`/dmc/v1.0/update_doc`,method:'PATCH',dataType: 'json'},
  download:{url:`/dmc/v1.0/download`,method:'GET'},
  deleteItemFile:{url:`/dmc/v1.0/datafile`,method:'DELETE'},
  // toPublic:{url:`/dmc/v1.0/to/public`,method:'POST',dataType: 'json'},
  // toPrivate:{url:`/dmc/v1.0/to/private`,method:'POST',dataType: 'json'},
  getDataSetsList: { url: `/dmc/v1.0/dataset_lists`, method: 'POST', dataType: 'json' }
};

export interface ITeacherMaterialResource {
  dataSets: TFHttpSend;
  getDatasetsUidList: TFHttpSend;
  getTypeList: TFHttpSend;
  getLabelsList: TFHttpSend;
  create: TFHttpSend;
  getSelectResourceList: TFHttpSend;
  getMountInfo: TFHttpSend;
  createDatasets: TFHttpSend;

  getDetail: TFHttpSend;
  getDetailFile: TFHttpSend;
  editMyImage: TFHttpSend;
  deleteImages: TFHttpSend;
  SaveFile: TFHttpSend;
  downLoadAll: TFHttpSend;
  updateDataset: TFHttpSend;
  deletDataset: TFHttpSend;

  detailed: TFHttpSend;
  getDataFileList: TFHttpSend;
  deleteDataSet: TFHttpSend;
  editInfo: TFHttpSend;
  editDoc: TFHttpSend;
  download: TFHttpSend;
  deleteItemFile: TFHttpSend;
  // toPublic: TFHttpSend;
  // toPrivate: TFHttpSend;
  getDataSetsList: TFHttpSend;
}

export const MODULE_NAME = "teacherMaterialResource";
