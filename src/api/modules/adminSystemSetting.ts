import { TFHttpSend } from "src/typings/getRequest";

export default {
    getAuthorizationInfoApi: { url: "/setting/auto-info", method: "GET" },
    saveCourseConfigApi: { url: "/setting/save-course-config", method: "POST", dataType: 'formdata' },
    getSystemSettingApi: { url: "/setting/system-set", method: "POST" },
    settingAutoKeyApi: { url: "/setting/auto-key", method: "POST" },
    saveSettingApi: { url: "/setting/save-auto", method: "POST", dataType: 'json' },
    getSystemLogTimeApi: { url: "/setting/get-system-log", method: "GET" },
    saveSystemLogApi: { url: "/setting/save-system-log", method: "GET" },
    uploadLogoImageApi: { url: "/setting/upload-site-logo", method: "POST", dataType: 'formdata' },
    updateSettingSiteApi: { url: "/setting/update-site", method: "POST", dataType: 'formdata' },
    getSettingSiteApi: { url: "/setting/index", method: "GET" },
    resetSystemSiteApi: { url: "/setting/reset-site", method: "POST" },
    getClearDiskDataApi:{url:"/setting/clear-disk-list",method: "GET"},
    getClearDiskLogDataApi:{url:"/setting/disk-clear-log-list",method: "GET"},
    clearSettingDiskApi:{url:"/setting/cleat-disk",method: "POST", dataType: 'json'}
}

export interface TAdminSystemSetting {
    getAuthorizationInfoApi: TFHttpSend
    saveCourseConfigApi: TFHttpSend
    getSystemSettingApi: TFHttpSend
    settingAutoKeyApi: TFHttpSend
    saveSettingApi: TFHttpSend
    getSystemLogTimeApi: TFHttpSend
    saveSystemLogApi: TFHttpSend
    uploadLogoImageApi: TFHttpSend
    updateSettingSiteApi: TFHttpSend
    getSettingSiteApi: TFHttpSend
    resetSystemSiteApi: TFHttpSend
    getClearDiskDataApi:TFHttpSend
    getClearDiskLogDataApi:TFHttpSend
    clearSettingDiskApi:TFHttpSend
}