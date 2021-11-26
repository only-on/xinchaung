import Layout from 'src/views/common/Layout.vue';

export default {
    path: "Workbench",
    component: Layout,
    meta: {
        title: "工作台",
        authCode: 'Workbench'
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherWorkbench/index.vue"),
            meta: {
                title: "工作台",
                authCode: 'workbench'
            },
        },
        {
            path: "createWorkbench",
            component: () => import("src/views/teacherWorkbench/createWorkbench/index.vue"),
            meta: {
                title: "创建工作台",
                authCode: 'createWorkbench'
            },
        },
        {
            path: "createImage",
            component: () => import("src/views/teacherWorkbench/createImage/index.vue"),
            meta: {
                title: "创建镜像",
                authCode: 'createImage'
            },
        },
        {
            path: "open-vnc",
            component: () => import("src/views/teacherWorkbench/openEnvironment/openVnc.vue"),
            meta: {
                title: "工作台镜像",
                authCode: 'open-vnc'
            },
        },
        {
            path: "open-jupyte",
            component: () => import("src/views/teacherWorkbench/openEnvironment/openJupyte.vue"),
            meta: {
                title: "工作台镜像",
                authCode: 'open-jupyte'
            },
        },
    ]
}