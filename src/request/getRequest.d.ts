import { IBusinessResp, TFRequest } from './fetch.d';
import { DefineComponent, Ref } from 'vue';
import { IApiItem, TAvailableModules } from '../api/index.d'
export type TGetRequest = {
    server: TFRequest;
    nowHandle: DefineComponent | null;
    baseUrl: string;
    v: (context: any) => TGetRequest;
    parseRouter: (moduleName: TAvailableModules, obj: Record<string, any>) => void;
    sendServe: (modulename: TAvailableModules, name: string, init: IApiItem, config: IRequestConfig) => void
} & Record<TAvailableModules, Record<string, any>>;

export interface IRequestConfig {
    bindName?: string;
    concurrent?: false;
    param?: Record<string, any>;
    success?: (resp: IBusinessResp) => void
}