import { TFHttpSend } from "src/typings/getRequest";

export default{
  categoryList:{ url:`/dmc/v1.0/datacategory`,method:'GET'}
}

export interface IDataSet{
  categoryList:TFHttpSend
}


export const MODULE_NAME = 'dataSet'