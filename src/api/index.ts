import { IHttpClient } from '../typings/getRequest';
import { TAvailableModules } from '../typings/api';
// import  request  from "../utils/fetch.js";
// //   预设了四中数据格式  URLENCODED(默认)    JSON   TEXT  FORMDATA

import MyServer from '../request/getRequest'

const files: any = import.meta.globEager("./modules/*.ts")
for (const key in files) {
    let file_name = key.split('/')[2].split('.')[0]
    let moduleFiles = files[key].default
    MyServer.parseRouter(file_name as TAvailableModules, moduleFiles)
}

export default MyServer;

export const RESP_SUCCESS = 1; // 响应成功的状态码
export const RESP_AUTH_FAILURE = 3003; // 认证失败的状态码

