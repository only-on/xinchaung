export interface MenuItem {
    label: string;
    url: Array<string | null>;
    options?: {
        class: string
    };
    icon?: string;
    active: boolean;
    items?: MenuItem[]

}
export interface FakeMenu {
    msg: string;
    status: number;
    data: MenuItem[]
}

export default {
    getMenu: { url: '/api/site/menu', method: 'GET', dataType: "JSON" },
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
    ],
};