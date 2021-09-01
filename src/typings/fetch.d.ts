export type IMimeMap = Record<TMimeTypes, string[]>
export type TMimeTypes = 'blob' | 'json' | 'arrayBuffer' | 'text'
export type TDataType = 'urlencoded' | 'json' | 'text' | 'formdata'
export type THttpHeaders = HeadersInit & {
    "Cache-Control": RequestCache;
    "Content-Type"?: string;
    'Authorization': string;
}
export type TFRequest = (params: IRequestParams) => Promise<IBusinessResp>;

export interface IRequestParams {
    url: string;
    method: string;
    dataType: TDataType;
    body: string | Record<string, string>;
    headers?: HeadersInit;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    mode?: RequestMode;
    timeout?: number;
}
/**
 * 业务响应结构
 */
export interface IBusinessResp {
    status: number;
    msg: string;
    data: any;
    error:any;
    code: number;
    message: string;
}