import { TFHttpSend } from "src/typings/getRequest";

export default {
  getTemplateList: { url: `/report/template/mine`, method: "POST" },
};

export interface ITeacherExperimentResourcePool {
  getTemplateList: TFHttpSend;
}

export const MODULE_NAME = "teacherExperimentResourcePool";
