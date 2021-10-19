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
            path: "content/:public/:type/:id",
            name: "classicalAssetContent",
            component: () => import("src/views/classicalAsset/Content.vue"),
            meta: {
                title: "资源内容",
                authCode: 'classicalAssetContent'
            },
        },
    ]
}
