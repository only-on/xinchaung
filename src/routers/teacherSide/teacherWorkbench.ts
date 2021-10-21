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
    ]
}