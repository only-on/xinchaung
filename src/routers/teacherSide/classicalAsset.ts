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
            path: "/evalute",
            name: "evalute",
            component: () => import("src/views/teachCourse/evalute.vue"),
            meta: {
                title: "课程评价",
                authCode: 'evalute'
            },
        },
    ]
}