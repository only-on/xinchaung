import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
import RouterViews from "src/components/RouterView.vue";

export default {
    path: "TeachingResourceManagement",
    name: "TeachingResourceManagement",
    component: Layout,
    meta: {
        title: "教学资源管理",
        authCode: 'TeachingResourceManagement'
    },
    children: [
        {
            path: "DirectionPlanning",
            name: "",
            component: () => import("src/views/adminModule/TeachingResourceManagement/DirectionPlanning/index.vue"),
            meta: {
                title: "方向规划",
                authCode: ''
            },
        },
    ]
}
