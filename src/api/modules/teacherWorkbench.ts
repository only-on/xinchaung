import { TFHttpSend } from "src/typings/getRequest";
export default {
    getWorkbenchsApi:{url: '/api/env/workbenchs',method: 'GET'},
    deleteWorkbenchApi:{url: '/api/env/workbenchs/{id}',method: 'DELETE'},
    closeWorkbenchApi:{url:"/api/env/workbenchs/stop/{id}",method:"POST"},
    openWorkbenchApi:{url:"/api/env/workbenchs/start/{id}",method:"POST"},
    getWorkbenchInfoApi:{url:"/api/env/workbenchs/info/{id}",method:"GET"},
    getWorkbenchStatusApi:{url:"/api/env/workbenchs/vms",method:"GET"},
    getConfigApi:{url:"/api/env/images/config",method:"GET"}, // 获取工作台配置
    getDataSetApi:{url:"/dmc/v1.0/datasets",method:"GET"}
}

export interface IteacherWorkbench{
    getWorkbenchsApi: TFHttpSend
    deleteWorkbenchApi:TFHttpSend
    closeWorkbenchApi:TFHttpSend
    openWorkbenchApi:TFHttpSend
    getWorkbenchInfoApi:TFHttpSend
    getWorkbenchStatusApi:TFHttpSend
    getConfigApi:TFHttpSend
    getDataSetApi:TFHttpSend
}