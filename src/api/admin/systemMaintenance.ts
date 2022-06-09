import { TFHttpSend } from "src/typings/getRequest";
export default{
    //用户登录信息
    systemLogList:{url:`/api/system/user-logs`,method:'get'},
    // 个性化设置
    systemPersonalSet: {url:`/api/system/setting/set`,method:'post'},
    // 获取个性化设置
    systemPersonalShow: {url:`/api/system/setting/show`,method:'get'},
    
    
    //磁盘管理
    // 1.操作记录
    operateRecords:{url:'/api/system/setting/log',method:'get'},
    // 2.自动清理视频
    clearScreen:{url:'/api/system/setting/set-video',method:'post',dataType:'json'},
    // 3.自动清理日志
    clearLog:{url:'/api/system/setting/set-log',method:'post',dataType:'json'},
     // 4.手动清理视频
    handclearScreen:{url:'/api/system/setting/clear-video',method:'post',dataType:'json'},
     // 5.手动清理日志
    handclearLog:{url:'/api/system/setting/clear-log',method:'post',dataType:'json'},
    //6.获取清除日志设置的天数
    dayOfsetLog:{url:'/api/system/setting/log-set',method:'GET',dataType:'json'},
    //7.获取清除录屏设置的天数
    dayOfsetVideo:{url:'/api/system/setting/video-set',method:'GET',dataType:'json'},
    //生成授权码
    settingAutoKeyApi: { url: "/api/system/auth/auth-key", method: "POST" },
    // 授权
    saveSettingApi: { url: "/api/system/auth/save-auth", method: "POST", dataType: 'json' },
    // 授权列表
    powerList:{url: "/api/system/auth/auth-info", method: "GET", dataType: 'json' },
}
export interface IsystemMaintenance{
    systemLogList:TFHttpSend,
    systemPersonalSet: TFHttpSend,
    systemPersonalShow: TFHttpSend,

    operateRecords:TFHttpSend
    clearScreen:TFHttpSend
    clearLog:TFHttpSend
    handclearScreen:TFHttpSend
    handclearLog:TFHttpSend
    settingAutoKeyApi:TFHttpSend
    saveSettingApi:TFHttpSend
}
export const MODULE_NAME = 'IsystemMaintenance'