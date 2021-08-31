import {TFHttpSend} from "src/typings/getRequest"

export default{
    createExamples:{url:'/api/operate/operates/action',method:'POST'},
}

export interface IvmApi{
    createExamples:TFHttpSend
}

export const MODULE_NAME="vmApi"