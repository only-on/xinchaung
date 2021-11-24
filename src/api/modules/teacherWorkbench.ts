import { TFHttpSend } from "src/typings/getRequest";
export default {
    getWorkbenchsApi: { url: '/api/env/workbenchs', method: 'GET' },
    deleteWorkbenchApi: { url: '/api/env/workbenchs/{id}', method: 'DELETE' },
    closeWorkbenchApi: { url: "/api/env/workbenchs/stop/{id}", method: "POST" },
    openWorkbenchApi: { url: "/api/env/workbenchs/start/{id}", method: "POST" },
    getWorkbenchInfoApi: { url: "/api/env/workbenchs/info/{id}", method: "GET" },
    getWorkbenchStatusApi: { url: "/api/env/workbenchs/vms", method: "GET" },
    getConfigApi: { url: "/api/env/images/config", method: "GET" }, // 获取工作台配置
    getDataSetApi: { url: "/dmc/v1.0/datasets", method: "GET" }, // 获取数据集
    getDatacategoryApi: { url: "/dmc/v1.0/datacategory", method: "GET" }, // 获取数据集类型
    createWorkbenchApi: { url: "/api/env/workbenchs", method: "POST", dataType: "json" },
    getMyImageApi: { url: "/api/env/images", method: "GET" },
    deleteMyImageApi: { url: "/api/env/images/{id}", method: "DELETE" },
    editMyImageApi: { url: "/api/env/images/{id}", method: "PUT", dataType: "json" },
    getPresetMirror: { url: "/api/env/images", method: "GET" },
    createMirrorApi: { url: "/api/env/images", method: "POST", dataType: "json" },
    extendSessionApi:{url:"/api/site/ping?{num}",method: "POST"},
    getVmBaseInfoApi:{url:"/api/env/workbenchs/info/{id}",method: "GET"},
    createImageApi:{url:"/api/env/workbenchs/image/{id}",method: "POST", dataType: "json"},
    stopImageApi:{url:"/api/env/workbenchs/stop/{id}",method: "POST"},
    vmUploadApi:{url:"/api/env/workbenchs/upload/{id}",method: "POST",dataType: "json"},
}

export interface IteacherWorkbench {
    getWorkbenchsApi: TFHttpSend
    deleteWorkbenchApi: TFHttpSend
    closeWorkbenchApi: TFHttpSend
    openWorkbenchApi: TFHttpSend
    getWorkbenchInfoApi: TFHttpSend
    getWorkbenchStatusApi: TFHttpSend
    getConfigApi: TFHttpSend
    getDataSetApi: TFHttpSend
    getDatacategoryApi: TFHttpSend
    createWorkbenchApi: TFHttpSend
    getMyImageApi: TFHttpSend
    deleteMyImageApi: TFHttpSend
    editMyImageApi: TFHttpSend
    getPresetMirror: TFHttpSend
    createMirrorApi: TFHttpSend
    extendSessionApi:TFHttpSend
    getVmBaseInfoApi:TFHttpSend
    createImageApi:TFHttpSend
    stopImageApi:TFHttpSend
    vmUploadApi:TFHttpSend
}