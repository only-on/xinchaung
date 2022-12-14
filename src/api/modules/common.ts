export interface MenuItem {
    name: string;
    url: Array<string | null>;
    options?: {
        class: string
    };
    icon?: string;
    active?: boolean;
    children?: MenuItem[]

}
export interface FakeMenu {
    msg: string;
    status: number;
    data: MenuItem[]
}
import { TFHttpSend } from "src/typings/getRequest";
export default {
    getMenu: { url: '/api/system/menus', method: 'GET'},
    login: { url: `/api/yii/site/jwt-login`, method: "POST", dataType: "json" },
    loginOut:{url:`/api/yii/site/logout1`,method:'POST',},
    uploadsFile:{url:`/api/instance/uploads/file`,method:'POST',dataType: "formdata"},       // 公用文件上传
     // 镜像全部配置项
    getConfigs: {url: `/api/env/images/config`, method: 'GET'},
    // 镜像列表
    getMeImage: {url: `/api/env/images`, method: 'GET'},
    // 是否需要验证码
    doesNeedCaptcha: { url: `/api/yii/site/does-need-captcha`, method: 'GET' },
    // 刷新验证码
    refreshCaptcha: { url: `/api/yii/site/captcha`, method: 'GET'},
    // 获取在线用户信息
    onlineUserInfo: { url: `/api/yii/site/online-info`, method: 'GET'},
    // 检查当前用户是否已登录
    doesLoggedIn: { url: `/api/common/does-logged-in`, method: 'GET' },
    //  获取公共配置
    getFileConfig:{ url: `/api/config/public-config`, method: "GET"},
    //   修改密码
    resetPassword:{url: `/api/yii/site/change-password`, method: 'POST', dataType: "json"},
    // 学生端修改密码
    stuResetPassword:{url: `/api/user/update-pwd`, method: 'POST', dataType: "json"},
    operationLog:{ url: '/api/system/user-logs', method: 'GET',},
    // 获取教师信息
    getTeacherInfo: {url: '/api/yii/site/teacher-info', method: 'GET'},

}
export interface ICommonAps {
    getFileConfig:TFHttpSend
    getMenu: TFHttpSend
    loginOut: TFHttpSend
    uploadsFile: TFHttpSend
    getConfigs: TFHttpSend
    getMeImage: TFHttpSend
    login: TFHttpSend
    doesNeedCaptcha: TFHttpSend
    refreshCaptcha: TFHttpSend
    onlineUserInfo: TFHttpSend
    doesLoggedIn: TFHttpSend
    resetPassword: TFHttpSend
    operationLog:TFHttpSend
    getTeacherInfo: TFHttpSend
}
export const FakeMenu = {
    msg: "success",
    status: 1,
    data: [
        {
            label: "数据",
            url: [null],
            options: { class: "menu-first-li menu-data" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "数据集",
                    url: ["/vue/dataset/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: false,
        },
        {
            label: "监控",
            url: [null],
            options: { class: "menu-first-li menu-system" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "系统状态",
                    url: ["/env/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "设备管理",
                    url: ["/env/equipment"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "系统日志",
                    url: ["/log/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "系统告警",
                    url: ["/env/warn"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "系统设置",
                    url: ["/setting/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: true,
        },
        {
            label: "用户",
            url: [null],
            options: { class: "menu-first-li menu-user" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "教师管理",
                    url: ["/teacher/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "学生管理",
                    url: ["/student/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "助教管理",
                    url: ["/assistant/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "班级管理",
                    url: ["/classes/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: false,
        },
        {
            label: "课程",
            url: ["/manage-course/index"],
            options: { class: "menu-first-li menu-course" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "课程管理",
                    url: ["/manage-course/manage-teacher-info"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "排课",
                    url: ["/vue/timetable-set/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "课程方向管理",
                    url: ["/manage-course/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "职业方向管理",
                    url: ["/manage-course/direction"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: false,
        },
        {
            label: "实训",
            url: [null],
            options: { class: "menu-first-li menu-train" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "实训信息管理",
                    url: ["/manage-train/manage-teacher-train"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: false,
        },
        {
            label: "实验",
            url: [null],
            options: { class: "menu-first-li menu-content" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "全部实验管理",
                    url: ["/content-manage/teacher-content"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "实验模板管理",
                    url: ["/vue/report/init#/list"],
                    options: { anchor: "#/list" },
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "技术方向管理",
                    url: ["/content-direction/manage"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: false,
        },
        {
            label: "环境",
            url: [null],
            options: { class: "menu-first-li menu-env" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "镜像管理",
                    url: ["/image/index-admin"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: false,
        },
        {
            label: "论坛",
            url: [null],
            options: { class: "menu-first-li menu-forum" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "帖子管理",
                    url: ["/forums/index"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "公共论坛",
                    url: ["/forums/common"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "我的帖子",
                    url: ["/forums/myself"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "发帖",
                    url: ["/forums/create"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: false,
        },
        {
            label: "开发",
            url: [null],
            options: { class: "menu-first-li menu-dev" },
            icon: "fa fa-circle-o",
            items: [
                {
                    label: "国际化",
                    url: ["/#/dev"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "菜单",
                    url: ["/#/dev/menu"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "登录",
                    url: ["/#/dev/login"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "webmsg",
                    url: ["/#/dev/webmsg"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "markdown",
                    url: ["/#/dev/markdown"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "editormd",
                    url: ["/#/dev/editormd"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
                {
                    label: "quill",
                    url: ["/#/dev/quill"],
                    icon: "fa fa-circle-o",
                    active: false,
                },
            ],
            active: false,
        },
    ],
};
