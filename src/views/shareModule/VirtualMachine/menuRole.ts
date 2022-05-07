/**
 * @description 权限划分
 * @param type guide 指导
 *             note 笔记
 *             report 报告
 *             question 问答
 *             switchVm 切换虚拟机
 *             delayed 延时
 *             switchSSH  切换SSH
 *             full 全屏
 *             save  保存进度
 *             closeOrStart  开机/关机
 *             reset   重置
 *             upload  上传
 *             down  下载
 *             copy  选中粘贴
 *             record 录屏
 *             share  桌面分享
 *             help  请求老师远程协助
 *             end  结束
 *             tools 工具箱
 */
const menuRole= {
    vnc:{
        4:['guide','note','report','question','switchVm','delayed','switchSSH','full','save','closeOrStart','reset','upload','down','copy','record','share','help','end','tools'],
        3:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','share','end','tools'],
    },
    ssh:{
        4:['guide','note','report','question','switchVm','delayed','switchSSH','full','save','closeOrStart','reset','upload','down','copy','record','share','help','end','tools'],
        3:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','share','end','tools'],
    },
    cmd:{
        4:['guide','note','report','question','switchVm','delayed','switchSSH','full','save','closeOrStart','reset','upload','down','copy','record','share','help','end','tools'],
        3:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','share','end','tools'],
    },
    task:{
        4:['guide','note','report','question','switchVm','delayed','switchSSH','full','save','closeOrStart','reset','upload','down','copy','record','share','help','end','tools'],
        3:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','share','end','tools'],
    },
    webide:{
        4:['guide','note','report','question','delayed','end'],
        3:['guide','question','end'],
    },
    jupyter:{
        4:['guide','note','report','question','delayed','end'],
        3:['guide','question','end'],
    },
    document:{
        4:['guide','note','report','question','end'],
        3:['guide','question','end'],
    },
    video:{
        4:['guide','note','report','question','end'],
        3:['guide','question','end'],
    },
    studyType:{
        test:{
            vnc:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','record','share','end','tools'],
            cmd:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','record','share','end','tools'],
            ssh:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','record','share','end','tools'],
            task:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','record','share','end','tools'],
            webide:['guide','question','end'],
            jupyter:['guide','question','end'],
            document:['guide','question','end'],
            video:['guide','question','end'],
        },
        recommend:{
            vnc:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','share','end','tools'],
            cmd:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','share','end','tools'],
            ssh:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','share','end','tools'],
            task:['guide','question','switchVm','switchSSH','full','closeOrStart','reset','upload','down','copy','share','end','tools'],
            webide:['guide','question','end'],
            jupyter:['guide','question','end'],
            document:['guide','question','end'],
            video:['guide','question','end'],
        }
    }
}
// 实验类型{vnc:VNC,ssh:SSH,cmd:命令行,task:任务制实验,webide:DE实验,jupyter:Jupyter,document:文档,video:视频}
type taskType="vnc"|"ssh"|"cmd"|"task"|"webide"|"jupyter"|"document"|"video"

type studyType="test"|"recommend"

export type menuTypeArr=['guide','note','report','question','switchVm','delayed','switchSSH','full','save','closeOrStart','reset','upload','down','copy','record','share','help','end','tools']

/**
 * @description 获取具有权限的按钮
 * @param role 4学生 3教师
 * @param type 实验类型
 * @param studyType  学习类型 test 练习  recommend  推荐
 */

function getMenuRole(role:4|3,type:taskType,studyType?:studyType) {
    console.log(role,type);
    if ([3,4].includes(role)) {
        if (studyType) {
            return menuRole.studyType[studyType][type]
        }else{
            return menuRole[type][role]
        }
    }else{
        return []
    }
    
}
export default getMenuRole


/**
 * @description 实验类型
 * @param 1:vnc 2:命令行 3:webide   4:jupyter 5:任务制 6:视频 7:文档
 */
export const experimentTypeList = {
    1: { name: 'vnc' },
    2: { name: 'ssh' },
    3: { name: 'webide' },
    4: { name: 'jupyter' },
    5: { name: 'task' },
    6: { name: 'video' },
    7: { name: 'document' },
}