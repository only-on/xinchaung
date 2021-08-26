import { TFHttpSend } from "src/typings/getRequest";
export default{
  getLatelyExperimentalList:{url:`/student-train/latest`,method: "GET",},
  getMyExperimentalList:{url:`/student-train/my`,method: "GET",}
}

export interface IStudentExperimentalAps {
  getLatelyExperimentalList: TFHttpSend;
  getMyExperimentalList: TFHttpSend;
}

export const MODULE_NAME = 'studentExperimental'