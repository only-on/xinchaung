import { IBusinessResp } from '../typings/fetch';
import { TAvailableModules, IApiItem } from '../typings/api';
import { IRequestConfig, IHttpClient } from '../typings/getRequest';
import request from "./fetch";
import pupa from 'pupa';
// import qs from 'qs';
// https://stackoverflow.com/questions/28920753/declaring-the-type-of-this-in-a-typescript-function/41358367
// https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
const dev_base_url=import.meta.env.VITE_APP_BASE_API || ''

const GetRequest = function (this: IHttpClient, baseUrl = "") {
  this.server = request;
  this.nowHandle = null;
  this.baseUrl = baseUrl || (dev_base_url as string);
  // this.baseUrl = baseUrl ||'/proxyPrefix'
  // 底下这里需要这么写，否则会提示这个方法缺少一个构造函数签名
  // https://stackoverflow.com/questions/43623461/new-expression-whose-target-lacks-a-construct-signature-in-typescript
} as any as { new(baseUrl: string): IHttpClient }

GetRequest.prototype.v = function (context: any) {
  this.nowHandle = context;
  return this;
};
GetRequest.prototype.parseRouter = function (moduleName: TAvailableModules, obj: Record<string, any>) {
  let moduleFun: Record<string, any> = (this[moduleName] = {});
  Object.keys(obj).forEach((item) => {
    moduleFun[item] = this.sendServe.bind(this, moduleName, item, obj[item]);
    this[moduleName][item].customState = "await";
  });
};

GetRequest.prototype.sendServe = function (
  modulename: TAvailableModules,
  name: string,
  init: IApiItem,
  config: IRequestConfig = {}
): Promise<IBusinessResp | null> {
  const bindName = config.bindName ? config.bindName : ""; // 传组件内的一个引用类型的字段  此字段会被直接赋值为res.data  使用此选项需先在组件内调用 serve.v(this)   // this 为上下文对象或引用值对象
  const concurrent = config.concurrent ? config.concurrent : false; // 相同接口是否需要并发请求
  const param = config.param || {}; //  调用接口需要的参数 格式为param
  const dataType = init.dataType ? init.dataType : "urlencoded"; //  请求接口参数的数据格式   可选JSON   TEXT  FORMDATA
  let url = this.baseUrl + init.url; // 接口地址
  if (config.urlParams) {
    url = pupa(url, config.urlParams)
  }
  const method = init.method; //  请求方式
  const success = config.success ? config.success : ""; //  自定义function 请求成功的回调
  const self = this;
  const defaultFn = function (response: IBusinessResp) {
    if (bindName != "") {
      self.nowHandle[bindName] = response.data;
    } else {
    }
    return response;
  };
  const successFun = success || defaultFn;
  const callback = function (response: IBusinessResp) {
    successFun(response);
    return response;
  };
  if (self[modulename][name].customState === "await" || concurrent) {
    self[modulename][name].customState = "end";
    return request({
      url: url,
      method: method,
      body: param,
      dataType: dataType,
    }).then(callback).finally(()=>{
      self[modulename][name].customState = "await";
    });
  }
  return new Promise((resolve, reject) => { resolve(null) });
};

export default new GetRequest('');
