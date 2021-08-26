import { TFHttpSend } from './getRequest';
import { TDataType } from './fetch';
import { IForumAps } from 'src/api/modules/forum'
import { IStudentCourseAps } from 'src/api/modules/studentCourse'
import { IStudentExperimentalAps } from 'src/api/modules/studentExperimental'
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

export type TAvailableModules = 'classicalAsset' | 'common' | 'statistic' | 'studentExperimental' | 'forum' | 'studentCourse'

// API方法类型定义，每次新增api时，需要扩充此interface，按照模块、api的层级来扩充
export interface IApiCollection {
    // 这是api层下的模块名
    classicalAsset: {
        // 这是具体的api名
        datasetList: TFHttpSend,
        fakeRequest: TFHttpSend,
        fakeRequestNoUrlParam: TFHttpSend
    },
    common: {
        getMenu: TFHttpSend
    },
    statistic: {
        getInfo: TFHttpSend
    },
    studentExperimental: IStudentExperimentalAps,
    forum: IForumAps,
    studentCourse:IStudentCourseAps,
    teachCourse: {
        getPre: TFHttpSend,
        vmOpen: TFHttpSend,
        vmClose: TFHttpSend,
        vmRevert: TFHttpSend,
        vmReset: TFHttpSend,
        preLimit: TFHttpSend,
        saveTopoinst: TFHttpSend,
        getTreeList: TFHttpSend,
    },
}