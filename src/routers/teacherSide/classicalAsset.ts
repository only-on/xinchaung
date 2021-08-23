import Layout from 'src/views/common/Layout.vue';

export default {
    path: "classical",
    component: Layout,
    meta: {
        title: "精品课",
        authCode: 'classical'
    },
    children: [
        {
            path: "",
            name: "classicalAsset",
            component: () => import("src/views/classicalAsset/Panel.vue"),
            meta: {
                title: "精品课资源",
                authCode: 'classicalAsset'
            },
        },
        {
            path: "/virtualEnv",
            name: "virtualEnv",
            component: () => import("src/views/teachCourse/index.vue"),
            meta: {
                title: "课程环境",
                authCode: 'virtualEnv'
            },
        },
    ]
}