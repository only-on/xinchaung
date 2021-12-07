import { TFHttpSend } from "src/typings/getRequest";

export default{
    getAuthorizationInfoApi:{url:"/setting/auto-info",method:"GET"}
}

export interface TAdminSystemSetting{
    getAuthorizationInfoApi:TFHttpSend
}