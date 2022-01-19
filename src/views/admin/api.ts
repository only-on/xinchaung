import request from "src/api/index";

const adminHomeApi = request.adminHome

/**
 * @description 首页统计
 */
export async function getStatisticsApi() {
    return await adminHomeApi.getStatisticsApi({})
}

/**
 * @description 首页统计
 */
export async function getNodeIpControlApi(ip: string) {
    return await adminHomeApi.getNodeIpControlApi({ param: { ip: ip } })
}

/**
 * @description 获取gpu信息
 */
export async function getGpuInfoApi() {
    return await adminHomeApi.getGpuInfoApi({})
}

/**
 * @description 获取单个折线图
 * @param type	是	string	day = 天，week = 周，hour = 小时
kind	是	string	master = 控制节点，slave = 计算节点
ip	是	string	当前节点的ip
 */
export async function getNodeGraphApi(params: FormData) {
    return await adminHomeApi.getNodeGraphApi({ param: params })
}

/**
 * @description 获取所有折线图
 */
export async function getNodeGraphAllApi() {
    return await adminHomeApi.getNodeGraphAllApi({})
}