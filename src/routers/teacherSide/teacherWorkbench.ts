import Layout from 'src/views/common/Layout.vue';

export default {
    path: "Workbench",
    component: Layout,
    name:'workbench',
    meta: {
        title: "工作台",
        authCode: 'Workbench'
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherModule/teacherWorkbench/index.vue"),
            meta: {
                title: "工作台",
                authCode: 'workbench'
            },
        },
        {
            path: "createWorkbench",
            component: () => import("src/views/teacherModule/teacherWorkbench/createWorkbench/index.vue"),
            meta: {
                title: "创建工作台",
                authCode: 'createWorkbench'
            },
        },
        {
            path: "createImage",
            component: () => import("src/views/teacherModule/teacherWorkbench/createImage/index.vue"),
            meta: {
                title: "创建镜像",
                authCode: 'createImage'
            },
        },
        {
            path: "open-vnc",
            component: () => import("src/views/teacherModule/teacherWorkbench/openEnvironment/openVnc.vue"),
            meta: {
                title: "工作台镜像",
                authCode: 'open-vnc'
            },
        },
        {
            path: "open-jupyte",
            component: () => import("src/views/teacherModule/teacherWorkbench/openEnvironment/openJupyte.vue"),
            meta: {
                title: "工作台镜像",
                authCode: 'open-jupyte'
            },
        },
    ]
}