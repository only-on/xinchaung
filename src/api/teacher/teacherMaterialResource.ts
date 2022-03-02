import { TFHttpSend } from "src/typings/getRequest";

export default {
  dataSets: { url: `/dmc/v1.0/datasets`, method: "GET" },
};

export interface ITeacherMaterialResource {
  dataSets: TFHttpSend;
}

export const MODULE_NAME = "teacherMaterialResource";
