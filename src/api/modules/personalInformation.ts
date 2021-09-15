import { TFHttpSend } from "src/typings/getRequest";
export default{
  journalList:{url:``,method: "GET",},
  saveInformation:{url:``,method:"POST",dataType:'json'}
}

export interface IPersonalInformationlAps {
  journalList: TFHttpSend;
}

export const MODULE_NAME = 'personalInformation'