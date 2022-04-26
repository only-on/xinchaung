import { TFHttpSend } from "./getRequest";
import { TDataType } from "./fetch";
import { ITeacherForum } from "src/api/teacher/teacherForum";
import { ICommonAps } from "src/api/modules/common";
import { IPersonalInformationlAps } from "src/api/modules/personalInformation";
import { ITeacherTrainAps } from "src/api/modules/teacherTrain";
import { IStudentCourse } from "src/api/student/studentCourse";
import { IvmApi } from "src/api/modules/vmApi";
import { ICourseTreeApis } from "src/api/modules/courseTree";
import { ITeacherCourseApis } from "src/api/teacher/teachCourse";
import { ITeacherCourseAnalysisApis } from "src/api/modules/teacherCourseAnalysis";
import { ITeacherExamlAps } from "src/api/modules/teacherExam";
import { ITeacherHome } from "src/api/modules/teacherHome";
import { IClassicalAssetApi } from "../api/modules/classicalAsset";
import { IKnowledgeMap } from "src/api/modules/knowledgeMap";
import { IteacherWorkbench } from "src/api/modules/teacherWorkbench";
import { ITeacherExperAps } from "src/api/modules/teacherExperiment";
import { ITeacherTemplateApis } from "src/api/teacher/teacherTemplate";
import { IDataSet } from "src/api/modules/dataSet";
import { TAdminSystemSetting } from "src/api/modules/adminSystemSetting";
import { IAdminUserManagement } from "src/api/modules/adminUserManagement";
import { IAdminExperimentManage } from "src/api/modules/adminExperimentManage";
import { TAdminCourse } from "src/api/modules/adminCourse";
import { IAdminHome } from "src/api/modules/adminHome";

import { ITeacherExperimentResourcePool } from "src/api/teacher/teacherExperimentResourcePool";
import { ITeacherMaterialResource } from "src/api/teacher/teacherMaterialResource";
import {ITeacherImageResourcePool} from 'src/api/teacher/teacherImageResourcePool'

/**
 * 通用响应类型
 */
export interface ResponseCommon {
  msg: string; // 消息
  status: number; // 状态码
  data: any; // 数据类型，数据类型多种多样，此处以any指代，各api重新定义这里的data
}

export interface IApiItem {
  url: string;
  method: string;
  dataType?: TDataType;
}

export type TAvailableModules =
    'studentCourse'
  | "classicalAsset"
  | "common"
  | "statistic"
  | "teacherForum"
  | "personalInformation"
  | "teachCourse"
  | "courseTree"
  | "teacherCourseAnalysis"
  | "teacherTrain"
  | "teacherExam"
  | "teacherHome"
  | "teacherExperiment"
  | "teacherTemplate"
  | "dataSet"
  | "adminUserManagement"
  | "adminExperimentManage"
  | "teacherExperimentResourcePool"
  | "teacherMaterialResource";

// API方法类型定义，每次新增api时，需要扩充此interface，按照模块、api的层级来扩充
export interface IApiCollection {
  // 这是api层下的模块名
  classicalAsset: IClassicalAssetApi;
  common: ICommonAps;
  personalInformation: IPersonalInformationlAps;
  teacherForum: ITeacherForum;
  teachCourse: ITeacherCourseApis;
  studentCourse: IStudentCourse;
  vmApi: IvmApi;
  courseTree: ICourseTreeApis;
  teacherCourseAnalysis: ITeacherCourseAnalysisApis;
  teacherTrain: ITeacherTrainAps;
  teacherExam: ITeacherExamlAps;
  teacherHome: ITeacherHome;
  knowledgeMap: IKnowledgeMap;
  teacherWorkbench: IteacherWorkbench;
  teacherExperiment: ITeacherExperAps;
  teacherTemplate: ITeacherTemplateApis;
  dataSet: IDataSet;
  adminSystemSetting: TAdminSystemSetting;
  adminUserManagement: IAdminUserManagement;
  adminExperimentManage: IAdminExperimentManage;
  adminCourse: TAdminCourse;
  adminHome: IAdminHome;
  teacherExperimentResourcePool: ITeacherExperimentResourcePool;
  teacherMaterialResource: ITeacherMaterialResource;
  teacherImageResourcePool:ITeacherImageResourcePool
}
