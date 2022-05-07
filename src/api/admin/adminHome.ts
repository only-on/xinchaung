import { TFHttpSend } from "src/typings/getRequest";
export default{
   statisData:{url:`/api/system/admin/index`,method:'get'},
}
export interface IadminHome{
    statisData:TFHttpSend
}
export const MODULE_NAME = 'adminHome'