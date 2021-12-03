import dataSet from "src/routers/modules/dataSet";
import { TFHttpSend } from "src/typings/getRequest";

export default{
  categoryList:{ url:`/dmc/v1.0/datacategory`,method:'GET'},
  dataSets:{ url:`/dmc/v1.0/datasets`,method:'GET'},
  deleteDataSet:{url:`/dmc/v1.0/dataset?{deleteParam}`,method:'DELETE'},
  dataSetAll:{url:`/api/dataset/all_datasets`,method:'GET'},
  upLoadCover:{url:`/dmc/v1.0/upload_image`,method:'POST',dataType: 'formdata'},
  uploadDoc:{url:`/dmc/v1.0/upload_doc`,method:'POST',dataType: 'formdata'},
  create:{url:`/dmc/v1.0/dataset`,method:'POST',dataType: 'json'},
  detailed:{url:`/dmc/v1.0/dataset`,method:'GET'},

  editInfo:{url:`/dmc/v1.0/dataset`,method:'PATCH',dataType: 'json'},
  editDoc:{url:`/dmc/v1.0/update_doc`,method:'PATCH',dataType: 'json'},
  getDataFileList:{url:`/dmc/v1.0/datafile`,method:'GET'},
  deleteFile:{url:`/dmc/v1.0/datafile`,method:'DELETE'},
  download:{url:`/dmc/v1.0/download`,method:'GET'},
  // upload_image:{url:`/dmc/v1.0/upload_image`}
  // 

}

export interface IDataSet{
  categoryList:TFHttpSend
  dataSets:TFHttpSend
  dataSetAll:TFHttpSend
  upLoadCover:TFHttpSend
  uploadDoc:TFHttpSend
  create:TFHttpSend
  detailed:TFHttpSend
  editInfo:TFHttpSend
  editDoc:TFHttpSend
  getDataFileList:TFHttpSend
  deleteFile:TFHttpSend
  download:TFHttpSend
}


export const MODULE_NAME = 'dataSet'