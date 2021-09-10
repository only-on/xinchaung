import { TFHttpSend } from "src/typings/getRequest";
export default{
  getLatelyExperimentalList:{url:`/student-train/latest`,method: "GET",},
}

export interface ITeacherExperimentallAps {
  getLatelyExperimentalList: TFHttpSend;
}

export const MODULE_NAME = 'teacherExperimental'