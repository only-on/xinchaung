import { TFHttpSend } from "./getRequest";
import { TDataType } from "./fetch";
import { IvmApi } from "src/api/modules/vmApi";
import { IKnowledgeMap } from "src/api/modules/knowledgeMap";
import { IteacherWorkbench } from "src/api/modules/teacherWorkbench";
import { ITeacherTemplateApis } from "src/api/teacher/teacherTemplate";
import { ITeacherForum } from "src/api/teacher/teacherForum";
import { ITeacherHome } from "src/api/teacher/teacherHome";
import { ICommonAps } from "src/api/modules/common";
import { ITeacherCourseApis } from "src/api/teacher/teachCourse";
import { IStudentCourse } from "src/api/student/studentCourse";
import { ITeachingResourceManagement } from "src/api/admin/TeachingResourceManagement";
import { IStudentAssignment } from "src/api/student/studentAssignment";
import { IStudentExamination } from "src/api/student/studentExamination";

import { ITeacherExperimentResourcePool } from "src/api/teacher/teacherExperimentResourcePool";
import { ITeacherMaterialResource } from "src/api/teacher/teacherMaterialResource";
import {ITeacherImageResourcePool} from 'src/api/teacher/teacherImageResourcePool';
import { ITeachingQuality } from "src/api/teacher/teachingQuality" ;
   
import { IQuestionBank } from "src/api/teacher/QuestionBank" ;
import { ITeacherAssignment } from "src/api/teacher/teacherAssignment" ;
import { ITeacherExamination } from "src/api/teacher/teacherExamination" ;
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
  | "teacherExperimentResourcePool"
  | "teacherMaterialResource";

// API方法类型定义，每次新增api时，需要扩充此interface，按照模块、api的层级来扩充
export interface IApiCollection {
  // 这是api层下的模块名
  teacherHome: ITeacherHome;
  knowledgeMap: IKnowledgeMap;
  teacherTemplate: ITeacherTemplateApis;
  teacherWorkbench: IteacherWorkbench;
  vmApi: IvmApi;
  common: ICommonAps;
  teacherForum: ITeacherForum;
  teachCourse: ITeacherCourseApis;
  studentCourse: IStudentCourse;
  studentAssignment:IStudentAssignment;
  studentExamination:IStudentExamination; 

  teacherExperimentResourcePool: ITeacherExperimentResourcePool;
  teacherMaterialResource: ITeacherMaterialResource;
  teacherImageResourcePool:ITeacherImageResourcePool;
  QuestionBank:IQuestionBank;
  teacherAssignment:ITeacherAssignment;


  TeachingResourceManagement:ITeachingResourceManagement;
  teachingQuality: ITeachingQuality
}
