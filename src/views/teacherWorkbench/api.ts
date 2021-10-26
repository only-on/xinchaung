import request from "src/request/getRequest"

const workbenchApi = request.teacherWorkbench

export type TgetWorkbench = {
    page: Number
    limit: Number
    name: string
    withs: string
}
/**
 * @param params page: 1
                 limit: 12
                 name: 
                 withs: image,flavor,vm,image.classify
 * @description 获取工作台列表
 */
export function getWorkbenchApi(params: TgetWorkbench) {
    return new Promise((resolve: any, reject: any) => {
        workbenchApi.getWorkbenchsApi({ param: params }).then((res) => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * @description 删除工作台
 * @param id:string
 */

export async function deleteWorkbenchApi(id: any) {
    return await workbenchApi.deleteWorkbenchApi({ urlParams: { id: id } })
}

/**
 * @description 开启工作台
 * @param id
 */
export async function openWorkbenchApi(id: any) {
    return await workbenchApi.openWorkbenchApi({ urlParams: { id: id } })
}

/**
 * @description 关闭工作台
 * @param id
 */
export async function closeWorkbenchApi(id: any) {
    return await workbenchApi.closeWorkbenchApi({ urlParams: { id: id } })
}

/**
 * @description 获取工作台虚拟机详情
 * @param id
 */

export async function getWorkbenchInfoApi(id: any) {
    return await workbenchApi.getWorkbenchInfoApi({ urlParams: id })
}

/**
 * @description 获取工作台各个虚拟机状态
 */
export async function getWorkbenchStatusApi() {
    return await workbenchApi.getWorkbenchStatusApi({})
}

/**
 * @description 获取工作过他所以配置
 */
export async function getConfigApi() {
    return await workbenchApi.getConfigApi({})
}


/**
 * @description 创建工作台
 * @param params {"dataset_id":["264f397ec43511ebb6230242ac110005","329f7020c41911eb9e990242ac110005"],
 *                  "image_id":50000,
 *                  "use_gpu":0,
 *                  "flavor":{"cpu":1,"ram":2048,"disk":30},
 *                  "is_permanent":1,
 *                  "start_time":null,
 *                  "end_time":null}
 */

export async function createWorkbenchApi(params: any) {
    return await workbenchApi.createWorkbenchApi({ param: params })
}

/**
 * @description 获取我的镜像列表
 * @param  param name
 *              limit:16
 *              withs:image,config,image.classify
 *               page:1
 */

export async function getMyImageApi(params: any) {
    return await workbenchApi.getMyImageApi({ param: params })
}

/**
 * @description 获取预设镜像列表
 * @param  param name
 *              limit:12
 *              withs:classify
 *              page:1
 *              is_init: 1
 */

export async function getPresetMirror(params: any) {
    return await workbenchApi.getPresetMirror({ param: params })
}


