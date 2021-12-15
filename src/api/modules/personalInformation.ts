import { TFHttpSend } from "src/typings/getRequest";
export default{
  operationLog:{ url: '/api/system/user-logs', method: 'GET',},
  // /log/index
  // operationLog:{ url: 'log/index', method: 'POST', dataType: "json" },
  resetPassword:{url: `/site/change-password`, method: 'POST', dataType: "json" },
}

export interface IPersonalInformationlAps {
  operationLog:TFHttpSend
  resetPassword: TFHttpSend
}

export const MODULE_NAME = 'personalInformation'