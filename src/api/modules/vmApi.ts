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
    switchInterfaceApi:{url:"/api/operate/operates/handle",method: 'POST', dataType: "json"},
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
    deleteVersion: { url: "/api/operate/crypts/deleteVersion", method: 'POST', dataType: 'json'}, // 删除版本

    // 实验报告
    experimentalReport: { url: "/api/yii/report/record/create", method: 'POST' },
    updateTemplateReport: { url: '/api/yii/report/record/student-update', method: 'POST', dataType: 'formdata' },
    updateOnlineTemplateReport: { url: '/api/yii/report/record/student-update', method: 'POST', dataType: 'formdata' },
    // 提交步骤/查看答案
    stepActionApi: { url: "/api/operate/operates/step", method: 'POST' },

    // 课程笔记
    getNoteApi:{url: "/api/yii/student-course/note", method: 'GET'},  //
    saveNoteApi:{url:"/api/yii/student-course/setnote", method: 'POST', dataType: 'json'}, // 课程

    // 实训笔记
    getTrainNoteApi:{url: "/student-train/note", method: 'GET'},  //
    saveTrainNoteApi:{url:"/student-train/savenote", method: 'POST', dataType: 'json'}, // 课程

    // 实训资源列表
    getTrainResourceApi:{url: "/api/service/resources", method: 'get'},

    // 学生提问
    studentQuestionApi:{url:"/api/operate/operates/handle", method: 'POST', dataType: 'json'},

    // 上传实训报告
    uploadTrainReportApi:{url:"/student-train/uploadreport",method:"POST",dataType:"formdata"},

    // 学生自评
    evaluateApi:{url:"/api/operate/operates/handle",method:"POST",dataType:"json"},
     // 随堂测试
    getQuestionListApi:{url:"/api/v1/xinchuang/question/contents/{content_id}/questions",methods:"GET",dataType:"json"},
    getAnswerListApi:{url:"/api/v1/xinchuang/question/contents/{content_id}/questions-with-answer",methods:"GET",dataType:"json"},
    submitAnswerApi:{url:"/api/v1/question/answers",method:"POST",dataType:"json"},
    // 远程协助消息
    getHelpFinfoApi:{ url: '/api/operate/teacherResults/questions', method: 'GET' },
    updateReadStatusApi:{url:"/api/operate/operates/handle",method:"POST",dataType: 'json'},
    // 查询备课环境
    getPrepareEnv: {url: '/api/operate/operates/prepares', method:"POST",dataType: 'json'},
    // 测试ssh服务
    testSSHServe: {url: `/wssh/sniff?hostname={hostname}&port={port}`, method:"POST", dataType: 'json'},
    // 获取webssh连接id
    getWsshId: {url: '/wssh?hostname={hostname}&port={port}', method: 'POST', dataType: 'json'},
}

//
export interface IvmApi {
    getQuestionListApi: TFHttpSend
    submitAnswerApi: TFHttpSend
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
    deleteVersion: TFHttpSend
    experimentalReport: TFHttpSend
    updateTemplateReport: TFHttpSend
    updateOnlineTemplateReport:TFHttpSend
    stepActionApi:TFHttpSend
    getNoteApi:TFHttpSend
    saveNoteApi:TFHttpSend
    getTrainNoteApi:TFHttpSend
    saveTrainNoteApi:TFHttpSend
    getTrainResourceApi:TFHttpSend
    studentQuestionApi:TFHttpSend
    getAnswerListApi:TFHttpSend
    switchInterfaceApi:TFHttpSend
    uploadTrainReportApi:TFHttpSend
    evaluateApi:TFHttpSend
    getHelpFinfoApi:TFHttpSend
    updateReadStatusApi:TFHttpSend
    getPrepareEnv:TFHttpSend
    testSSHServe:TFHttpSend
    getWsshId:TFHttpSend
}

export const MODULE_NAME = "vmApi"
