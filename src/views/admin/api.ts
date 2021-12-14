import request from "src/api/index";

const adminHomeApi=request.adminHome

/**
 * @description 首页统计
 */
export async function getStatisticsApi() {
    return await adminHomeApi.getStatisticsApi({})
}

/**
 * @description 首页统计
 */
 export async function getNodeIpControlApi(ip:string) {
    return await adminHomeApi.getNodeIpControlApi({param:{ip:ip}})
}

/**
 * @description 获取gpu信息
 */
 export async function getGpuInfoApi() {
    return await adminHomeApi.getGpuInfoApi({})
}