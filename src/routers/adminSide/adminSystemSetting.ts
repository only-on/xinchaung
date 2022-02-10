import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
import RouterViews from "src/components/RouterView.vue";

export default {
    path: "systemSetting",
    name: "systemSetting",
    component: Layout,
    meta: {
        title: "系统管理",
        authCode: 'systemSetting',
        // showInBreadcrumb: false
    },
    children: [
        {
            path: "",
            name: "systemSetting",
            component: () => import("src/views/adminModule/adminSystemSetting/index.vue"),
            meta: {
                title: " ",
                authCode: 'systemSetting'
            },
        },
    ]
}
