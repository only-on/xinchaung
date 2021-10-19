import { TFHttpSend } from './getRequest';
import { TDataType } from './fetch';
import { IForumAps } from 'src/api/modules/studentForum'
import { IStudentCourseAps } from 'src/api/modules/studentCourse'
import { ICommonAps } from 'src/api/modules/common'
import {IPersonalInformationlAps} from 'src/api/modules/personalInformation'
import { IStudentExperimentalAps } from 'src/api/modules/studentExperimental'
import { ITeacherExperimentallAps } from 'src/api/modules/teacherExperimental'
import {IstudentExam} from "src/api/modules/studentExam"
import {IvmApi} from "src/api/modules/vmApi"
import { ICourseTreeApis } from "src/api/modules/courseTree"
import { ITeacherCourseApis } from "src/api/modules/teachCourse"
import { ITeacherCourseAnalysisApis } from "src/api/modules/teacherCourseAnalysis"
import { ITeacherExamlAps } from "src/api/modules/teacherExam"
import { ITeacherAssistantApis } from "src/api/modules/teacherAssistant"
import { ITeacherHome } from "src/api/modules/teacherHome"
import { IClassicalAssetApi } from "../api/modules/classicalAsset";
import { IKnowledgeMap } from 'src/api/modules/knowledgeMap';

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

export type TAvailableModules = 'classicalAsset' | 'common' | 'statistic' | 'studentExperimental' | 'studentForum' | 'studentCourse' | 'personalInformation' | 'teachCourse' | 'courseTree' | 'teacherCourseAnalysis' | 'teacherExperimental' | 'teacherExam' | 'teacherHome'

// API方法类型定义，每次新增api时，需要扩充此interface，按照模块、api的层级来扩充
export interface IApiCollection {
    // 这是api层下的模块名
    classicalAsset: IClassicalAssetApi,
    common: ICommonAps,
    statistic: {
        getInfo: TFHttpSend
    },
    personalInformation:IPersonalInformationlAps,
    studentExperimental: IStudentExperimentalAps,
    studentForum: IForumAps,
    studentCourse:IStudentCourseAps,
    teachCourse: ITeacherCourseApis,
    studentExam:IstudentExam,
    vmApi:IvmApi,
    courseTree: ICourseTreeApis,
    teacherCourseAnalysis: ITeacherCourseAnalysisApis,
    teacherExperimental:ITeacherExperimentallAps
    teacherExam:ITeacherExamlAps
    teacherAssistant:ITeacherAssistantApis
    teacherHome: ITeacherHome
    knowledgeMap: IKnowledgeMap
}
