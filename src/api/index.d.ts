import { TDataType } from './../request/fetch.d';
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

export type TAvailableModules = 'classicalAsset' | 'common' | 'statistic' | 'teacherExperimental'