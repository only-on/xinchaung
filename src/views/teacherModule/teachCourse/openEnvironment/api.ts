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
        workbenchApi.getWorkbenchsApi({ param: params }).then((res:any) => {
            resolve(res)
        }).catch((err:any) => {
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

/**
 * @description 创建镜像
 * @param  param name: values.name,
                file_path: this.formData.image.file_path,
                file_size: this.formData.image.file_size,
                classify_id: Number(values.system),
                tag: values.tag,
                description: this.formData.image.description,
                ssh_user: values.userName,
                ssh_pass: values.userPassword,
                is_use_gpu: this.isActiveGPU ? 1 : 0,
 */
export async function createMirrorApi(params: any) {
    return await workbenchApi.createMirrorApi({ param: params })
}
/**
 * @description 删除镜像
 * @param  id
 * 
 * */
export async function deleteMyImageApi(id: any) {
    return await workbenchApi.deleteMyImageApi({ urlParams: { id: id } })
}

/**
 * @description 编辑镜像
 * @param  params 
 * @param id 
 *              name: values.name,
                file_path: this.formData.image.file_path,
                file_size: this.formData.image.file_size,
                classify_id: Number(values.system),
                tag: values.tag,
                description: this.formData.image.description,
                ssh_user: values.userName,
                ssh_pass: values.userPassword,
                is_use_gpu: this.isActiveGPU ? 1 : 0,
 */
export async function editMyImageApi(id: any, params: any) {
    return await workbenchApi.editMyImageApi({ urlParams: id, param: params })
}


/**
 * @description 获取虚拟机详情
 */
export async function getVmBaseInfoApi(params:{id:number}) {
    return await workbenchApi.getVmBaseInfoApi({urlParams:params})
}

/**
 * @description 保存镜像
 */
export async function createImageApi(params:any,urlParams:{id:number}) {
    return await workbenchApi.createImageApi({urlParams:urlParams,param:params})
}

/**
 * @description 停止镜像
 */
export async function stopImageApi(params:{id:number}) {
    return await workbenchApi.stopImageApi({urlParams:params})
}

/**
 * @description 虚拟机文件上传
 */
export async function vmUploadApi(params:{file_path:string},urlParams:{id:number}) {
    return await workbenchApi.vmUploadApi({urlParams:urlParams,param:params})
}

/**
 * @description 延长session
 */
export async function extendSessionApi(params:{num:string}) {
    return await workbenchApi.extendSessionApi({urlParams:params})
}

