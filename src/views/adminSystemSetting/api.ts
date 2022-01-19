import request from "src/api/index";

const requestApi=request.adminSystemSetting
/**
 * @description 获取授权信息
 */

async function getAuthorizationInfoApi() {
    return await requestApi.getAuthorizationInfoApi({})
}

/**
 * @description 保存实验课时
 */
async function saveCourseConfigApi(params:FormData) {
    return await requestApi.saveCourseConfigApi({param:params})
}

/**
 * @description 获取系统设置信息
 */
async function getSystemSettingApi() {
    return await requestApi.getSystemSettingApi({})
}

/**
 * @description 生成授权码
 */
async function settingAutoKeyApi() {
    return await requestApi.settingAutoKeyApi({})
}

/**
 * @description 授权
 */
async function saveSettingApi(params:{filename:string,authNumber:string,url:string}) {
    return await requestApi.saveSettingApi({param:params})
}

/**
 * @description 获取系统日志时间配置
 */
async function getSystemLogTimeApi() {
    return await requestApi.getSystemLogTimeApi({})
}

/**
 * @description 保存系统日志
 */
async function saveSystemLogApi(params:{clearTime:number}) {
    return await requestApi.saveSystemLogApi({param:params})
}
/**
 * @description 上传logo
 */
async function uploadLogoImageApi(params:FormData) {
    return await requestApi.uploadLogoImageApi({param:params})
}

/**
 * @description 保存
 */
async function updateSettingSiteApi(params:FormData) {
    return await requestApi.updateSettingSiteApi({param:params})
}

/**
 * @description 获取系统基本信息
 */
async function getSettingSiteApi() {
    return await requestApi.getSettingSiteApi({})
}

/**
 * @description 初始化设置
 */
async function resetSystemSiteApi() {
    return await requestApi.resetSystemSiteApi({})
}

/**
 * @description 磁盘清理
 */
async function getClearDiskDataApi() {
    return await requestApi.getClearDiskDataApi({})
}

/**
 * @description 磁盘清理记录
 */
 async function getClearDiskLogDataApi(params:{page:number,startTime:string,endTime:string}) {
    return await requestApi.getClearDiskLogDataApi({param:params})
}

/**
 * @description 清理磁盘
 */
async function clearSettingDiskApi(params:{host_ip:string,time:string}) {
    return await requestApi.clearSettingDiskApi({param:params})
}
export {
    getAuthorizationInfoApi,
    saveCourseConfigApi,
    getSystemSettingApi,
    settingAutoKeyApi,
    saveSettingApi,
    getSystemLogTimeApi,
    saveSystemLogApi,
    uploadLogoImageApi,
    updateSettingSiteApi,
    getSettingSiteApi,
    resetSystemSiteApi,
    getClearDiskDataApi,
    getClearDiskLogDataApi,
    clearSettingDiskApi
}