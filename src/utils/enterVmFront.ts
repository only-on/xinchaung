import request from "src/request/getRequest";

export interface IcreateExamples{
    type:string  // 学习类别：course:课程实验/实训；train:实训
    opType:string  // 操作类型:start/continue/rebuild/test
    taskId:number // 课程实验id/实训id
}
/**
 * 
 * @param params IcreateExamples类型
 * @returns 请求数据
 */

export function createExamples(params:IcreateExamples){
   return request.vmApi.createExamples({param:params})
}
