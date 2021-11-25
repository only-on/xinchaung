import dataSet from "src/routers/modules/dataSet";
import { TFHttpSend } from "src/typings/getRequest";

export default{
  categoryList:{ url:`/dmc/v1.0/datacategory`,method:'GET'},
  dataSets:{ url:`/dmc/v1.0/datasets`,method:'GET'},
  deleteDataSet:{url:`/dmc/v1.0/dataset?{deleteParam}`,method:'DELETE'},
  dataSetAll:{url:`/api/dataset/all_datasets`,method:'GET'}
}

export interface IDataSet{
  categoryList:TFHttpSend
  dataSets:TFHttpSend
  dataSetAll:TFHttpSend
}


export const MODULE_NAME = 'dataSet'