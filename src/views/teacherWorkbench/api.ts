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