import dataSet from "src/routers/modules/dataSet";
import { TFHttpSend } from "src/typings/getRequest";

export default{
  categoryList:{ url:`/dmc/v1.0/datacategory`,method:'GET'},
  dataSets:{ url:`/dmc/v1.0/datasets`,method:'GET'},
  deleteDataSet:{url:`/dmc/v1.0/dataset?{deleteParam}`,method:'DELETE'},
  dataSetAll:{url:`/api/dataset/all_datasets`,method:'GET'},
  upLoadCover:{url:`/dmc/v1.0/upload_image`,method:'POST',dataType: 'formdata'},
  uploadDoc:{url:`/dmc/v1.0/upload_doc`,method:'POST',dataType: 'formdata'},
}

export interface IDataSet{
  categoryList:TFHttpSend
  dataSets:TFHttpSend
  dataSetAll:TFHttpSend
  upLoadCover:TFHttpSend
  uploadDoc:TFHttpSend
}


export const MODULE_NAME = 'dataSet'