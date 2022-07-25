import { TAvailableModules } from 'src/typings/api';

import GetRequest from 'src/request/getRequest'
// const MyServer:any=await import ('src/request/getRequest')
// MyServer.default()
const MyServer=new GetRequest('')
const modulesFiles: any = import.meta.globEager("./modules/*.ts")
const teacherFiles: any = import.meta.globEager("./teacher/*.ts")
const studentFiles: any = import.meta.globEager("./student/*.ts")
const adminFiles: any = import.meta.globEager("./admin/*.ts")
const files:any=Object.assign(modulesFiles,teacherFiles,studentFiles,adminFiles)

for (const key in files) {
    let file_name = key.split('/')[2].split('.')[0]
    let moduleFiles = files[key].default
    MyServer.parseRouter(file_name as TAvailableModules, moduleFiles)
}

export default MyServer;

export const RESP_SUCCESS = 1; // 响应成功的状态码
export const RESP_AUTH_FAILURE_0 = 400100; // 登录失效的状态码
export const RESP_AUTH_FAILURE_1 = 400101; // 用户帐号不存在
export const RESP_AUTH_FAILURE_2 = 400102; // 用户账号被禁用
export const RESP_AUTH_FAILURE_3 = 400103; // 助教账号被禁用
export const RESP_AUTH_FAILURE = [400100, 400101, 400102, 400103]

