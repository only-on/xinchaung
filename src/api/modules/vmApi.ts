import {TFHttpSend} from "src/typings/getRequest"

// 创建实例
export default{
    createExamples:{url:'/api/operate/operates/action',method:'POST'},
    envirmentsExists:{url:"/api/operate/envirments/exists",method:'POST'},
    cleanEnvirments:{url:"/api/operate/envirments/clean",method:'POST'},
    resourceInspect:{url:"/api/operate/envirments/limit",method:'POST'},
    getVmBaseInfo:{url:"/api/operate/operates/info",method:'GET'},
    endOperates:{url:"/api/operate/operates/step",method:'POST'},
    endExperiment:{url:"/api/operate/operates/stop",method:'POST'}
}

// 
export interface IvmApi{
    createExamples:TFHttpSend
    envirmentsExists:TFHttpSend
    cleanEnvirments:TFHttpSend
    resourceInspect:TFHttpSend
    getVmBaseInfo:TFHttpSend
    endOperates:TFHttpSend
    endExperiment:TFHttpSend
}

export const MODULE_NAME="vmApi"