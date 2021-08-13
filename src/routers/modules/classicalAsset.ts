import Layout from "../../views/common/Layout.vue";

export default {
    path: "/classical",
    component: Layout,
    meta: {
        title: "精品课",
        authCode: "classical",
    },
    children: [
        {
            path: "asset",
            name: "classicalAsset",
            component: () => import("src/views/classicalAsset/Panel.vue"),
            meta: {
                title: "classicalPanel",
            },
        }
    ]
}