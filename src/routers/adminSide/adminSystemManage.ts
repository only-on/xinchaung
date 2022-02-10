import Layout from 'src/views/common/Layout.vue';

export default {
    path: "adminSystemManage",
    name: "adminSystemManage",
    component: Layout,
    meta: {
        title: "监控",
        authCode: 'adminTrain',
        showInBreadcrumb: false,
    },
    children: [
        {
            path: "systemLog",
            name: "",
            // component: () => import("src/views/adminModule/adminSystemManage/systemLog/index.vue"),
            component: () => import("src/views/shareModule/personalInformation/OperationList.vue"),
            meta: {
                // title: "系统日志",
                title:`监控${'\xa0\xa0'}/${'\xa0\xa0'}系统日志`,
                authCode: ''
            },
        },
        {
            path: "deviceManage",
            name: "",
            component: () => import("src/views/adminModule/adminSystemManage/deviceManage/index.vue"),
            meta: {
                // title: "设备管理",
                title:`监控${'\xa0\xa0'}/${'\xa0\xa0'}设备管理`,
                authCode: ''
            },
        },
        {
            path: "systemAlarm",
            name: "",
            component: () => import("src/views/adminModule/adminSystemManage/systemAlarm/index.vue"),
            meta: {
                // title: "系统告警",
                title:`监控${'\xa0\xa0'}/${'\xa0\xa0'}系统告警`,
                authCode: ''
            },
        },
    ]
}
