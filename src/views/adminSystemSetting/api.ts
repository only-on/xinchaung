import request from "src/api/index";

/**
 * @description 获取授权信息
 */

async function getAuthorizationInfoApi() {
    return await request.adminSystemSetting.getAuthorizationInfoApi({})
}

export {
    getAuthorizationInfoApi
}