import { IApiCollection } from './api'
import { IBusinessResp, TFRequest } from './fetch';
import { DefineComponent, Ref } from 'vue';
import { IApiItem, TAvailableModules } from './api'
export interface IHttpClient extends IApiCollection {
    server: TFRequest;
    nowHandle: DefineComponent | null;
    baseUrl: string;
    v: (context: any) => IHttpClient;
    parseRouter: (moduleName: TAvailableModules, obj: Record<string, any>) => void;
    sendServe: (modulename: TAvailableModules, name: string, init: IApiItem, config: IRequestConfig) => void
}

// 发送http请求的方法
export type TFHttpSend = (config?: IRequestConfig) => Promise<IBusinessResp | null>

export interface IRequestConfig {
    bindName?: string;
    concurrent?: false;
    param?: Record<string, any>;
    urlParams?: object;
    success?: (resp: IBusinessResp) => void;
    silent?: boolean;
    baseUrl?: string; // 部分服务比较特殊，经过代理后会有问题，因此给这些服务开辟专用通路，一般情况下，不能使用这个参数
}
