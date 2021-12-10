import Layout from 'src/views/common/Layout.vue';

export default {
    path: "adminSystemManage",
    name: "adminSystemManage",
    component: Layout,
    meta: {
        title: "系统管理",
        authCode: 'adminTrain'
    },
    children: [
        {
            path: "systemLog",
            name: "",
            component: () => import("src/views/adminSystemManage/systemLog/index.vue"),
            meta: {
                title: "系统日志",
                authCode: ''
            },
        },
        {
            path: "deviceManage",
            name: "",
            component: () => import("src/views/adminSystemManage/deviceManage/index.vue"),
            meta: {
                title: "设备管理",
                authCode: ''
            },
        },
        {
            path: "systemAlarm",
            name: "",
            component: () => import("src/views/adminSystemManage/systemAlarm/index.vue"),
            meta: {
                title: "系统告警",
                authCode: ''
            },
        },
    ]
}
