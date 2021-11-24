import { TFHttpSend } from "src/typings/getRequest";

export default{
  categoryList:{ url:`/dmc/v1.0/datacategory`,method:'GET'},
  datasets:{ url:`/dmc/v1.0/datasets`,method:'GET'}
}

export interface IDataSet{
  categoryList:TFHttpSend
  datasets:TFHttpSend
}


export const MODULE_NAME = 'dataSet'