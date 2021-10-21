import { TFHttpSend } from "src/typings/getRequest";
export default {
    getWorkbenchsApi:{url: '/api/env/workbenchs',method: 'GET'}
}

export interface IteacherWorkbench{
    getWorkbenchsApi: TFHttpSend
}