import { TFHttpSend } from "src/typings/getRequest"

// 创建实例
export default {
    /* vnc */
    createExamples: { url: '/api/operate/operates/action', method: 'POST' },
    envirmentsExists: { url: "/api/operate/envirments/exists", method: 'POST' },
    cleanEnvirments: { url: "/api/operate/envirments/clean", method: 'POST' },
    resourceInspect: { url: "/api/operate/envirments/limit", method: 'POST' },
    getVmBaseInfo: { url: "/api/operate/operates/info", method: 'GET' },
    endOperates: { url: "/api/operate/operates/step", method: 'POST' },
    endExperiment: { url: "/api/operate/operates/stop", method: 'POST' },
    recommendExperiment: { url: "/api/operate/operates/action", method: 'POST' },
    operatesHandle: { url: "/api/operate/operates/handle", method: 'POST', dataType: "json" },
    /* webide */
    webideVersionsApi: { url: '/api/operate/crypts/versions', method: 'GET' },
    currentVersionApi: { url: "/api/operate/crypts/currentVersion", method: 'GET' },
    createVersionApi: { url: "/api/operate/crypts/createVersion", method: 'POST' },
    switchVersionApi: { url: "/api/operate/crypts/switchVersion", method: 'POST' },
    deleteVersionApi: { url: "/api/operate/crypts/deleteVersion", method: 'POST' },
    cryptsFilesVersionApi: { url: "/api/operate/crypts/files", method: 'GET' },
    cryptsSaveFileApi: { url: "/api/operate/crypts/saveFile", method: 'POST' },
    cryptsSwitchFileApi: { url: "/api/operate/crypts/switchFile", method: 'POST' },
    runCodeApi: { url: "/api/operate/crypts/run", method: 'POST' },
    taskDetailApi: { url: "/api/operate/crypts/info", method: 'GET' },
    // 实验报告
    experimentalReport: { url: "/report/record/create", method: 'POST' },
    updateTemplateReport: { url: '/report/record/student-update', method: 'POST', dataType: 'formdata' }
}

// 
export interface IvmApi {
    createExamples: TFHttpSend
    envirmentsExists: TFHttpSend
    cleanEnvirments: TFHttpSend
    resourceInspect: TFHttpSend
    getVmBaseInfo: TFHttpSend
    endOperates: TFHttpSend
    endExperiment: TFHttpSend
    recommendExperiment: TFHttpSend
    operatesHandle: TFHttpSend
    webideVersionsApi: TFHttpSend
    currentVersionApi: TFHttpSend
    createVersionApi: TFHttpSend
    switchVersionApi: TFHttpSend
    deleteVersionApi: TFHttpSend
    cryptsFilesVersionApi: TFHttpSend
    cryptsSaveFileApi: TFHttpSend
    cryptsSwitchFileApi: TFHttpSend
    runCodeApi: TFHttpSend
    taskDetailApi: TFHttpSend
    experimentalReport: TFHttpSend
    updateTemplateReport: TFHttpSend
}

export const MODULE_NAME = "vmApi"