import { resolve } from 'path';
import { type } from "os";
import request from "src/request/getRequest";
import { message, Modal } from "ant-design-vue";
const vmApi = request.vmApi

export type TStudyType = 'course' | 'train' // 学习类别：course:课程实验/实训；train:实训
export type TopType = 'start' | 'continue' | 'rebuild' | 'test' | 'prepare' // 操作类型:start/continue/rebuild/test/prepare


export interface IEnvirmentsParam {
  type: TStudyType
  opType: TopType
  taskId: any
}

export interface IStopOperatesParam extends IEnvirmentsParam{
  action: string
  topoinst_id: string
}

console.log(vmApi);
/**
 * @description 检查创建环境
 * @param params 
 */
function openVm(params: IEnvirmentsParam) {
  return new Promise(async (resolve: any, reject: any) => {
    envirmentsInspect(params).then((result: any) => {
      if (result.status === 1) {
        resourceInspect().then(() => {
          createExamples(params).then((res) => {
            resolve({data:res,query:{
              opType:params.opType,
              type:params.type,
              taskId:params.taskId,
            }});
          })
        })
      } else {
        if (result.msg.topoinst_id) {
          const modal = Modal.confirm({
            title: "是否清除多余的环境",
            cancelText: "取消",
            okText: "确定",
            onOk() {
              try {
                cleanEnvirments(result.msg.topoinst_id).then(() => {
                  resourceInspect().then(() => {
                    createExamples(params).then((res) => {
                      resolve(res);
                    })
                  })
                })
              } catch (error) {
                console.log(error);
              }


            },
            onCancel() {
              console.log("关闭");
              modal.destroy()
            }
          })

        }
      }

    }).catch(err => {
      console.log(err);

    })
  })

}

/**
 * @description 检查环境
 * @param IEnvirmentsParam
 */
function envirmentsInspect(params: IEnvirmentsParam) {
  return new Promise((resolve: any, reject: any) => {
    vmApi.envirmentsExists({ param: params }).then((res: any) => {
      console.log(res);

      if (res.status === 1) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      if (res.status === 0) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  })
}

/**
 * @description 清理多余环境
 * @param params topoinst_id
 */
function cleanEnvirments(topoinst_id: string) {
  return new Promise((resolve: any, reject: any) => {
    vmApi.cleanEnvirments({ param: { topoinst_id } }).then((res: any) => {
      console.log(res);

      if (res.status === 1) {
        resolve(res)
        // resourceInspect(params)
      } else {
        message.warn(res.msg)
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * @description 资源池检查
 * @param params topoinst_id
 */
function resourceInspect() {
  return new Promise((resolve: any, reject: any) => {
    vmApi.resourceInspect({}).then((res: any) => {

      if (res.status === 1) {
        // createExamples(params)
        resolve(res)
      } else {
        message.warn(res.msg)
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * @description 创建实例
 * @param params IEnvirmentsParam
 */
function createExamples(params: IEnvirmentsParam) {
  return new Promise((resolve: any, reject: any) => {
    vmApi.createExamples({ param: params }).then((res: any) => {
      console.log(res);

      if (res.status === 1) {
        resolve(res)
      } else {
        message.warn(res.msg)
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * @description 获取虚机页面加载的当前实验/实训的详情，以及相关的学习记录
 * @param params 
 */
function getVmBaseInfo(params: IEnvirmentsParam) {
    return new Promise((resolve:any,reject:any)=>{
      vmApi.getVmBaseInfo({param:params}).then(res=>{
        resolve(res)
      }).catch(err=>{
        reject(err)
      })
    })
}

/**
 * @description 结束脚本入口
 * @param params 
 */
 function endOperates(params: IStopOperatesParam) {
  return new Promise((resolve:any,reject:any)=>{
    vmApi.endOperates({param:params}).then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}

/**
 * @description 学生结束实验/实训
 * @param params 
 */
 function endEnvirment(params: IEnvirmentsParam) {
  return new Promise((resolve:any,reject:any)=>{
    vmApi.endEnvirment({param:params}).then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}
export {
  openVm,
  getVmBaseInfo,
  endOperates,
  endEnvirment
}

