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
    operateRecords:{url:'api/system/setting/log',method:'get'},
    // 2.清理视频
    clearScreen:{url:'api/system/setting/set-video',method:'post',dataType:'json'},
    // 3.清理日志
    clearLog:{url:'api/system/setting/set-log',method:'post',dataType:'json'}
}
export interface IsystemMaintenance{
    systemLogList:TFHttpSend,
    systemPersonalSet: TFHttpSend,
    systemPersonalShow: TFHttpSend,

    operateRecords:TFHttpSend
    clearScreen:TFHttpSend
    clearLog:TFHttpSend
}
export const MODULE_NAME = 'IsystemMaintenance'